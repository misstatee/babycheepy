'use client';

import { useState, type FormEvent } from 'react';

export default function PasswordResetForm() {
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: form.get('login') }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'ส่งคำขอรีเซ็ตรหัสผ่านไม่สำเร็จ');
      return;
    }
    setRequestMessage('หากพบบัญชีนี้ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้ทางอีเมลหรือแจ้งแอดมินให้ช่วยดำเนินการ');
  }

  async function confirmReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: form.get('token'),
        password: form.get('password'),
        confirmPassword: form.get('confirmPassword'),
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'ตั้งรหัสผ่านใหม่ไม่สำเร็จ');
      return;
    }
    setConfirmMessage('ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบอีกครั้ง');
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={requestReset} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">ขอลิงก์รีเซ็ตรหัสผ่าน</h2>
        <label className="block text-sm font-bold text-gray-700">
          อีเมลหรือเบอร์โทรศัพท์
          <input name="login" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <button className="btn-pink w-full justify-center rounded-xl py-3">ส่งคำขอรีเซ็ตรหัสผ่าน</button>
        {requestMessage && <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{requestMessage}</p>}
      </form>

      <form onSubmit={confirmReset} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">ตั้งรหัสผ่านใหม่ด้วย Token</h2>
        <p className="text-sm text-gray-500">ใช้ token จากลิงก์อีเมล หรือ token ที่แอดมินส่งให้โดยตรง</p>
        <label className="block text-sm font-bold text-gray-700">
          Reset Token
          <input name="token" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-gray-700">
            รหัสผ่านใหม่
            <input name="password" required minLength={8} type="password" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
          </label>
          <label className="text-sm font-bold text-gray-700">
            ยืนยันรหัสผ่านใหม่
            <input name="confirmPassword" required minLength={8} type="password" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
          </label>
        </div>
        <button className="btn-outline-pink w-full justify-center rounded-xl py-3">ตั้งรหัสผ่านใหม่</button>
        {confirmMessage && <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{confirmMessage}</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
      </form>
    </div>
  );
}
