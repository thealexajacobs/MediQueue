'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export function AuthPageContent() {
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
