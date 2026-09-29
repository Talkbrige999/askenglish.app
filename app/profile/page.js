'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Student User',
    email: 'user@example.com',
    nativeLang: 'Persian',
    targetLang: 'English',
    level: 'Intermediate',
    bio: 'Passionate about learning new languages and connecting with native speakers worldwide!'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ padding: '15px 30px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Home</Link>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>👤 User Profile & Settings</h2>
        <Link href="/chat" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem' }}>Go to Chat 💬</Link>
      </header>

      {/* Profile Form Card */}
      <main style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0284c7', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            🎓
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{user.name}</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '5px 0 0' }}>{user.email}</p>
        </div>

        {saved && (
          <div style={{ backgroundColor: '#065f46', color: '#34d399', padding: '10px', borderRadius: '6px', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
            ✅ Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>Full Name</label>
            <input 
              type="text" 
              value={user.name} 
              onChange={(e) => setUser({...user, name: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>Native Language</label>
            <select 
              value={user.nativeLang}
              onChange={(e) => setUser({...user, nativeLang: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            >
              <option value="Persian">Persian (فارسی)</option>
              <option value="English">English</option>
              <option value="Chinese">Chinese (中文)</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>Learning Target Language</label>
            <select 
              value={user.targetLang}
              onChange={(e) => setUser({...user, targetLang: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            >
              <option value="English">English</option>
              <option value="Persian">Persian (فارسی)</option>
              <option value="Chinese">Chinese (中文)</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>Proficiency Level</label>
            <select 
              value={user.level}
              onChange={(e) => setUser({...user, level: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            >
              <option value="Beginner">Beginner (مبتدی)</option>
              <option value="Intermediate">Intermediate (متوسط)</option>
              <option value="Advanced">Advanced (پیشرفته)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>Bio / Learning Goals</label>
            <textarea 
              rows="3"
              value={user.bio} 
              onChange={(e) => setUser({...user, bio: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            Save Changes
          </button>
        </form>

      </main>
    </div>
  );
}

