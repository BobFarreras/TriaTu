const REDACT_VALUE = '[REDACTED]';

const REDACT_KEYS = new Set([
  'authorization',
  'cookie',
  'email',
  'password',
  'token',
  'session',
  'prompt',
  'messages'
]);

const REDACT_KEYWORDS = ['secret', 'api_key', 'apikey', 'access_token', 'refresh_token'];

function shouldRedactKey(key: string): boolean {
  const normalized = key.toLowerCase();
  if (REDACT_KEYS.has(normalized)) return true;
  return REDACT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function scrubValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item));
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (shouldRedactKey(key)) {
        result[key] = REDACT_VALUE;
        continue;
      }
      result[key] = scrubValue(val);
    }
    return result;
  }

  return value;
}

export function sanitizeSentryEvent<T>(event: T): T {
  return scrubValue(event) as T;
}

export function parseSampleRate(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 0), 1);
}
