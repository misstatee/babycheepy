import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { recommendSize, fabricConsumption } from '../../../lib/size-chart';
import { requireActiveMemberApi } from '../../../lib/member/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const VISION_PROMPT = `คุณคือผู้ช่วยวัดขนาดตัวเด็กจากรูปถ่าย สำหรับร้านผลิตเสื้อผ้าเด็ก

ในรูปควรมี "วัตถุอ้างอิงขนาดมาตรฐาน" วางข้างตัวเด็ก เช่น
- กระดาษ A4 (ยาว 29.7 ซม. กว้าง 21.0 ซม.)
- ไม้บรรทัด 30 ซม.
- ธนบัตรไทย (ยาว ~15 ซม.)

ขั้นตอน:
1. หา "วัตถุอ้างอิง" ในรูป และระบุชนิด
2. ประมาณความยาวตัวเด็ก (จากศีรษะถึงส้นเท้า) โดยเทียบสัดส่วนพิกเซลกับวัตถุอ้างอิง
3. ถ้าเด็กนอนงอตัว/นั่ง ให้ประมาณความยาวเมื่อเหยียดตรง และลด confidence ลง
4. ถ้าไม่พบวัตถุอ้างอิง ให้ประมาณจากบริบท (สัดส่วนใบหน้า/ร่างกายตามช่วงวัย) และให้ confidence เป็น "low"

ตอบเป็น JSON เท่านั้น ตาม schema นี้:
{
  "is_child_photo": boolean,
  "reference_detected": boolean,
  "reference_type": string | null,
  "body_length_cm": number | null,
  "estimated_age_years": number | null,
  "pose": "lying" | "standing" | "sitting" | "other",
  "confidence": "high" | "medium" | "low",
  "notes_th": string
}

ข้อกำหนด: body_length_cm ต้องอยู่ในช่วง 40-160 ถ้าประเมินไม่ได้เลยให้เป็น null และอธิบายเหตุผลใน notes_th`;

interface VisionResult {
  is_child_photo: boolean;
  reference_detected: boolean;
  reference_type: string | null;
  body_length_cm: number | null;
  estimated_age_years: number | null;
  pose: string;
  confidence: 'high' | 'medium' | 'low';
  notes_th: string;
}

function parseJson(text: string): VisionResult | null {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleaned.slice(start, end + 1)) as VisionResult;
  } catch {
    return null;
  }
}

async function analyzeImage(base64: string, mimeType: string): Promise<VisionResult | null> {
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('NO_GEMINI_KEY');

  const genAI = new GoogleGenerativeAI(key);
  const imagePart = { inlineData: { data: base64, mimeType } };

  // ลองรุ่นใหม่ก่อน แล้วค่อย fallback รุ่นเดิมที่โปรเจกต์ใช้อยู่
  for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
      });
      const result = await model.generateContent([VISION_PROMPT, imagePart]);
      const parsed = parseJson(result.response.text());
      if (parsed) return parsed;
    } catch (err) {
      console.error(`[size-analysis] ${modelName} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const member = await requireActiveMemberApi();
  if (!member.ok) return member.response;

  try {
    const body = await req.json();
    const { image, mimeType, heightCm, weightKg } = body as {
      image?: string; mimeType?: string; heightCm?: number; weightKg?: number;
    };

    // ---------- โหมดกรอกเอง (ไม่ใช้รูป) ----------
    if (!image && heightCm) {
      const rec = recommendSize(Number(heightCm), weightKg ? Number(weightKg) : null);
      if (!rec) {
        return NextResponse.json(
          { ok: false, error: 'ส่วนสูงอยู่นอกช่วงไซซ์เด็ก 1-10 ปี (75-140 ซม.)' },
          { status: 400 },
        );
      }
      return NextResponse.json({
        ok: true,
        mode: 'manual',
        analysis: null,
        estimatedHeightCm: Number(heightCm),
        recommendation: rec,
        fabric: fabricConsumption(rec.size),
      });
    }

    // ---------- โหมดวิเคราะห์รูป ----------
    if (!image) {
      return NextResponse.json({ ok: false, error: 'กรุณาแนบรูปภาพ หรือกรอกส่วนสูง' }, { status: 400 });
    }

    // รองรับทั้ง dataURL และ base64 ล้วน
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    const b64 = match ? match[2] : image;
    const mime = match ? match[1] : (mimeType ?? 'image/jpeg');

    const analysis = await analyzeImage(b64, mime);

    if (!analysis) {
      return NextResponse.json(
        { ok: false, error: 'วิเคราะห์รูปไม่สำเร็จ กรุณาลองใหม่ หรือกรอกส่วนสูงด้วยตนเอง' },
        { status: 502 },
      );
    }

    if (!analysis.is_child_photo || !analysis.body_length_cm) {
      return NextResponse.json({
        ok: false,
        analysis,
        error: analysis.notes_th || 'ไม่พบตัวเด็กในรูป หรือประเมินความยาวตัวไม่ได้ กรุณาถ่ายใหม่ตามคำแนะนำ',
      }, { status: 422 });
    }

    const height = Math.round(analysis.body_length_cm);
    const rec = recommendSize(height, weightKg ? Number(weightKg) : null);

    if (!rec) {
      return NextResponse.json({
        ok: false,
        analysis,
        error: `ความยาวตัวที่ประเมินได้ (${height} ซม.) อยู่นอกช่วงไซซ์เด็ก 1-10 ปี`,
      }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      mode: 'photo',
      analysis,
      estimatedHeightCm: height,
      recommendation: rec,
      fabric: fabricConsumption(rec.size),
      warning: analysis.confidence === 'low' || !analysis.reference_detected
        ? 'ผลนี้เป็นการประมาณคร่าวๆ เพราะไม่พบวัตถุอ้างอิงชัดเจนในรูป แนะนำให้วัดตัวจริงก่อนสั่งผลิต'
        : analysis.confidence === 'medium'
          ? 'ความแม่นยำระดับปานกลาง แนะนำตรวจสอบกับการวัดตัวจริงอีกครั้งก่อนตัดสินใจ'
          : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('[size-analysis] error:', msg);
    if (msg === 'NO_GEMINI_KEY') {
      return NextResponse.json(
        { ok: false, error: 'ระบบยังไม่ได้ตั้งค่า AI (GEMINI_API_KEY) กรุณากรอกส่วนสูงด้วยตนเองแทน' },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 });
  }
}
