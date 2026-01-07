// tests/components/auth/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-from';
import { describe, it, expect, vi } from 'vitest';
import * as authActions from '@/app/actions/auth-actions';
import React from 'react';

// Mock de les dependències
vi.mock('@/app/actions/auth-actions', () => ({
    login: vi.fn(),
}));

vi.mock('@/lib/i18n/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            auth: {
                login_title: 'Login Test',
                login_subtitle: 'Hola de nou',
                email_label: 'Email',
                password_label: 'Password',
                login_btn: 'Entrar',
                no_account: 'No tens compte?',
                register_link: 'Registra\'t',
                back: 'Tornar'
            }
        }
    })
}));

// Mock AuthInput sense "any"
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

describe('LoginForm Component', () => {
    it('renderitza el formulari de login correctament', () => {
        render(<LoginForm redirectTo="/home" />);

        expect(screen.getByText('Login Test')).toBeDefined();
        expect(screen.getByText('Entrar')).toBeDefined();
        expect(screen.getByTestId('input-email')).toBeDefined();

        const hiddenInput = document.querySelector('input[name="next"]') as HTMLInputElement;
        expect(hiddenInput.value).toBe('/home');
    });

    it('crida a l\'acció de login amb les credencials', async () => {
        const loginMock = vi.mocked(authActions.login);

        // ✅ ÉXITO: undefined (void)
        loginMock.mockResolvedValue(undefined);

        render(<LoginForm redirectTo="/home" />);

        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'usuari@test.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledTimes(1);
        });
    });
    it('mostra missatge d\'error si credencials són incorrectes', async () => {
        const loginMock = vi.mocked(authActions.login);

        // ✅ FALLO: Objeto con error
        loginMock.mockResolvedValue({ error: 'Credencials invàlides' });

        render(<LoginForm redirectTo="/home" />);

        // Necesitas rellenar los inputs para que no salte la validación HTML5 'required' antes de enviar
        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'bad@test.com' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(screen.getByText('🚫 Credencials invàlides')).toBeDefined();
        });
    });
});