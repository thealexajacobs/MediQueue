'use server';

import { signIn } from '@/auth';

export type LoginResult = { success: true } | { error: string };

export async function authenticate(email: string, password: string): Promise<LoginResult> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return { error: 'Invalid email or password' };
  }
}
