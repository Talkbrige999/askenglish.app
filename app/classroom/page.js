'use client';

import { useState, useEffect, useRef } from 'react';

export default function ClassroomPage() {
  const [myPeerId, setMyPeerId] = useState('');
  const [remotePeerIdInput, setRemotePeerIdInput] = useState('');
  const [callStatus, setCallStatus] = useState('');

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
    script.async = true;
    script.onload = () => {
      const peer = new window.Peer();
      peerInstance.current = peer;

      peer.on('open', (id) => {
        setMyPeerId(id);
      });

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
            myVideoRef.current.play().catch(e => console.log(e));
          }

          peer.on('call', (call) => {
            setCallStatus('در حال دریافت تماس...');
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play().catch(e => console.log(e));
              }
              setCallStatus('متصل شد');
            });
          });
        })
        .catch(err => {
          console.log('خطا در دسترسی به دوربین', err);
        });
    };
    document.body.appendChild(script);
  }, []);

  const callUser = (remoteId) => {
    if (!remoteId) return;
    setCallStatus('در حال تماس...');
    const call = peerInstance.current.call(remoteId, localStreamRef.current);
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(e => console.log(e));
      }
      setCallStatus('متصل شد');
    });
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '10px' }}>کلاس آنلاین</h2>
      <p style={{ fontSize: '14px', wordBreak: 'break-all', backgroundColor: '#1e293b', padding: '10px', borderRadius: '6px' }}>
        شناسه شما: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{myPeerId}</span>
      </p>
      
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="شناسه طرف مقابل را وارد کنید" 
          value={remotePeerIdInput} 
          onChange={(e) => setRemotePeerIdInput(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: 'none', flex: 1, color: '#000', fontSize: '14px' }}
        />
        <button 
          onClick={() => callUser(remotePeerIdInput)}
          style={{ padding: '12px 24px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
        >
          برقراری تماس
        </button>
      </div>

      {callStatus && (
        <p style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '15px' }}>وضعیت: {callStatus}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '250px' }}>
          <video ref={myVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '250px' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
