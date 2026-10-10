
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-400">
          AskEnglish Live Rooms
        </h1>
        <p className="text-slate-300 text-lg">
          پلتفرم رایگان مکالمه زنده زبان انگلیسی. سطح خود را انتخاب کنید و وارد اتاق تمرین شوید.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Beginner Room */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-blue-500 transition-all">
            <div>
              <span className="bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">مقدماتی</span>
              <h2 className="text-xl font-bold mt-4">Beginner Room</h2>
              <p className="text-slate-400 text-sm mt-2">مکالمات ساده، پایه‌ای و دوستانه برای شروع یادگیری.</p>
            </div>
            <Link 
              href="/classroom?level=beginner"
              className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              ورود به اتاق
            </Link>
          </div>

          {/* Intermediate Room */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-blue-500 transition-all">
            <div>
              <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">متوسط</span>
              <h2 className="text-xl font-bold mt-4">Intermediate Room</h2>
              <p className="text-slate-400 text-sm mt-2">تمرین روان‌سازی کلام و بحث پیرامون موضوعات روز.</p>
            </div>
            <Link 
              href="/classroom?level=intermediate"
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              ورود به اتاق
            </Link>
          </div>

          {/* Advanced Room */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-blue-500 transition-all">
            <div>
              <span className="bg-purple-500/10 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">پیشرفته</span>
              <h2 className="text-xl font-bold mt-4">Advanced Room</h2>
              <p className="text-slate-400 text-sm mt-2">بحث‌های تخصصی، آزادی بیان و اصطلاحات پیشرفته.</p>
            </div>
            <Link 
              href="/classroom?level=advanced"
              className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              ورود به اتاق
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
