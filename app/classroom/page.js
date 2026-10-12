'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db } from '../firebase';
import { ref, push, onValue } from 'firebase/database';

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
        localStorage.setItem('askenglish_username', randomName);
        setUsername(randomName);
      }
    }
  }, []);

  useEffect(() => {
    if (!level) return;

    const messagesRef = ref(db, `messages/${level}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
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

    return () => unsubscribe();
  }, [level]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white border-b p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 capitalize">
          {level} Room / اتاق {level}
        </h1>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition"
          >
            {showVideo ? 'Hide Video / مخفی کردن ویدیو' : 'Show Video / نمایش ویدیو'}
          </button>
          <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded font-medium border">
            Name: {username}
          </div>
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded transition"
          >
            Exit / خروج
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        {showVideo && (
          <div className="flex-1 bg-black rounded-lg overflow-hidden min-h-[300px] md:min-h-[500px] shadow">
            <iframe
              src={`https://meet.jit.si/askenglish-${level}-room-2026#config.prejoinPageEnabled=false`}
              className="w-full h-full min-h-[300px] md:min-h-[500px] border-0"
              allow="camera; microphone; display-capture; autoplay"
            />
          </div>
        )}

        <div className="w-full md:w-80 bg-white rounded-lg shadow border flex flex-col h-[500px]">
          <div className="p-3 border-b font-bold text-gray-700 bg-gray-50">
            Live Chat / چت زنده
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            <p className="text-xs text-gray-400 text-center">
              System: Welcome to the live room! Chat below or use the video call.
            </p>
            {messages.map((msg) => {
              const isMe = msg.sender === username;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-1">{msg.sender}</span>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
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
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
