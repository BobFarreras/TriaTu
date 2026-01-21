import { describe, it, expect, vi, afterEach } from 'vitest';
import * as logger from '@/lib/logger';
import { logActionError } from '@/lib/observability/action-logger';

describe('logActionError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forward action context to logger', () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const err = new Error('boom');

    logActionError('saveRecipeAction', 'saveRecipeAction failed', err);

    expect(spy).toHaveBeenCalledWith('saveRecipeAction failed', err, {
      action: 'saveRecipeAction'
    });
  });
});
