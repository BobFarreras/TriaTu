import { describe, it, expect } from 'vitest';
import { getEditorTourSamples } from '@/features/recipes/components/editor/editor/utils';

describe('getEditorTourSamples', () => {
  it('provides sample data for the full tour flow', () => {
    const samples = getEditorTourSamples();

    expect(samples.name).toBeTruthy();
    expect(samples.prepTimeMinutes).toBeGreaterThan(0);
    expect(samples.ingredients).toHaveLength(3);
    expect(samples.linkedIngredients).toHaveLength(3);
    expect(samples.stepText).toContain('[Tomàquet]');
  });
});
