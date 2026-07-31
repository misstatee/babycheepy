'use client';

import { useRef, useState } from 'react';
import { SIZE_ORDER, type FitResult, type SizeRecommendation } from '../../lib/size-chart';
import { useAccessGate } from '../../components/AccessGate';

interface TryOnResponse {
  ok: boolean;
  error?: string;
  image?: string | null;
  imageError?: string | null;
  analysis?: {
    childHeightCm: number | null;
    childAgeYears: number | null;
    garmentType: string;
    garmentDescriptionTh: string;
    sizeTag: string | null;
    confidence: string;
    notesTh: string;
  };
  childSize?: SizeRecommendation | null;
  outfitSize?: string | null;
  outfitSizeSource?: 'user' | 'tag' | 'ai' | null;
  fit?: FitResult | null;
  warnings?: string[];
}

async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const MAX = 1024;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

const FIT_STYLE: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  perfect:        { bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-700',  icon: '✅' },
  slightly_large: { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-700',   icon: '📏' },
  too_large:      { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: '⚠️' },
  slightly_small: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: '📏' },
  too_small:      { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700',    icon: '⚠️' },
};

const SIZE_SOURCE_TH: Record<string, string> = {
  user: 'ไซซ์ที่คุณเลือก', tag: 'อ่านจากป้ายไซซ์ในรูป', ai: 'AI ประเมินจากรูป',
};

function UploadBox({ label, hint, preview, onFile, onClear }: {
  label: string; hint: string; preview: string | null;
  onFile: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
      <div
        onClick={() => ref.current?.click()}
        className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-3 text-center cursor-pointer hover:border-brand-pink hover:bg-pink-50/50 transition-colors min-h-[180px] flex items-center justify-center">
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="max-h-44 rounded-xl shadow" />
        ) : (
          <div>
            <div className="text-4xl mb-2">📷</div>
            <p className="text-xs text-gray-500 font-semibold">{hint}</p>
          </div>
        )}
      </div>
      {preview && (
        <button onClick={onClear} className="text-[11px] text-gray-400 hover:text-red-500 mt-1 underline">
          เลือกรูปใหม่
        </button>
      )}
    </div>
  );
}

export default function TryOnPage() {
  const [childImg, setChildImg] = useState<string | null>(null);
  const [outfitImg, setOutfitImg] = useState<string | null>(null);
  const [outfitSize, setOutfitSize] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);

  // 🔐 ระบบรหัสปลดล็อก — หน้ายังเข้าดูได้ปกติ ล็อกเฉพาะตอนกดสร้างภาพ
  const { ask, gate, unlocked } = useAccessGate({
    icon: '👗',
    title: 'ปลดล็อกลองชุดเสมือนจริง',
    subtitle: 'กรอกรหัสเพื่อทดลองใช้ฟรี ไม่มีค่าใช้จ่ายค่ะ',
  });

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childImage: childImg,
          outfitImage: outfitImg,
          outfitSize: outfitSize || undefined,
          childHeightCm: heightCm ? Number(heightCm) : undefined,
          childWeightKg: weightKg ? Number(weightKg) : undefined,
        }),
      });
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: 'เชื่อมต่อระบบไม่ได้ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setLoading(false);
    }
  }

  const fit = result?.ok ? result.fit : null;
  const fitStyle = fit ? FIT_STYLE[fit.level] : null;

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1">
            <span className="font-extrabold text-xl text-gray-900">Baby</span>
            <span className="font-extrabold text-xl text-brand-pink">Cheepy</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <a href="/" className="hover:text-brand-pink transition-colors">หน้าแรก</a>
            <a href="/shop" className="hover:text-brand-pink transition-colors">ร้านค้า</a>
            <a href="/size-finder" className="hover:text-brand-pink transition-colors">วัดไซซ์ AI</a>
            <a href="/try-on" className="text-brand-pink border-b-2 border-brand-pink pb-0.5">ลองชุดเสมือน</a>
            <a href="/#quote" className="hover:text-brand-pink transition-colors">สั่งผลิต OEM</a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            👗 ลองชุดเสมือนจริงด้วย <span className="text-brand-pink">AI</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            อัพโหลดรูปน้อง + รูปชุดที่อยากลอง ระบบจะสร้างภาพน้องใส่ชุดนั้น
            พร้อมวิเคราะห์ว่าไซซ์นี้พอดีตัว ใหญ่ไป หรือเล็กไป
          </p>
        </div>

        {/* Upload 2 รูป */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <UploadBox
            label="1. รูปน้อง (เต็มตัว)" hint="ยืนตรง เห็นหัวถึงเท้า ชัดเจน"
            preview={childImg}
            onFile={async (f) => { setResult(null); setChildImg(await compressImage(f)); }}
            onClear={() => { setChildImg(null); setResult(null); }} />
          <UploadBox
            label="2. รูปชุดที่อยากลอง" hint="ถ่ายชุดเต็มตัว เห็นสี/ลายชัด"
            preview={outfitImg}
            onFile={async (f) => { setResult(null); setOutfitImg(await compressImage(f)); }}
            onClear={() => { setOutfitImg(null); setResult(null); }} />
        </div>

        {/* ข้อมูลเสริม */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              ไซซ์ของชุดในรูป <span className="text-gray-400 font-normal">— ถ้าทราบ จะประเมินความพอดีได้แม่นที่สุด</span>
            </label>
            <select
              value={outfitSize} onChange={(e) => setOutfitSize(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-pink bg-white">
              <option value="">ไม่ทราบ — ให้ AI ประเมินจากรูป</option>
              {SIZE_ORDER.map((s) => (
                <option key={s} value={s}>ไซซ์ {s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                ส่วนสูงน้อง (ซม.) <span className="text-gray-400 font-normal">— ไม่บังคับ</span>
              </label>
              <input type="number" inputMode="decimal" value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)} placeholder="เช่น 98"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-pink" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                น้ำหนัก (กก.) <span className="text-gray-400 font-normal">— ไม่บังคับ</span>
              </label>
              <input type="number" inputMode="decimal" value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)} placeholder="เช่น 15"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-pink" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400">
            * รูปจะถูกส่งไปประมวลผลเท่านั้น ไม่ถูกจัดเก็บไว้ในระบบ
          </p>
        </div>

        <button
          onClick={() => ask(submit)} disabled={!childImg || !outfitImg || loading}
          className="w-full py-3.5 bg-brand-pink text-white font-extrabold rounded-xl hover:bg-brand-pink-dark transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-md mb-8">
          {loading
            ? '⏳ กำลังสร้างภาพ อาจใช้เวลา 20-40 วินาที...'
            : (
              <>
                ✨ ลองชุดด้วย AI
                {!unlocked && (
                  <span className="ml-2 inline-block align-middle rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold">
                    🔑 ต้องมีรหัส
                  </span>
                )}
              </>
            )}
        </button>

        {/* ---------- ผลลัพธ์ ---------- */}
        {result && !result.ok && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600 font-semibold">
            ⚠️ {result.error}
          </div>
        )}

        {result?.ok && (
          <div className="space-y-5 animate-fade-up">
            {/* ภาพที่ gen */}
            {result.image ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 mb-3 tracking-wide">ภาพจำลองน้องใส่ชุดนี้</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.image} alt="ภาพจำลองการลองชุด" className="max-h-[480px] mx-auto rounded-xl shadow-md" />
                <a href={result.image} download="babycheepy-tryon.png"
                  className="inline-block mt-3 text-xs font-bold text-brand-pink hover:underline">
                  ⬇️ บันทึกรูปนี้
                </a>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
                {result.imageError}
              </div>
            )}

            {/* คำตัดสินความพอดี */}
            {fit && fitStyle && (
              <div className={`${fitStyle.bg} border-2 ${fitStyle.border} rounded-2xl p-5`}>
                <p className={`text-lg font-extrabold ${fitStyle.text} mb-1`}>
                  {fitStyle.icon} {fit.labelTh}
                </p>
                <p className="text-sm text-gray-600">{fit.adviceTh}</p>
                <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-bold">
                  {result.childSize && (
                    <span className="bg-white/70 rounded-full px-3 py-1 text-gray-600">
                      ไซซ์ที่เหมาะกับน้อง: {result.childSize.size}
                    </span>
                  )}
                  {result.outfitSize && (
                    <span className="bg-white/70 rounded-full px-3 py-1 text-gray-600">
                      ไซซ์ชุดนี้: {result.outfitSize} ({SIZE_SOURCE_TH[result.outfitSizeSource ?? ''] ?? '-'})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* คำเตือน */}
            {result.warnings?.map((w, i) => (
              <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 text-xs text-orange-700">
                ⚠️ {w}
              </div>
            ))}

            {/* รายละเอียดวิเคราะห์ */}
            {result.analysis && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-700 text-sm mb-2">🤖 รายละเอียดการวิเคราะห์</p>
                <p>ชุดในรูป: {result.analysis.garmentDescriptionTh}</p>
                {result.analysis.childHeightCm && <p>ส่วนสูงน้องที่ใช้คำนวณ: {result.analysis.childHeightCm} ซม.</p>}
                {result.analysis.sizeTag && <p>ป้ายไซซ์ที่เห็นในรูป: {result.analysis.sizeTag}</p>}
                {result.analysis.notesTh && <p>หมายเหตุ: {result.analysis.notesTh}</p>}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              {fit && fit.level !== 'perfect' && result.childSize && (
                <a href="/shop"
                  className="flex-1 text-center py-3 bg-brand-pink text-white font-bold rounded-xl hover:bg-brand-pink-dark transition-colors">
                  🛒 ดูชุดไซซ์ {result.childSize.size} ที่พอดีตัวน้อง
                </a>
              )}
              <a href="/size-finder"
                className="flex-1 text-center py-3 bg-white border-2 border-brand-pink text-brand-pink font-bold rounded-xl hover:bg-pink-50 transition-colors">
                📏 วัดไซซ์น้องแบบละเอียด
              </a>
            </div>

            <p className="text-[11px] text-gray-400 text-center pb-4">
              ภาพที่สร้างเป็นภาพจำลองจาก AI เพื่อช่วยจินตนาการเท่านั้น
              สี ทรง และความพอดีจริงอาจต่างจากภาพ ควรเทียบกับตารางไซซ์ก่อนตัดสินใจ
            </p>
          </div>
        )}
      </div>

      {/* 🔐 กล่องกรอกรหัส */}
      {gate}
    </div>
  );
}
