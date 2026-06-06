import { describe, it, expect } from 'vitest';
import { addPatientSchema, updateEntrySchema } from '@/features/queue-entries/schemas/entry';

describe('addPatientSchema', () => {
  it('accepts valid input with all fields', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
      patientName: 'John Doe',
      phone: '+2348012345678',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid input without phone', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
      patientName: 'John Doe',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty phone string', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
      patientName: 'John Doe',
      phone: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing patientName', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty patientName', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
      patientName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing queueId', () => {
    const result = addPatientSchema.safeParse({
      patientName: 'John Doe',
    });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from patientName', () => {
    const result = addPatientSchema.safeParse({
      queueId: 'queue-1',
      patientName: '  John Doe  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.patientName).toBe('John Doe');
    }
  });
});

describe('updateEntrySchema', () => {
  it('accepts valid action: call', () => {
    const result = updateEntrySchema.safeParse({ action: 'call' });
    expect(result.success).toBe(true);
  });

  it('accepts valid action: skip', () => {
    const result = updateEntrySchema.safeParse({ action: 'skip' });
    expect(result.success).toBe(true);
  });

  it('accepts valid action: complete', () => {
    const result = updateEntrySchema.safeParse({ action: 'complete' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid action', () => {
    const result = updateEntrySchema.safeParse({ action: 'delete' });
    expect(result.success).toBe(false);
  });

  it('rejects missing action', () => {
    const result = updateEntrySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
