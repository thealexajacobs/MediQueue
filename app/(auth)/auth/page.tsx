import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthPageContent } from '@/features/auth/components/AuthPageContent';

export default function AuthPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="mx-auto h-64 w-full max-w-sm animate-pulse rounded-sm bg-muted" />}>
        <AuthPageContent />
      </Suspense>
    </AuthLayout>
  );
}
