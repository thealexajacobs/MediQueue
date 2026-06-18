import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthPageContent } from '@/features/auth/components/AuthPageContent';

export default function AuthPage() {
  return (
    <AuthLayout>
      <AuthPageContent />
    </AuthLayout>
  );
}
