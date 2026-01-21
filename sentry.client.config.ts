import * as Sentry from '@sentry/nextjs';
import { parseSampleRate, sanitizeSentryEvent } from './lib/observability/sentry';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0.1),
  profilesSampleRate: parseSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE, 0.0),
  sendDefaultPii: false,
  beforeSend(event) {
    return sanitizeSentryEvent(event);
  }
});
