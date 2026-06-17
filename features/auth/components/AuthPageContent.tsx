'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(
  () => import('@/features/auth/components/LoginForm').then((m) => m.LoginForm),
  { loading: () => <div className="mx-auto h-64 w-full max-w-sm animate-pulse rounded-sm bg-muted" /> }
);

const RegisterForm = dynamic(
  () => import('@/features/auth/components/RegisterForm').then((m) => m.RegisterForm),
  { loading: () => <div className="mx-auto h-80 w-full max-w-sm animate-pulse rounded-sm bg-muted" /> }
);

const ForgotPasswordForm = dynamic(
  () => import('@/features/auth/components/ForgotPasswordForm').then((m) => m.ForgotPasswordForm),
  { loading: () => <div className="mx-auto h-48 w-full max-w-sm animate-pulse rounded-sm bg-muted" /> }
);

const ResetPasswordForm = dynamic(
  () => import('@/features/auth/components/ResetPasswordForm').then((m) => m.ResetPasswordForm),
  { loading: () => <div className="mx-auto h-64 w-full max-w-sm animate-pulse rounded-sm bg-muted" /> }
);

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-6">
      {mode === 'login' && (
        <>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your queues.</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="/auth?mode=register" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
              Create one
            </a>
          </p>
        </>
      )}

      {mode === 'register' && (
        <>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Create an account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Set up your facility to get started.</p>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/auth" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
              Sign in
            </a>
          </p>
        </>
      )}

      {mode === 'forgot-password' && <ForgotPasswordForm />}
      {mode === 'reset-password' && <ResetPasswordForm />}
    </div>
  );
}

export function AuthPageContent() {
  return (
    <Suspense fallback={<div className="mx-auto h-64 w-full max-w-sm animate-pulse rounded-sm bg-muted" />}>
      <AuthContent />
    </Suspense>
  );
}
