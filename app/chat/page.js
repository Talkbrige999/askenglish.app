
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [inCall, setInCall] = useState(false);

  // لینک روم ویدیو کنفرانس عمومی و دائمی
  const roomUrl = 'https://askenglishapp.daily.co/chatroom';

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#f3f4f6', fontFamily: 'system-ui, sans-serif' }}>
      {/* لینک بازگشت به صفحه اصلی */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>
          &larr; Back to Dashboard
        </Link>
        <span style={{ fontSize: '14px', color: '#10b981', background: '#064e3b', padding: '4px 12px', borderRadius: '20px' }}>
          ● Live Global Network
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>GlobalTalk AI - Live Interactive Classroom</h2>
        <p style={{ color: '#9ca3af' }}>ورود به اتاق کنفرانس ویدیویی زنده با قابلیت گفتگو با سایر کاربران</p>
      </div>

      {/* بخش کنفرانس ویدیویی */}
      {!inCall ? (
        <div
          style={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '50px 20px',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🌐🎥</div>
          <h3 style={{ marginTop: 0 }}>آماده پیوستن به ویدیوکنفرانس هستید؟</h3>
          <p style={{ color: '#9ca3af', maxWidth: '500px', margin: '10px auto 25px auto' }}>
            با زدن دکمه زیر، وارد روم زنده می‌شوید. تمام کاربران آنلاین در این اتاق می‌توانند تصویر و صدای یکدیگر را ببینند و بشنوند.
          </p>
          <button
            onClick={() => setInCall(true)}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            🚀 پیوستن به کلاس تصویری زنده
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#34d399', fontSize: '14px' }}>✓ شما متصل به اتاق زنده هستید</span>
            <button
              onClick={() => setInCall(false)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              خروج از کنفرانس
            </button>
          </div>

          <div style={{ width: '100%', height: '650px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #374151', background: '#000' }}>
            <iframe
              src={roomUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="GlobalTalk Live Conference"
            />
          </div>
        </div>
      )}
    </div>
  );
}
