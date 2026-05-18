'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'MEMBER' as "ADMIN" | "MEMBER",
    }
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-xl shadow-blue-200">
            <span className="text-white font-black text-2xl">PF</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900">
          Únete a <span className="text-indigo-600">Nosotros</span>
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
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nombre de usuario"
              type="text"
              placeholder="Ej. julian_dev"
              className="rounded-xl border-2"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@ejemplo.com"
              className="rounded-xl border-2"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              className="rounded-xl border-2"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Rol en el Equipo
              </label>
              <select
                {...register('role')}
                className="block w-full rounded-xl border-2 border-gray-100 bg-gray-50 py-2.5 px-4 text-gray-900 focus:border-indigo-500 focus:ring-0 sm:text-sm transition-all"
              >
                <option value="MEMBER">Miembro del Equipo</option>
                <option value="ADMIN">Administrador de Proyectos</option>
              </select>
              {errors.role && <p className="mt-1 text-xs font-bold text-red-500">{errors.role.message}</p>}
            </div>

            {registerError && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-red-50 p-4 border border-red-100"
              >
                <div className="text-xs font-bold text-red-600 uppercase tracking-tight text-center">
                  Hubo un problema al crear tu cuenta.
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-600 border-0"
                isLoading={isRegistering}
              >
                Registrarme Ahora
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-400 font-bold uppercase tracking-widest">¿Ya eres parte?</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest border-2 hover:bg-gray-50 transition-all">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
