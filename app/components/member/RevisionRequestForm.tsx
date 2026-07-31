'use client';

import { useState, type FormEvent } from 'react';
import type { AiModelDeliverableRecord } from '../../../lib/member/types';

export default function RevisionRequestForm({
  requestId,
  deliverables,
}: {
  requestId: string;
  deliverables: AiModelDeliverableRecord[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const imageKeys = formData.getAll('imageKeys').map(String);
    const response = await fetch('/api/member/revisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        imageKeys,
        message: String(formData.get('message') || ''),
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'ส่งคำขอแก้ไขไม่สำเร็จ');
      return;
    }
    event.currentTarget.reset();
    setMessage('ส่งคำขอแก้ไขให้แอดมินแล้ว');
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-2xl bg-pink-50 p-4 text-sm">
      <p className="font-extrabold text-gray-900">ส่งคำขอแก้ไขงาน</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {deliverables.map((file) => (
          <label key={file.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-gray-600">
            <input name="imageKeys" type="checkbox" value={file.id} className="h-4 w-4 accent-brand-pink" />
            {file.deliverable_kind}
          </label>
        ))}
      </div>
      <textarea
        name="message"
        required
        minLength={10}
        placeholder="พิมพ์รายละเอียดที่ต้องการให้แอดมินช่วยแก้ไข"
        className="mt-3 w-full rounded-xl border border-pink-100 px-3 py-2"
      />
      <p className="mt-2 text-xs text-gray-500">
        การแก้ไขเป็นไปตามขอบเขตที่ Baby Cheepy กำหนด การเปลี่ยนนางแบบ เปลี่ยนชุด หรือเปลี่ยนแนวทางหลักหลังเริ่มดำเนินงาน อาจถือเป็นงานใหม่และมีค่าใช้จ่ายเพิ่มเติม
      </p>
      <button className="mt-3 rounded-xl bg-brand-pink px-4 py-2 text-xs font-bold text-white">ส่งคำขอแก้ไข</button>
      {message && <p className="mt-2 text-xs font-bold text-green-700">{message}</p>}
      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
    </form>
  );
}
