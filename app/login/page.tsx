'use client'

import { useState, useTransition } from 'react';
import { login, signup } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const action = isLogin ? login : signup;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{isLogin ? 'Benvingut de nou' : 'Crear compte'}</h1>
          <p className="text-sm text-gray-500">Accedeix a les teves sales i perfil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="email" 
            type="email" 
            placeholder="el-teu@email.com" 
            label="Correu electrònic" 
            required 
          />
          <Input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            label="Contrasenya" 
            required 
            minLength={6}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" type="submit" isLoading={isPending}>
            {isLogin ? 'Entrar' : 'Registrar-se'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "No tens compte? Registra't" : "Ja tens compte? Entra"}
          </button>
        </div>
      </Card>
    </div>
  );
}