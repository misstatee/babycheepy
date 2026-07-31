'use client';

import { useState, type FormEvent } from 'react';
import type { AiModelRecord } from '../../../lib/member/types';

export default function AiModelRequestForm({
  models,
  brandName,
  remainingCredits,
}: {
  models: AiModelRecord[];
  brandName: string;
  remainingCredits: number;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/member/ai-model-requests', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'ส่งคำขอไม่สำเร็จ');
      setMessage('ส่งคำขอชุดภาพนางแบบ AI แล้ว กรุณารอแอดมินตรวจสอบและรับงาน');
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ส่งคำขอไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
      <div className="rounded-2xl bg-pink-50 p-4 text-sm text-gray-700">
        <p className="font-extrabold text-gray-900">สรุปก่อนส่งคำขอ</p>
        <p className="mt-1">จำนวนภาพรวม 6 ภาพ: Mockup 1 ภาพ + นางแบบ AI 1 คน จำนวน 5 ท่าทาง</p>
        <p>สิทธิ์คงเหลือก่อนส่ง: {remainingCredits} เซ็ต</p>
        <p className="mt-2 text-xs text-gray-500">
          เมื่อ Baby Cheepy รับงานแล้ว ระบบจะหักเครดิต 1 เซ็ต การเปลี่ยนนางแบบหรือเปลี่ยนชุดหลังเริ่มงานอาจถือเป็นงานใหม่
        </p>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        ชื่อแบรนด์
        <input name="brandName" required defaultValue={brandName} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          ชื่อสินค้า
          <input name="productName" required className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ประเภทสินค้า
          <input name="productType" required placeholder="เช่น ชุดเดรส, ชุดนอน, เซ็ตเสื้อกางเกง" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        เลือกนางแบบ AI จากคลัง
        <select name="aiModelId" required className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal">
          <option value="">เลือกนางแบบ</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.display_name} ({model.model_code})
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          อัตราส่วนภาพ
          <select name="aspectRatio" required className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal">
            <option value="1:1">1:1</option>
            <option value="4:5">4:5</option>
            <option value="9:16">9:16</option>
          </select>
        </label>
        <label className="text-sm font-bold text-gray-700">
          สไตล์พื้นหลัง
          <select name="backgroundStyle" required className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal">
            <option value="studio">สตูดิโอสะอาด</option>
            <option value="lifestyle">Lifestyle อบอุ่น</option>
            <option value="minimal">Minimal สีอ่อน</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        ช่องทางนำภาพไปใช้งาน
        <input name="usageChannel" required placeholder="เช่น Shopee, Facebook, LINE, Catalog" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">
          ภาพชุดต้นฉบับ
          <input name="mainGarment" required type="file" accept="image/jpeg,image/png" className="mt-1 w-full rounded-xl border border-dashed border-pink-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ภาพด้านหน้า
          <input name="frontImage" required type="file" accept="image/jpeg,image/png" className="mt-1 w-full rounded-xl border border-dashed border-pink-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ภาพด้านหลัง ถ้ามี
          <input name="backImage" type="file" accept="image/jpeg,image/png" className="mt-1 w-full rounded-xl border border-dashed border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ภาพรายละเอียดผ้า ถ้ามี
          <input name="fabricDetail" type="file" accept="image/jpeg,image/png" className="mt-1 w-full rounded-xl border border-dashed border-gray-200 px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-bold text-gray-700">
          ลายผ้า ถ้ามี
          <input name="fabricPattern" type="file" accept="image/jpeg,image/png" className="mt-1 w-full rounded-xl border border-dashed border-gray-200 px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-bold text-gray-700">
        หมายเหตุเพิ่มเติม
        <textarea name="notes" rows={4} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" />
      </label>
      <label className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">
        <input name="confirmed" required type="checkbox" className="mt-1" />
        <span>ฉันยืนยันว่าได้ตรวจสอบนางแบบและรายละเอียดชุดแล้ว</span>
      </label>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</p>}
      <button disabled={loading || remainingCredits <= 0} className="btn-pink w-full justify-center rounded-xl py-3 disabled:opacity-50">
        {loading ? 'กำลังส่งคำขอ...' : 'ส่งคำขอใช้สิทธิ์ชุดภาพ AI'}
      </button>
    </form>
  );
}
