import { z } from 'zod';

export const createQueueSchema = z.object({
  name: z.string().min(1, 'Queue name is required').max(100).trim(),
});

export const updateQueueSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CLOSED']).optional(),
});

export type CreateQueueInput = z.infer<typeof createQueueSchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueSchema>;
