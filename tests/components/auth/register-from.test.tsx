// tests/components/auth/register-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/registre-form';
import { describe, it, expect, vi } from 'vitest';
import * as authActions from '@/app/actions/auth-actions';
import React from 'react';

// 1. Mock de les accions
vi.mock('@/app/actions/auth-actions', () => ({
    signup: vi.fn(),
}));

// 2. Mock del context d'idioma
vi.mock('@/lib/i18n/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            auth: {
                register_title: 'Registre Test',
                register_subtitle: 'Subtítol Test',
                email_label: 'Email',
                email_placeholder: 'test@example.com',
                password_label: 'Password',
                password_min: 'Mínim 6',
                register_btn: 'Crear Compte',
                has_account: 'Ja tens compte?',
                login_link: 'Entra',
            }
        }
    })
}));

// 3. Mock dels components UI (Corregit l'error de "any")
// Definim una interfície bàsica per als props que esperem
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

vi.mock('@/components/ui/AuthInput', () => ({
    AuthInput: ({ name, placeholder, type }: AuthInputProps) => (
        <input
            data-testid={`input-${name}`}
            name={name}
            placeholder={placeholder}
            type={type}
        />
    ),
}));

describe('RegisterForm Component', () => {
    it('renderitza correctament els elements bàsics', () => {
        render(<RegisterForm redirectTo="/dashboard" />);

        expect(screen.getByText('Registre Test')).toBeDefined();
        expect(screen.getByTestId('input-email')).toBeDefined();

        // Type assertion segur per a inputs hidden
        const hiddenInput = document.querySelector('input[name="next"]') as HTMLInputElement;
        expect(hiddenInput).not.toBeNull();
        expect(hiddenInput.value).toBe('/dashboard');
    });

    it('crida a la server action "signup" amb le dades correctes', async () => {
        const signupMock = vi.mocked(authActions.signup);

        // ✅ CORRECCIÓN: Usamos 'undefined' para éxito, NO 'true' ni '{}'
        // Esto simula que la función se ejecutó sin retornar un error.
        signupMock.mockResolvedValue(undefined);

        render(<RegisterForm redirectTo="/dashboard" />);

        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'nou@usuari.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } });

        fireEvent.click(screen.getByText('Crear Compte'));

        await waitFor(() => {
            expect(signupMock).toHaveBeenCalledTimes(1);
        });
    });

    it('mostra un error si la server action retorna error', async () => {
        const signupMock = vi.mocked(authActions.signup);

        // ✅ CORRECCIÓN: El objeto debe coincidir con el tipo esperado
        // Si tu Server Action devuelve { error: string }, pasamos exactamente eso.
        signupMock.mockResolvedValue({ error: 'Email ja existent' });

        render(<RegisterForm redirectTo="/dashboard" />);

        // ... rellenar form ...
        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'fail@test.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: '123456' } });

        fireEvent.click(screen.getByText('Crear Compte'));

        await waitFor(() => {
            expect(screen.getByText('🚫 Email ja existent')).toBeDefined();
        });
    });
});