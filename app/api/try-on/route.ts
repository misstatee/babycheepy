import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  recommendSize, assessFit, SIZE_ORDER,
  type SizeCode, type FitResult, type SizeRecommendation,
} from '../../../lib/size-chart';

export const runtime = 'nodejs';
export const maxDuration = 60;

const IMAGE_MODEL = 'gemini-2.5-flash-image';

/* ---------- Step 1: วิเคราะห์รูปเด็ก + รูปชุด (Gemini vision) ---------- */

const ANALYSIS_PROMPT = `คุณคือผู้ช่วยของร้านผลิตเสื้อผ้าเด็ก จะได้รับรูป 2 รูป:
- รูปที่ 1: ตัวเด็ก
- รูปที่ 2: ชุดเสื้อผ้าเด็ก (อาจถ่ายแขวน วางราบ หรือใส่บนหุ่น)

วิเคราะห์แล้วตอบเป็น JSON เท่านั้น:
{
  "is_child_photo": boolean,          // รูปที่ 1 มีเด็กจริงหรือไม่
  "is_garment_photo": boolean,        // รูปที่ 2 เป็นเสื้อผ้าหรือไม่
  "child_height_cm": number | null,   // ประมาณส่วนสูงเด็ก (ซม.) จากสัดส่วนร่างกาย/ช่วงวัย ช่วง 70-145
  "child_age_years": number | null,   // ประมาณอายุ (ปี)
  "garment_type": "shirt" | "pants" | "skirt" | "dress" | "set" | "other",
  "garment_description_th": string,   // อธิบายชุดสั้นๆ เช่น สี ลาย แบบ
  "size_tag_visible": boolean,        // เห็นป้ายไซซ์ในรูปชุดหรือไม่
  "size_tag_value": string | null,    // ค่าบนป้ายไซซ์ ถ้าเห็น เช่น "100", "3Y"
  "estimated_garment_size": string | null, // ประเมินไซซ์ชุด (80,90,95,100,110,115,120,130,135,140) จากสัดส่วนในรูป ถ้าประเมินไม่ได้ให้ null
  "confidence": "high" | "medium" | "low",
  "notes_th": string
}`;

interface TryOnAnalysis {
  is_child_photo: boolean;
  is_garment_photo: boolean;
  child_height_cm: number | null;
  child_age_years: number | null;
  garment_type: string;
  garment_description_th: string;
  size_tag_visible: boolean;
  size_tag_value: string | null;
  estimated_garment_size: string | null;
  confidence: 'high' | 'medium' | 'low';
  notes_th: string;
}

function parseJson<T>(text: string): T | null {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

function splitDataUrl(image: string, fallbackMime = 'image/jpeg'): { b64: string; mime: string } {
  const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
  return match ? { b64: match[2], mime: match[1] } : { b64: image, mime: fallbackMime };
}

async function analyze(
  apiKey: string, child: { b64: string; mime: string }, outfit: { b64: string; mime: string },
): Promise<TryOnAnalysis | null> {
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
      });
      const result = await model.generateContent([
        ANALYSIS_PROMPT,
        { inlineData: { data: child.b64, mimeType: child.mime } },
        { inlineData: { data: outfit.b64, mimeType: outfit.mime } },
      ]);
      const parsed = parseJson<TryOnAnalysis>(result.response.text());
      if (parsed) return parsed;
    } catch (err) {
      console.error(`[try-on] analysis ${modelName} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}

/* ---------- Step 2: gen ภาพเด็กใส่ชุด (gemini-2.5-flash-image) ---------- */

const FIT_RENDER_TH: Record<string, string> = {
  perfect: 'ชุดพอดีตัว ความยาวแขนและชายชุดอยู่ในตำแหน่งที่ถูกต้องตามสัดส่วน',
  slightly_large: 'ชุดหลวมเล็กน้อย แขนเสื้อยาวเกินข้อมือนิดหน่อย ชายชุดยาวกว่าปกติเล็กน้อย',
  too_large: 'ชุดใหญ่เกินตัวชัดเจน หลวมโพรก แขนเสื้อยาวคลุมมือ ชายชุดยาวเกินมาก ไหล่ตก',
  slightly_small: 'ชุดคับเล็กน้อย แขนเสื้อและชายชุดสั้นกว่าปกติ ดูรัดรูป',
  too_small: 'ชุดเล็กเกินตัวชัดเจน คับมาก แขนและชายชุดสั้นมาก ดูอึดอัด',
};

async function generateTryOnImage(
  apiKey: string,
  child: { b64: string; mime: string },
  outfit: { b64: string; mime: string },
  fitLevel: string,
  garmentDescriptionTh: string,
): Promise<{ b64: string; mime: string } | null> {
  const prompt = `สร้างภาพเสมือนจริง (virtual try-on) สำหรับร้านเสื้อผ้าเด็ก:
นำเด็กจากรูปที่ 1 มาสวมใส่ชุดจากรูปที่ 2 (${garmentDescriptionTh})
- คงใบหน้า ทรงผม และสัดส่วนตัวเด็กจากรูปที่ 1 ไว้ให้เหมือนเดิมมากที่สุด
- คงสี ลวดลาย และดีไซน์ของชุดจากรูปที่ 2 ไว้ครบถ้วน
- ลักษณะความพอดีของชุดที่ต้องแสดง: ${FIT_RENDER_TH[fitLevel] ?? FIT_RENDER_TH.perfect}
- ท่ายืนตรงเต็มตัว เห็นตั้งแต่หัวถึงเท้า พื้นหลังสตูดิโอสีครีมเรียบ แสงนุ่ม
- ภาพสไตล์ถ่ายจริง (photorealistic) เหมาะกับเว็บร้านเสื้อผ้าเด็ก`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: child.mime, data: child.b64 } },
              { inline_data: { mime_type: outfit.mime, data: outfit.b64 } },
            ],
          }],
        }),
      },
    );

    if (!res.ok) {
      console.error('[try-on] image gen HTTP', res.status, await res.text().catch(() => ''));
      return null;
    }

    const data = await res.json();
    const parts: Array<{ inlineData?: { data: string; mimeType: string } }> =
      data?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        return { b64: part.inlineData.data, mime: part.inlineData.mimeType || 'image/png' };
      }
    }
    console.error('[try-on] no image in response');
    return null;
  } catch (err) {
    console.error('[try-on] image gen failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

/* ---------- Route ---------- */

function normalizeSize(value: string | null | undefined): SizeCode | null {
  if (!value) return null;
  const digits = value.replace(/[^0-9]/g, '');
  return (SIZE_ORDER as string[]).includes(digits) ? (digits as SizeCode) : null;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: 'ระบบยังไม่ได้ตั้งค่า AI (GEMINI_API_KEY) กรุณาติดต่อร้านค้า' },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { childImage, outfitImage, outfitSize, childHeightCm, childWeightKg } = body as {
      childImage?: string; outfitImage?: string; outfitSize?: string;
      childHeightCm?: number; childWeightKg?: number;
    };

    if (!childImage || !outfitImage) {
      return NextResponse.json({ ok: false, error: 'กรุณาแนบทั้งรูปน้องและรูปชุด' }, { status: 400 });
    }

    const child = splitDataUrl(childImage);
    const outfit = splitDataUrl(outfitImage);

    // ---- วิเคราะห์รูปทั้งสอง ----
    const analysis = await analyze(apiKey, child, outfit);
    if (!analysis) {
      return NextResponse.json({ ok: false, error: 'วิเคราะห์รูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 502 });
    }
    if (!analysis.is_child_photo) {
      return NextResponse.json({ ok: false, error: 'ไม่พบตัวเด็กในรูปแรก กรุณาอัพโหลดรูปน้องเต็มตัว' }, { status: 422 });
    }
    if (!analysis.is_garment_photo) {
      return NextResponse.json({ ok: false, error: 'รูปที่สองไม่ใช่รูปเสื้อผ้า กรุณาอัพโหลดรูปชุดที่ต้องการลอง' }, { status: 422 });
    }

    // ---- หาไซซ์ที่เหมาะกับตัวเด็ก ----
    const heightForRec = childHeightCm && childHeightCm > 0 ? Number(childHeightCm) : analysis.child_height_cm;
    let recommendation: SizeRecommendation | null = null;
    if (heightForRec) {
      recommendation = recommendSize(heightForRec, childWeightKg ? Number(childWeightKg) : null);
    }

    // ---- หาไซซ์ของชุด: ผู้ใช้เลือก > ป้ายไซซ์ในรูป > AI ประเมิน ----
    const userSize = normalizeSize(outfitSize);
    const tagSize = normalizeSize(analysis.size_tag_value);
    const aiSize = normalizeSize(analysis.estimated_garment_size);
    const resolvedOutfitSize = userSize ?? tagSize ?? aiSize;
    const outfitSizeSource = userSize ? 'user' : tagSize ? 'tag' : aiSize ? 'ai' : null;

    // ---- ประเมินความพอดี ----
    let fit: FitResult | null = null;
    if (recommendation && resolvedOutfitSize) {
      fit = assessFit(recommendation.size, resolvedOutfitSize);
    }

    // ---- gen ภาพ ----
    const generated = await generateTryOnImage(
      apiKey, child, outfit, fit?.level ?? 'perfect', analysis.garment_description_th,
    );

    const warnings: string[] = [];
    if (!fit) {
      warnings.push('ประเมินความพอดีเป็นตัวเลขไม่ได้ (ไม่ทราบไซซ์ชุดหรือส่วนสูงน้อง) ภาพที่ได้เป็นภาพจำลองเท่านั้น');
    } else if (outfitSizeSource === 'ai') {
      warnings.push('ไซซ์ชุดมาจากการประเมินด้วย AI จากรูป อาจคลาดเคลื่อนได้ ถ้าทราบไซซ์จริงให้เลือกจากเมนูเพื่อผลที่แม่นยำ');
    }
    if (!childHeightCm && analysis.confidence !== 'high') {
      warnings.push('ส่วนสูงน้องมาจากการประเมินรูป หากกรอกส่วนสูงจริงจะแม่นยำขึ้น');
    }

    return NextResponse.json({
      ok: true,
      image: generated ? `data:${generated.mime};base64,${generated.b64}` : null,
      imageError: generated ? null : 'สร้างภาพไม่สำเร็จ แต่ผลวิเคราะห์ความพอดียังใช้ได้ตามด้านล่าง',
      analysis: {
        childHeightCm: heightForRec ?? null,
        childAgeYears: analysis.child_age_years,
        garmentType: analysis.garment_type,
        garmentDescriptionTh: analysis.garment_description_th,
        sizeTag: analysis.size_tag_visible ? analysis.size_tag_value : null,
        confidence: analysis.confidence,
        notesTh: analysis.notes_th,
      },
      childSize: recommendation,
      outfitSize: resolvedOutfitSize,
      outfitSizeSource,
      fit,
      warnings,
    });
  } catch (err) {
    console.error('[try-on] error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 });
  }
}
