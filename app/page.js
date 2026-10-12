
'use client';

import Link from 'next/link';

export default function HomePage() {
  const rooms = [
    {
      id: 'beginner',
      title: 'Beginner Room',
      levelFa: 'مقدماتی',
      descFa: 'مکالمات ساده، پایه‌ای و دوستانه برای شروع یادگیری.',
      badgeColor: '#22c55e',
    },
    {
      id: 'intermediate',
      title: 'Intermediate Room',
      levelFa: 'متوسط',
      descFa: 'تمرین روان‌سازی کلام و بحث پیرامون موضوعات روزمره.',
      badgeColor: '#eab308',
    },
    {
      id: 'advanced',
      title: 'Advanced Room',
      levelFa: 'پیشرفته',
      descFa: 'گفتگوهای تخصصی و پیشرفته جهت تسلط کامل بر زبان.',
      badgeColor: '#a855f7',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="bg-white border-b py-5 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            AskEnglish <span className="text-blue-600">Academy</span>
          </h1>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border">
            Online Classroom Portal
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            انتخاب اتاق گفتگو و کلاس
          </h2>
          <p className="text-gray-500 text-sm">
            سطح مورد نظر خود را انتخاب کنید تا وارد کلاس آنلاین شوید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition hover:shadow-md"
            >
              <div className="h-2" style={{ backgroundColor: room.badgeColor }} />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {room.title}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {room.levelFa}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6">
                    {room.descFa}
                  </p>
                </div>
                <Link
                  href={`/classroom?level=${room.id}`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition"
                >
                  ورود به اتاق
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} AskEnglish Academy. All rights reserved.
      </footer>
    </div>
  );
}
