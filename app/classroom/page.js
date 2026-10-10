'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../firebase'; // مسیر فایل فایربیس پروژه شما
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

function ClassroomContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'beginner';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('Guest User');

  const roomDetails = {
    beginner: {
      title: 'Beginner Room / اتاق مقدماتی / 初级聊天室',
      desc: 'Practice basic English with friends / تمرین مکالمه پایه / 练习基础英语日常对话',
      color: '#22c55e',
    },
    intermediate: {
      title: 'Intermediate Room / اتاق متوسط / 中级聊天室',
      desc: 'Discuss daily topics / بحث پیرامون موضوعات روزمره / 讨论日常热门话题',
      color: '#eab308',
    },
    advanced: {
      title: 'Advanced Room / اتاق پیشرفته / 高级聊天室',
      desc: 'Advanced discussions & expressions / بحث‌های تخصصی و اصطلاحات پیشرفته / 深入探讨专业话题',
      color: '#ef4444',
    },
  };

  const currentRoom = roomDetails[level] || roomDetails.beginner;

  // دریافت پیام‌ها به صورت زنده (Real-time) از Firestore
  useEffect(() => {
    const q = query(collection(db, `rooms_${level}_messages`), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [level]);

  // ارسال پیام به فایربیس
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `rooms_${level}_messages`), {
        text: newMessage,
        sender: userName,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1e293b',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: currentRoom.color, margin: 0 }}>
              {currentRoom.title}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
              {currentRoom.desc}
            </p>
          </div>
          <Link href="/" style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Exit / خروج / 退出
          </Link>
        </div>

        {/* نام کاربری موقت */}
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          <span>Your Name / نام شما / 您的名字:</span>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>
      </div>

      {/* Box of Messages */}
      <div style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '16px',
        maxHeight: '50vh'
      }}>
        {/* پیام پیش‌فرض خوش‌آمدگویی سیستم */}
        <div style={{ backgroundColor: '#e2e8f0', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }}>
          <strong style={{ color: '#334155' }}>System / سیستم / 系统:</strong>
          <p style={{ margin: '4px 0 0 0' }}>Welcome to the live room! Start typing your messages below. / به اتاق زنده خوش آمدید! پیام خود را بنویسید. / 欢迎来到直播间！请在下方输入您的消息。</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: '10px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
              <strong>{msg.sender}</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', wordBreak: 'break-word' }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message in English, Persian, or Chinese... / پیام خود را بنویسید... / 输入消息..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          padding: '0 20px',
          borderRadius: '10px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Send / ارسال / 发送
        </button>
      </form>
    </div>
  );
}

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading room... / در حال بارگذاری... / 加载中...</div>}>
      <ClassroomContent />
    </Suspense>
  );
}
