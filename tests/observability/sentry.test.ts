import { describe, it, expect } from 'vitest';
import { sanitizeSentryEvent } from '@/lib/observability/sentry';

describe('sanitizeSentryEvent', () => {
  it('redacts common PII fields recursively', () => {
    const input = {
      user: { email: 'user@example.com', id: 'u1' },
      request: {
        headers: {
          authorization: 'Bearer secret',
          cookie: 'session=abc'
        }
      },
      extra: {
        prompt: 'full prompt',
        password: 'secret',
        nested: {
          token: 'tok',
          messages: [{ role: 'user', content: 'hi' }]
        }
      }
    };

    const result = sanitizeSentryEvent(input);

    expect(result.user.email).toBe('[REDACTED]');
    expect(result.request.headers.authorization).toBe('[REDACTED]');
    expect(result.request.headers.cookie).toBe('[REDACTED]');
    expect(result.extra.prompt).toBe('[REDACTED]');
    expect(result.extra.password).toBe('[REDACTED]');
    expect(result.extra.nested.token).toBe('[REDACTED]');
    expect(result.extra.nested.messages).toBe('[REDACTED]');
  });
});
