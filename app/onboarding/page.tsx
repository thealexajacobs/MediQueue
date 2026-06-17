import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AuthLayout } from '@/components/auth/AuthLayout';
import dynamicNext from 'next/dynamic';

const OnboardingFlow = dynamicNext(
  () => import('@/components/onboarding/OnboardingFlow').then((m) => m.OnboardingFlow),
  { loading: () => <div className="mx-auto h-96 w-full max-w-md animate-pulse rounded-sm bg-muted" /> }
);

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  let session;

  try {
    session = await auth();
  } catch (err) {
    console.error('[onboarding] auth() failed:', err);
    return <AuthLayout><OnboardingFlow /></AuthLayout>;
  }

  if (!session?.user) return <AuthLayout><OnboardingFlow /></AuthLayout>;

  const queueCount = await prisma.queue.count({
    where: { facilityId: session.user.facilityId },
  });

  if (queueCount > 0) redirect('/dashboard');

  return <AuthLayout><OnboardingFlow /></AuthLayout>;
}
