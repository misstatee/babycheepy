export const MEMBER_SESSION_COOKIE = 'babycheepy_member_session';
export const MEMBER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
export const DEFAULT_PRIVATE_BUCKET = 'babycheepy-private';
export const MAX_PAYMENT_PROOF_BYTES = 8 * 1024 * 1024;
export const MAX_MEMBER_UPLOAD_BYTES = 10 * 1024 * 1024;

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.replace(/^/, 'https://') ||
    'http://localhost:3000'
  );
}

export function getLineContactUrl() {
  return process.env.NEXT_PUBLIC_LINE_CONTACT_URL || 'https://line.me/R/ti/p/@861pkbnz';
}

export function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    privateBucket: process.env.SUPABASE_PRIVATE_BUCKET || DEFAULT_PRIVATE_BUCKET,
  };
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.serviceRoleKey);
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '';
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET is required in production');
  }
  return secret || 'babycheepy-dev-auth-secret-change-before-production';
}

export function getPaymentSettings() {
  return {
    amountBaht: Number(process.env.BRAND_CLUB_PRICE_BAHT || 99),
    qrCodeUrl: process.env.BRAND_CLUB_PAYMENT_QR_URL || '',
    accountName: process.env.BRAND_CLUB_PAYMENT_ACCOUNT_NAME || '',
    bankName: process.env.BRAND_CLUB_PAYMENT_BANK_NAME || '',
    accountNumber: process.env.BRAND_CLUB_PAYMENT_ACCOUNT_NUMBER || '',
    paymentNote:
      process.env.BRAND_CLUB_PAYMENT_NOTE ||
      'โอนค่าสมัคร Babycheepy Brand Club 99 บาท แล้วอัปโหลดสลิปในแบบฟอร์มสมัครสมาชิก',
  };
}

export function getAdminBootstrapToken() {
  return process.env.ADMIN_BOOTSTRAP_TOKEN || '';
}

export function getPasswordResetTtlMinutes() {
  return Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30);
}
