
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function ClassroomContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'beginner';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('Guest');
  const [showVideo, setShowVideo] = useState(true);
  const messagesEndRef = useRef(null);

  const roomName = `askenglish-${level}-room-2026`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: input,
        createdAt: serverTimestamp(),
        user: username,
        room: level
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const roomTitle = 
    level === 'beginner' 
      ? 'Beginner Room / اتاق مقدماتی / 初级聊天室' 
      : level === 'intermediate' 
      ? 'Intermediate Room / اتاق متوسط / 中级聊天室' 
      : 'Advanced Room / اتاق پیشرفته / 高级聊天室';

  const jitsiUrl = `https://meet.jit.si/${roomName}`;

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
            {roomTitle}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button"
            onClick={() => setShowVideo(!showVideo)} 
            style={{ 
              padding: '8px 14px', 
              background: showVideo ? '#e53e3e' : '#2b6cb0', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {showVideo ? 'Hide Video / مخفی کردن ویدیو / 隐藏视频' : 'Show Video / نمایش ویدیو / 显示视频'}
          </button>
          <div>
            <label style={{ fontSize: '11px', color: '#666', display: 'block' }}>Name / نام / 姓名:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => {
                setUsername(e.target.value);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('askenglish_username', e.target.value);
                }
              }}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', width: '110px' }}
            />
          </div>
          <Link href="/" style={{ padding: '8px 14px', background: '#e0e0e0', color: '#333', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
            Exit / خروج / 退出
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showVideo ? '1fr 1fr' : '1fr', gap: '20px' }}>
        
        {showVideo && (
          <div style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden', height: '520px', background: '#000' }}>
            <iframe
              src={jitsiUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="camera; microphone; display-capture; autoplay; clipboard-write"
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
          <div style={{ flex: 1, border: '1px solid #e0e0e0', overflowY: 'auto', padding: '15px', borderRadius: '10px', background: '#f9f9f9' }}>
            <div style={{ background: '#e6f2ff', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '12px', color: '#004080', lineHeight: '1.5' }}>
              <strong>System / سیستم / 系统:</strong> Welcome to the live room! Chat below or use the video call. <br/>
              به اتاق زنده خوش آمدید! در پایین چت کنید یا از تماس ویدیویی استفاده کنید. <br/>
              欢迎来到直播间！在下方聊天或使用视频通话。
            </div>
            {messages.map((msg) => {
              const isMe = msg.user === username;
              return (
                <div 
                  key={msg.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '12px' 
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>{msg.user}</span>
                    {msg.formattedTime && (
                      <span style={{ fontSize: '10px', color: '#aaa' }}>{msg.formattedTime}</span>
                    )}
                  </div>
                  <div style={{ 
                    background: isMe ? '#0070f3' : '#ffffff', 
                    color: isMe ? '#ffffff' : '#333333', 
                    padding: '10px 14px', 
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    maxWidth: '80%',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type in English, Persian, or Chinese... / پیام خود را بنویسید... / 输入消息..."
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
            />
            <button type="submit" style={{ padding: '12px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Send / ارسال / 发送
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
      <ClassroomContent />
    </Suspense>
  );
}
