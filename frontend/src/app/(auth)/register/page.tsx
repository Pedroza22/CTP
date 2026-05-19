'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth';

export default function RegisterPage() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as never,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-200">
            <span className="text-white font-black text-2xl">PF</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900">
          Únete a <span className="text-blue-600">Precision Flow</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium uppercase tracking-widest">
          COMIENZA A GESTIONAR TUS PROYECTOS
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-gray-200/50 rounded-3xl sm:px-12 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nombre de usuario"
              type="text"
              placeholder="tu_usuario"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@ejemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {registerError && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-red-50 p-4 border border-red-100"
              >
                <div className="text-xs font-bold text-red-600 uppercase tracking-tight">
                  Hubo un error al registrarte. Intenta con otro correo o usuario.
                </div>
              </motion.div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
                isLoading={isRegistering}
              >
                Crear Cuenta
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="flex w-full justify-center rounded-2xl border-2 border-gray-100 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
