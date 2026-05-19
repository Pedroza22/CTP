'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Project, Task } from '@/lib/types';
import { taskSchema, TaskFormValues } from '@/lib/validations/task';
import { cn } from '../ui/Button';

interface TaskFormProps {
  initialData?: Partial<Task>;
  projects?: Project[];
  onSubmit: (data: TaskFormValues) => void;
  isLoading?: boolean;
}

export function TaskForm({ initialData, projects, onSubmit, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      project: initialData?.project as string || '',
      due_date: initialData?.due_date || null,
      priority: (initialData?.priority as TaskFormValues['priority']) || 'medium',
      status: (initialData?.status as TaskFormValues['status']) || 'pending',
      assigned_to: (initialData?.assigned_to as string) || null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {projects && projects.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Proyecto</label>
          <select
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all"
            {...register('project')}
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.project && <p className="mt-1 text-xs font-bold text-red-600">{errors.project.message}</p>}
        </div>
      )}

      <Input
        label="Título de la tarea"
        placeholder="Ej: Diseñar base de datos"
        className="rounded-xl border-2"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Descripción</label>
        <textarea
          className={cn(
            'block w-full rounded-xl border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 transition-all',
            errors.description ? 'border-red-300' : 'border-gray-200'
          )}
          rows={3}
          placeholder="¿Qué se debe hacer en esta tarea?"
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-xs font-bold text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Fecha límite"
          type="date"
          className="rounded-xl border-2"
          error={errors.due_date?.message}
          {...register('due_date')}
        />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-widest text-[10px]">Prioridad</label>
          <select
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all"
            {...register('priority')}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
          {errors.priority && <p className="mt-1 text-xs font-bold text-red-600">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full rounded-2xl h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
        >
          {initialData?.id ? 'Actualizar Tarea' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
}
