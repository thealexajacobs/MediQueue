'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/login';
import { authenticate } from '@/features/auth/actions/login';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const passwordValue = watch('password', '');
  const hasPassword = !!passwordValue;

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError(null);

    const result = await authenticate(data.email, data.password);

    if ('error' in result) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  function clearError() {
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-4">
      {error && (
        <div className="rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder=" "
          className="h-11 w-full rounded-sm border border-input bg-card px-3 text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-primary focus:bg-card [&:not(:placeholder-shown):not(:focus)]:bg-muted/85"

          onFocus={clearError}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() => router.push('/auth?mode=forgot-password')}
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder=" "
            className="h-11 w-full rounded-sm border border-input bg-card pr-10 pl-3 text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-primary focus:bg-card [&:not(:placeholder-shown):not(:focus)]:bg-muted/85"

            onFocus={clearError}
            {...register('password')}
          />
          {hasPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 items-center justify-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
      </button>
    </form>
  );
}
