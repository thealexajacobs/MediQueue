import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ fresh?: string }>;
}) {
  const { fresh } = await searchParams;

  if (fresh === '1') {
    return <AuthLayout><OnboardingFlow /></AuthLayout>;
  }

  let session;

  try {
    session = await auth();
  } catch (err) {
    console.error('[onboarding] auth() failed:', err);
    return <AuthLayout><OnboardingFlow /></AuthLayout>;
  }

  if (!session?.user) {
    return <AuthLayout><OnboardingFlow /></AuthLayout>;
  }

  const queueCount = await prisma.queue.count({
    where: { clinicId: session.user.clinicId },
  });

  if (queueCount > 0) redirect('/dashboard');

  return (
    <AuthLayout>
      <OnboardingFlow skipRegistration initialStep={2} />
    </AuthLayout>
  );
}
