import { FoodPreset } from '../editor/types';

export function filterAndOrderPresets(
  presets: FoodPreset[],
  query: string,
  selectedCategory: string | 'ALL'
): FoodPreset[] {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? presets.filter(preset => preset.name.toLowerCase().includes(normalizedQuery))
    : presets;

  if (selectedCategory === 'ALL') return filtered;
  return filtered.filter(preset => preset.category === selectedCategory);
}
