'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/register';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: data.clinicName,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Registration failed');
        setIsLoading(false);
        return;
      }

      router.push('/auth?mode=login&registered=true');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="clinicName" className="mb-1 block text-sm text-muted-foreground">
          Clinic name
        </label>
        <input
          id="clinicName"
          type="text"
          autoComplete="organization"
          className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="Your Clinic Name"
          {...register('clinicName')}
        />
        {errors.clinicName && (
          <p className="mt-1 text-sm text-destructive">{errors.clinicName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="admin@clinic.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-muted-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="At least 8 characters"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm text-muted-foreground">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="Repeat your password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 items-center justify-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
      </button>
    </form>
  );
}
