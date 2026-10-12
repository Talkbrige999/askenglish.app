
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db } from '../firebase';
import { ref, push, onValue, set, remove } from 'firebase/database';

export default function ClassroomPage() {
  const [level, setLevel] = useState('beginner');
  const [username, setUsername] = useState('Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomStatus, setRoomStatus] = useState('open'); // 'open' or 'waiting'
  const [waitingList, setWaitingList] = useState([]);
  const [isApproved, setIsApproved] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lvl = params.get('level') || 'beginner';
      setLevel(lvl);

      let savedName = localStorage.getItem('askenglish_username');
      if (!savedName) {
        savedName = 'User_' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('askenglish_username', savedName);
      }
      setUsername(savedName);

      // اگر نام کاربری شامل کلمه Admin باشد یا کاربر اول باشد، ادمین محسوب می‌شود
      const adminCheck = savedName.toLowerCase().includes('admin') || savedName === 'User_6150';
      setIsAdmin(adminCheck);
      if (adminCheck) {
        setIsApproved(true);
      }
    }
  }, []);

  // گوش دادن به وضعیت اتاق و لیست انتظار در فایربیس
  useEffect(() => {
    if (!level) return;

    const roomRef = ref(db, `rooms/${level}`);
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomStatus(data.status || 'open');
        
        // بررسی لیست تایید شده‌ها برای کاربران عادی
        if (data.approvedUsers && data.approvedUsers[username]) {
          setIsApproved(true);
        }

        // لیست انتظار برای ادمین
        if (data.waitingList) {
          const list = Object.keys(data.waitingList).map((key) => ({
            id: key,
            ...data.waitingList[key],
          }));
          setWaitingList(list);
        } else {
          setWaitingList([]);
        }
      } else {
        // مقداردهی اولیه اگر اتاق وجود نداشت
        setRoomStatus('open');
      }
    });

    // مدیریت چت‌ها
    const messagesRef = ref(db, `messages/${level}`);
    const unsubscribeMsgs = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(list);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribeRoom();
      unsubscribeMsgs();
    };
  }, [level, username]);

  // ثبت نام کاربر در صف انتظار اگر اتاق بسته/در انتظار باشد
  useEffect(() => {
    if (!isAdmin && roomStatus === 'waiting' && !isApproved && username !== 'Guest') {
      const waitRef = ref(db, `rooms/${level}/waitingList`);
      // با استفاده از نام کاربری به عنوان کلید تا درخواست تکراری ثبت نشود
      const userKey = username.replace(/[.#$\/\[\]]/g, '_');
      set(ref(db, `rooms/${level}/waitingList/${userKey}`), {
        name: username,
        timestamp: Date.now()
      });
    }
  }, [roomStatus, isAdmin, isApproved, level, username]);

  // تغییر وضعیت اتاق توسط مدیر (باز یا بسته کردن)
  const toggleRoomStatus = async () => {
    if (!isAdmin) return;
    const newStatus = roomStatus === 'open' ? 'waiting' : 'open';
    await set(ref(db, `rooms/${level}/status`), newStatus);
  };

  // تایید کاربر توسط مدیر
  const approveUser = async (userKey, userName) => {
    await set(ref(db, `rooms/${level}/approvedUsers/${userName}`), true);
    await remove(ref(db, `rooms/${level}/waitingList/${userKey}`));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input || !input.trim()) return;
    try {
      const messagesRef = ref(db, `messages/${level}`);
      await push(messagesRef, {
        text: input,
        sender: username,
        timestamp: Date.now(),
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // اگر اتاق در حالت انتظار باشد و کاربر عادی هنوز تایید نشده باشد
  if (roomStatus === 'waiting' && !isAdmin && !isApproved) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-lg border max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ⏳
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">اتاق در حالت انتظار (Waiting Room)</h2>
          <p className="text-gray-500 text-sm mb-6">
            کلاس در حال حاضر قفل است یا مدیر ورود را محدود کرده. درخواست شما ارسال شد؛ لطفاً منتظر بمانید تا مدیر دسترسی شما را تأیید کند.
          </p>
          <div className="bg-blue-50 text-blue-700 py-2.5 px-4 rounded-xl text-sm font-medium mb-4 animate-pulse">
            نام کاربری شما: {username}
          </div>
          <Link
            href="/"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-6 rounded-xl transition"
          >
            خروج / Exit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white border-b p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 capitalize">
          {level} Room / اتاق {level}
        </h1>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {isAdmin && (
            <button
              onClick={toggleRoomStatus}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition shadow-sm ${
                roomStatus === 'open' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {roomStatus === 'open' ? '🔒 قفل کردن اتاق (Waiting Room)' : '🔓 باز کردن درگاه ورود'}
            </button>
          )}
          <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border">
            {isAdmin ? 'مدیر (Admin)' : `کاربر: ${username}`}
          </div>
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-lg transition"
          >
            خروج / Exit
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 gap-4 max-w-7xl mx-auto w-full">
        {/* پنل مدیریت افراد در انتظار برای ادمین */}
        {isAdmin && waitingList.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-amber-800 text-sm mb-3">
              🔔 درخواست‌های ورود به کلاس ({waitingList.length}):
            </h3>
            <div className="flex gap-3 flex-wrap">
              {waitingList.map((user) => (
                <div key={user.id} className="bg-white px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-3 border border-amber-100">
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  <button 
                    onClick={() => approveUser(user.id, user.name)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    تأیید ورود
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          {showVideo && (
            <div className="flex-1 bg-black rounded-xl overflow-hidden min-h-[300px] md:min-h-[500px] shadow">
              <iframe
                src={`https://meet.jit.si/askenglish-${level}-room-2026#config.prejoinPageEnabled=false`}
                className="w-full h-full min-h-[300px] md:min-h-[500px] border-0"
                allow="camera; microphone; display-capture; autoplay"
              />
            </div>
          )}

          <div className="w-full md:w-80 bg-white rounded-xl shadow-sm border flex flex-col h-[500px]">
            <div className="p-3.5 border-b font-bold text-gray-700 bg-gray-50 rounded-t-xl text-sm">
              Live Chat / چت زنده
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              <p className="text-xs text-gray-400 text-center">
                System: Welcome to the live room!
              </p>
              {messages.map((msg) => {
                const isMe = msg.sender === username;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-gray-400 mb-1">{msg.sender}</span>
                    <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm break-words ${
                      isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
