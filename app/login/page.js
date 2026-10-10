'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('خطا در ورود با گوگل. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-400">ورود به AskEnglish</h1>
        <p className="text-slate-400 text-sm">برای پیوستن به اتاق‌های مکالمه، با حساب گوگل خود وارد شوید.</p>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.36 7.22 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.19C.43 8.15 0 9.89 0 12s.43 3.85 1.19 5.4l4.09-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.64 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
          </svg>
          {loading ? 'در حال اتصال...' : 'ورود با حساب گوگل'}
        </button>

        <div className="pt-4 border-t border-slate-700">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">در حال بارگذاری...</div>}>
      <LoginContent />
    </Suspense>
  );
}
