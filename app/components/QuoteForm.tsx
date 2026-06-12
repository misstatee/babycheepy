'use client';

import React, { useState } from 'react';

type Lang = 'th' | 'en';

type FormState = {
  name: string;
  contact: string;
  contactType: string;
  email: string;
  productTypes: string[];
  services: string[];
  quantity: string;
  details: string;
};

const PRODUCT_TYPES = {
  th: [
    { value: 'oem-kids', label: '🧒 เสื้อผ้าเด็ก (OEM/ODM)' },
    { value: 'family', label: '👨‍👩‍👧 ชุดครอบครัว (Family Collection)' },
    { value: 'pet', label: '🐾 ชุดสัตว์เลี้ยง (Pet Outfits)' },
    { value: 'wholesale', label: '🏷️ ขายส่งในประเทศ (Wholesale)' },
    { value: 'other', label: '📦 อื่นๆ' },
  ],
  en: [
    { value: 'oem-kids', label: '🧒 Kids Clothing (OEM/ODM)' },
    { value: 'family', label: '👨‍👩‍👧 Family Collection' },
    { value: 'pet', label: '🐾 Pet Outfits' },
    { value: 'wholesale', label: '🏷️ Domestic Wholesale' },
    { value: 'other', label: '📦 Other' },
  ],
};

const SERVICE_OPTIONS = {
  th: [
    { value: 'pattern', label: 'พัฒนาแพทเทิร์น & ตัวอย่าง' },
    { value: 'fabric', label: 'จัดหาผ้า / พิมพ์ลายผ้า' },
    { value: 'decoration', label: 'ปัก / สกรีน / ตกแต่ง' },
    { value: 'fullprod', label: 'ผลิตเต็มรูปแบบ (Full Production)' },
  ],
  en: [
    { value: 'pattern', label: 'Pattern Development & Sampling' },
    { value: 'fabric', label: 'Fabric Sourcing & Printing' },
    { value: 'decoration', label: 'Embroidery / Screen / Decoration' },
    { value: 'fullprod', label: 'Full Production' },
  ],
};

const labels = {
  th: {
    namePlaceholder: 'เช่น คุณสมหญิง หรือ แบรนด์ Little Stars',
    nameLabel: 'ชื่อ / ชื่อแบรนด์',
    contactLabel: 'ช่องทางติดต่อ',
    emailLabel: 'อีเมล (ถ้ามี)',
    emailPlaceholder: 'info@yourbrand.com',
    productLabel: 'ประเภทสินค้าที่ต้องการ',
    serviceLabel: 'บริการที่สนใจ',
    serviceOptional: '(เลือกได้หลายข้อ)',
    quantityLabel: 'จำนวนที่ต้องการผลิต (โดยประมาณ)',
    quantityPlaceholder: 'เช่น 500 ชิ้น / ไม่แน่ใจ',
    detailsLabel: 'รายละเอียดเพิ่มเติม / ไอเดียสินค้า',
    detailsPlaceholder: 'เล่าให้เราฟังเกี่ยวกับแบรนด์ ไอเดียดีไซน์ หรือความต้องการพิเศษของคุณ...',
    required: '*',
    contactTypes: ['Line ID', 'เบอร์โทรศัพท์', 'อีเมล'],
    contactPlaceholders: { 'Line ID': 'เช่น @somying', 'เบอร์โทรศัพท์': 'เช่น 089-123-4567', 'อีเมล': 'info@yourbrand.com' },
    submit: '📩 ส่งคำขอใบเสนอราคา',
    sending: '⏳ กำลังส่ง...',
    successTitle: 'ส่งคำขอสำเร็จแล้ว!',
    successMsg: 'ขอบคุณที่ติดต่อเข้ามาค่ะ ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
    sendAnother: 'ส่งคำขอใหม่',
    errorRequired: 'กรุณากรอกชื่อและช่องทางติดต่อ',
    errorProduct: 'กรุณาเลือกประเภทสินค้าอย่างน้อย 1 อย่าง',
    errorGeneric: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อผ่าน LINE โดยตรง',
    linePrompt: 'หรือติดต่อโดยตรงผ่าน LINE OA:',
  },
  en: {
    namePlaceholder: 'e.g. Jane Smith or Little Stars Brand',
    nameLabel: 'Name / Brand Name',
    contactLabel: 'Contact Method',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'info@yourbrand.com',
    productLabel: 'Product Type',
    serviceLabel: 'Services Needed',
    serviceOptional: '(select all that apply)',
    quantityLabel: 'Estimated Quantity',
    quantityPlaceholder: 'e.g. 500 pcs / not sure yet',
    detailsLabel: 'Additional Details / Design Ideas',
    detailsPlaceholder: 'Tell us about your brand, design ideas, or any special requirements...',
    required: '*',
    contactTypes: ['Line ID', 'Phone', 'Email'],
    contactPlaceholders: { 'Line ID': 'e.g. @yourbrand', 'Phone': 'e.g. +66-89-123-4567', 'Email': 'info@yourbrand.com' },
    submit: '📩 Submit Quote Request',
    sending: '⏳ Sending...',
    successTitle: 'Request Submitted!',
    successMsg: 'Thank you for reaching out. Our team will contact you within 24 hours.',
    sendAnother: 'Send Another Request',
    errorRequired: 'Please fill in your name and contact information.',
    errorProduct: 'Please select at least one product type.',
    errorGeneric: 'Something went wrong. Please try again or contact us via LINE.',
    linePrompt: 'Or contact us directly via LINE OA:',
  },
};

const initialForm: FormState = {
  name: '', contact: '', contactType: 'Line ID', email: '',
  productTypes: [], services: [], quantity: '', details: '',
};

function Checkbox({
  checked, onChange, label, highlight,
}: { checked: boolean; onChange: () => void; label: string; highlight: 'pink' | 'green' }) {
  const active = highlight === 'pink'
    ? 'border-pink-600 bg-pink-50 text-gray-900'
    : 'border-green-500 bg-green-50 text-gray-900';
  const inactive = 'border-gray-200 hover:border-gray-300 text-gray-600';
  const dotActive = highlight === 'pink' ? 'bg-pink-600 border-pink-600' : 'bg-green-500 border-green-500';

  return (
    <label className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-2.5 cursor-pointer transition text-sm font-semibold ${checked ? active : inactive}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${checked ? dotActive : 'border-gray-300'}`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default function QuoteForm({ lang = 'th' }: { lang?: Lang }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const lbl = labels[lang];

  function toggleCheckbox(field: 'productTypes' | 'services', value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) { setErrorMsg(lbl.errorRequired); return; }
    if (form.productTypes.length === 0) { setErrorMsg(lbl.errorProduct); return; }

    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
      setErrorMsg(lbl.errorGeneric);
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{lbl.successTitle}</h3>
        <p className="text-gray-600 mb-6">{lbl.successMsg}</p>
        <button onClick={() => setStatus('idle')} className="btn-primary">{lbl.sendAnother}</button>
      </div>
    );
  }

  const contactPlaceholder = (lbl.contactPlaceholders as Record<string, string>)[form.contactType] ?? '';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {lbl.nameLabel} <span className="text-pink-500">{lbl.required}</span>
        </label>
        <input type="text" value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder={lbl.namePlaceholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          required />
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {lbl.contactLabel} <span className="text-pink-500">{lbl.required}</span>
        </label>
        <div className="flex gap-2">
          <select value={form.contactType}
            onChange={(e) => setForm((p) => ({ ...p, contactType: e.target.value }))}
            className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white">
            {lbl.contactTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" value={form.contact}
            onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
            placeholder={contactPlaceholder}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">{lbl.emailLabel}</label>
        <input type="email" value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder={lbl.emailPlaceholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
      </div>

      {/* Product type */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {lbl.productLabel} <span className="text-pink-500">{lbl.required}</span>
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {PRODUCT_TYPES[lang].map((pt) => (
            <Checkbox key={pt.value} checked={form.productTypes.includes(pt.value)}
              onChange={() => toggleCheckbox('productTypes', pt.value)}
              label={pt.label} highlight="pink" />
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {lbl.serviceLabel} <span className="text-xs text-gray-400 font-normal">{lbl.serviceOptional}</span>
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {SERVICE_OPTIONS[lang].map((s) => (
            <Checkbox key={s.value} checked={form.services.includes(s.value)}
              onChange={() => toggleCheckbox('services', s.value)}
              label={s.label} highlight="green" />
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">{lbl.quantityLabel}</label>
        <input type="text" value={form.quantity}
          onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
          placeholder={lbl.quantityPlaceholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
      </div>

      {/* Details */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">{lbl.detailsLabel}</label>
        <textarea value={form.details}
          onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
          placeholder={lbl.detailsPlaceholder}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition resize-none" />
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm font-semibold bg-red-50 rounded-xl px-4 py-3">⚠️ {errorMsg}</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'loading' ? lbl.sending : lbl.submit}
      </button>

      <p className="text-center text-xs text-gray-400">
        {lbl.linePrompt}{' '}
        <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
          className="text-[#06C755] font-semibold hover:underline">@861pkbnz</a>
      </p>
    </form>
  );
}
