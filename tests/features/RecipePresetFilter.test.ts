import { describe, it, expect } from 'vitest';
import { filterAndOrderPresets } from '@/features/recipes/components/ingredients/presetFilter';

describe('filterAndOrderPresets', () => {
  it('filtra per categoria seleccionada', () => {
    const presets = [
      { id: 'a', name: 'Poma', category: 'Fruita' },
      { id: 'b', name: 'Pastanaga', category: 'Verdura' },
      { id: 'c', name: 'Pera', category: 'Fruita' }
    ];

    const result = filterAndOrderPresets(presets, '', 'Fruita');

    expect(result.map(p => p.id)).toEqual(['a', 'c']);
  });

  it('filtra per text sense eliminar categories no seleccionades', () => {
    const presets = [
      { id: 'a', name: 'Poma', category: 'Fruita' },
      { id: 'b', name: 'Pastanaga', category: 'Verdura' },
      { id: 'c', name: 'Pera', category: 'Fruita' }
    ];

    const result = filterAndOrderPresets(presets, 'pa', 'Verdura');

    expect(result.map(p => p.id)).toEqual(['b']);
  });
});
