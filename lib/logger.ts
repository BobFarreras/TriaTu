export const isDev = process.env.NODE_ENV === 'development';

export function debug(message: string, meta?: Record<string, unknown>) {
  if (!isDev) return;
  if (meta) {
    console.log(message, meta);
    return;
  }
  console.log(message);
}

export function warn(message: string, meta?: Record<string, unknown>) {
  if (meta) {
    console.warn(message, meta);
    return;
  }
  console.warn(message);
}

type LogErrorContext = {
  action?: string;
  feature?: string;
  useCase?: string;
  code?: string;
  tags?: Record<string, string>;
};

export function error(message: string, err?: unknown, context?: LogErrorContext) {
  if (err) {
    console.error(message, err);
  } else {
    console.error(message);
  }

  if (typeof process === 'undefined') return;
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  import('@sentry/nextjs')
    .then(({ captureException, captureMessage, withScope }) => {
      withScope((scope) => {
        scope.setLevel('error');
        scope.setTag('context', message);
        if (context?.action) scope.setTag('action', context.action);
        if (context?.feature) scope.setTag('feature', context.feature);
        if (context?.useCase) scope.setTag('use_case', context.useCase);
        if (context?.code) scope.setTag('code', context.code);
        if (context?.tags) {
          for (const [key, value] of Object.entries(context.tags)) {
            scope.setTag(key, String(value));
          }
        }

        if (err && typeof err === 'object') {
          const maybeError = err as { feature?: string; useCase?: string; code?: string };
          if (!context?.feature && maybeError.feature) scope.setTag('feature', maybeError.feature);
          if (!context?.useCase && maybeError.useCase) scope.setTag('use_case', maybeError.useCase);
          if (!context?.code && maybeError.code) scope.setTag('code', maybeError.code);
        }
        if (err instanceof Error) {
          captureException(err);
        } else {
          captureMessage(message);
        }
      });
    })
    .catch(() => {});
}
