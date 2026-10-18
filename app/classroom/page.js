
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ClassroomPage() {
  const [lang, setLang] = useState('fa');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [inWaitingRoom, setInWaitingRoom] = useState(true);

  const [myPeerId, setMyPeerId] = useState('');
  const [remotePeerIdInput, setRemotePeerIdInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

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
            setCallStatus('در حال اتصال...');
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play().catch(e => console.log(e));
              }
            });
          });
        })
        .catch(err => {
          console.log('خطا در دسترسی به دوربین', err);
        });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h1>کلاس آنلاین</h1>
      <p>شناسه شما: {myPeerId}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <video ref={myVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}
