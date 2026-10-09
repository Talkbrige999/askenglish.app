'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Li Wei (China)', text: 'Hello everyone! Glad to learn English here.', translated: 'سلام به همگی! خوشحالم که اینجا انگلیسی یاد می‌گیرم.' },
    { id: 2, sender: 'Sara (Iran)', text: 'Hello everyone! I am happy to be here.', translated: 'سلام به همگی! خوشحالم که اینجا هستم.' },
    { id: 3, sender: 'John (USA)', text: 'Welcome everyone! Feel free to practice your speaking.', translated: 'خوش آمدید! راحت باشید و صحبت کردن را تمرین کنید.' }
  ]);

  const [input, setInput] = useState('');
  const [aiTip, setAiTip] = useState('💡 AI Tip: Try using complete sentences to practice fluency!');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // مدیریت دوربین
  const toggleVideo = async () => {
    if (isVideoOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsVideoOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoOn(true);
      } catch (err) {
        alert('لطفاً دسترسی به دوربین و میکروفون را در مرورگر تأیید کنید.');
      }
    }
  };

  // مدیریت ضبط صدا (Voice Message)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('دسترسی به میکروفون داده نشد.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // تلفظ متن (Text to Speech)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !audioUrl) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: input || '🎤 Voice Message Attached',
      audio: audioUrl,
      translated: ''
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setAudioUrl(null);

    // پاسخ هوشمند و خودکار AI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'AI Tutor',
          text: 'Great effort! Your sentence structure looks good. Keep going!',
          translated: 'تلاش عالی بود! ساختار جمله شما خوب به نظر می‌رسد. ادامه دهید!'
        }
      ]);
      setAiTip('💡 AI Tip: Fantastic practice! Try using longer sentences next time.');
    }, 1200);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', color: '#f3f4f6', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>
        &larr; Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <h2>GlobalTalk AI - Practice Hub</h2>
        <button
          onClick={toggleVideo}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: isVideoOn ? '#ef4444' : '#10b981',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isVideoOn ? '📹 Turn Off Camera' : '🎥 Turn On Camera'}
        </button>
      </div>

      {isVideoOn && (
        <div style={{ marginTop: '15px', borderRadius: '12px', overflow: 'hidden', background: '#000', height: '260px', border: '2px solid #3b82f6' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ background: '#1e1b4b', border: '1px solid #6366f1', padding: '12px 18px', borderRadius: '10px', margin: '20px 0', color: '#c7d2fe' }}>
        {aiTip}
      </div>

      <div style={{ background: '#1f2937', border: '1px solid #374151', padding: '20px', borderRadius: '12px', minHeight: '350px', maxHeight: '450px', overflowY: 'auto' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: '15px', background: '#111827', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ color: '#93c5fd' }}>{m.sender}</strong>
              <button onClick={() => speakText(m.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Listen">
                🔊
              </button>
            </div>
            <p style={{ margin: '0 0 5px 0' }}>{m.text}</p>
            {m.translated && <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>Translation: {m.translated}</p>}
            {m.audio && <audio src={m.audio} controls style={{ marginTop: '8px', height: '30px', width: '100%' }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message in English..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #374151', background: '#111827', color: '#fff', fontSize: '15px' }}
        />

        {!isRecording ? (
          <button type="button" onClick={startRecording} style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer' }} title="Record Voice">
            🎙️
          </button>
        ) : (
          <button type="button" onClick={stopRecording} style={{ padding: '12px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }} title="Stop Recording">
            ⏹️ Recording...
          </button>
        )}

        <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Send
        </button>
      </form>

      {audioUrl && (
        <div style={{ marginTop: '10px', fontSize: '13px', color: '#34d399' }}>
          ✓ Voice message ready to send!
        </div>
      )}
    </div>
  );
}
