'use client';

import { useState, type FormEvent } from 'react';

export default function MemberRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/member/register', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');
      }
      event.currentTarget.reset();
      setMessage(
        'ได้รับข้อมูลการสมัคร Babycheepy Brand Club แล้ว กรุณารอแอดมินตรวจสอบหลักฐานการชำระเงิน เมื่อได้รับอนุมัติ คุณจะสามารถเข้าใช้สิทธิ์สมาชิกได้โดยไม่ต้องต่ออายุ',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          ชื่อผู้สมัคร
          <input name="firstName" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          นามสกุล
          <input name="lastName" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        ชื่อแบรนด์หรือชื่อร้าน
        <input name="brandName" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          เบอร์โทรศัพท์
          <input name="phone" required inputMode="tel" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          LINE ID
          <input name="lineId" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        อีเมล
        <input name="email" required type="email" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          รหัสผ่าน
          <input name="password" required type="password" minLength={8} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ยืนยันรหัสผ่าน
          <input name="confirmPassword" required type="password" minLength={8} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        อัปโหลดหลักฐานการชำระเงิน
        <input
          name="paymentProof"
          required
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="mt-1 w-full rounded-xl border border-dashed border-pink-200 bg-pink-50/40 px-4 py-3 text-sm font-normal"
        />
        <span className="mt-1 block text-xs font-normal text-gray-400">รองรับ JPG, PNG หรือ PDF ขนาดไม่เกิน 8MB</span>
      </label>
      <label className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">
        <input name="acceptedTerms" type="checkbox" required className="mt-1" />
        <span>ฉันได้อ่านและยอมรับข้อกำหนดของ Babycheepy Brand Club</span>
      </label>
      <label className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">
        <input name="acceptedPrivacy" type="checkbox" required className="mt-1" />
        <span>ฉันยินยอมให้ Baby Cheepy จัดเก็บข้อมูลเพื่อให้บริการสมาชิก</span>
      </label>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</p>}
      <button disabled={loading} className="btn-pink w-full justify-center rounded-xl py-3 disabled:opacity-50">
        {loading ? 'กำลังส่งข้อมูล...' : 'สมัคร Babycheepy Brand Club 99 บาท'}
      </button>
    </form>
  );
}
