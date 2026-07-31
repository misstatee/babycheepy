export default function SetupNotice({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-800">
      <p className="font-extrabold">ระบบสมาชิกต้องตั้งค่า backend ก่อนใช้งานจริง</p>
      <p className="mt-2">
        {message ||
          'กรุณาตั้งค่า Supabase Environment Variables และรัน migration ของ Babycheepy Brand Club ก่อนใช้งานระบบสมาชิก'}
      </p>
    </div>
  );
}
