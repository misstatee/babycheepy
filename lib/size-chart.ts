/**
 * Baby Cheepy — Size Chart & Fabric Consumption
 * อ้างอิงจาก GUIDE BOOK SIZE CHART ของแบรนด์ (ขนาดสำเร็จ, หน่วย cm)
 */

export type SizeCode = '80' | '90' | '95' | '100' | '110' | '115' | '120' | '130' | '135' | '140';

export interface BodyReference {
  ageYears: number;
  size: SizeCode;
  heightMin: number; // cm
  heightMax: number; // cm
  weightMin: number; // kg
  weightMax: number; // kg
  chest: number; // รอบอกตัวจริง cm
  waist: number;
  hip: number;
}

/** ตาราง 5 — ขนาดตัวเด็กอ้างอิง (Body Reference) */
export const BODY_REFERENCE: BodyReference[] = [
  { ageYears: 1,  size: '80',  heightMin: 75,  heightMax: 80,  weightMin: 9,  weightMax: 10, chest: 47, waist: 44, hip: 48 },
  { ageYears: 2,  size: '90',  heightMin: 83,  heightMax: 88,  weightMin: 11, weightMax: 12, chest: 49, waist: 46, hip: 50 },
  { ageYears: 3,  size: '95',  heightMin: 90,  heightMax: 95,  weightMin: 13, weightMax: 14, chest: 51, waist: 48, hip: 52 },
  { ageYears: 4,  size: '100', heightMin: 96,  heightMax: 101, weightMin: 15, weightMax: 16, chest: 53, waist: 50, hip: 55 },
  { ageYears: 5,  size: '110', heightMin: 102, heightMax: 107, weightMin: 17, weightMax: 19, chest: 55, waist: 52, hip: 57 },
  { ageYears: 6,  size: '115', heightMin: 108, heightMax: 113, weightMin: 20, weightMax: 22, chest: 57, waist: 53, hip: 59 },
  { ageYears: 7,  size: '120', heightMin: 114, heightMax: 119, weightMin: 23, weightMax: 25, chest: 60, waist: 55, hip: 62 },
  { ageYears: 8,  size: '130', heightMin: 120, heightMax: 125, weightMin: 26, weightMax: 28, chest: 63, waist: 57, hip: 65 },
  { ageYears: 9,  size: '135', heightMin: 126, heightMax: 131, weightMin: 29, weightMax: 31, chest: 66, waist: 59, hip: 68 },
  { ageYears: 10, size: '140', heightMin: 132, heightMax: 138, weightMin: 32, weightMax: 35, chest: 69, waist: 61, hip: 71 },
];

/** ขนาดสำเร็จของเสื้อผ้าแต่ละประเภท ต่อไซซ์ (จากตาราง 1–4) */
export interface GarmentDims {
  shirt: { chest: number; length: number; shoulder: number; sleeveLong: number };
  pants: { waist: number; hip: number; length: number; inseam: number; rise: number };
  skirt: { waist: number; hip: number; length: number };
  dress: { chest: number; waist: number; length: number; topLength: number; bottomLength: number };
}

export const GARMENT_DIMS: Record<SizeCode, GarmentDims> = {
  '80':  { shirt: { chest: 52, length: 30, shoulder: 24, sleeveLong: 25 }, pants: { waist: 48, hip: 54, length: 42, inseam: 28, rise: 14 }, skirt: { waist: 48, hip: 54, length: 22 }, dress: { chest: 52, waist: 48, length: 46,  topLength: 22, bottomLength: 24 } },
  '90':  { shirt: { chest: 54, length: 33, shoulder: 25, sleeveLong: 28 }, pants: { waist: 50, hip: 56, length: 47, inseam: 32, rise: 15 }, skirt: { waist: 50, hip: 56, length: 26 }, dress: { chest: 54, waist: 50, length: 52,  topLength: 24, bottomLength: 28 } },
  '95':  { shirt: { chest: 56, length: 35, shoulder: 26, sleeveLong: 31 }, pants: { waist: 52, hip: 58, length: 52, inseam: 36, rise: 16 }, skirt: { waist: 52, hip: 58, length: 29 }, dress: { chest: 56, waist: 52, length: 57,  topLength: 27, bottomLength: 30 } },
  '100': { shirt: { chest: 58, length: 38, shoulder: 27, sleeveLong: 33 }, pants: { waist: 54, hip: 61, length: 57, inseam: 40, rise: 17 }, skirt: { waist: 54, hip: 61, length: 32 }, dress: { chest: 58, waist: 54, length: 63,  topLength: 29, bottomLength: 34 } },
  '110': { shirt: { chest: 60, length: 40, shoulder: 28, sleeveLong: 35 }, pants: { waist: 56, hip: 63, length: 62, inseam: 44, rise: 18 }, skirt: { waist: 56, hip: 63, length: 35 }, dress: { chest: 60, waist: 56, length: 69,  topLength: 32, bottomLength: 37 } },
  '115': { shirt: { chest: 62, length: 43, shoulder: 29, sleeveLong: 37 }, pants: { waist: 57, hip: 65, length: 67, inseam: 48, rise: 19 }, skirt: { waist: 57, hip: 65, length: 38 }, dress: { chest: 62, waist: 57, length: 74,  topLength: 35, bottomLength: 39 } },
  '120': { shirt: { chest: 65, length: 46, shoulder: 30, sleeveLong: 39 }, pants: { waist: 59, hip: 68, length: 73, inseam: 53, rise: 20 }, skirt: { waist: 59, hip: 68, length: 41 }, dress: { chest: 65, waist: 59, length: 80,  topLength: 38, bottomLength: 42 } },
  '130': { shirt: { chest: 68, length: 49, shoulder: 31, sleeveLong: 42 }, pants: { waist: 61, hip: 71, length: 79, inseam: 58, rise: 21 }, skirt: { waist: 61, hip: 71, length: 44 }, dress: { chest: 68, waist: 61, length: 88,  topLength: 42, bottomLength: 46 } },
  '135': { shirt: { chest: 71, length: 52, shoulder: 32, sleeveLong: 44 }, pants: { waist: 63, hip: 74, length: 84, inseam: 62, rise: 22 }, skirt: { waist: 63, hip: 74, length: 47 }, dress: { chest: 71, waist: 63, length: 94,  topLength: 46, bottomLength: 48 } },
  '140': { shirt: { chest: 74, length: 55, shoulder: 33, sleeveLong: 47 }, pants: { waist: 65, hip: 77, length: 90, inseam: 66, rise: 23 }, skirt: { waist: 65, hip: 77, length: 50 }, dress: { chest: 74, waist: 65, length: 100, topLength: 49, bottomLength: 51 } },
};

export interface SizeRecommendation {
  size: SizeCode;
  ageYears: number;
  matchedBy: 'height' | 'height+weight' | 'age';
  heightRange: string;
  weightRange: string;
  note: string | null;
  body: BodyReference;
}

/**
 * แนะนำไซซ์จากส่วนสูง (หลัก) + น้ำหนัก (ปรับละเอียด)
 * หลักการ: เลือกไซซ์ที่ช่วงส่วนสูงครอบคลุม ถ้าอยู่ระหว่างช่วงให้ปัดขึ้น (เผื่อโต)
 * ถ้าน้ำหนักเกินช่วงของไซซ์ที่เลือก > 2 kg ให้ขยับขึ้น 1 ไซซ์ (ตามข้อควรระวังใน guide ±2-4 cm)
 */
export function recommendSize(heightCm: number, weightKg?: number | null): SizeRecommendation | null {
  if (!heightCm || heightCm < 60 || heightCm > 150) return null;

  let idx = BODY_REFERENCE.findIndex((b) => heightCm >= b.heightMin && heightCm <= b.heightMax);

  if (idx === -1) {
    // อยู่ระหว่างช่วง → ปัดขึ้นไปไซซ์ถัดไป (เผื่อโต)
    idx = BODY_REFERENCE.findIndex((b) => heightCm < b.heightMin);
    if (idx === -1) idx = BODY_REFERENCE.length - 1; // สูงกว่าทุกช่วง → ไซซ์ใหญ่สุด
  }

  let matchedBy: SizeRecommendation['matchedBy'] = 'height';
  let note: string | null = null;

  if (weightKg && weightKg > 0) {
    const b = BODY_REFERENCE[idx];
    if (weightKg > b.weightMax + 2 && idx < BODY_REFERENCE.length - 1) {
      idx += 1;
      matchedBy = 'height+weight';
      note = 'น้ำหนักมากกว่าค่าเฉลี่ยของช่วงส่วนสูง จึงขยับขึ้น 1 ไซซ์เพื่อความสบายตัว';
    } else if (weightKg < b.weightMin - 2) {
      matchedBy = 'height+weight';
      note = 'น้ำหนักน้อยกว่าค่าเฉลี่ย แนะนำให้คงไซซ์ตามส่วนสูง แต่ทรงอาจหลวมเล็กน้อย';
    } else {
      matchedBy = 'height+weight';
    }
  }

  const body = BODY_REFERENCE[idx];
  return {
    size: body.size,
    ageYears: body.ageYears,
    matchedBy,
    heightRange: `${body.heightMin}–${body.heightMax} cm`,
    weightRange: `${body.weightMin}–${body.weightMax} kg`,
    note,
    body,
  };
}

/* ============================================================
 * Fabric Consumption — ประมาณการใช้ผ้าต่อตัว
 * สมมติฐาน (ปรับได้):
 * - ผ้าหน้ากว้าง 150 cm (ผ้าทอ/ผ้ายืดหน้ากว้างมาตรฐาน)
 * - แพทเทิร์นเด็กวางชิ้นหน้า-หลังเรียงคู่ตามหน้าผ้าได้ (ไซส์เด็กแคบกว่า 75 cm/ชิ้น)
 * - เผื่อตะเข็บ + ขอบ + ชายพับ รวมในค่า allowance ของแต่ละแบบ
 * - บวกเผื่อผ้าหด (pre-wash shrinkage) 5% ตาม guide
 * ============================================================ */

export const FABRIC_WIDTH_CM = 150;
export const SHRINKAGE = 0.05;

export interface FabricItem {
  garment: 'shirt' | 'pants' | 'skirt' | 'dress';
  labelTh: string;
  labelEn: string;
  cutLengthCm: number; // ความยาวผ้าที่ต้องใช้ (ตามหน้าผ้า 150 cm)
  meters: number;      // แปลงเป็นเมตร รวมเผื่อหดแล้ว
  formulaTh: string;   // อธิบายที่มาของตัวเลข
}

function toMeters(cutCm: number): number {
  return Math.ceil(cutCm * (1 + SHRINKAGE)) / 100;
}

/* ============================================================
 * Fit Assessment — เทียบไซซ์ชุดกับไซซ์ตัวเด็ก
 * ============================================================ */

export const SIZE_ORDER: SizeCode[] = ['80', '90', '95', '100', '110', '115', '120', '130', '135', '140'];

export type FitLevel = 'perfect' | 'slightly_large' | 'too_large' | 'slightly_small' | 'too_small';

export interface FitResult {
  level: FitLevel;
  diff: number; // outfitIndex - childIndex (บวก = ชุดใหญ่กว่าตัว)
  labelTh: string;
  adviceTh: string;
}

/** เทียบไซซ์ชุด (outfitSize) กับไซซ์ที่เหมาะกับตัวเด็ก (childSize) */
export function assessFit(childSize: SizeCode, outfitSize: SizeCode): FitResult {
  const diff = SIZE_ORDER.indexOf(outfitSize) - SIZE_ORDER.indexOf(childSize);

  if (diff === 0) {
    return { level: 'perfect', diff, labelTh: 'พอดีตัว', adviceTh: 'ไซซ์นี้เหมาะกับน้องพอดี ใส่ได้สบาย' };
  }
  if (diff === 1) {
    return {
      level: 'slightly_large', diff, labelTh: 'ใหญ่กว่าตัวเล็กน้อย',
      adviceTh: 'หลวมนิดหน่อย แขน/ชายอาจยาวเกินเล็กน้อย แต่ใส่ได้และเผื่อโตได้อีกประมาณ 1 ปี',
    };
  }
  if (diff >= 2) {
    return {
      level: 'too_large', diff, labelTh: 'ใหญ่เกินไป',
      adviceTh: `ชุดใหญ่กว่าตัวน้อง ${diff} ไซซ์ จะหลวมมาก แนะนำลดลงมาใช้ไซซ์ที่พอดีตัว`,
    };
  }
  if (diff === -1) {
    return {
      level: 'slightly_small', diff, labelTh: 'เล็กกว่าตัวเล็กน้อย',
      adviceTh: 'ค่อนข้างคับ แขน/ชายอาจสั้น ใส่ได้ไม่นานเพราะน้องกำลังโต แนะนำขยับขึ้น 1 ไซซ์',
    };
  }
  return {
    level: 'too_small', diff, labelTh: 'เล็กเกินไป',
    adviceTh: `ชุดเล็กกว่าตัวน้อง ${Math.abs(diff)} ไซซ์ จะคับและสั้นมาก ไม่แนะนำให้ใช้ไซซ์นี้`,
  };
}

/** ประมาณผ้าที่ใช้ต่อ 1 ตัว ของแต่ละประเภท ตามไซซ์ */
export function fabricConsumption(size: SizeCode): FabricItem[] {
  const d = GARMENT_DIMS[size];

  // เสื้อเชิ้ตแขนยาว: ตัวเสื้อ + แขน (วางชิ้นเรียงตามหน้าผ้า 150 cm ได้ทั้งหน้า-หลัง-แขน)
  const shirtCut = d.shirt.length + d.shirt.sleeveLong + 12; // +12 เผื่อตะเข็บ/ปก/สาบกระดุม
  // กางเกงขายาว: ชิ้นขาหน้า-หลัง 4 ชิ้นเรียงตามหน้าผ้าได้
  const pantsCut = d.pants.length + 12; // +12 ขอบเอวยางยืด + ชายพับ
  // กระโปรงทรงบาน/ทรง A: ต้องใช้ผ้ากว้างกว่าตัวจริง ~2 เท่า
  const skirtCut = d.skirt.length * 2 + 12; // +12 ขอบเอว + ชายพับ
  // ชุดกระโปรง: ส่วนบน + กระโปรงจับรูด (ส่วนล่าง x2)
  const dressCut = d.dress.topLength + d.dress.bottomLength * 2 + 15; // +15 ตะเข็บ/สาบ/ชาย

  return [
    {
      garment: 'shirt', labelTh: 'เสื้อเชิ้ตแขนยาว', labelEn: 'Shirt (long sleeve)',
      cutLengthCm: shirtCut, meters: toMeters(shirtCut),
      formulaTh: `ยาวเสื้อ ${d.shirt.length} + แขน ${d.shirt.sleeveLong} + เผื่อ 12 ซม.`,
    },
    {
      garment: 'pants', labelTh: 'กางเกงขายาว', labelEn: 'Pants (long)',
      cutLengthCm: pantsCut, meters: toMeters(pantsCut),
      formulaTh: `ยาวกางเกง ${d.pants.length} + เผื่อขอบเอว/ชาย 12 ซม.`,
    },
    {
      garment: 'skirt', labelTh: 'กระโปรง (บาน/ทรง A)', labelEn: 'Skirt (flare/A-line)',
      cutLengthCm: skirtCut, meters: toMeters(skirtCut),
      formulaTh: `ยาวกระโปรง ${d.skirt.length} × 2 + เผื่อ 12 ซม.`,
    },
    {
      garment: 'dress', labelTh: 'ชุดกระโปรง/วันพีซ', labelEn: 'Dress (one-piece)',
      cutLengthCm: dressCut, meters: toMeters(dressCut),
      formulaTh: `ส่วนบน ${d.dress.topLength} + ส่วนล่าง ${d.dress.bottomLength} × 2 + เผื่อ 15 ซม.`,
    },
  ];
}
