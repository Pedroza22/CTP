import { z } from 'zod';

export const taskSchema = z.object({
  project: z.string().uuid('ID de proyecto inválido'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(300),
  description: z.string().optional(),
  due_date: z.string().optional().nullable(),
  status: z.enum(['pending', 'in_progress', 'done', 'blocked']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assigned_to: z.string().uuid('ID de usuario inválido').optional().nullable(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'El comentario no puede estar vacío'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type CommentFormValues = z.infer<typeof commentSchema>;
