
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ClassroomContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'beginner';

  const roomDetails = {
    beginner: {
      title: 'Beginner Room / اتاق مقدماتی / 初级聊天室',
      desc: 'Practice basic English with friends / تمرین مکالمه پایه / 练习基础英语日常对话',
      color: '#22c55e',
    },
    intermediate: {
      title: 'Intermediate Room / اتاق متوسط / 中级聊天室',
      desc: 'Discuss daily topics / بحث پیرامون موضوعات روزمره / 讨论日常生活话题',
      color: '#eab308',
    },
    advanced: {
      title: 'Advanced Room / اتاق پیشرفته / 高级聊天室',
      desc: 'Advanced discussions & expressions / بحث‌های تخصصی و اصطلاحات / 深入探讨专业话题',
      color: '#ef4444',
    },
  };

  const currentRoom = roomDetails[level] || roomDetails.beginner;

  const [messages, setMessages] = useState([
    { id: 1, sender: 'System / سیستم / 系统', text: 'Welcome to the live room! Start typing your messages below. / به اتاق زنده خوش آمدید! پیام خود را بنویسید. / 欢迎来到直播间！请在下方输入您的消息。' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You / شما / 你',
      text: inputMessage,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentRoom.color, margin: 0 }}>
            {currentRoom.title}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>
            {currentRoom.desc}
          </p>
        </div>
        <Link href="/" style={{
          backgroundColor: '#e2e8f0',
          color: '#334155',
          padding: '8px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          Exit / خروج / 退出
        </Link>
      </div>

      {/* Chat Box */}
      <div style={{
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        height: '400px',
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: '#f8fafc',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            backgroundColor: msg.sender.includes('System') ? '#e0f2fe' : '#ffffff',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            maxWidth: '80%',
            alignSelf: msg.sender.includes('You') ? 'flex-end' : 'flex-start'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', display: 'block', marginBottom: '4px' }}>
              {msg.sender}
            </span>
            <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message in English, Persian, or Chinese... / پیام خود را بنویسید... / 输入消息..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '0 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Send / ارسال / 发送
        </button>
      </form>
    </main>
  );
}

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading... / در حال بارگذاری... / 加载中...</div>}>
      <ClassroomContent />
    </Suspense>
  );
}
