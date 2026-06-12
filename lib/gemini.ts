import { GoogleGenerativeAI } from '@google/generative-ai';

export const DEFAULT_REPLY =
  'ขอบคุณที่ติดต่อค่ะ ถามเรื่องสินค้า การผลิต หรือการสั่งซื้อได้เลยนะคะ 😊';

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractFaqAnswer(faqCsv: string, userMessage: string): string | null {
  const input = normalizeText(userMessage);

  for (const rawLine of faqCsv.split('\n')) {
    const line = rawLine.trim();
    if (!line || !line.includes(',')) continue;

    const [question, ...answerParts] = line.split(',');
    const answer = answerParts.join(',').trim();
    const questionText = normalizeText(question);

    if (!answer || !questionText) continue;

    const score = [questionText].reduce((total, text) => {
      if (input.includes(text)) return total + 2;
      return total + (text.split(' ').some((word) => input.includes(word)) ? 1 : 0);
    }, 0);

    if (score >= 2) return answer;
  }

  return null;
}

function buildSimpleReply(faqCsv: string, userMessage: string): string {
  const faqAnswer = extractFaqAnswer(faqCsv, userMessage);
  if (faqAnswer) return faqAnswer;

  const text = normalizeText(userMessage);
  if (/สวัสดี|hello|hi|หวัด|ดีคะ|ดีครับ/.test(text)) {
    return 'สวัสดีค่ะ มีอะไรให้ช่วยบ้างครับ/ค่ะ 😊';
  }

  if (/ราคา|จ่าย|ชำระ|ส่ง|จัดส่ง|ผลิต|ทำเสื้อ|สั่ง|สินค้า/.test(text)) {
    return 'ขอบคุณที่สอบถามค่ะ ผม/ฉันช่วยตอบเรื่องสินค้า การผลิต และการสั่งซื้อได้เลยนะคะ';
  }

  return DEFAULT_REPLY;
}

function buildPrompt(faqCsv: string, userMessage: string): string {
  return `<role>
คุณคือแอดมินร้านรับผลิตเสื้อผ้าเด็กและจำหน่ายขายส่งเสื้อผ้าเด็ก
มีความเชี่ยวชาญทั้งด้านรับผลิตแบรนด์ลูกค้า และขายส่งในแบรนด์ของทางร้าน
</role>

<constraints>
- ตอบโดยใช้ข้อมูลใน <faq> เท่านั้น
- ห้ามแต่งราคา ระยะเวลาผลิต หรือเงื่อนไขที่ไม่มีใน FAQ
- ถ้าไม่มีข้อมูลในคำถามนั้น ให้ตอบว่า:
  "รอสักครู่นะคะ ระบบจะส่งคำถามให้แอดมินค่ะ หากไม่สะดวกรอสามารถสอบถามเบอร์โทรศัพท์เพื่อติดต่อได้เลยค่ะ 📞"
- โทนเป็นกันเอง ใกล้ชิด ลูกค้าเข้าถึงง่าย มีอีโมจิเหมาะสม ลงท้ายด้วยค่ะ
- ความยาว 1-3 ประโยค ไม่พูดเยิ่นเย้อ
</constraints>

<output_format>
ภาษาไทย ไม่ใช้ markdown ไม่ใช้ bullet point ตอบเป็นข้อความธรรมดา
</output_format>

<faq>
${faqCsv}
</faq>

<question>
${userMessage}
</question>`;
}

export async function askGemini(faqCsv: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return buildSimpleReply(faqCsv, userMessage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(buildPrompt(faqCsv, userMessage));
    const text = result.response.text();

    if (!text || !text.trim()) {
      return DEFAULT_REPLY;
    }

    return text;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('[Gemini] API call failed:', msg);
    return buildSimpleReply(faqCsv, userMessage);
  }
}
