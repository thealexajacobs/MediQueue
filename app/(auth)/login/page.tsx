import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your queues.</p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
