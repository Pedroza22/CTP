'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Project } from '@/lib/types';
import { projectSchema, ProjectFormValues } from '@/lib/validations/project';
import { cn } from '../ui/Button';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormValues) => void;
  isLoading?: boolean;
}

export function ProjectForm({ initialData, onSubmit, isLoading }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || '',
      status: (initialData?.status as ProjectFormValues['status']) || 'active',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre del proyecto"
        placeholder="Ej: Rediseño de App"
        className="rounded-xl border-2"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Descripción</label>
        <textarea
          className={cn(
            'block w-full rounded-xl border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 transition-all text-gray-900 bg-white placeholder-gray-400',
            errors.description ? 'border-red-300' : 'border-gray-200'
          )}
          rows={4}
          placeholder="Describe los objetivos del proyecto..."
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-xs font-bold text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Fecha de inicio"
          type="date"
          className="rounded-xl border-2"
          error={errors.start_date?.message}
          {...register('start_date')}
        />

        <Input
          label="Fecha de fin (Opcional)"
          type="date"
          className="rounded-xl border-2"
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Estado</label>
        <select
          className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all text-gray-900 bg-white"
          {...register('status')}
        >
          <option value="active">Activo</option>
          <option value="completed">Completado</option>
          <option value="on_hold">En pausa</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
        >
          {initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
}
