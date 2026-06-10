import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const addPatientSchema = z.object({
  queueId: z.string().min(1),
  patientName: z.string().min(1, 'Patient name is required').max(100).trim(),
  phone: z.string().regex(phoneRegex, 'Phone must be in E.164 format (e.g. +2348012345678)').max(16).optional().or(z.literal('')),
});

export type AddPatientInput = z.infer<typeof addPatientSchema>;

export const updateEntrySchema = z.object({
  action: z.enum(['call', 'skip', 'complete']),
});

export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
