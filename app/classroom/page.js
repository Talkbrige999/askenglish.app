'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ClassroomPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* هدر کلاس */}
      <header style={{ backgroundColor: '#1e293b', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#38bdf8', fontWeight: 'bold' }}>← Back to Home</Link>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🎓 Live Class: Everyday Conversation Practice</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>● LIVE</span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>45:00</span>
        </div>
      </header>

      {/* بخش اصلی ویدیوی استاد و زبان‌آموزان */}
      <main style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* بخش ویدیوها */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* ویدیوی استاد */}
          <div style={{ backgroundColor: '#1e293b', height: '400px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '2px solid #3b82f6' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              👨‍🏫
            </div>
            <h3 style={{ marginTop: '15px', color: '#f8fafc' }}>Instructor: Mr. Sarah (Native Speaker)</h3>
            <span style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>
              🔊 Speaking...
            </span>
          </div>

          {/* ویدیوی شرکت‌کنندگان */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ backgroundColor: '#1e293b', height: '140px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
              <span style={{ fontSize: '1.8rem' }}>🧑‍🎓</span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '5px' }}>You (Student)</span>
            </div>
            <div style={{ backgroundColor: '#1e293b', height: '140px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
              <span style={{ fontSize: '1.8rem' }}>👩‍🎓</span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '5px' }}>Li Wei (China)</span>
            </div>
            <div style={{ backgroundColor: '#1e293b', height: '140px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
              <span style={{ fontSize: '1.8rem' }}>👨‍💻</span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '5px' }}>Ali (Iran)</span>
            </div>
          </div>
        </div>

        {/* تخته هوشمند / یادداشت کلاس */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#38bdf8' }}>📋 Lesson Notes & Vocabulary</h3>
          <div style={{ flex: 1, backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.7', color: '#e2e8f0' }}>
            <p style={{ color: '#fbbf24', fontWeight: 'bold' }}>Key Vocabulary Today:</p>
            <ul>
              <li><strong>Fluency:</strong> Expressing yourself smoothly.</li>
              <li><strong>Collaboration:</strong> Working together.</li>
              <li><strong>Interactive:</strong> Engaging in two-way communication.</li>
            </ul>
            <p style={{ color: '#34d399', fontWeight: 'bold', marginTop: '20px' }}>Discussion Question:</p>
            <p>"What is the best way to practice speaking every day?"</p>
          </div>
        </div>
      </main>

      {/* نوار ابزار کنترل کلاس */}
      <footer style={{ backgroundColor: '#1e293b', padding: '15px', display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid #334155' }}>
        <button 
          onClick={() => setIsMicOn(!isMicOn)} 
          style={{ backgroundColor: isMicOn ? '#334155' : '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isMicOn ? '🎙️ Mic On' : '🎙️ Mic Off'}
        </button>

        <button 
          onClick={() => setIsVideoOn(!isVideoOn)} 
          style={{ backgroundColor: isVideoOn ? '#334155' : '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isVideoOn ? '📹 Camera On' : '📹 Camera Off'}
        </button>

        <button 
          onClick={() => setRaisedHand(!raisedHand)} 
          style={{ backgroundColor: raisedHand ? '#eab308' : '#334155', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {raisedHand ? '✋ Hand Raised' : '✋ Raise Hand'}
        </button>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            🚪 Leave Class
          </button>
        </Link>
      </footer>
    </div>
  );
}