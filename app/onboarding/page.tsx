import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ fresh?: string }>;
}) {
  const { fresh } = await searchParams;

  if (fresh === '1') {
    return <OnboardingPageLayout><OnboardingFlow /></OnboardingPageLayout>;
  }

  let session;

  try {
    session = await auth();
  } catch (err) {
    console.error('[onboarding] auth() failed:', err);
    return <OnboardingPageLayout><OnboardingFlow /></OnboardingPageLayout>;
  }

  if (!session?.user) {
    return <OnboardingPageLayout><OnboardingFlow /></OnboardingPageLayout>;
  }

  const queueCount = await prisma.queue.count({
    where: { clinicId: session.user.clinicId },
  });

  if (queueCount > 0) redirect('/dashboard');

  return (
    <OnboardingPageLayout>
      <OnboardingFlow skipRegistration initialStep={2} />
    </OnboardingPageLayout>
  );
}

function OnboardingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-[#0a0f1e] via-[#141b3d] to-[#0a0f1e] p-10 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30">
            M
          </div>
          <span className="text-sm font-semibold text-white">MediQueue</span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center -mt-14">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Modern queue management,
            <br />
            <span className="text-primary/90">built for healthcare.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Streamline patient flow with real-time queue management.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Real-time patient queue updates',
              'Automated check-in and notifications',
              'Comprehensive analytics and reporting',
              'Multi-department queue management',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M13.3 4.3L6 11.6 2.7 8.3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background">
        <div className="w-full max-w-xl px-10 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
