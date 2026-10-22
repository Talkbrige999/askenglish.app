'use client';

import { useState, useEffect, useRef } from 'react';

export default function ClassroomPage() {
  const [myPeerId, setMyPeerId] = useState('');
  const [callStatus, setCallStatus] = useState('در انتظار اتصال...');
  const [copied, setCopied] = useState(false);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // خواندن شناسه ادمین از URL (اگر کاربر باشد)
    const params = new URLSearchParams(window.location.search);
    const adminId = params.get('connect');

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
    script.async = true;
    script.onload = () => {
      const peer = new window.Peer();
      peerInstance.current = peer;

      peer.on('open', (id) => {
        setMyPeerId(id);
        
        // اگر کاربر روی لینک ادمین کلیک کرده باشد، به طور خودکار به ادمین متصل می‌شود
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream;
              myVideoRef.current.play().catch(e => console.log(e));
            }

            if (adminId) {
              setCallStatus('در حال اتصال به ادمین...');
              const call = peer.call(adminId, stream);
              call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play().catch(e => console.log(e));
                }
                setCallStatus('متصل شد!');
              });
            }
          })
          .catch(err => console.log('خطا در دوربین', err));
      });

      // اگر ادمین هستیم، منتظر تماس کاربر می‌مانیم
      peer.on('call', (call) => {
        setCallStatus('در حال دریافت تماس از کاربر...');
        call.answer(localStreamRef.current);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(e => console.log(e));
          }
          setCallStatus('متصل شد!');
        });
      });
    };
    document.body.appendChild(script);
  }, []);

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/classroom?connect=${myPeerId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '10px' }}>کلاس آنلاین</h2>
      
      <div style={{ margin: '15px 0', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
          وضعیت: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{callStatus}</span>
        </p>
        
        <button 
          onClick={copyInviteLink}
          style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
        >
          {copied ? 'لینک دعوت کپی شد! ✅' : 'کپی لینک دعوت برای کاربر 🔗'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <p style={{ padding: '10px', margin: 0, fontSize: '12px', color: '#94a3b8' }}>تصویر شما</p>
          <video ref={myVideoRef} autoPlay playsInline muted style={{ width: '100%', height: 'calc(100% - 30px)', objectFit: 'cover' }} />
        </div>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <p style={{ padding: '10px', margin: 0, fontSize: '12px', color: '#94a3b8' }}>تصویر طرف مقابل</p>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: 'calc(100% - 30px)', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
