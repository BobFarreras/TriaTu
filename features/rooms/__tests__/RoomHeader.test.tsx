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
const deleteRoomMock = vi.fn();
vi.mock('@/features/rooms/actions/delete-room', () => ({
  deleteRoom: (roomId: string) => deleteRoomMock(roomId)
}));

describe('Rooms Feature - RoomHeader', () => {
  it('hauria de mostrar el nom de la sala', () => {
    render(
      <LanguageProvider>
        <RoomHeader
          roomName="Sala Prova"
          roomId="room-12345678"
          hostUserId="host-1"
          participants={[{ userId: 'host-1' }, { userId: 'user-2' }]}
          currentUserId="host-1"
          onKick={() => {}}
          onCopyCode={() => {}}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Sala Prova')).toBeTruthy();
  });

  it('obre el dialeg de confirmacio i crida deleteRoom quan el host elimina la sala', async () => {
    deleteRoomMock.mockResolvedValueOnce(undefined);

    render(
      <LanguageProvider>
        <RoomHeader
          roomName="Sala Prova"
          roomId="room-12345678"
          hostUserId="host-1"
          participants={[{ userId: 'host-1' }, { userId: 'user-2' }]}
          currentUserId="host-1"
          onKick={() => {}}
          onCopyCode={() => {}}
        />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /eliminar sala/i }));
    expect(screen.getByText(/est[aà]s segur/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /s[ií],? eliminar sala/i }));
    expect(deleteRoomMock).toHaveBeenCalledWith('room-12345678');
  });
});
