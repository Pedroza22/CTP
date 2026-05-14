'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Task, Project } from '@/lib/types';

const taskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  project: z.number({ 
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_type' && issue.received === 'nan') {
        return { message: 'Debe seleccionar un proyecto' };
      }
      return { message: ctx.defaultError };
    }
  }),
  due_date: z.string().min(1, 'La fecha límite es obligatoria'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'BLOCKED']),
  assigned_to: z.number().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<Task>;
  projects: Project[];
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
}

export function TaskForm({ initialData, projects, onSubmit, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      project: initialData?.project,
      due_date: initialData?.due_date || '',
      priority: initialData?.priority || 'MEDIUM',
      status: initialData?.status || 'PENDING',
      assigned_to: initialData?.assigned_to || null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título de la tarea"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            errors.description ? 'border-red-300' : 'border-gray-300'
          )}
          rows={3}
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register('project', { valueAsNumber: true })}
          >
            <option value="">Seleccionar...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project.message}</p>}
        </div>

        <Input
          label="Fecha límite"
          type="date"
          error={errors.due_date?.message}
          {...register('due_date')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register('priority')}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register('status')}
          >
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Completada</option>
            <option value="BLOCKED">Bloqueada</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
}

import { cn } from '../ui/Button';
