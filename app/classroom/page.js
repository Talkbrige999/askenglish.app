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
        console.error('Error accessing camera/mic:', err);
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

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1e293b', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#38bdf8', fontWeight: 'bold' }}>
            ← Back to Home
          </Link>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🎓 Live Class: Everyday Conversation Practice</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>LIVE</span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>45:00</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', height: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '2px solid #3b82f6' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👨‍🏫</div>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>Instructor: Mr. Sarah (Native Speaker)</h3>
            <span style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>
              🎙️ Speaking...
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: isVideoOn && hasStream ? 'block' : 'none' }}
              />
              {(!isVideoOn || !hasStream) && <div style={{ fontSize: '2.5rem' }}>🧑‍🎓</div>}
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                You (Student) {isMicOn ? '🎙️' : '🔇'}
              </span>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem' }}>👩‍🎓</div>
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Li Wei (China)</span>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem' }}>👨‍💻</div>
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Ali (Iran)</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#f59e0b', marginTop: 0 }}>Key Vocabulary Today:</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Fluency:</strong> Expressing yourself smoothly.</li>
              <li><strong>Collaboration:</strong> Working together.</li>
              <li><strong>Interactive:</strong> Engaging in two-way communication.</li>
            </ul>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>
            <h3 style={{ color: '#10b981', marginTop: 0 }}>Discussion Question:</h3>
            <p style={{ fontStyle: 'italic', color: '#cbd5e1' }}>&quot;What is the best way to practice speaking every day?&quot;</p>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#1e293b', padding: '15px', display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid #334155' }}>
        <button
          onClick={toggleMic}
          style={{ backgroundColor: isMicOn ? '#3b82f6' : '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isMicOn ? '🎙️ Mic On' : '🔇 Mic Off'}
        </button>

        <button
          onClick={toggleVideo}
          style={{ backgroundColor: isVideoOn ? '#3b82f6' : '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isVideoOn ? '📹 Camera On' : '📷 Camera Off'}
        </button>

        <button
          onClick={() => setRaisedHand(!raisedHand)}
          style={{ backgroundColor: raisedHand ? '#f59e0b' : '#334155', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {raisedHand ? '✋ Hand Raised' : '✋ Raise Hand'}
        </button>

        <Link href="/">
          <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            🚪 Leave Class
          </button>
        </Link>
      </footer>
    </div>
  );
}
