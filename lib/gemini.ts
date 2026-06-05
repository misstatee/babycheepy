import OpenAI from 'openai';

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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  let completion: Awaited<ReturnType<typeof client.chat.completions.create>>;
  try {
    completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: buildPrompt(faqCsv, userMessage) }],
      max_tokens: 300,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('[OpenAI] API call failed:', msg);
    throw err;
  }

  const finishReason = completion.choices[0]?.finish_reason;
  const promptTokens = completion.usage?.prompt_tokens ?? 0;
  const completionTokens = completion.usage?.completion_tokens ?? 0;

  console.log(
    `[OpenAI] finishReason=${finishReason} prompt=${promptTokens} completion=${completionTokens}`,
  );

  if (finishReason === 'length') {
    console.warn('[OpenAI] max_tokens hit — returning default reply');
    return DEFAULT_REPLY;
  }

  return completion.choices[0]?.message?.content ?? DEFAULT_REPLY;
}
