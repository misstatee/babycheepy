'use client';

import { useState, type FormEvent } from 'react';

export default function MemberLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: form.get('login'),
          password: form.get('password'),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      const next = new URLSearchParams(window.location.search).get('next') || '/member-dashboard';
      window.location.href = next.startsWith('/') ? next : '/member-dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
      <label className="block text-sm font-bold text-gray-700">
        อีเมลหรือเบอร์โทรศัพท์
        <input name="login" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <label className="block text-sm font-bold text-gray-700">
        รหัสผ่าน
        <input name="password" required type="password" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
      <button disabled={loading} className="btn-pink w-full justify-center rounded-xl py-3 disabled:opacity-50">
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
      <div className="grid gap-2 text-center text-sm font-bold sm:grid-cols-3">
        <a href="/member-register" className="rounded-xl border border-pink-200 px-3 py-2 text-brand-pink">
          สมัคร Babycheepy Brand Club
        </a>
        <a href="/member-reset-password" className="rounded-xl border border-gray-200 px-3 py-2 text-gray-600">
          ลืมรหัสผ่าน
        </a>
        <a href="https://line.me/R/ti/p/@861pkbnz" className="rounded-xl border border-green-200 px-3 py-2 text-green-600">
          ติดต่อแอดมินผ่าน LINE
        </a>
      </div>
    </form>
  );
}
