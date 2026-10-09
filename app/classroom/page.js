'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ClassroomPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
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
        console.log("Media error:", err);
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <div>
          <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Home</Link>
          <h1 style={{ margin: '10px 0 0 0', fontSize: '24px' }}>Everyday Conversation Practice</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #334155', marginBottom: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👨‍🏫</div>
            <h3>Instructor: Live Class</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', height: '140px', position: 'relative', overflow: 'hidden', border: '2px solid #3b82f6' }}>
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: isVideoOn ? 'block' : 'none', transform: 'scaleX(-1)' }}
              />
              {!isVideoOn && <div style={{ textAlign: 'center', paddingTop: '40px', fontSize: '30px' }}>👨‍🎓</div>}
              <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                You
              </span>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsMicOn(!isMicOn)} style={{ padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: isMicOn ? '#334155' : '#ef4444', color: '#fff', border: 'none' }}>
              {isMicOn ? '🎙️ Mic On' : '🎙️ Mic Off'}
            </button>
            <button onClick={() => setIsVideoOn(!isVideoOn)} style={{ padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: isVideoOn ? '#334155' : '#ef4444', color: '#fff', border: 'none' }}>
              {isVideoOn ? '📹 Camera On' : '📹 Camera Off'}
            </button>
            <button onClick={() => setRaisedHand(!raisedHand)} style={{ padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: raisedHand ? '#eab308' : '#334155', color: '#fff', border: 'none' }}>
              ✋ {raisedHand ? 'Hand Raised' : 'Raise Hand'}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <h3>Lesson Notes</h3>
          <p style={{ color: '#cbd5e1' }}>Practice speaking with your peers and teacher.</p>
        </div>
      </div>
    </div>
  );
}
