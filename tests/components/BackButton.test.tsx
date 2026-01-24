import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { BackButton } from '@/components/ui/BackButton';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

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
    button: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { whileHover?: unknown; whileTap?: unknown }) => {
      const { children, ...rest } = props;
      const clean = { ...rest } as React.ButtonHTMLAttributes<HTMLButtonElement>;
      delete (clean as Record<string, unknown>).whileHover;
      delete (clean as Record<string, unknown>).whileTap;
      return <button {...clean}>{children}</button>;
    },
    div: (props: React.HTMLAttributes<HTMLDivElement> & { whileHover?: unknown; whileTap?: unknown }) => {
      const { children, ...rest } = props;
      const clean = { ...rest } as React.HTMLAttributes<HTMLDivElement>;
      delete (clean as Record<string, unknown>).whileHover;
      delete (clean as Record<string, unknown>).whileTap;
      return <div {...clean}>{children}</div>;
    }
  }
}));

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('BackButton', () => {
  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
    router.replace.mockClear();
  });

  it('runs onAction without navigating', () => {
    const onAction = vi.fn();
    const { getByRole } = renderWithLanguage(<BackButton onAction={onAction} />);

    fireEvent.click(getByRole('button'));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(router.back).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('uses router.back when no href or onAction', () => {
    const { getByRole } = renderWithLanguage(<BackButton />);

    fireEvent.click(getByRole('button'));

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('renders a link when href is provided', () => {
    const { container } = renderWithLanguage(<BackButton href="/test" />);
    const link = container.querySelector('a[href="/test"]');

    expect(link).not.toBeNull();
  });
});
