'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState('Persian');
  const [targetLang, setTargetLang] = useState('English');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`خوش آمدید! زبان مادری: ${nativeLang} | زبان هدف: ${targetLang}`);
    window.location.href = '/chat';
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#38bdf8', margin: '0 0 8px 0' }}>🌐 GlobalTalk AI</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>وارد حساب کاربری خود شوید</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>ایمیل</label>
            <input 
              type="email" 
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>رمز عبور</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Native Language */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>زبان مادری شما</label>
            <select 
              value={nativeLang} 
              onChange={(e) => setNativeLang(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="Persian">فارسی (Persian)</option>
              <option value="English">انگلیسی (English)</option>
              <option value="Spanish">اسپانیایی (Spanish)</option>
              <option value="French">فرانسوی (French)</option>
              <option value="Arabic">عربی (Arabic)</option>
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>زبان مورد تمرین (هدف)</label>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="English">انگلیسی (English)</option>
              <option value="Persian">فارسی (Persian)</option>
              <option value="Spanish">اسپانیایی (Spanish)</option>
              <option value="French">فرانسوی (French)</option>
              <option value="German">آلمانی (German)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ marginTop: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ورود به برنامه 🚀
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>بازگشت به صفحه اصلی</Link>
        </div>

      </div>
    </div>
  );
}

