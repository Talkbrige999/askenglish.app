import Link from 'next/link';

export default function ChatRedirect() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'system-ui' }}>
      <h2>لطفاً از صفحه اصلی وارد اتاق‌ها شوید</h2>
      <Link href="/" style={{ color: '#2563eb', fontWeight: 'bold' }}>بازگشت به صفحه اصلی / 返回首页</Link>
    </div>
  );
}
