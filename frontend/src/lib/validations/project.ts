import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  start_date: z.string().min(1, 'La fecha de inicio es requerida'),
  end_date: z.string().optional().nullable(),
  status: z.enum(['active', 'completed', 'on_hold', 'cancelled']),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
