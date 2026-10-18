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

  const [showContactModal, setShowContactModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const t = {
    fa: {
      back: '← بازگشت به چت',
      title: 'کلاس زنده: تمرین مکالمه آنلاین',
      live: '🔴 زنده',
      waitingTitle: '⏳ اتاق انتظار کلاس',
      waitingDesc: 'کلاس هنوز شروع نشده است. پس از آماده شدن برای شروع ارتباط زنده روی دکمه زیر کلیک کنید.',
      enterClass: 'ورود به کلاس (شروع جلسه)',
      leaveToWaiting: 'انتقال به اتاق انتظار',
      myIdLabel: 'شناسه اختصاصی شما جهت اتصال:',
      targetIdPlaceholder: 'شناسه کاربر مقابل را وارد کنید...',
      callBtn: '📞 تماس زنده',
      connecting: 'در حال برقراری ارتباط...',
      connected: '✅ متصل شد',
      micOn: '🎤 میکروفون روشن',
      micOff: '🔇 میکروفون خاموش',
      camOn: '📹 دوربین روشن',
      camOff: '📷 دوربین خاموش',
      handUp: '✋ دست بالاست',
      raiseHand: '🙋‍♂️ بالا بردن دست',
      participants: '👥 شرکت‌کنندگان',
      host: '👨‍🏫 استاد راهنما (Host)',
      you: '👤 شما (Student)',
      contactUs: '💬 ارتباط با ما / پشتیبانی',
      sendMessageTitle: 'ارسال پیام به پشتیبانی و استاد',
      messagePlaceholder: 'پیام خود را بنویسید...',
      send: 'ارسال پیام',
      sentSuccess: '✅ پیام شما با موفقیت ارسال شد!',
      close: 'بستن',
      copyId: '📋 کپی شناسه',
      copied: '✅ کپی شد',
      showQr: '📱 QR کد اتصال',
      qrTitle: 'اسکن کد جهت اتصال سریع'
    },
    en: {
      back: '← Back to Chat',
      title: 'Live Class: Online Conversation Practice',
      live: '🔴 Live',
      waitingTitle: '⏳ Class Waiting Room',
      waitingDesc: 'Class has not started yet. Click below when ready to initiate live video/audio stream.',
      enterClass: 'Enter Classroom',
      leaveToWaiting: 'Go to Waiting Room',
      myIdLabel: 'Your unique connection ID:',
      targetIdPlaceholder: 'Enter peer ID to call...',
      callBtn: '📞 Live Call',
      connecting: 'Connecting...',
      connected: '✅ Connected',
      micOn: '🎤 Mic On',
      micOff: '🔇 Mic Off',
      camOn: '📹 Cam On',
      camOff: '📷 Cam Off',
      handUp: '✋ Hand Raised',
      raiseHand: '🙋‍♂️ Raise Hand',
      participants: '👥 Participants',
      host: '👨‍🏫 Instructor (Host)',
      you: '👤 You (Student)',
      contactUs: '💬 Contact Us / Support',
      sendMessageTitle: 'Send Message to Support & Instructor',
      messagePlaceholder: 'Type your message...',
      send: 'Send Message',
      sentSuccess: '✅ Your message has been sent successfully!',
      close: 'Close',
      copyId: '📋 Copy ID',
      copied: '✅ Copied',
      showQr: '📱 QR Code',
      qrTitle: 'Scan QR Code for Fast Connect'
    },
    zh: {
      back: '← 返回聊天',
      title: '直播课：在线口语练习',
      live: '🔴 直播中',
      waitingTitle: '⏳ 课堂等候室',
      waitingDesc: '课程尚未开始。准备好进行实时音视频通话后，请点击下方按钮。',
      enterClass: '进入教室',
      leaveToWaiting: '前往等候室',
      myIdLabel: '您的唯一连接 ID：',
      targetIdPlaceholder: '输入对方的 ID 进行呼叫...',
      callBtn: '📞 实时通话',
      connecting: '正在连接...',
      connected: '✅ 已连接',
      micOn: '🎤 麦克风已开启',
      micOff: '🔇 麦克风已关闭',
      camOn: '📹 摄像头已开启',
      camOff: '📷 摄像头已关闭',
      handUp: '✋ 已举手',
      raiseHand: '🙋‍♂️ 举手',
      participants: '👥 参与者',
      host: '👨‍🏫 导师 (Host)',
      you: '👤 你 (Student)',
      contactUs: '💬 联系我们 / 技术支持',
      sendMessageTitle: '发送消息给导师或支持团队',
      messagePlaceholder: '输入您的消息...',
      send: '发送消息',
      sentSuccess: '✅ 您的消息已成功发送！',
      close: '关闭',
      copyId: '📋 复制 ID',
      copied: '✅ 已复制',
      showQr: '📱 二维码',
      qrTitle: '扫描二维码快速连接'
    }
  }[lang];

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
          }

          peer.on('call', (call) => {
            setCallStatus(t.connecting);
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
              setIsConnected(true);
              setCallStatus(t.connected);
            });
          });
        })
        .catch((err) => console.error('Media error:', err));
    };
    document.body.appendChild(script);

    return () => {
      if (peerInstance.current) peerInstance.current.destroy();
    };
  }, []);

  const makeCall = () => {
    if (!remotePeerIdInput || !peerInstance.current || !localStreamRef.current) return;
    setCallStatus(t.connecting);
    const call = peerInstance.current.call(remotePeerIdInput, localStreamRef.current);
    
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setIsConnected(true);
      setCallStatus(t.connected);
    });
  };

  const copyPeerId = () => {
    if (!myPeerId) return;
    navigator.clipboard.writeText(myPeerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageText('');
      setMessageSent(false);
      setShowContactModal(false);
    }, 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(myPeerId)}`;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: lang === 'fa' ? 'rtl' : 'ltr' }}>
      
      <header style={{ backgroundColor: '#1e293b', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/chat" style={{ textDecoration: 'none', color: '#38bdf8', fontWeight: 'bold' }}>{t.back}</Link>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '5px', background: '#0f172a', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setLang('fa')} style={{ background: lang === 'fa' ? '#38bdf8' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>فارسی 🇮🇷</button>
            <button onClick={() => setLang('en')} style={{ background: lang === 'en' ? '#38bdf8' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>English 🇬🇧</button>
            <button onClick={() => setLang('zh')} style={{ background: lang === 'zh' ? '#38bdf8' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>中文 🇨🇳</button>
          </div>

          <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{t.live}</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '20px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {inWaitingRoom ? (
            <div style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center', border: '1px solid #334155' }}>
              <h2 style={{ color: '#38bdf8', marginBottom: '15px' }}>{t.waitingTitle}</h2>
              <p style={{ color: '#94a3b8', maxWidth: '450px', lineHeight: '1.6', marginBottom: '25px' }}>
                {t.waitingDesc}
              </p>

              <button 
                onClick={() => setInWaitingRoom(false)}
                style={{ padding: '12px 24px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                {t.enterClass}
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#1e293b', minHeight: '420px', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', border: '1px solid #334155' }}>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#0f172a', padding: '10px 15px', borderRadius: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t.myIdLabel} <strong style={{ color: '#38bdf8' }}>{myPeerId || 'در حال دریافت...'}</strong></span>
                
                {myPeerId && (
                  <>
                    <button onClick={copyPeerId} style={{ padding: '4px 10px', backgroundColor: copied ? '#10b981' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      {copied ? t.copied : t.copyId}
                    </button>
                    <button onClick={() => setShowQrModal(true)} style={{ padding: '4px 10px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      {t.showQr}
                    </button>
                  </>
                )}

                <input 
                  type="text" 
                  value={remotePeerIdInput}
                  onChange={(e) => setRemotePeerIdInput(e.target.value)}
                  placeholder={t.targetIdPlaceholder}
                  style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px' }}
                />
                <button onClick={makeCall} style={{ padding: '6px 14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                  {t.callBtn}
                </button>
                {callStatus && <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{callStatus}</span>}
                
                <button 
                  onClick={() => setInWaitingRoom(true)}
                  style={{ marginRight: 'auto', padding: '6px 12px', backgroundColor: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {t.leaveToWaiting}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isConnected ? '1fr 1fr' : '1fr', gap: '15px', flex: 1 }}>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '300px' }}>
                  <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!isConnected && (
                    <div style={{ position: 'absolute', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '40px' }}>👨‍🏫</div>
                      <p>منتظر تماس کاربر مقابل...</p>
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '300px' }}>
                  <video ref={myVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>تصویر شما</span>
                </div>
              </div>

            </div>
          )}

          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', border: '1px solid #334155', flexWrap: 'wrap' }}>
            <button 
              onClick={toggleMic}
              style={{ padding: '10px 18px', backgroundColor: isMicOn ? '#3b82f6' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isMicOn ? t.micOn : t.micOff}
            </button>

            <button 
              onClick={toggleCam}
              style={{ padding: '10px 18px', backgroundColor: isVideoOn ? '#3b82f6' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isVideoOn ? t.camOn : t.camOff}
            </button>

            <button 
              onClick={() => setRaisedHand(!raisedHand)}
              style={{ padding: '10px 18px', backgroundColor: raisedHand ? '#f59e0b' : '#475569', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {raisedHand ? t.handUp : t.raiseHand}
            </button>

            <button 
              onClick={() => setShowContactModal(true)}
              style={{ padding: '10px 18px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {t.contactUs}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #334155' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>{t.participants}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', color: '#94a3b8', fontSize: '0.9rem', flex: 1 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #2b3b55' }}>{t.host}</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #2b3b55', color: '#38bdf8' }}>{t.you} {raisedHand && '✋'}</li>
          </ul>
        </div>

      </main>

      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '350px', border: '1px solid #334155', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, color: '#38bdf8' }}>{t.qrTitle}</h3>
            
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', display: 'inline-block', margin: '15px 0' }}>
              <img src={qrUrl} alt="QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '15px' }}>{myPeerId}</p>

            <button onClick={() => setShowQrModal(false)} style={{ padding: '8px 20px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
              {t.close}
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '450px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, color: '#38bdf8' }}>{t.sendMessageTitle}</h3>
            
            {messageSent ? (
              <p style={{ color: '#10b981', fontWeight: 'bold', textAlign: 'center', padding: '20px 0' }}>{t.sentSuccess}</p>
            ) : (
              <form onSubmit={handleSendMessage}>
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={4}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '15px', resize: 'none', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setShowContactModal(false)} style={{ padding: '8px 16px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t.close}</button>
                  <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{t.send}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
