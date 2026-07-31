import MemberNav from '../components/member/MemberNav';
import PasswordResetForm from '../components/member/PasswordResetForm';

export default function MemberResetPasswordPage() {
  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6 text-center">
          <p className="chip mb-3">Password Reset</p>
          <h1 className="text-3xl font-extrabold text-gray-900">รีเซ็ตรหัสผ่าน</h1>
          <p className="mt-2 text-sm text-gray-500">ระบบจะสร้าง token แบบหมดอายุ และไม่เก็บรหัสผ่านเป็น Plain Text</p>
        </div>
        <PasswordResetForm />
      </section>
    </main>
  );
}
