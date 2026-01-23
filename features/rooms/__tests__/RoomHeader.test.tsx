import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomHeader } from '../components/RoomHeader';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));
describe('Rooms Feature - RoomHeader', () => {
  it('hauria de mostrar el nom de la sala', () => {
    render(
      <LanguageProvider>
        <RoomHeader
          roomName="Sala Prova"
          roomId="room-12345678"
          hostUserId="host-1"
          participants={[{ userId: 'host-1', name: 'Host' }, { userId: 'user-2', name: 'Ada' }]}
          currentUserId="host-1"
          onKick={() => {}}
          onCopyCode={() => {}}
          onOpenSettings={() => {}}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Sala Prova')).toBeTruthy();
  });

  it('obre els ajustos quan el host fa click al botó de settings', async () => {
    const onOpenSettings = vi.fn();

    render(
      <LanguageProvider>
        <RoomHeader
          roomName="Sala Prova"
          roomId="room-12345678"
          hostUserId="host-1"
          participants={[{ userId: 'host-1', name: 'Host' }, { userId: 'user-2', name: 'Ada' }]}
          currentUserId="host-1"
          onKick={() => {}}
          onCopyCode={() => {}}
          onOpenSettings={onOpenSettings}
        />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /open room settings/i }));
    expect(onOpenSettings).toHaveBeenCalled();
  });
});
