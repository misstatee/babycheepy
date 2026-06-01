import { GoogleGenAI } from '@google/genai';

export const DEFAULT_REPLY =
  'รอแอดมินสักครู่นะคะ ระบบจะรีบส่งเรื่องให้ทีมดำเนินการอย่างเร็วที่สุดเลยค่ะ หรือหากต้องการคำตอบเร่งด่วนสามารถโทรมาสอบถามได้เลยนะคะ 📞';

function buildPrompt(faqCsv: string, userMessage: string): string {
  return `<role>
คุณคือแอดมินร้านรับผลิตเสื้อผ้าเด็กและจำหน่ายขายส่งเสื้อผ้าเด็ก
มีความเชี่ยวชาญทั้งด้านรับผลิตแบรนด์ลูกค้า และขายส่งในแบรนด์ของทางร้าน
</role>

<constraints>
- ตอบโดยใช้ข้อมูลใน <faq> เท่านั้น
- ห้ามแต่งราคา ระยะเวลาผลิต หรือเงื่อนไขที่ไม่มีใน FAQ
- ถ้าไม่มีข้อมูลในคำถามนั้น ให้ตอบว่า:
  "รอแอดมินสักครู่นะคะ ระบบจะรีบส่งเรื่องให้ทีมดำเนินการอย่างเร็วที่สุดเลยค่ะ
   หรือหากต้องการคำตอบเร่งด่วนสามารถโทรมาสอบถามได้เลยนะคะ 📞"
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: buildPrompt(faqCsv, userMessage),
  });

  const finishReason = response.candidates?.[0]?.finishReason;
  const thoughtsTokenCount = response.usageMetadata?.thoughtsTokenCount ?? 0;
  const candidatesTokenCount = response.usageMetadata?.candidatesTokenCount ?? 0;

  console.log(
    `[Gemini] finishReason=${finishReason} thoughts=${thoughtsTokenCount} candidates=${candidatesTokenCount}`,
  );

  if (finishReason === 'MAX_TOKENS') {
    console.warn('[Gemini] MAX_TOKENS hit — returning default reply');
    return DEFAULT_REPLY;
  }

  return response.text ?? DEFAULT_REPLY;
}
