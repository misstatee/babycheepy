import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import { getAuthSecret, MEMBER_SESSION_MAX_AGE_SECONDS } from './config';
import type { UserRole } from './types';

const PASSWORD_HASH_PREFIX = 'scrypt';
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function hmac(value: string) {
  return createHmac('sha256', getAuthSecret()).update(value).digest('base64url');
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function sha256Buffer(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 64 * 1024 * 1024,
  }).toString('base64url');
  return `${PASSWORD_HASH_PREFIX}$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [prefix, n, r, p, salt, expected] = storedHash.split('$');
  if (prefix !== PASSWORD_HASH_PREFIX || !n || !r || !p || !salt || !expected) return false;

  const actual = scryptSync(password, salt, KEY_LENGTH, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  }).toString('base64url');

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function signSession(payload: Omit<SessionPayload, 'exp'>, maxAgeSeconds = MEMBER_SESSION_MAX_AGE_SECONDS) {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Url(JSON.stringify(fullPayload));
  const signature = hmac(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;

  const expected = hmac(`${header}.${body}`);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.userId || !payload.email || !payload.role || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashResetToken(token: string) {
  return createHmac('sha256', getAuthSecret()).update(token).digest('hex');
}

export function safeStorageFileName(originalName: string, fallbackExt: string) {
  const clean = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  const ext = clean.includes('.') ? clean.split('.').pop() || fallbackExt : fallbackExt;
  return `${Date.now()}-${randomToken(8)}.${ext}`;
}
