'use client';

import * as Sentry from '@sentry/nextjs';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <main
          style={{
            margin: '0 auto',
            maxWidth: 520,
            padding: '48px 24px',
            fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
          }}
        >
          <h1>Alguna cosa ha fallat</h1>
          <p>Hem registrat l&apos;error. Pots tornar-ho a provar.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #0f172a',
              background: '#0f172a',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
