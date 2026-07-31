import { NextRequest, NextResponse } from 'next/server';
import { getRequestKey, rateLimit } from '../../../../lib/member/rate-limit';
import { registerBrandClubMember } from '../../../../lib/member/repository';
import { hashPassword, safeStorageFileName, sha256Buffer } from '../../../../lib/member/security';
import { MemberBackendSetupError, uploadPrivateObject } from '../../../../lib/member/supabase';
import {
  jsonError,
  normalizePhone,
  requireAccepted,
  requireEmail,
  requirePasswordPair,
  requireText,
  validateUpload,
} from '../../../../lib/member/validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const limit = rateLimit(getRequestKey(request, 'member-register'), 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'ส่งแบบฟอร์มถี่เกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const firstName = requireText(formData, 'firstName', 'ชื่อผู้สมัคร');
    const lastName = requireText(formData, 'lastName', 'นามสกุล');
    const brandName = requireText(formData, 'brandName', 'ชื่อแบรนด์หรือชื่อร้าน');
    const phone = normalizePhone(formData.get('phone'));
    if (!phone || phone.length < 8) throw new Error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
    const lineId = requireText(formData, 'lineId', 'LINE ID', 80);
    const email = requireEmail(formData);
    const password = requirePasswordPair(formData);
    requireAccepted(formData, 'acceptedTerms', 'กรุณายอมรับข้อกำหนดของ Babycheepy Brand Club');
    requireAccepted(formData, 'acceptedPrivacy', 'กรุณายินยอมให้จัดเก็บข้อมูลเพื่อให้บริการสมาชิก');

    const paymentProof = await validateUpload(formData.get('paymentProof'), {
      label: 'หลักฐานการชำระเงิน',
      kind: 'image-or-pdf',
    });
    if (!paymentProof) throw new Error('กรุณาอัปโหลดหลักฐานการชำระเงิน');

    const proofPath = `payment-proofs/${new Date().toISOString().slice(0, 10)}/${safeStorageFileName(
      paymentProof.originalName,
      paymentProof.extension,
    )}`;
    const uploaded = await uploadPrivateObject({
      path: proofPath,
      contentType: paymentProof.contentType,
      buffer: paymentProof.buffer,
    });

    const membership = await registerBrandClubMember({
      firstName,
      lastName,
      brandName,
      phone,
      lineId,
      email,
      passwordHash: hashPassword(password),
      paymentProof: {
        bucket: uploaded.bucket,
        path: uploaded.path,
        originalName: paymentProof.originalName,
        contentType: paymentProof.contentType,
        byteSize: paymentProof.size,
        sha256: sha256Buffer(paymentProof.buffer),
      },
    });

    return NextResponse.json({ ok: true, membership });
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return jsonError(error);
  }
}
