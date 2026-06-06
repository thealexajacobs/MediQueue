import { z } from 'zod';

export const addPatientSchema = z.object({
  queueId: z.string().min(1),
  patientName: z.string().min(1, 'Patient name is required').max(100).trim(),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export type AddPatientInput = z.infer<typeof addPatientSchema>;

export const updateEntrySchema = z.object({
  action: z.enum(['call', 'skip', 'complete']),
});

export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
