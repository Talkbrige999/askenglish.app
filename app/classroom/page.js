'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ClassroomPage() {
  const [lang, setLang] = useState('fa');
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
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h2>کلاس آنلاین</h2>
      <p style={{ fontSize: '14px', wordBreak: 'break-all' }}>شناسه شما: {myPeerId}</p>
      
      <div style={{ margin: '15px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="شناسه طرف مقابل را وارد کنید" 
          value={remotePeerIdInput} 
          onChange={(e) => setRemotePeerIdInput(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '200px' }}
        />
        <button 
          onClick={() => callUser(remotePeerIdInput)}
          style={{ padding: '8px 16px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          تماس
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#38bdf8' }}>وضعیت: {callStatus}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
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
