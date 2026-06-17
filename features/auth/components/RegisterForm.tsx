'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/register';
import { signIn } from 'next-auth/react';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const clinicNameVal = watch('clinicName');
  const emailVal = watch('email');
  const passwordVal = watch('password');
  const confirmPasswordVal = watch('confirmPassword');

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

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push('/onboarding');
        return;
      }

      router.push('/onboarding');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="clinicName" className="mb-1 block text-sm text-muted-foreground">
          Enter Facility Name
        </label>
        <input
          id="clinicName"
          type="text"
          autoFocus
          autoComplete="organization"
          className={`h-11 w-full rounded-sm border border-input px-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${clinicNameVal ? 'bg-inverse-on-surface' : 'bg-card'}`}
          {...register('clinicName')}
        />
        {errors.clinicName && (
          <p className="mt-1 text-sm text-destructive">{errors.clinicName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
          Enter Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={`h-11 w-full rounded-sm border border-input px-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${emailVal ? 'bg-inverse-on-surface' : 'bg-card'}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-muted-foreground">
          Choose Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={`h-11 w-full rounded-sm border border-input pr-10 pl-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${passwordVal ? 'bg-inverse-on-surface' : 'bg-card'}`}
            {...register('password')}
          />
          {passwordVal ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm text-muted-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={`h-11 w-full rounded-sm border border-input pr-10 pl-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${confirmPasswordVal ? 'bg-inverse-on-surface' : 'bg-card'}`}
            {...register('confirmPassword')}
          />
          {confirmPasswordVal ? (
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
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
