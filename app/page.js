'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#38bdf8', fontWeight: 'bold' }}>🌐 GlobalTalk AI</h1>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/chat" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Global Chat</Link>
          <Link href="/classroom" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Live Class</Link>
          <Link href="/login" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <span style={{ backgroundColor: '#1e293b', color: '#38bdf8', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid #334155' }}>
          🚀 Next-Gen AI Language Exchange Platform
        </span>
        
        <h2 style={{ fontSize: '3rem', maxWidth: '800px', lineHeight: '1.2', margin: '0 0 20px 0' }}>
          Connect, Chat & Learn Languages <span style={{ color: '#38bdf8' }}>in Real-Time</span>
        </h2>
        
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '40px' }}>
          Experience seamless multilingual communication with AI-powered instant translation, global chatrooms, and live interactive video classes.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/chat">
            <button style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              💬 Join Global Chat
            </button>
          </Link>
          
          <Link href="/classroom">
            <button style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', padding: '14px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              🎓 Enter Live Class
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', borderTop: '1px solid #1e293b' }}>
        © 2026 GlobalTalk AI. Built with Next.js & React.
      </footer>
    </div>
  );
}

