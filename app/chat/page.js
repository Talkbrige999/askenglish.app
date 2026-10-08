
'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Li Wei (China)', text: '大家好! 很高兴在这里 me learn english.', translated: 'سلام به همگی! خوشحالم اینجا انگلیسی یاد می‌گیرم.' },
    { id: 2, sender: 'Sara (Iran)', text: 'سلام به همگی! خوشحالم که اینجا هستم', translated: 'Hello everyone! Glad to be here.' },
    { id: 3, sender: 'John (USA)', text: 'Welcome everyone! Feel free to practice your speaking here.', translated: 'به همگی خوش‌آمد می‌گویم! راحت باشید و مکالمه تمرین کنید.' }
  ]);

  const [input, setInput] = useState('');
  const [aiTip, setAiTip] = useState('💡 AI Tip: Try using complete sentences to practice fluency.');
  
  // فایل‌های انتخاب‌شده و وضعیت ضبط صدا
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // تابع پخش تلفظ صوتی متن
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('مرورگر شما از قابلیت تلفظ صوتی پشتیبانی نمی‌کند');
    }
  };

  // انتخاب تصویر
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // شروع / توقف ضبط صدا
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        alert('دسترسی به میکروفون امکان‌پذیر نیست.');
      }
    }
  };

  // ارسال پیام
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage && !audioUrl) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You (Student)',
      text: input,
      image: selectedImage,
      audio: audioUrl,
      translated: input ? 'ترجمه خودکار پیام شما...' : ''
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setSelectedImage(null);
    setAudioUrl(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Global Chat Room</h2>
        <Link href="/">
          <button style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>بازگشت به خانه</button>
        </Link>
      </header>

      <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
        <p style={{ margin: 0, color: '#555' }}>{aiTip}</p>
      </div>

      {/* لیست پیام‌ها */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', height: '400px', overflowY: 'auto', padding: '15px', marginBottom: '15px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '15px', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong>{msg.sender}</strong>
            {msg.text && <p style={{ margin: '5px 0' }}>{msg.text}</p>}
            
            {/* نمایش تصویر در صورت وجود */}
            {msg.image && (
              <img src={msg.image} alt="uploaded" style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px', display: 'block' }} />
            )}

            {/* نمایش ویس در صورت وجود */}
            {msg.audio && (
              <audio controls src={msg.audio} style={{ marginTop: '5px', width: '100%', maxWidth: '250px' }} />
            )}

            {msg.translated && <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>{msg.translated}</small>}
            
            {msg.text && (
              <button onClick={() => speakText(msg.text)} style={{ marginTop: '6px', fontSize: '12px', cursor: 'pointer', background: '#e0e0e0', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                🔊 پخش تلفظ
              </button>
            )}
          </div>
        ))}
      </div>

      {/* پیش‌نمایش عکس یا صدای انتخاب‌شده قبل از ارسال */}
      {(selectedImage || audioUrl) && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', padding: '8px', background: '#eef', borderRadius: '6px' }}>
          {selectedImage && <span style={{ fontSize: '14px' }}>🖼️ تصویر آماده ارسال</span>}
          {audioUrl && <span style={{ fontSize: '14px' }}>🎙️ صدای ضبط‌شده آماده ارسال</span>}
          <button onClick={() => { setSelectedImage(null); setAudioUrl(null); }} style={{ marginLeft: 'auto', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>حذف</button>
        </div>
      )}

      {/* فرم ورودی پیام و دکمه‌ها */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* دکمه مخفی آپلود فایل */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
        />
        
        {/* دکمه گیره عکس */}
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()} 
          style={{ padding: '10px 12px', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc' }}
          title="افزودن تصویر"
        >
          📎
        </button>

        {/* دکمه میکروفون */}
        <button 
          type="button" 
          onClick={toggleRecording} 
          style={{ 
            padding: '10px 12px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            background: isRecording ? '#ff4d4d' : '#f0f0f0',
            color: isRecording ? '#fff' : '#000'
          }}
          title={isRecording ? 'توقف ضبط' : 'ضبط صدا'}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>

        {/* ورودی متن */}
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="پیام خود را بنویسید..." 
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
        />

        {/* دکمه ارسال */}
        <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          ارسال
        </button>
      </form>
    </div>
  );
}
'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Li Wei (China)', text: '大家好! 很高兴在这里 me learn english.', translated: 'سلام به همگی! خوشحالم اینجا انگلیسی یاد می‌گیرم.' },
    { id: 2, sender: 'Sara (Iran)', text: 'سلام به همگی! خوشحالم که اینجا هستم', translated: 'Hello everyone! Glad to be here.' },
    { id: 3, sender: 'John (USA)', text: 'Welcome everyone! Feel free to practice your speaking here.', translated: 'به همگی خوش‌آمد می‌گویم! راحت باشید و مکالمه تمرین کنید.' }
  ]);

  const [input, setInput] = useState('');
  const [aiTip, setAiTip] = useState('💡 AI Tip: Try using complete sentences to practice fluency.');
  
  // فایل‌های انتخاب‌شده و وضعیت ضبط صدا
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // تابع پخش تلفظ صوتی متن
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('مرورگر شما از قابلیت تلفظ صوتی پشتیبانی نمی‌کند');
    }
  };

  // انتخاب تصویر
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // شروع / توقف ضبط صدا
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        alert('دسترسی به میکروفون امکان‌پذیر نیست.');
      }
    }
  };

  // ارسال پیام
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage && !audioUrl) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You (Student)',
      text: input,
      image: selectedImage,
      audio: audioUrl,
      translated: input ? 'ترجمه خودکار پیام شما...' : ''
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setSelectedImage(null);
    setAudioUrl(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Global Chat Room</h2>
        <Link href="/">
          <button style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>بازگشت به خانه</button>
        </Link>
      </header>

      <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
        <p style={{ margin: 0, color: '#555' }}>{aiTip}</p>
      </div>

      {/* لیست پیام‌ها */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', height: '400px', overflowY: 'auto', padding: '15px', marginBottom: '15px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '15px', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong>{msg.sender}</strong>
            {msg.text && <p style={{ margin: '5px 0' }}>{msg.text}</p>}
            
            {/* نمایش تصویر در صورت وجود */}
            {msg.image && (
              <img src={msg.image} alt="uploaded" style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px', display: 'block' }} />
            )}

            {/* نمایش ویس در صورت وجود */}
            {msg.audio && (
              <audio controls src={msg.audio} style={{ marginTop: '5px', width: '100%', maxWidth: '250px' }} />
            )}

            {msg.translated && <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>{msg.translated}</small>}
            
            {msg.text && (
              <button onClick={() => speakText(msg.text)} style={{ marginTop: '6px', fontSize: '12px', cursor: 'pointer', background: '#e0e0e0', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                🔊 پخش تلفظ
              </button>
            )}
          </div>
        ))}
      </div>

      {/* پیش‌نمایش عکس یا صدای انتخاب‌شده قبل از ارسال */}
      {(selectedImage || audioUrl) && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', padding: '8px', background: '#eef', borderRadius: '6px' }}>
          {selectedImage && <span style={{ fontSize: '14px' }}>🖼️ تصویر آماده ارسال</span>}
          {audioUrl && <span style={{ fontSize: '14px' }}>🎙️ صدای ضبط‌شده آماده ارسال</span>}
          <button onClick={() => { setSelectedImage(null); setAudioUrl(null); }} style={{ marginLeft: 'auto', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>حذف</button>
        </div>
      )}

      {/* فرم ورودی پیام و دکمه‌ها */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* دکمه مخفی آپلود فایل */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
        />
        
        {/* دکمه گیره عکس */}
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()} 
          style={{ padding: '10px 12px', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc' }}
          title="افزودن تصویر"
        >
          📎
        </button>

        {/* دکمه میکروفون */}
        <button 
          type="button" 
          onClick={toggleRecording} 
          style={{ 
            padding: '10px 12px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            background: isRecording ? '#ff4d4d' : '#f0f0f0',
            color: isRecording ? '#fff' : '#000'
          }}
          title={isRecording ? 'توقف ضبط' : 'ضبط صدا'}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>

        {/* ورودی متن */}
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="پیام خود را بنویسید..." 
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
        />

        {/* دکمه ارسال */}
        <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          ارسال
        </button>
      </form>
    </div>
  );
}
