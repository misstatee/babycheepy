import { getSupabaseConfig } from './config';

export class MemberBackendSetupError extends Error {
  constructor(message = 'ยังไม่ได้ตั้งค่า Supabase สำหรับระบบสมาชิก Babycheepy Brand Club') {
    super(message);
    this.name = 'MemberBackendSetupError';
  }
}

export class SupabaseRequestError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(`Supabase request failed with status ${status}`);
    this.name = 'SupabaseRequestError';
    this.status = status;
    this.detail = detail;
  }
}

function assertConfig() {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new MemberBackendSetupError();
  }
  return config;
}

function baseUrl(path: string) {
  const { url } = assertConfig();
  return `${url.replace(/\/$/, '')}${path}`;
}

export function eq(value: string | number | boolean) {
  return `eq.${encodeURIComponent(String(value))}`;
}

export function ilike(value: string) {
  return `ilike.*${encodeURIComponent(value)}*`;
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { serviceRoleKey } = assertConfig();
  const response = await fetch(baseUrl(`/rest/v1/${path.replace(/^\//, '')}`), {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new SupabaseRequestError(response.status, data);
  }
  return data as T;
}

export async function supabaseRpc<T>(fnName: string, body: Record<string, unknown>): Promise<T> {
  return supabaseRest<T>(`rpc/${fnName}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function uploadPrivateObject(params: {
  bucket?: string;
  path: string;
  contentType: string;
  buffer: Buffer;
}) {
  const { serviceRoleKey, privateBucket } = assertConfig();
  const bucket = params.bucket || privateBucket;
  const objectPath = params.path.replace(/^\/+/, '');
  const body = new Blob([new Uint8Array(params.buffer)], { type: params.contentType });
  const response = await fetch(baseUrl(`/storage/v1/object/${bucket}/${objectPath}`), {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': params.contentType,
      'x-upsert': 'false',
    },
    body,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new SupabaseRequestError(response.status, data);
  }

  return { bucket, path: objectPath };
}

export async function createSignedObjectUrl(bucket: string, path: string, expiresInSeconds = 60) {
  const { serviceRoleKey } = assertConfig();
  const objectPath = path.replace(/^\/+/, '');
  const response = await fetch(baseUrl(`/storage/v1/object/sign/${bucket}/${objectPath}`), {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: expiresInSeconds }),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new SupabaseRequestError(response.status, data);
  }

  const signedUrl = (data as { signedURL?: string; signedUrl?: string }).signedURL || (data as { signedUrl?: string }).signedUrl;
  if (!signedUrl) {
    throw new SupabaseRequestError(500, { message: 'Supabase did not return signed URL' });
  }
  const { url } = getSupabaseConfig();
  return `${url.replace(/\/$/, '')}/storage/v1${signedUrl}`;
}
