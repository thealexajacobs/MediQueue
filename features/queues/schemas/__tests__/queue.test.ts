import { describe, it, expect } from 'vitest';
import { createQueueSchema, updateQueueSchema } from '@/features/queues/schemas/queue';

describe('createQueueSchema', () => {
  it('accepts valid queue name', () => {
    const result = createQueueSchema.safeParse({ name: 'General Consultation' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createQueueSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('trims whitespace', () => {
    const result = createQueueSchema.safeParse({ name: '  Dentistry  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Dentistry');
    }
  });
});

describe('updateQueueSchema', () => {
  it('accepts partial update with name', () => {
    const result = updateQueueSchema.safeParse({ name: 'Updated Name' });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with status', () => {
    const result = updateQueueSchema.safeParse({ status: 'PAUSED' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object (no updates)', () => {
    const result = updateQueueSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = updateQueueSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
