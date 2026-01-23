import { error as logError } from '@/lib/logger';

export function logActionError(
  action: string,
  message: string,
  err?: unknown,
  tags?: Record<string, string>
) {
  logError(message, err, { action, tags });
}
