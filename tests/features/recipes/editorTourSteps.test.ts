import { describe, it, expect } from 'vitest';
import { getEditorTourSteps } from '@/features/recipes/components/editor/editor/utils';
import { en } from '@/lib/i18n/locales/en';

describe('getEditorTourSteps', () => {
  it('returns a full tour flow for meta, ingredients, and steps', () => {
    const steps = getEditorTourSteps(en);

    expect(steps).toHaveLength(8);
    expect(steps[0].targetId).toBe('tour-recipe-title');
    expect(steps[3].targetId).toBe('tour-ing-input');
    expect(steps[5].targetId).toBe('tour-step-textarea');
    expect(steps[7].targetId).toBe('tour-save-btn');
  });
});
