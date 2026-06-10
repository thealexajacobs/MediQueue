import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'field cannot be empty').email('Invalid email address').trim(),
  password: z.string().min(1, 'field cannot be empty'),
});

export type LoginInput = z.infer<typeof loginSchema>;
