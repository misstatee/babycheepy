const CACHE_TTL_MS = 60 * 1000;

let cache: { csv: string; expiresAt: number } | null = null;

export async function getFAQ(): Promise<string> {
  const now = Date.now();

  if (cache && now < cache.expiresAt) {
    return cache.csv;
  }

  const url = process.env.SHEET_CSV_URL;
  if (!url) throw new Error('SHEET_CSV_URL is not set');

  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);

  const csv = await res.text();
  cache = { csv, expiresAt: now + CACHE_TTL_MS };
  return csv;
}

export function getCachedFAQ(): string | null {
  return cache?.csv ?? null;
}
