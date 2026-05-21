'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/lib/types';
import { registerSchema } from '@/lib/validations/auth';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: initialData?.username || '',
      email: initialData?.email || '',
      role: initialData?.role || 'member',
      password: '', 
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre de usuario"
        placeholder="Ej: juan.perez"
        error={errors.username?.message as string}
        {...register('username')}
      />

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="juan@example.com"
        error={errors.email?.message as string}
        disabled={isEditing}
        {...register('email')}
      />

      {!isEditing && (
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message as string}
          {...register('password')}
        />
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Rol</label>
        <select
          className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all text-gray-900 bg-white"
          {...register('role')}
        >
          <option value="member">Miembro</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && <p className="mt-1 text-xs font-bold text-red-600">{errors.role.message as React.ReactNode}</p>}
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
        >
          {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
}
