'use z';
import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  avatar: z.any().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
