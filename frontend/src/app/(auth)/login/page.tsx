'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useState } from 'react';

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    console.log('Intentando iniciar sesión con:', data);
    try {
      await login(data);
      console.log('Login exitoso');
    } catch (e: unknown) {
      console.error('Error en el login:', e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado';
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col justify-center py-6 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-2xl"
      >
        <div className="flex justify-center -mb-8">
          <div className="relative h-96 w-full scale-150">
            <Image 
              src="/logo1_black_text.png" 
              alt="Precision Flow Logo" 
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-0 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-gray-200/50 rounded-3xl sm:px-12 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {submitError && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-red-50 p-4 border border-red-100"
              >
                <div className="text-xs font-bold text-red-600 uppercase tracking-tight">
                  {submitError}
                </div>
              </motion.div>
            )}

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-red-50 p-4 border border-red-100"
              >
                <div className="flex">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-tight text-red-600">
                    Credenciales incorrectas. Revisa tus datos e intenta de nuevo.
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
                isLoading={isLoggingIn}
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">¿No tienes cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="flex w-full justify-center rounded-2xl border-2 border-gray-100 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
