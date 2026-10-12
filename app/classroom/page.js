
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function ClassroomPage() {
  const [level, setLevel] = useState('beginner');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('Guest');
  const [showVideo, setShowVideo] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lvl = params.get('level') || 'beginner';
      setLevel(lvl);

      const savedName = localStorage.getItem('askenglish_username');
      if (savedName) {
        setUsername(savedName);
      } else {
        const randomName = 'User_' + Math.floor(1000 + Math.random() * 9000);
        setUsername(randomName);
        localStorage.setItem('askenglish_username', randomName);
      }
    }
  }, []);

  const roomName = `askenglish-${level}-room-2026`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!level) return;

    const q = query(
      collection(db, 'messages'),
      where('room', '==', level),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeString = '';
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          timeString = data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return {
          id: doc.id,
          ...data,
          formattedTime: timeString
        };
      });
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [level]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        room: level,
        username: username,
        text: input,
        createdAt: serverTimestamp()
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* هدر بالای صفحه */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {level} Room / اتاق {level}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            {showVideo ? 'Hide Video / مخفی کردن ویدیو' : 'Show Video / نمایش ویدیو'}
          </button>
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
            Name: {username}
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Exit / خروج
          </Link>
        </div>
      </header>

      {/* بخش اصلی صفحه: ویدیو و چت */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* بخش ویدیو کنفرانس */}
        {showVideo && (
          <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-lg flex flex-col relative h-[600px]">
            <iframe
              src={`https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(username)}"&config.flags.alwaysSkipMobileAppRedirect=true`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ width: '100%', height: '100%', border: 0 }}
              title="AskEnglish Video Classroom"
            />
          </div>
        )}

        {/* بخش چت متنی */}
        <div className={`bg-white rounded-xl shadow-lg flex flex-col h-[600px] ${showVideo ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">
            Live Chat / چت زنده
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="text-xs text-gray-400 text-center my-2">
              System: Welcome to the live room! Chat below or use the video call.
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.username === username ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-500 mb-1">{msg.username} {msg.formattedTime && `(${msg.formattedTime})`}</span>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.username === username ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type in English, Persian, or Chinese..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
