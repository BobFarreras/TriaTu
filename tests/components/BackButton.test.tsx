import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { BackButton } from '@/components/ui/BackButton';

const router = {
  back: vi.fn(),
  push: vi.fn(),
  replace: vi.fn()
};

vi.mock('next/navigation', () => ({
  useRouter: () => router
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    )
  }
}));

describe('BackButton', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
    router.replace.mockClear();
  });

  it('runs onAction without navigating', () => {
    const onAction = vi.fn();
    const { getByRole } = render(<BackButton onAction={onAction} />);

    fireEvent.click(getByRole('button'));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(router.back).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('uses router.back when no href or onAction', () => {
    const { getByRole } = render(<BackButton />);

    fireEvent.click(getByRole('button'));

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('renders a link when href is provided', () => {
    const { container } = render(<BackButton href="/test" />);
    const link = container.querySelector('a[href="/test"]');

    expect(link).not.toBeNull();
  });
});
