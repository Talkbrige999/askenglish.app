'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Li Wei (China)', text: '大家好！很高兴在这里 me learn english.', translation: 'Hello everyone! I am glad to learn English here.', correction: 'me learn english ❌ ➡️ I want to learn English ✅' },
    { id: 2, sender: 'Sara (Iran)', text: 'سلام به همگی! خوشحالم که اینجا هستم', translation: 'Hello everyone! I am happy to be here.', correction: null },
    { id: 3, sender: 'John (USA)', text: 'Welcome everyone! Feel free to practice your speaking and typing.', translation: 'خوش آمدید همگی! راحت باشید و مکالمه و تایپ تمرین کنید.', correction: null }
  ]);

  const [input, setInput] = useState('');
  const [aiTip, setAiTip] = useState('💡 AI Tip: Try using complete sentences to practice better!');

  // تابع پخش صوتی متن
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('مرورگر شما از قابلیت تلفظ صوتی پشتیبانی نمی‌کند.');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You (Student)',
      text: input,
      translation: 'ترجمه خودکار هوش مصنوعی: ' + input,
      correction: input.toLowerCase().includes('i is') ? 'i is ❌ ➡️ I am ✅' : null
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setAiTip('✨ Great job! AI validated your grammar structure.');
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ padding: '15px 30px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Home</Link>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🌐 TalkBridge Global Chatroom</h2>
        </div>
        <div style={{ backgroundColor: '#0284c7', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          🤖 AI Tutor Active
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Chat Feed */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '10px', border: '1px solid #334155', maxWidth: '80%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold' }}>{msg.sender}</span>
                <button 
                  onClick={() => speakText(msg.text)} 
                  title="تلفظ صوتی"
                  style={{ backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  🔊
                </button>
              </div>

              <div style={{ fontSize: '1rem', marginBottom: '8px' }}>{msg.text}</div>
              
              {msg.translation && (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px dashed #334155', paddingTop: '5px' }}>
                  💡 Translation: {msg.translation}
                </div>
              )}
              
              {msg.correction && (
                <div style={{ fontSize: '0.85rem', color: '#f59e0b', backgroundColor: '#451a03', padding: '5px 10px', borderRadius: '5px', marginTop: '8px' }}>
                  🔧 AI Grammar Correction: {msg.correction}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Assistant Sidebar */}
        <div style={{ width: '280px', borderLeft: '1px solid #1e293b', padding: '20px', backgroundColor: '#0b1329', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#38bdf8' }}>🤖 AI Language Assistant</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
            روی دکمه 🔊 کنار هر پیام کلیک کنید تا تلفظ آن را بشنوید!
          </p>
          <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.85rem', color: '#38bdf8' }}>
            {aiTip}
          </div>
        </div>

      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ padding: '15px 20px', borderTop: '1px solid #1e293b', display: 'flex', gap: '10px', backgroundColor: '#0b1329' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Send
        </button>
      </form>

    </div>
  );
}

