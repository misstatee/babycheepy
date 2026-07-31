export default function MemberNav() {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-sm font-prompt">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-extrabold text-xl text-gray-900">Baby</span>
          <span className="font-extrabold text-xl text-brand-pink">Cheepy</span>
        </a>
        <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-600">
          <a href="/member-register" className="hover:text-brand-pink">สมัครสมาชิก</a>
          <a href="/member-login" className="hover:text-brand-pink">เข้าสู่ระบบ</a>
          <a href="/member-dashboard" className="hover:text-brand-pink">Dashboard</a>
          <a href="/size-finder" className="hover:text-brand-pink">วัดไซซ์ AI</a>
          <a href="/try-on" className="hover:text-brand-pink">ลองชุดเสมือน</a>
        </div>
        <a href="/member-register" className="btn-pink text-xs py-2 px-4">
          สมัคร Babycheepy Brand Club
        </a>
      </div>
    </nav>
  );
}
