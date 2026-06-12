import { NextRequest, NextResponse } from 'next/server';
import { messagingApi } from '@line/bot-sdk';
import { Resend } from 'resend';

type QuoteBody = {
  name: string; contact: string; contactType: string; email: string;
  productTypes: string[]; services: string[]; quantity: string; details: string; lang?: string;
};

const PRODUCT_LABELS: Record<string, string> = {
  'oem-kids': 'เสื้อผ้าเด็ก (OEM/ODM)',
  family: 'ชุดครอบครัว (Family Collection)',
  pet: 'ชุดสัตว์เลี้ยง (Pet Outfits)',
  wholesale: 'ขายส่งในประเทศ',
  other: 'อื่นๆ',
};

const SERVICE_LABELS: Record<string, string> = {
  pattern: 'พัฒนาแพทเทิร์น & ตัวอย่าง',
  fabric: 'จัดหาผ้า / พิมพ์ลาย',
  decoration: 'ปัก / สกรีน / ตกแต่ง',
  fullprod: 'ผลิตเต็มรูปแบบ',
};

export async function POST(req: NextRequest) {
  let body: QuoteBody;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name, contact, contactType, email, productTypes, services, quantity, details } = body;
  if (!name?.trim() || !contact?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const products = (productTypes ?? []).map((v) => PRODUCT_LABELS[v] ?? v).join(', ') || '-';
  const serviceList = (services ?? []).map((v) => SERVICE_LABELS[v] ?? v).join(', ') || '-';
  const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const lineMsg = [
    '🌸 คำขอใบเสนอราคาใหม่จากเว็บไซต์!',
    '',
    `👤 ชื่อ/แบรนด์: ${name}`,
    `📞 ติดต่อ (${contactType}): ${contact}`,
    email ? `📧 อีเมล: ${email}` : null,
    `👕 ประเภทสินค้า: ${products}`,
    `🔧 บริการที่สนใจ: ${serviceList}`,
    `📦 จำนวน: ${quantity || '-'}`,
    `📝 รายละเอียด: ${details || '-'}`,
    '',
    `⏰ ${timestamp}`,
  ].filter(Boolean).join('\n');

  /* ── LINE push to owner ── */
  const ownerUserId = process.env.LINE_OWNER_USER_ID;
  if (ownerUserId) {
    try {
      const client = new messagingApi.MessagingApiClient({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '',
      });
      await client.pushMessage({ to: ownerUserId, messages: [{ type: 'text', text: lineMsg }] });
    } catch (err) {
      console.error('[Quote] LINE push failed:', err);
    }
  }

  /* ── Email via Resend ── */
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Baby Cheepy <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `🌸 คำขอใบเสนอราคาใหม่ — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #fce7f3">
            <div style="background:linear-gradient(135deg,#f9a8d4,#93c5fd);padding:24px 32px">
              <h1 style="margin:0;color:#fff;font-size:22px">🌸 คำขอใบเสนอราคาใหม่</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:13px">Baby Cheepy · Global Apparel Kids</p>
            </div>
            <div style="padding:28px 32px">
              <table style="width:100%;border-collapse:collapse">
                ${[
                  ['👤 ชื่อ / แบรนด์', name],
                  [`📞 ติดต่อ (${contactType})`, contact],
                  ...(email ? [['📧 อีเมล', email]] : []),
                  ['👕 ประเภทสินค้า', products],
                  ['🔧 บริการที่สนใจ', serviceList],
                  ['📦 จำนวน', quantity || '-'],
                  ['📝 รายละเอียด', details || '-'],
                  ['⏰ เวลา', timestamp],
                ].map(([k, v]) => `
                  <tr>
                    <td style="padding:8px 0;color:#9ca3af;font-size:13px;width:180px;vertical-align:top">${k}</td>
                    <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600">${v}</td>
                  </tr>
                `).join('')}
              </table>
              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #fce7f3;text-align:center">
                <a href="https://line.me/R/ti/p/@861pkbnz" style="display:inline-block;background:#06C755;color:#fff;text-decoration:none;padding:10px 24px;border-radius:999px;font-weight:bold;font-size:14px">
                  ตอบกลับผ่าน LINE OA
                </a>
              </div>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error('[Quote] Email failed:', err);
    }
  }

  if (!ownerUserId && !resendKey) {
    console.log('[Quote] New request (set LINE_OWNER_USER_ID or RESEND_API_KEY+NOTIFY_EMAIL):\n', lineMsg);
  }

  return NextResponse.json({ ok: true });
}
