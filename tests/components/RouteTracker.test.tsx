import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RouteTracker } from '@/components/navigation/RouteTracker';

let pathname = '/dashboard';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname
}));

describe('RouteTracker', () => {
  beforeEach(() => {
    sessionStorage.clear();
    pathname = '/dashboard';
  });

  it('stores non-recipe origin when entering /recipes', () => {
    const { rerender } = render(<RouteTracker />);

    pathname = '/recipes';
    rerender(<RouteTracker />);

    expect(sessionStorage.getItem('back-origin:/recipes')).toBe('/dashboard');
  });

  it('clears origin when coming from a recipe detail', () => {
    const { rerender } = render(<RouteTracker />);

    pathname = '/recipes/123';
    rerender(<RouteTracker />);
    expect(sessionStorage.getItem('back-origin:/recipes')).toBe('/recipes/123');

    pathname = '/recipes';
    rerender(<RouteTracker />);
    expect(sessionStorage.getItem('back-origin:/recipes')).toBeNull();
  });
});
