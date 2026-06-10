import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <FAQs />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20">
            M
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">MediQueue</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-8 md:flex">
          <a href="#features" className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
            Features
          </a>
          <a href="#how-it-works" className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
            How it works
          </a>
          <a href="#faqs" className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
            FAQs
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/auth?mode=login"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Sign in
          </Link>
          <Link
          href="/onboarding?fresh=1"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30"
        >
          Get started
        </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden pb-20 pt-16 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 bg-gradient-to-t from-primary/[0.03] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        Real-time queue management for clinics
      </div>

      <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Replace your queue board with a{' '}
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          live digital system
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        MediQueue gives your reception team a single, real-time dashboard to manage patients,
        reduce wait times, and keep everyone informed — no manual boards needed.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/onboarding?fresh=1"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
        >
          Start free trial
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link
          href="/auth?mode=login"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card/50 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted sm:w-auto"
        >
          Sign in
        </Link>
      </div>

    </section>
  );
}

const features = [
  {
    number: '01',
    title: 'Multi-queue dashboard',
    description: 'Manage multiple service lines from one screen. Switch between queues instantly without losing context.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'hover:border-blue-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Live patient view',
    description: 'Each patient gets a unique tracking link with QR code. They see their position, wait time, and queue status live.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'hover:border-green-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Real-time updates',
    description: 'Queue changes propagate in under 2 seconds via WebSockets. No page refreshes, no delays, no confusion.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'hover:border-purple-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'One-click actions',
    description: 'Call next, skip, or complete from a single, always-visible toolbar. Every action takes one click.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'hover:border-amber-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Queue analytics',
    description: 'Track patient volume, completion rates, and wait times to optimize your clinic flow and staffing.',
    gradient: 'from-rose-500/20 to-red-500/20',
    border: 'hover:border-rose-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Tenant-safe by design',
    description: 'Each clinic\'s data is fully isolated. Your patients\' information stays private and secure.',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    border: 'hover:border-teal-500/30',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your reception desk needs
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Built for speed. Designed for clarity. No clutter, no learning curve.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${feature.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: '1',
    title: 'Create your queues',
    description: 'Set up service lines for General Consultation, Lab, Pharmacy, or any department.',
  },
  {
    number: '2',
    title: 'Add patients in seconds',
    description: 'Type a name, optionally a phone number, and they\'re in the queue. A QR code prints automatically.',
  },
  {
    number: '3',
    title: 'Manage with one tap',
    description: 'Call next, skip, or mark complete. The dashboard updates live. Patients see their status in real time.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            Workflow
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Three steps to go from paper to digital.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-1 flex-col items-center text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
                {step.number}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-10 text-center shadow-lg sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to streamline your clinic?
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Get started free. No credit card required. Your clinic will be live in under a minute.
          </p>
          <div className="mt-10">
            <Link
              href="/auth?mode=register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Create your free account
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: 'How long does it take to set up?',
    a: 'Less than a minute. Create an account, name your first queue, and start adding patients.',
  },
  {
    q: 'Can I run multiple queues at the same time?',
    a: 'Yes. You can create separate queues for different departments — General Consultation, Lab, Pharmacy, etc. — and switch between them instantly.',
  },
  {
    q: 'Do patients need to download an app?',
    a: 'No. Each patient gets a web link (optionally via QR code) that works in any browser. No install required.',
  },
  {
    q: 'Is my clinic\'s data secure?',
    a: 'Yes. Each clinic operates in its own isolated tenant. All data is scoped by clinic ID server-side, and passwords are hashed with bcrypt (cost 12).',
  },
  {
    q: 'What happens if the internet goes down?',
    a: 'The dashboard uses a polling fallback every 5 seconds. Once connectivity is restored, everything syncs automatically.',
  },
];

function FAQs() {
  return (
    <section id="faqs" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            FAQs
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all open:border-primary/30 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                {faq.q}
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="border-t border-border/40 px-6 pb-5 pt-3">
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                M
              </div>
              <span className="text-sm font-semibold text-foreground">MediQueue</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Real-time queue management for clinics. Replace your manual queue board with a live digital system.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a></li>
              <li><a href="#faqs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQs</a></li>
              <li><Link href="/auth?mode=register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Get started</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Account</h4>
            <ul className="space-y-3">
              <li><Link href="/auth?mode=login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign in</Link></li>
              <li><Link href="/auth?mode=register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Register</Link></li>
            </ul>
          </div>


        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MediQueue. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Built for clinic reception teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
