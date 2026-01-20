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

export function error(message: string, err?: unknown) {
  if (err) {
    console.error(message, err);
    return;
  }
  console.error(message);
}
