'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/register';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  function markCompleted(field: keyof RegisterInput) {
    return () => {
      if (getValues(field)?.toString().trim()) {
        setCompleted((prev) => ({ ...prev, [field]: true }));
      }
    };
  }

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: data.clinicName,
          name: data.name,
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
          Enter Clinic Name
        </label>
        <input
          id="clinicName"
          type="text"
          autoFocus
          autoComplete="organization"
          className={`h-11 w-full rounded-sm border border-input px-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${completed.clinicName ? 'bg-inverse-on-surface' : 'bg-card'}`}
          {...register('clinicName', { onBlur: markCompleted('clinicName') })}
        />
        {errors.clinicName && (
          <p className="mt-1 text-sm text-destructive">{errors.clinicName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-muted-foreground">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={`h-11 w-full rounded-sm border border-input px-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${completed.name ? 'bg-inverse-on-surface' : 'bg-card'}`}
          {...register('name', { onBlur: markCompleted('name') })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
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
          className={`h-11 w-full rounded-sm border border-input px-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0 ${completed.email ? 'bg-inverse-on-surface' : 'bg-card'}`}
          {...register('email', { onBlur: markCompleted('email') })}
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
            className="h-11 w-full rounded-sm border border-input bg-card pr-10 pl-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
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
            className="h-11 w-full rounded-sm border border-input bg-card pr-10 pl-3 text-foreground placeholder:text-muted-foreground transition-all duration-[400ms] focus:ring-2 focus:ring-primary focus:ring-offset-0"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
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
