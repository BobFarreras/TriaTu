import { describe, it, expect } from 'vitest';
import { isSentryTestEnabled } from '@/lib/observability/sentry-test';

describe('isSentryTestEnabled', () => {
  it('returns true only when value is "true"', () => {
    expect(isSentryTestEnabled('true')).toBe(true);
    expect(isSentryTestEnabled('false')).toBe(false);
    expect(isSentryTestEnabled(undefined)).toBe(false);
  });
});
