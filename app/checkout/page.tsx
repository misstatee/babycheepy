'use client';

import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

type Lang = 'th' | 'en';

const BANK = {
  name: 'ธนาคารกสิกรไทย (KBank)',
  account: 'XXX-X-XXXXX-X',
  holder: 'นาง/นาย ชื่อบัญชีของคุณ',
  note: '⚠️ กรุณาแก้ไขชื่อและเลขบัญชีในไฟล์ app/checkout/page.tsx',
};

export default function CheckoutPage() {
  const [lang] = useState<Lang>('th');
  const { items, total, clearCart } = useCart();

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [orderId, setOrderId] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;
    setStatus('loading');

    const id = `BC${Date.now().toString().slice(-6)}`;
    setOrderId(id);

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, ...form, items, total }),
      });
      clearCart();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (items.length === 0 && status === 'form') {
    return (
      <div className="min-h-screen bg-pastel-pink-light flex items-center justify-center font-prompt">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 mb-4">ตะกร้าว่างอยู่ค่ะ</p>
          <a href="/shop" className="btn-pink">กลับไปเลือกสินค้า</a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-pastel-pink-light flex items-center justify-center font-prompt px-4">
        <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">สั่งซื้อสำเร็จแล้วค่ะ!</h2>
          <div className="chip mb-4 mx-auto">หมายเลขออเดอร์: {orderId}</div>

          <div className="bg-pastel-pink-light rounded-3xl p-5 mb-5 text-left">
            <p className="font-bold text-gray-900 mb-3">📱 ขั้นตอนต่อไป:</p>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="font-bold text-brand-pink">1.</span> โอนเงินจำนวน <strong>{total.toLocaleString()} บาท</strong> มาที่บัญชีด้านล่าง</li>
              <li className="flex gap-2"><span className="font-bold text-brand-pink">2.</span> ถ่ายสลิปการโอนเงิน</li>
              <li className="flex gap-2"><span className="font-bold text-brand-pink">3.</span> ส่งสลิปพร้อมหมายเลขออเดอร์ <strong>{orderId}</strong> มาที่ LINE OA</li>
            </ol>
          </div>

          <div className="bg-blue-50 rounded-3xl p-5 mb-5 text-left border-2 border-blue-200">
            <p className="font-bold text-gray-900 mb-2">🏦 บัญชีธนาคาร</p>
            <p className="text-sm text-gray-600">{BANK.name}</p>
            <p className="text-xl font-extrabold text-gray-900 my-1 tracking-wider">{BANK.account}</p>
            <p className="text-sm text-gray-600">ชื่อบัญชี: {BANK.holder}</p>
            {BANK.note && <p className="text-xs text-red-400 mt-2">{BANK.note}</p>}
          </div>

          <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#06C755] text-white font-bold py-3 px-6 rounded-full shadow-md hover:opacity-90 transition mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
            </svg>
            ส่งสลิปทาง LINE OA
          </a>
          <a href="/shop" className="btn-outline-pink w-full justify-center block text-center">กลับไปเลือกสินค้าต่อ</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-pink-light font-prompt">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100 px-4 h-16 flex items-center gap-4 shadow-sm">
        <a href="/shop" className="text-gray-500 hover:text-brand-pink">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <span className="font-extrabold text-gray-900">ชำระเงิน</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Left — form */}
        <div>
          <h2 className="font-extrabold text-xl text-gray-900 mb-5">📋 ข้อมูลการจัดส่ง</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อ-นามสกุล <span className="text-pink-500">*</span></label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="เช่น คุณสมหญิง ใจดี"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">เบอร์โทรศัพท์ <span className="text-pink-500">*</span></label>
              <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="เช่น 089-123-4567" type="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ที่อยู่จัดส่ง <span className="text-pink-500">*</span></label>
              <textarea required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">หมายเหตุ</label>
              <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="เช่น ขอเป็นของขวัญ ห่อกล่อง ฯลฯ"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none" />
            </div>

            {/* Bank info */}
            <div className="bg-blue-50 rounded-3xl p-5 border-2 border-blue-200">
              <p className="font-bold text-gray-900 mb-2">🏦 ชำระโดยการโอนเงิน</p>
              <p className="text-sm text-gray-600">{BANK.name}</p>
              <p className="text-lg font-extrabold text-gray-900 tracking-wider my-1">{BANK.account}</p>
              <p className="text-sm text-gray-600">ชื่อบัญชี: {BANK.holder}</p>
              {BANK.note && <p className="text-xs text-red-400 mt-2">{BANK.note}</p>}
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full btn-pink py-4 text-base justify-center disabled:opacity-60">
              {status === 'loading' ? '⏳ กำลังส่งออเดอร์...' : '✅ ยืนยันการสั่งซื้อ'}
            </button>
            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">เกิดข้อผิดพลาด กรุณาลองใหม่หรือติดต่อ LINE โดยตรงค่ะ</p>
            )}
          </form>
        </div>

        {/* Right — order summary */}
        <div>
          <h2 className="font-extrabold text-xl text-gray-900 mb-5">🛒 สรุปออเดอร์</h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-pastel-pink-light flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image.startsWith('http') ? item.image : `/images/${item.image}`}
                      alt={item.name_th} fill className="object-cover" />
                  ) : <span className="text-xl">👕</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.name_th}</p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <p className="text-sm font-extrabold text-brand-pink shrink-0">
                  {(item.price * item.quantity).toLocaleString()} ฿
                </p>
              </div>
            ))}

            <div className="border-t border-dashed border-pink-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-700">ยอดรวมทั้งหมด</span>
              <span className="text-xl font-extrabold text-brand-pink">{total.toLocaleString()} ฿</span>
            </div>
            <p className="text-xs text-gray-400 text-center">ค่าจัดส่งคำนวณแยกต่างหาก ทีมงานจะแจ้งยอดสุทธิ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
