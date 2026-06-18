import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <ProductShowcase />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-4 pb-16 pt-20 sm:pb-24 sm:pt-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft Ambient Gradient - main atmospheric glow */}
        <div className="absolute left-1/2 top-[35%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute left-1/2 top-[55%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--color-primary-container)/0.06)] blur-[100px]" />

        {/* Elegant Queue Flow Lines - curved paths suggesting movement */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M-80 250 Q 200 150, 360 280 T 640 300 T 920 260 T 1200 320 T 1520 280" stroke="hsl(var(--primary)/0.07)" strokeWidth="1" fill="none" />
          <path d="M-80 420 Q 250 320, 420 450 T 700 470 T 980 430 T 1260 490 T 1520 450" stroke="hsl(var(--primary)/0.05)" strokeWidth="0.75" fill="none" />
          <path d="M-80 580 Q 300 480, 480 610 T 760 630 T 1040 590 T 1320 650 T 1520 610" stroke="hsl(var(--primary)/0.04)" strokeWidth="0.5" fill="none" />
          <path d="M-80 720 Q 350 620, 530 750 T 810 770 T 1090 730 T 1370 790 T 1520 750" stroke="hsl(var(--primary)/0.03)" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Soft Glow Elements behind dashboard area */}
        <div className="absolute left-1/2 top-[55%] h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--color-primary-container)/0.05)] blur-[100px]" />
        <div className="absolute left-[55%] top-[58%] h-[200px] w-[200px] rounded-full bg-[hsl(var(--color-secondary-container)/0.04)] blur-[80px]" />

        {/* Dashboard Focus Halo - draws eye to product preview */}
        <div className="absolute left-1/2 top-[56%] h-[240px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[90px]" />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        {/* Bottom fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Real-Time Medical Facility Queue Management
        </div>

        <h1 className="text-[clamp(1.75rem,_1.25rem_+_3.5vw,_3.75rem)] font-bold leading-[1.05] tracking-tight text-foreground">
          Manage Patient Queues Without{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            the Waiting Room Chaos
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg sm:leading-relaxed">
          MediQueue gives your reception team a real-time dashboard to manage walk-in patients,
          reduce wait times, and keep everyone informed — no manual boards, no crowded lobbies.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
          <Link
            href="/auth?mode=register"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 sm:w-auto"
          >
            Get Started
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/50 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted sm:w-auto"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardShowcaseMockup() {
  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="flex h-10 items-center justify-between border-b border-border/10 bg-background px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[8px] font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <span className="text-[10px] font-semibold text-foreground">MediQueue</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-1.5 py-0.5">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          <span className="text-[8px] font-medium text-muted-foreground">City Medical Center</span>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-1 border-b border-border/10 px-3 sm:px-4">
        {['General', 'Dental', 'Pediatrics'].map((tab, i) => (
          <button
            key={tab}
            className={`relative shrink-0 whitespace-nowrap px-2 py-2 text-[9px] font-medium transition-colors sm:px-3 sm:text-[10px] ${
              i === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {i === 0 && <span className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* Dashboard Content - no sidebar */}
      <div className="p-3 space-y-3 sm:p-4 sm:space-y-4">
        {/* Current Patient Hero */}
        <div
          className="relative flex h-36 flex-col overflow-hidden rounded-xl p-3 shadow-xl sm:h-44 sm:p-4"
          style={{
            background: 'linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(200,30%,15%) 100%)',
          }}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-[60px]" />
          <div className="relative z-10 flex flex-1 flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-400 sm:text-[10px]">
                  Now Serving
                </span>
              </div>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[7px] font-semibold text-white/70 backdrop-blur-md sm:text-[9px]">
                General Consultation
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="font-mono text-[clamp(1.5rem,_2vw_+_0.5rem,_2.5rem)] leading-none font-black tracking-tighter text-white drop-shadow-lg">
                #003
              </span>
              <span className="pb-0.5 text-xs font-bold tracking-tight text-white/90 sm:text-sm">
                Sarah Johnson
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[7px] font-semibold text-emerald-400 backdrop-blur-sm sm:text-[9px]">
                In consultation
              </span>
              <span className="text-[8px] font-medium text-white/40 sm:text-[10px]">Waiting 12m</span>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: '12', label: 'Waiting' },
            { value: '1', label: 'Serving' },
            { value: '87', label: 'Completed' },
            { value: '14m', label: 'Avg Wait' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border/20 bg-card/60 p-2 backdrop-blur-md sm:rounded-xl sm:p-3"
            >
              <p className="text-sm font-bold tracking-tight text-foreground sm:text-base">{metric.value}</p>
              <p className="mt-0.5 text-[8px] font-medium text-muted-foreground sm:text-[10px]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2">
          {[
            { label: 'Add Patient', primary: false },
            { label: 'Call Next', primary: true },
            { label: 'Skip', primary: false },
            { label: 'Complete', primary: false },
          ].map((action) => (
            <div
              key={action.label}
              className={`flex flex-row items-center justify-center gap-2 rounded-lg px-3 py-3 text-[10px] font-semibold sm:flex-col sm:justify-center sm:gap-1.5 sm:rounded-xl sm:py-3 sm:text-[10px] ${
                action.primary
                  ? 'bg-primary text-primary-foreground shadow-sm col-span-2 sm:col-span-1'
                  : 'border border-border/30 bg-card text-muted-foreground'
              }`}
            >
              <span>{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-border/10 bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <span className="text-xs font-semibold text-foreground">MediQueue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/20 bg-card text-[10px] text-muted-foreground">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1">
            <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] font-medium text-muted-foreground">City Medical Center</span>
          </div>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-1 border-b border-border/10 px-4 sm:px-6">
        {['General Consultation', 'Dental', 'Pediatrics'].map((tab, i) => (
          <button
            key={tab}
            className={`relative shrink-0 whitespace-nowrap px-3 py-2.5 text-[11px] font-medium transition-colors sm:px-4 sm:py-3 sm:text-xs ${
              i === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {i === 0 && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
        <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border/40 text-muted-foreground">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
        {/* Left Column */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Current Patient Hero */}
          <div
            className="relative flex h-36 flex-col overflow-hidden rounded-xl p-4 shadow-xl sm:h-52 sm:p-6"
            style={{
              background: 'linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(200,30%,15%) 100%)',
            }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]" />
            <div className="relative z-10 flex flex-1 flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 sm:text-xs">
                    Now Serving
                  </span>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur-md sm:text-xs">
                  General Consultation
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span className="font-mono text-[clamp(2rem,_4vw_+_0.5rem,_3.5rem)] leading-none font-black tracking-tighter text-white drop-shadow-lg">
                  #003
                </span>
                <span className="pb-1 text-sm font-bold tracking-tight text-white/90 sm:text-lg">
                  Sarah Johnson
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm sm:text-xs">
                  In consultation
                </span>
                <span className="text-[10px] font-medium text-white/40 sm:text-xs">Waiting 12m</span>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { value: '12', label: 'Waiting' },
              { value: '1', label: 'Serving' },
              { value: '87', label: 'Completed Today' },
              { value: '14m', label: 'Avg Wait Time' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="relative overflow-hidden rounded-xl border border-border/20 bg-card/60 p-3 backdrop-blur-md sm:rounded-2xl sm:p-4"
              >
                <p className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">{metric.value}</p>
                <p className="mt-0.5 text-[9px] font-medium tracking-wider text-muted-foreground sm:text-[10px]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Add Patient', primary: false },
              { label: 'Call Next', primary: true },
              { label: 'Skip', primary: false },
              { label: 'Complete', primary: false },
            ].map((action) => (
              <div
                key={action.label}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[10px] font-semibold transition-all sm:gap-2 sm:rounded-2xl sm:py-4 sm:text-xs ${
                  action.primary
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/30 bg-card text-muted-foreground'
                }`}
              >
                <span>{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex w-full flex-col gap-4 sm:w-[260px] lg:w-[300px]">
          {/* Next Up */}
          <div className="rounded-xl border border-border/20 bg-card/60 p-4 backdrop-blur-md sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                Next Up
              </h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                3 waiting
              </span>
            </div>
            <div className="mt-3 space-y-1">
              {[
                { name: 'John Smith', number: '#002', time: '5m ago' },
                { name: 'Jane Doe', number: '#004', time: '12m ago' },
                { name: 'Bob Wilson', number: '#005', time: '18m ago' },
              ].map((entry) => (
                <div
                  key={entry.number}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-[10px] font-bold text-muted-foreground shadow-sm">
                    {entry.number.slice(1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-muted-foreground/60">{entry.number} </span>
                    <span className="text-xs font-semibold text-foreground">{entry.name}</span>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground/50">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity */}
          <div className="rounded-xl border border-border/20 bg-card/60 p-4 backdrop-blur-md sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                Live Activity
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="mt-3 space-y-1">
              {[
                { event: 'Patient Added', name: 'Sarah Johnson', time: 'now' },
                { event: 'Patient Called', name: '#003 John Smith', time: '3m ago' },
                { event: 'Patient Completed', name: '#002 Jane Doe', time: '12m ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{activity.event}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/60">{activity.name}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground/50">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSolution() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
            Long Waiting Rooms Create Frustration
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            For both patients and medical facility staff. Here&apos;s how MediQueue changes that.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8">
          {/* Problems */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-destructive sm:text-sm">The Problem</h3>
            <div className="space-y-3">
              {[
                { title: 'Patients repeatedly asking for updates', desc: 'Front desk spends hours answering "How much longer?"' },
                { title: 'Crowded waiting areas', desc: 'No visibility means everyone stays in the lobby to avoid missing their turn.' },
                { title: 'Manual queue tracking', desc: 'Paper lists, whiteboards, or mental notes — error-prone and stressful.' },
                { title: 'Inefficient medical facility operations', desc: 'No data on wait times, no insight into patient flow bottlenecks.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm sm:p-5"
                >
                  <h4 className="text-sm font-semibold text-foreground sm:text-base">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">The Solution</h3>
            <div className="space-y-3">
              {[
                { title: 'Real-time queue visibility', desc: 'Patients check their position from their phone — no more asking the front desk.' },
                { title: 'QR-based queue access', desc: 'Scan a code on arrival. No app, no sign-up, no friction.' },
                { title: 'Faster queue management', desc: 'One-click call, skip, and complete from a single dashboard.' },
                { title: 'Better patient experience', desc: 'Shorter perceived wait times, less anxiety, happier patients.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm sm:p-5"
                >
                  <h4 className="text-sm font-semibold text-foreground sm:text-base">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Add Patient',
      description: 'Receptionist adds a walk-in patient. Name, optional phone — that\'s it. They\'re in the queue instantly.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      ),
    },
    {
      number: '2',
      title: 'Share Queue Link',
      description: 'Patient receives a QR code or unique tracking link. No app download required.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
        </svg>
      ),
    },
    {
      number: '3',
      title: 'Track in Real Time',
      description: 'Patient follows their queue progress from their phone. Live updates, no refresh needed.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            Simple Workflow
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Three simple steps to go from paper to digital queue management.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-3 sm:gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 z-0 hidden h-px w-[calc(100%+3rem)] -translate-y-1/2 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent sm:block" />
              )}
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
                {step.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground sm:text-lg">{step.title}</h3>
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

function Features() {
  const features = [
    {
      title: 'Real-Time Queue Updates',
      description: 'Patients always know their position. Queue changes propagate in under 2 seconds via WebSockets.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      ),
    },
    {
      title: 'QR Code Access',
      description: 'No app download required. Each patient gets a unique web link and QR code that works in any browser.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
        </svg>
      ),
    },
    {
      title: 'Multi-Queue Management',
      description: 'Manage multiple medical facility services from one screen. Switch between departments instantly.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
        </svg>
      ),
    },
    {
      title: 'Queue Analytics',
      description: 'Understand patient flow and wait times. Track volume, completion rates, and optimize staffing.',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border/30 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            Key Features
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
            Everything Your Medical Facility Needs
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Built for speed. Designed for clarity. No clutter, no learning curve.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border border-border/20 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:rounded-2xl sm:p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground sm:text-base">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section id="analytics" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
            See MediQueue in Action
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Three screens that transform how your medical facility manages patient flow.
          </p>
        </div>

        <div className="mt-10 space-y-20 sm:mt-14 sm:space-y-32">
          {/* Dashboard */}
          <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-12">
            <div>
              <h3 className="text-lg font-bold text-foreground sm:text-2xl">Live Operations Dashboard</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Everything your reception team needs on one screen. See who&apos;s next, call patients forward,
                and track queue status — all with zero page refreshes.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'One-click call, skip, and complete',
                  'Real-time metrics: waiting, serving, completed',
                  'Switch between departments instantly',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
              </div>
              <div className="relative overflow-hidden rounded-xl border border-border/20 bg-background sm:rounded-2xl">
                <DashboardShowcaseMockup />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-12">
            <div className="order-last sm:order-first">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-4">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
                </div>
                <div className="relative overflow-hidden rounded-xl border border-border/20 bg-background sm:rounded-2xl">
                  <AnalyticsMockup />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground sm:text-2xl">Queue Analytics</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Understand patient flow with lightweight operational insights. Track wait times, completion rates,
                and daily activity — no complex reporting needed.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Patients today, average wait time, active queues',
                  'Per-queue performance breakdown',
                  'Hourly activity patterns',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Patient View */}
          <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-12">
            <div>
              <h3 className="text-lg font-bold text-foreground sm:text-2xl">Patient Queue Tracking</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Patients check their position from any device. No app, no sign-up — just scan the QR code or open
                their unique tracking link.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Live position and estimated wait time',
                  'See who is currently being served',
                  'Real-time updates via WebSocket',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
              </div>
              <div className="relative overflow-hidden rounded-xl border border-border/20 bg-background sm:rounded-2xl">
                <PatientViewMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsMockup() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Analytics</h3>
          <p className="text-xs text-muted-foreground">Today&apos;s overview</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/20 bg-card px-2 py-1">
          <span className="text-[10px] font-medium text-muted-foreground">Today</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { value: '42', label: 'Patients Today' },
          { value: '14m', label: 'Avg Wait' },
          { value: '4', label: 'Active Queues' },
          { value: '38', label: 'Completed' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border/20 bg-card/60 p-2 text-center sm:p-3">
            <p className="text-sm font-bold text-foreground sm:text-base">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground sm:text-[10px]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border/20 bg-card/60 p-3 sm:p-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
          Hourly Activity
        </h4>
        <div className="mt-3 flex items-end gap-1 sm:gap-2">
          {[30, 45, 25, 60, 55, 40, 70, 65, 50, 35, 20, 15].map((h, i) => {
            const hours = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
                  style={{ height: `${(h / 70) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[8px] text-muted-foreground sm:text-[10px]">{hours[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PatientViewMockup() {
  return (
    <div className="flex flex-col p-4 sm:p-6">
      <div className="flex items-center justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm">
          M
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">Now Serving</span>
        </div>

        <p className="mt-4 font-mono text-3xl font-black tracking-tighter text-foreground">#003</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">Sarah Johnson</p>

        <div className="mx-auto mt-6 max-w-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Your Position</span>
            <span>Est. Wait: ~12 min</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/5 rounded-full bg-primary transition-all" />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
            <span>Queue: 12</span>
            <span>3 ahead of you</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {[
            { label: 'Checked In', time: '9:30 AM', done: true },
            { label: 'Moved to Position 3', time: '9:32 AM', done: true },
            { label: 'Currently Serving', time: 'In progress', done: false },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  step.done ? 'bg-primary/10 text-primary' : 'border border-border/30 text-muted-foreground/50'
                }`}
              >
                {step.done ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-xs font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {step.label}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground/50">{step.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-8 text-center shadow-lg sm:p-16">
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-80 sm:w-80" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
            Modernize Your Medical Facility Queue Experience
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base sm:text-lg">
            Get started free. No credit card required. Your medical facility will be live in under a minute.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/auth?mode=register"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-10 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              Get Started
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


