
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ClassroomPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [hasStream, setHasStream] = useState(false);
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
            setHasStream(true);
          }
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }

    initMedia();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = isVideoOn;
    }
  }, [isVideoOn]);

  useEffect(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = isMicOn;
    }
  }, [isMicOn]);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <div>
          <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Home</Link>
          <h1 style={{ margin: '10px 0 0 0', fontSize: '24px' }}>Everyday Conversation Practice</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ backgroundColor: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>LIVE</span>
          <span style={{ color: '#94a3b8' }}>45:00</span>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Left Side: Video Area */}
        <div>
          {/* Main Stage (Instructor) */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #334155', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '15px' }}>
              👨‍🏫
            </div>
            <h3 style={{ margin: 0 }}>Instructor: Mr. Sarah (Native Speaker)</h3>
            <span style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>🔊 Speaking...</span>
          </div>

          {/* Students Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {/* YOU (Student) with Video Element */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '2px solid #3b82f6' }}>
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: isVideoOn ? 'block' : 'none',
                  transform: 'scaleX(-1)', // Mirror effect
                }}
              />
              {!isVideoOn && (
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👨‍🎓</div>
              )}
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#fff', zIndex: 10 }}>
                You (Student) {!isVideoOn && '(Camera Off)'}
              </span>
            </div>

            {/* Other Students */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #334155' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧔</div>
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>Li Wei (China)</span>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #334155' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👩</div>
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>Ali (Iran)</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: isMicOn ? '#334155' : '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isMicOn ? '🎙️ Mic On' : '🎙️ Mic Off'}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: isVideoOn ? '#334155' : '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isVideoOn ? '📹 Camera On' : '📹 Camera Off'}
            </button>
            <button
              onClick={() => setRaisedHand(!raisedHand)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: raisedHand ? '#eab308' : '#334155', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✋ {raisedHand ? 'Hand Raised' : 'Raise Hand'}
            </button>
            <Link href="/" style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#ef4444', color: '#fff', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
              Leave Class
            </Link>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #334155', paddingBottom: '10px' }}>📋 Lesson Notes &amp; Vocabulary</h3>
          <div style={{ marginTop: '15px' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '8px' }}>Key Vocabulary Today:</h4>
            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6' }}>
              <li><strong>Fluency:</strong> Expressing yourself smoothly.</li>
              <li><strong>Collaboration:</strong> Working together.</li>
              <li><strong>Interactive:</strong> Engaging in two-way communication.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
