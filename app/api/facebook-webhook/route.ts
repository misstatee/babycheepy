import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getFAQ, getCachedFAQ } from '@/lib/sheet';
import { askGemini, DEFAULT_REPLY } from '@/lib/gemini';

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN ?? '';
const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN ?? '';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET ?? '';

function verifySignature(body: string, signature: string): boolean {
  if (!APP_SECRET || !signature) return true;
  const expected = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(body).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function sendMessage(recipientId: string, text: string): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('[Facebook] send failed:', err);
  }
}

// Webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Handle incoming messages
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const signature = req.headers.get('x-hub-signature-256') ?? '';
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    object?: string;
    entry?: { messaging?: { sender?: { id: string }; message?: { text?: string } }[] }[];
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  if (body.object !== 'page') {
    return NextResponse.json({ error: 'Not a page event' }, { status: 400 });
  }

  let faqCsv: string;
  try {
    faqCsv = await getFAQ();
  } catch (err) {
    console.error('[Sheet] fetch failed:', err);
    faqCsv = getCachedFAQ() ?? '';
  }

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      if (!senderId) continue;
      if (!event.message?.text) continue;

      const userMessage = event.message.text;

      let replyText: string;
      if (!faqCsv) {
        replyText = DEFAULT_REPLY;
      } else {
        try {
          replyText = await askGemini(faqCsv, userMessage);
        } catch (err) {
          console.error('[AI] error:', err);
          replyText = DEFAULT_REPLY;
        }
      }

      await sendMessage(senderId, replyText).catch((err) =>
        console.error('[Facebook] sendMessage error:', err)
      );
    }
  }

  return NextResponse.json({ ok: true });
}
