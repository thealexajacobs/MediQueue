'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import Link from 'next/link';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') ?? 'login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-bold text-foreground hover:text-primary transition-colors">
          MediQueue
        </Link>
        <p className="mt-2 text-muted-foreground">
          {mode === 'login' && 'Sign in to manage your queues'}
          {mode === 'register' && 'Create your MediQueue account'}
          {mode === 'forgot-password' && 'Enter your email to reset your password'}
        </p>
      </div>

      <div className="flex w-full max-w-sm rounded-lg border border-border bg-card p-1 mb-6">
        <Link
          href="/auth?mode=login"
          className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
            mode === 'login' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign in
        </Link>
        <Link
          href="/auth?mode=register"
          className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
            mode === 'register' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Register
        </Link>
      </div>

      {mode === 'login' && <LoginForm />}
      {mode === 'register' && <RegisterForm />}

      {mode === 'login' && (
        <p className="mt-6 text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth?mode=register" className="text-primary hover:underline">
            Register your clinic
          </Link>
        </p>
      )}
      {mode === 'register' && (
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth?mode=login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
