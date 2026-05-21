'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
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

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors cursor-pointer"
                    {...register('acceptTerms')}
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700 cursor-pointer">
                    Acepto el <span className="text-blue-600 font-bold">tratamiento de datos personales</span> conforme a la <span className="font-bold">Ley 1581 de 2012</span> (Habeas Data) y la <span className="font-bold">normativa ISO/IEC 27001</span>.
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-red-600 font-bold uppercase tracking-tighter">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requisitos de seguridad:</p>
                <ul className="text-[10px] space-y-1 font-medium text-gray-500 list-disc pl-4">
                  <li className={errors.password?.message?.includes('8 caracteres') ? 'text-red-500' : ''}>Mínimo 8 caracteres</li>
                  <li className={errors.password?.message?.includes('mayúscula') ? 'text-red-500' : ''}>Al menos una mayúscula</li>
                  <li className={errors.password?.message?.includes('minúscula') ? 'text-red-500' : ''}>Al menos una minúscula</li>
                  <li className={errors.password?.message?.includes('número') ? 'text-red-500' : ''}>Al menos un número</li>
                  <li className={errors.password?.message?.includes('carácter especial') ? 'text-red-500' : ''}>Al menos un carácter especial</li>
                </ul>
              </div>
            </div>

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
