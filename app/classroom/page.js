'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! How can I help you practice your English today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: "That's dynamic! Tell me more about that." };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Home</Link>
        <h1 style={{ margin: '10px 0 0 0', fontSize: '24px' }}>AI Chat Practice</h1>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
        <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#334155',
                color: '#fff',
                padding: '10px 15px',
                borderRadius: '8px',
                maxWidth: '80%'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
