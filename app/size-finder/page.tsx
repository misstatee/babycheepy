'use client';

import { useRef, useState } from 'react';
import type { SizeRecommendation, FabricItem } from '../../lib/size-chart';
import { GARMENT_DIMS } from '../../lib/size-chart';

interface ApiResult {
  ok: boolean;
  mode?: 'photo' | 'manual';
  estimatedHeightCm?: number;
  recommendation?: SizeRecommendation;
  fabric?: FabricItem[];
  warning?: string | null;
  error?: string;
  analysis?: {
    reference_detected: boolean;
    reference_type: string | null;
    pose: string;
    confidence: 'high' | 'medium' | 'low';
    notes_th: string;
  } | null;
}

/** ย่อรูปฝั่ง client ให้เล็กพอส่ง API (ยาวสุด 1280px, JPEG 0.85) */
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

  const MAX = 1280;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

const CONFIDENCE_TH: Record<string, string> = {
  high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ',
};

export default function SizeFinderPage() {
  const [tab, setTab] = useState<'photo' | 'manual'>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [weightKg, setWeightKg] = useState('');
  const [manualHeight, setManualHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setResult(null);
    const compressed = await compressImage(file);
    setPreview(compressed);
  }

  async function analyze() {
    setLoading(true);
    setResult(null);
    try {
      const payload =
        tab === 'photo'
          ? { image: preview, weightKg: weightKg ? Number(weightKg) : undefined }
          : { heightCm: Number(manualHeight), weightKg: weightKg ? Number(weightKg) : undefined };

      const res = await fetch('/api/size-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: ApiResult = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: 'เชื่อมต่อระบบไม่ได้ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setLoading(false);
    }
  }

  const canAnalyze = tab === 'photo' ? !!preview : Number(manualHeight) > 0;
  const rec = result?.ok ? result.recommendation : undefined;
  const dims = rec ? GARMENT_DIMS[rec.size] : undefined;

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
            <a href="/size-finder" className="text-brand-pink border-b-2 border-brand-pink pb-0.5">วัดไซซ์ AI</a>
            <a href="/#quote" className="hover:text-brand-pink transition-colors">สั่งผลิต OEM</a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            📏 วัดไซซ์เสื้อผ้าเด็กด้วย <span className="text-brand-pink">AI</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            อัพโหลดรูปน้อง ระบบจะประเมินความยาวตัว แนะนำไซซ์ที่เหมาะสม
            พร้อมประมาณปริมาณผ้าที่ใช้ผลิตชุดแต่ละแบบ
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 mb-5 shadow-sm">
          {(['photo', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setResult(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                tab === t ? 'bg-brand-pink text-white' : 'text-gray-500 hover:text-brand-pink'
              }`}>
              {t === 'photo' ? '📷 วิเคราะห์จากรูปถ่าย' : '✏️ กรอกส่วนสูงเอง'}
            </button>
          ))}
        </div>

        {tab === 'photo' && (
          <>
            {/* คำแนะนำการถ่ายรูป */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 mb-5">
              <h2 className="font-bold text-gray-900 text-sm mb-3">📸 วิธีถ่ายรูปให้วัดได้แม่นยำ</h2>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                <li>ให้น้อง<b>นอนหงายเหยียดตัวตรง</b>บนพื้นเรียบ</li>
                <li>วาง<b>กระดาษ A4</b> (หรือไม้บรรทัด 30 ซม.) ข้างลำตัว ในระนาบเดียวกัน</li>
                <li>ถ่ายจาก<b>ด้านบนตรงๆ</b> (มุม 90°) ให้เห็นทั้งตัวและกระดาษเต็มใบ</li>
                <li>แสงสว่างเพียงพอ ไม่มีผ้าห่มบังลำตัว</li>
              </ol>
              <p className="text-[11px] text-gray-400 mt-3">
                * รูปจะถูกส่งไปวิเคราะห์และไม่ถูกจัดเก็บไว้ในระบบ
              </p>
            </div>

            {/* Upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-pink hover:bg-pink-50/50 transition-colors mb-4">
              <input
                ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-72 mx-auto rounded-xl shadow" />
              ) : (
                <div className="py-8">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="font-bold text-gray-700 text-sm">แตะเพื่อเลือกรูป หรือถ่ายรูปใหม่</p>
                  <p className="text-xs text-gray-400 mt-1">รองรับ JPG / PNG</p>
                </div>
              )}
            </div>
            {preview && (
              <button
                onClick={() => { setPreview(null); setResult(null); }}
                className="text-xs text-gray-400 hover:text-red-500 mb-4 underline">
                ลบรูปนี้ เลือกใหม่
              </button>
            )}
          </>
        )}

        {tab === 'manual' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ส่วนสูงของน้อง (ซม.)</label>
            <input
              type="number" inputMode="decimal" value={manualHeight}
              onChange={(e) => setManualHeight(e.target.value)}
              placeholder="เช่น 98"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-pink" />
          </div>
        )}

        {/* น้ำหนัก (ใช้ได้ทั้ง 2 โหมด) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            น้ำหนัก (กก.) <span className="text-gray-400 font-normal">— ไม่บังคับ ช่วยให้แนะนำไซซ์แม่นขึ้น</span>
          </label>
          <input
            type="number" inputMode="decimal" value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="เช่น 15"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-pink" />
        </div>

        <button
          onClick={analyze} disabled={!canAnalyze || loading}
          className="w-full py-3.5 bg-brand-pink text-white font-extrabold rounded-xl hover:bg-brand-pink-dark transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-md mb-8">
          {loading ? '⏳ กำลังวิเคราะห์...' : tab === 'photo' ? '🔍 วิเคราะห์รูปด้วย AI' : '🔍 คำนวณไซซ์'}
        </button>

        {/* ---------- ผลลัพธ์ ---------- */}
        {result && !result.ok && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600 font-semibold">
            ⚠️ {result.error}
          </div>
        )}

        {result?.ok && rec && dims && result.fabric && (
          <div className="space-y-5 animate-fade-up">
            {/* ไซซ์ที่แนะนำ */}
            <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-rose-400 rounded-2xl p-6 text-white text-center shadow-md">
              <p className="text-pink-100 text-xs font-bold tracking-wide mb-1">ไซซ์ที่แนะนำ</p>
              <p className="text-5xl font-extrabold mb-1">{rec.size}</p>
              <p className="text-sm text-pink-100">
                เหมาะกับช่วงอายุ ~{rec.ageYears} ปี | ส่วนสูง {rec.heightRange} | น้ำหนัก {rec.weightRange}
              </p>
              {result.estimatedHeightCm && (
                <p className="mt-2 inline-block bg-white/20 rounded-full px-4 py-1 text-xs font-bold">
                  ความยาวตัวที่ประเมิน: {result.estimatedHeightCm} ซม.
                </p>
              )}
            </div>

            {rec.note && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
                💡 {rec.note}
              </div>
            )}
            {result.warning && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs text-orange-700">
                ⚠️ {result.warning}
              </div>
            )}

            {/* รายละเอียดจาก AI */}
            {result.analysis && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-700 text-sm mb-2">🤖 รายละเอียดการวิเคราะห์</p>
                <p>วัตถุอ้างอิง: {result.analysis.reference_detected ? `พบ (${result.analysis.reference_type ?? '-'})` : 'ไม่พบ — ใช้การประมาณจากสัดส่วน'}</p>
                <p>ท่าทางในรูป: {result.analysis.pose} | ความมั่นใจ: {CONFIDENCE_TH[result.analysis.confidence] ?? result.analysis.confidence}</p>
                {result.analysis.notes_th && <p>หมายเหตุ: {result.analysis.notes_th}</p>}
              </div>
            )}

            {/* ขนาดสำเร็จของเสื้อผ้า */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm overflow-x-auto">
              <h3 className="font-bold text-gray-900 text-sm mb-3">👕 ขนาดเสื้อผ้าสำเร็จ ไซซ์ {rec.size} (ซม.)</h3>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="py-2 pr-3 font-semibold">ประเภท</th>
                    <th className="py-2 pr-3 font-semibold">ขนาดหลัก</th>
                    <th className="py-2 font-semibold">ความยาว</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-bold">เสื้อเชิ้ต</td>
                    <td className="py-2 pr-3">รอบอก {dims.shirt.chest} | ไหล่ {dims.shirt.shoulder}</td>
                    <td className="py-2">ยาว {dims.shirt.length} | แขนยาว {dims.shirt.sleeveLong}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-bold">กางเกง</td>
                    <td className="py-2 pr-3">เอว {dims.pants.waist} | สะโพก {dims.pants.hip}</td>
                    <td className="py-2">ยาว {dims.pants.length} | ในขา {dims.pants.inseam}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-bold">กระโปรง</td>
                    <td className="py-2 pr-3">เอว {dims.skirt.waist} | สะโพก {dims.skirt.hip}</td>
                    <td className="py-2">ยาว {dims.skirt.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-bold">ชุดกระโปรง</td>
                    <td className="py-2 pr-3">รอบอก {dims.dress.chest} | เอว {dims.dress.waist}</td>
                    <td className="py-2">ยาว {dims.dress.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ปริมาณผ้า */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm overflow-x-auto">
              <h3 className="font-bold text-gray-900 text-sm mb-1">🧵 ประมาณการใช้ผ้าต่อ 1 ตัว</h3>
              <p className="text-[11px] text-gray-400 mb-3">
                คิดจากผ้าหน้ากว้าง 150 ซม. รวมเผื่อตะเข็บและผ้าหด 5% แล้ว
              </p>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="py-2 pr-3 font-semibold">แบบชุด</th>
                    <th className="py-2 pr-3 font-semibold">ผ้าที่ใช้</th>
                    <th className="py-2 font-semibold">ที่มา</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {result.fabric.map((f) => (
                    <tr key={f.garment} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 pr-3 font-bold">{f.labelTh}</td>
                      <td className="py-2 pr-3">
                        <span className="text-brand-pink font-extrabold">{f.meters.toFixed(2)} ม.</span>
                      </td>
                      <td className="py-2 text-gray-400">{f.formulaTh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/shop"
                className="flex-1 text-center py-3 bg-brand-pink text-white font-bold rounded-xl hover:bg-brand-pink-dark transition-colors">
                🛒 เลือกซื้อชุดไซซ์ {rec.size}
              </a>
              <a href="/#quote"
                className="flex-1 text-center py-3 bg-white border-2 border-brand-pink text-brand-pink font-bold rounded-xl hover:bg-pink-50 transition-colors">
                📋 สั่งผลิต OEM ไซซ์นี้
              </a>
            </div>

            <p className="text-[11px] text-gray-400 text-center pb-4">
              ผลจาก AI เป็นการประมาณเบื้องต้นเพื่อช่วยตัดสินใจ
              ก่อนตัดเย็บจริงควรวัดตัวเด็กโดยตรงตามคู่มือ Size Guide ของทางร้าน
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
