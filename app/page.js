
import Link from 'next/link';

export default function Home() {
  const rooms = [
    {
      id: 'beginner',
      title: 'Beginner Room',
      levelFa: 'مقدماتی',
      levelZh: '初级',
      descFa: 'مکالمات ساده، پایه‌ای و دوستانه برای شروع یادگیری.',
      descZh: '适合初学者，进行简单友好的日常英语对话。',
      badgeColor: '#22c55e',
    },
    {
      id: 'intermediate',
      title: 'Intermediate Room',
      levelFa: 'متوسط',
      levelZh: '中级',
      descFa: 'تمرین روان‌سازی کلام و بحث پیرامون موضوعات روزمره.',
      descZh: '提高口语流利度，讨论日常热门话题。',
      badgeColor: '#eab308',
    },
    {
      id: 'advanced',
      title: 'Advanced Room',
      levelFa: 'پیشرفته',
      levelZh: '高级',
      descFa: 'بحث‌های تخصصی، آزادی بیان و اصطلاحات پیشرفته.',
      descZh: '深入探讨专业话题，练习地道英语表达。',
      badgeColor: '#ef4444',
    },
  ];

  return (
    <main style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1e293b'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '10px' }}>
          AskEnglish Live Rooms
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '6px' }}>
          Free Live English Speaking Practice Platform
        </p>
        <p style={{ fontSize: '1rem', color: '#64748b', direction: 'rtl', marginBottom: '6px' }}>
          پلتفرم رایگان مکالمه زنده زبان انگلیسی. سطح خود را انتخاب کنید و وارد اتاق شوید.
        </p>
        <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
          免费在线英语口语练习平台。选择您的水平并加入房间。
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '20px'
      }}>
        {rooms.map((room) => (
          <div key={room.id} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{room.title}</h2>
                <span style={{
                  backgroundColor: room.badgeColor,
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {room.levelFa} / {room.levelZh}
                </span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', direction: 'rtl', textAlign: 'right', marginBottom: '8px' }}>
                {room.descFa}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '20px' }}>
                {room.descZh}
              </p>
            </div>

            <Link href={`/classroom?level=${room.id}`} style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Join Room / ورود / 加入
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
