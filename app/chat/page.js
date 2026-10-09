
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AI Instructor', text: 'Hello! How can I help you practice today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
        &larr; Back to Home
      </Link>
      <h2 style={{ marginTop: '20px' }}>Global Chat</h2>
      <div style={{ border: '1px solid #374151', padding: '15px', borderRadius: '8px', minHeight: '300px', marginBottom: '15px' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: '10px' }}>
            <strong>{m.sender}: </strong>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}
