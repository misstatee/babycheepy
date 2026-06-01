import { NextRequest, NextResponse } from 'next/server';
import { messagingApi } from '@line/bot-sdk';
import type { webhook } from '@line/bot-sdk';
import crypto from 'node:crypto';
import { getFAQ, getCachedFAQ } from '@/lib/sheet';
import { askGemini, DEFAULT_REPLY } from '@/lib/gemini';

function verifySignature(body: string, signature: string, secret: string): boolean {
  const digest = crypto.createHmac('SHA256', secret).update(body).digest('base64');
  return digest === signature;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-line-signature') ?? '';
  const body = await req.text();

  const secret = process.env.LINE_CHANNEL_SECRET ?? '';
  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsed: webhook.WebhookRequestBody;
  try {
    parsed = JSON.parse(body) as webhook.WebhookRequestBody;
  } catch {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '',
  });

  for (const event of parsed.events) {
    if (event.type !== 'message') continue;

    const msgEvent = event as webhook.MessageEvent;
    if (msgEvent.message.type !== 'text') continue;
    if (!msgEvent.replyToken) continue;

    const userMessage = (msgEvent.message as webhook.TextMessageContent).text;
    const replyToken = msgEvent.replyToken;

    let faqCsv: string;
    try {
      faqCsv = await getFAQ();
    } catch (err) {
      console.error('[Sheet] fetch failed:', err);
      faqCsv = getCachedFAQ() ?? '';
    }

    let replyText: string;
    if (!faqCsv) {
      replyText = DEFAULT_REPLY;
    } else {
      try {
        replyText = await askGemini(faqCsv, userMessage);
      } catch (err) {
        console.error('[Gemini] error:', err);
        replyText = DEFAULT_REPLY;
      }
    }

    try {
      await client.replyMessage({
        replyToken,
        messages: [{ type: 'text', text: replyText }],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Invalid reply token') || msg.includes('Reply token has expired')) {
        console.warn('[LINE] replyToken expired, skipping');
      } else {
        console.error('[LINE] reply failed:', err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
