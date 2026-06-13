import { NextRequest, NextResponse } from 'next/server';
import { messagingApi } from '@line/bot-sdk';

type OrderItem = { name_th: string; price: number; quantity: number };
type OrderBody = {
  orderId: string; name: string; phone: string;
  address: string; note: string;
  items: OrderItem[]; total: number;
};

export async function POST(req: NextRequest) {
  let body: OrderBody;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { orderId, name, phone, address, note, items, total } = body;
  const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const itemLines = (items ?? [])
    .map(i => `  • ${i.name_th} x${i.quantity} = ${(i.price * i.quantity).toLocaleString()} ฿`)
    .join('\n');

  const msg = [
    '🛒 ออเดอร์ใหม่จากเว็บไซต์!',
    '',
    `🔖 หมายเลขออเดอร์: ${orderId}`,
    `👤 ชื่อ: ${name}`,
    `📞 เบอร์โทร: ${phone}`,
    `📦 ที่อยู่: ${address}`,
    note ? `📝 หมายเหตุ: ${note}` : null,
    '',
    '🛍️ รายการสินค้า:',
    itemLines,
    '',
    `💰 ยอดรวม: ${total.toLocaleString()} ฿`,
    `⏰ ${timestamp}`,
    '',
    '⚡ รอรับสลิปโอนเงินจากลูกค้าทาง LINE ค่ะ',
  ].filter(Boolean).join('\n');

  const ownerUserId = process.env.LINE_OWNER_USER_ID;
  if (ownerUserId) {
    try {
      const client = new messagingApi.MessagingApiClient({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '',
      });
      await client.pushMessage({ to: ownerUserId, messages: [{ type: 'text', text: msg }] });
    } catch (err) {
      console.error('[Order] LINE push failed:', err);
    }
  } else {
    console.log('[Order] New order (set LINE_OWNER_USER_ID to receive LINE notifications):\n', msg);
  }

  return NextResponse.json({ ok: true, orderId });
}
