'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ClassroomContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'beginner';

  const levelInfo = {
    beginner: { title: 'Beginner Room', color: 'text-green-400', desc: 'اتاق مکالمه مقدماتی و تمرین پایه' },
    intermediate: { title: 'Intermediate Room', color: 'text-blue-400', desc: 'اتاق مکالمه متوسط و بحث روزمره' },
    advanced: { title: 'Advanced Room', color: 'text-purple-400', desc: 'اتاق مکالمه پیشرفته و بحث آزاد' },
  };

  const currentLevel = levelInfo[level] || levelInfo.beginner;

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  // Chat States
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: `به ${currentLevel.title} خوش آمدید! کلمات و اصطلاحات جدید را اینجا بنویسید.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const userVideoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initMedia() {
      try {
        if (typeof window !== 'undefined' && navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (isMounted) {
            streamRef.current = stream;
            if (userVideoRef.current) {
              userVideoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }

    initMedia();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'شما',
      text: inputMessage,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 md:p-6">
      <header className="w-full max-w-6xl flex justify-between items-center py-4 border-b border-slate-800 mb-6">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm md:text-base">
          ← بازگشت به انتخاب اتاق‌ها
        </Link>
        <span className={`font-semibold ${currentLevel.color}`}>{currentLevel.title}</span>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main Video Section */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{currentLevel.title}</h1>
            <p className="text-slate-400 text-sm">{currentLevel.desc}</p>
          </div>
          
          <div className="bg-slate-900 rounded-2xl h-80 lg:h-96 flex items-center justify-center border border-slate-800 overflow-hidden relative my-4">
            <video 
              ref={userVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-500">
                دوربین خاموش است
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={toggleMic}
              className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm md:text-base ${isMicOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {isMicOn ? '🎤 قطع میکروفون' : '🎤 وصل میکروفون'}
            </button>
            <button 
              onClick={toggleVideo}
              className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm md:text-base ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {isVideoOn ? '📹 قطع دوربین' : '📹 وصل دوربین'}
            </button>
          </div>
        </div>

        {/* Live Chat Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl h-[500px] lg:h-auto">
          <h2 className="text-xl font-bold border-b border-slate-700 pb-3 text-blue-400">چت زنده کلاس</h2>
          
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-3 rounded-2xl text-sm ${msg.sender === 'System' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' : 'bg-slate-700/60 text-slate-200'}`}>
                <span className="font-bold text-xs block text-slate-400 mb-1">{msg.sender}</span>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-700 pt-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="پیام یا کلمه جدید بنویسید..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              ارسال
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">در حال بارگذاری اتاق...</div>}>
      <ClassroomContent />
    </Suspense>
  );
}
