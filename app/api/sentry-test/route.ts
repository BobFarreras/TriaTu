import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { isSentryTestEnabled } from '@/lib/observability/sentry-test';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSentryTestEnabled(process.env.SENTRY_TEST_ENABLED)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!process.env.SENTRY_DSN) {
    return NextResponse.json({ error: 'SENTRY_DSN missing' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const type = body?.type === 'message' ? 'message' : 'error';

  Sentry.setTag('test_source', 'server');

  let eventId: string | undefined;
  if (type === 'message') {
    eventId = Sentry.captureMessage('Sentry server test');
  } else {
    eventId = Sentry.captureException(new Error('Sentry server test'));
  }

  await Sentry.flush(2000);

  return NextResponse.json({ ok: true, eventId });
}
