import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeHeader } from '../components/parts/RecipeHeader';

describe('Recipes Feature - RecipeHeader', () => {
  it('hauria de mostrar el titol i tags', () => {
    render(
      <RecipeHeader
        name="Pasta Primavera"
        prepTime={25}
        tags={['rapida', 'veg']}
        estimatedCost={3}
        authorName="Xef"
      />
    );

    expect(screen.getByText('Pasta Primavera')).toBeTruthy();
    expect(screen.getByText(/rapida/i)).toBeTruthy();
    expect(screen.getByText(/veg/i)).toBeTruthy();
  });
});
