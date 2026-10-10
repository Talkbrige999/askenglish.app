
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

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-slate-800">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← بازگشت به انتخاب اتاق‌ها
        </Link>
        <span className={`font-semibold ${currentLevel.color}`}>{currentLevel.title}</span>
      </header>

      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center text-center space-y-6 my-8">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full shadow-2xl space-y-4">
          <h1 className="text-3xl font-bold">{currentLevel.title}</h1>
          <p className="text-slate-400">{currentLevel.desc}</p>
          
          <div className="bg-slate-900 rounded-2xl h-80 flex items-center justify-center border border-slate-800 overflow-hidden relative">
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

          <div className="flex justify-center gap-4 mt-4">
            <button 
              onClick={toggleMic}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${isMicOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {isMicOn ? '🎤 قطع میکروفون' : '🎤 وصل میکروفون'}
            </button>
            <button 
              onClick={toggleVideo}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {isVideoOn ? '📹 قطع دوربین' : '📹 وصل دوربین'}
            </button>
          </div>
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
