import MemberLoginForm from '../components/member/MemberLoginForm';
import MemberNav from '../components/member/MemberNav';

export default function MemberLoginPage() {
  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6 text-center">
          <p className="chip mb-3">Babycheepy Brand Club</p>
          <h1 className="text-3xl font-extrabold text-gray-900">เข้าสู่ระบบสมาชิก</h1>
          <p className="mt-2 text-sm text-gray-500">เข้าใช้ AI วัดไซส์, AI ลองชุดเสมือนจริง และ Dashboard สมาชิก</p>
        </div>
        <MemberLoginForm />
      </section>
    </main>
  );
}
