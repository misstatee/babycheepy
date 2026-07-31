import { MAX_MEMBER_UPLOAD_BYTES, MAX_PAYMENT_PROOF_BYTES } from './config';

export type SafeUploadKind = 'image' | 'pdf' | 'image-or-pdf';

export interface SafeUpload {
  buffer: Buffer;
  contentType: string;
  extension: string;
  size: number;
  originalName: string;
}

export function normalizeEmail(value: FormDataEntryValue | string | null | undefined) {
  return String(value || '').trim().toLowerCase();
}

export function normalizeText(value: FormDataEntryValue | string | null | undefined) {
  return String(value || '').trim();
}

export function normalizePhone(value: FormDataEntryValue | string | null | undefined) {
  return String(value || '').replace(/[^\d+]/g, '').trim();
}

export function requireText(formData: FormData, name: string, label: string, maxLength = 160) {
  const value = normalizeText(formData.get(name));
  if (!value) throw new Error(`กรุณากรอก${label}`);
  if (value.length > maxLength) throw new Error(`${label}ยาวเกินไป`);
  return value;
}

export function requireEmail(formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('กรุณากรอกอีเมลให้ถูกต้อง');
  }
  return email;
}

export function requirePasswordPair(formData: FormData) {
  const password = normalizeText(formData.get('password'));
  const confirmPassword = normalizeText(formData.get('confirmPassword'));
  if (password.length < 8) throw new Error('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
  if (password !== confirmPassword) throw new Error('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
  return password;
}

export function requireAccepted(formData: FormData, name: string, message: string) {
  if (formData.get(name) !== 'on' && formData.get(name) !== 'true') {
    throw new Error(message);
  }
}

function detectContentType(buffer: Buffer) {
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { contentType: 'image/jpeg', extension: 'jpg' };
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { contentType: 'image/png', extension: 'png' };
  }
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString('utf8') === '%PDF') {
    return { contentType: 'application/pdf', extension: 'pdf' };
  }
  return null;
}

export async function validateUpload(
  file: FormDataEntryValue | null,
  options: { label: string; kind: SafeUploadKind; maxBytes?: number; required?: boolean },
): Promise<SafeUpload | null> {
  if (!(file instanceof File) || file.size === 0) {
    if (options.required === false) return null;
    throw new Error(`กรุณาอัปโหลด${options.label}`);
  }

  const maxBytes =
    options.maxBytes || (options.kind === 'image-or-pdf' ? MAX_PAYMENT_PROOF_BYTES : MAX_MEMBER_UPLOAD_BYTES);
  if (file.size > maxBytes) {
    throw new Error(`${options.label}ต้องมีขนาดไม่เกิน ${Math.floor(maxBytes / 1024 / 1024)}MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectContentType(buffer);
  if (!detected) {
    throw new Error(`${options.label}ต้องเป็นไฟล์ JPG, PNG หรือ PDF ตามที่กำหนด`);
  }

  const isImage = detected.contentType.startsWith('image/');
  const isPdf = detected.contentType === 'application/pdf';
  if (options.kind === 'image' && !isImage) throw new Error(`${options.label}ต้องเป็นรูปภาพ JPG หรือ PNG`);
  if (options.kind === 'pdf' && !isPdf) throw new Error(`${options.label}ต้องเป็น PDF`);
  if (options.kind === 'image-or-pdf' && !isImage && !isPdf) {
    throw new Error(`${options.label}ต้องเป็น JPG, PNG หรือ PDF`);
  }

  return {
    buffer,
    contentType: detected.contentType,
    extension: detected.extension,
    size: file.size,
    originalName: file.name || `upload.${detected.extension}`,
  };
}

export function jsonError(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
  return Response.json({ ok: false, error: message }, { status });
}
