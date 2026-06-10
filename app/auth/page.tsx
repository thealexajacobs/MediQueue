'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import Link from 'next/link';

const MODE_CONFIG = {
  login: {
    heading: 'Welcome back',
    supporting: 'Sign in to manage your queues.',
  },
  register: {
    heading: 'Create your account',
    supporting: 'Set up your clinic in minutes.',
  },
} as const;

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') ?? 'login';
  const cfg = MODE_CONFIG[mode as keyof typeof MODE_CONFIG] ?? MODE_CONFIG.login;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-[#0a0f1e] via-[#141b3d] to-[#0a0f1e] p-10 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30">
            M
          </Link>
          <Link href="/" className="text-sm font-semibold text-white">MediQueue</Link>
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
        <div className="w-full max-w-md pl-4 pr-10 py-6">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
                {cfg.heading}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{cfg.supporting}</p>
            </div>

            <div className="rounded-xl bg-background p-6">
              {mode === 'login' && <LoginForm />}
              {mode === 'register' && <RegisterForm />}
            </div>

            {mode === 'login' && (
              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/onboarding?fresh=1" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  Create an account
                </Link>
              </p>
            )}
            {mode === 'register' && (
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth?mode=login" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
