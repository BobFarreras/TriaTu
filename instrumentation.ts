import * as Sentry from '@sentry/nextjs';
import { parseSampleRate, sanitizeSentryEvent } from './lib/observability/sentry';

const dsn = process.env.SENTRY_DSN;

const initSentry = () => {
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
};

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    initSentry();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    initSentry();
  }
}
