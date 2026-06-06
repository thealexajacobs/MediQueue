import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/features/auth/schemas/login';
import { registerSchema } from '@/features/auth/schemas/register';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'admin@clinic.com', password: 'Demo1234!' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Demo1234!' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'admin@clinic.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      clinicName: 'Test Clinic',
      email: 'admin@clinic.com',
      password: 'Demo1234!',
      confirmPassword: 'Demo1234!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      clinicName: 'Test Clinic',
      email: 'admin@clinic.com',
      password: '1234567',
      confirmPassword: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      clinicName: 'Test Clinic',
      email: 'admin@clinic.com',
      password: 'Demo1234!',
      confirmPassword: 'DifferentPass1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing clinic name', () => {
    const result = registerSchema.safeParse({
      clinicName: '',
      email: 'admin@clinic.com',
      password: 'Demo1234!',
      confirmPassword: 'Demo1234!',
    });
    expect(result.success).toBe(false);
  });
});
