'use client';

import { useState, type ComponentProps } from 'react';
import Link from 'next/link';
import {
  Users, BarChart3, Smartphone, Monitor, ArrowLeft,
  LayoutDashboard, CheckCircle2, Clock, TrendingUp, Activity,
} from 'lucide-react';
import { CurrentPatientHero } from '@/components/dashboard/CurrentPatientHero';
import { QueueMetricsRow } from '@/components/dashboard/QueueMetricsRow';
import { QueueProgress } from '@/components/dashboard/QueueProgress';
import { LiveActivity } from '@/components/dashboard/LiveActivity';
import { EntryStatus, type QueueEntryDTO, type QueueDTO } from '@/types';

const DEMO_QUEUES: QueueDTO[] = [
  { id: 'demo-gc', facilityId: 'demo', name: 'General Consultation', status: 0 as unknown as never, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'demo-dental', facilityId: 'demo', name: 'Dental', status: 0 as unknown as never, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'demo-peds', facilityId: 'demo', name: 'Pediatrics', status: 0 as unknown as never, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
];

const SERVING_ENTRY: QueueEntryDTO = {
  id: 'demo-serving',
  queueId: 'demo-gc',
  patientName: 'Robert Chen',
  phone: null,
  queueNumber: 4,
  status: EntryStatus.SERVING,
  position: 1,
  createdAt: new Date(Date.now() - 8 * 60000),
  updatedAt: new Date(Date.now() - 2 * 60000),
};

const WAITING_ENTRIES: QueueEntryDTO[] = [
  {
    id: 'demo-w1', queueId: 'demo-gc', patientName: 'John Smith', phone: null,
    queueNumber: 2, status: EntryStatus.WAITING, position: 1,
    createdAt: new Date(Date.now() - 15 * 60000), updatedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'demo-w2', queueId: 'demo-gc', patientName: 'Maria Garcia', phone: null,
    queueNumber: 3, status: EntryStatus.WAITING, position: 2,
    createdAt: new Date(Date.now() - 12 * 60000), updatedAt: new Date(Date.now() - 12 * 60000),
  },
  {
    id: 'demo-w3', queueId: 'demo-gc', patientName: 'Emily Davis', phone: null,
    queueNumber: 5, status: EntryStatus.WAITING, position: 3,
    createdAt: new Date(Date.now() - 25 * 60000), updatedAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: 'demo-w4', queueId: 'demo-gc', patientName: 'James Wilson', phone: null,
    queueNumber: 6, status: EntryStatus.WAITING, position: 4,
    createdAt: new Date(Date.now() - 32 * 60000), updatedAt: new Date(Date.now() - 32 * 60000),
  },
  {
    id: 'demo-w5', queueId: 'demo-gc', patientName: 'Lisa Brown', phone: null,
    queueNumber: 7, status: EntryStatus.WAITING, position: 5,
    createdAt: new Date(Date.now() - 45 * 60000), updatedAt: new Date(Date.now() - 45 * 60000),
  },
];

const COMPLETED_ENTRIES: QueueEntryDTO[] = [
  {
    id: 'demo-c1', queueId: 'demo-gc', patientName: 'Sarah Johnson', phone: null,
    queueNumber: 1, status: EntryStatus.COMPLETED, position: 0,
    createdAt: new Date(Date.now() - 60 * 60000), updatedAt: new Date(Date.now() - 35 * 60000),
  },
  {
    id: 'demo-c2', queueId: 'demo-gc', patientName: 'Michael Torres', phone: null,
    queueNumber: 8, status: EntryStatus.COMPLETED, position: 0,
    createdAt: new Date(Date.now() - 90 * 60000), updatedAt: new Date(Date.now() - 65 * 60000),
  },
  {
    id: 'demo-c3', queueId: 'demo-gc', patientName: 'Amanda Lee', phone: null,
    queueNumber: 9, status: EntryStatus.COMPLETED, position: 0,
    createdAt: new Date(Date.now() - 120 * 60000), updatedAt: new Date(Date.now() - 95 * 60000),
  },
];

const ALL_ENTRIES = [...WAITING_ENTRIES, SERVING_ENTRY, ...COMPLETED_ENTRIES];

const tabs = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patient' as const, label: 'Patient View', icon: Smartphone },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

const QUEUE_PERFORMANCE = [
  { name: 'General Consultation', served: 28, avgWait: '12' },
  { name: 'Dental', served: 14, avgWait: '18' },
  { name: 'Pediatrics', served: 9, avgWait: '22' },
];

const HOUR_LABELS = ['6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p'];
const HOURLY_DATA = [0, 2, 8, 14, 18, 22, 16, 20, 15, 10, 6, 3];


function DemoPatientView() {
  const entry = WAITING_ENTRIES[1];
  const serving = { queueNumber: 4, patientName: 'Robert Chen' };
  const waitingCount = 2;
  const totalInQueue = 5;
  const position = 2;

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl border border-border/20 bg-muted/[0.07] p-6 shadow-sm sm:p-8">
      <div className="space-y-10">

      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-600">Now Serving</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Queue Number</p>
        <p className="font-mono text-5xl font-black tracking-tighter text-foreground sm:text-6xl">
          #{String(entry.queueNumber).padStart(3, '0')}
        </p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{entry.patientName}</p>
      </div>

      <div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Your Position</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${totalInQueue > 1 ? ((position - 1) / (totalInQueue - 1)) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground/60">
          <span>Queue: {totalInQueue}</span>
          <span>{waitingCount} ahead of you</span>
        </div>
      </div>

      <div
        className="relative flex h-48 flex-col overflow-hidden rounded-2xl p-5 shadow-xl sm:h-56 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(200, 30%, 15%) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 drop-shadow-sm sm:text-xs">
                Now Serving
              </span>
            </div>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70 border border-white/10 backdrop-blur-md sm:text-xs">
              General Consultation
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[clamp(1.75rem,_4vw_+_0.5rem,_2.75rem)] leading-none font-black tracking-tighter text-white drop-shadow-lg">
              #{String(serving.queueNumber).padStart(3, '0')}
            </p>
            <p className="text-sm font-bold tracking-tight text-white/90 sm:text-base">
              {serving.patientName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm sm:text-xs">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              In consultation
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Checked In</p>
          </div>
          <span className="text-xs text-muted-foreground/50">Done</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">In Queue</p>
          </div>
          <span className="text-xs text-muted-foreground/50">Position {position}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/30 text-muted-foreground/50">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground/50">Currently Serving</p>
          </div>
          <span className="text-xs text-muted-foreground/30">In progress</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {waitingCount} ahead
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Est. 12 min
        </div>
      </div>

      </div>
      </div>
    </div>
  );
}

function DemoAnalytics() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Patients Today', value: '42', icon: Users },
          { label: 'Average Wait Time', value: '14m', icon: Clock },
          { label: 'Active Queues', value: '3', icon: Activity },
          { label: 'Completed Today', value: '38', icon: CheckCircle2 },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border/20 bg-card p-4 shadow-sm sm:rounded-2xl sm:p-5">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{m.value}</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground sm:text-sm sm:font-normal sm:tracking-normal">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-border/20 bg-card p-5 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm sm:font-semibold sm:tracking-normal">
            Hourly Activity
          </h2>
        </div>
        <div className="flex items-end gap-1 sm:gap-2">
          {HOURLY_DATA.map((count, i) => {
            const maxCount = Math.max(...HOURLY_DATA, 1);
            const heightPct = (count / maxCount) * 100;
            return (
              <div key={i} className="group relative flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
                  style={{ height: `${Math.max(heightPct, 4)}px` }}
                />
                <span className="mt-1.5 text-[8px] text-muted-foreground sm:text-[10px]">
                  {HOUR_LABELS[i]}
                </span>
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  {count} patients
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border/20 bg-card p-5 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm sm:font-semibold sm:tracking-normal">
            Queue Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/10">
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Queue Name</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Patients Served</th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Average Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {QUEUE_PERFORMANCE.map((q) => (
                <tr key={q.name} className="border-b border-border/5 last:border-none">
                  <td className="py-3 pr-4 font-medium text-foreground">{q.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{q.served}</td>
                  <td className="py-3 text-muted-foreground">{q.avgWait} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function DemoExperience() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patient' | 'analytics'>('dashboard');

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background elements */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[200px] w-[600px] -translate-x-1/2 bg-gradient-to-t from-primary/[0.02] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10">
        {/* Top bar */}
        <div className="flex h-14 items-center border-b border-border/[0.07] bg-background/70 backdrop-blur-xl px-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 border-b border-border/[0.07] bg-background/80 backdrop-blur-xl">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors sm:flex-initial sm:px-6 sm:py-4 sm:text-sm ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 pb-8 pt-6 sm:px-6">
          {activeTab === 'dashboard' && (
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-12 lg:flex-row lg:gap-6">
                <div className="min-w-0 flex-1 space-y-6">
                  <CurrentPatientHero
                    servingEntry={SERVING_ENTRY}
                    queueName="General Consultation"
                    waitingCount={WAITING_ENTRIES.length}
                    totalEntries={ALL_ENTRIES.length}
                  />
                  <QueueMetricsRow
                    waitingCount={WAITING_ENTRIES.length}
                    servingCount={1}
                    completedToday={COMPLETED_ENTRIES.length}
                    avgWaitTime={14}
                  />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
                    {[
                      { label: 'Add Patient', primary: false },
                      { label: 'Call Next', primary: true },
                      { label: 'Skip', primary: false },
                      { label: 'Complete', primary: false },
                    ].map((action) => (
                      <div
                        key={action.label}
                        className={`flex flex-row items-center justify-center gap-3 rounded-xl px-4 py-5 text-sm font-semibold sm:flex-col sm:items-center sm:justify-center sm:gap-2 sm:rounded-2xl sm:py-4 sm:text-xs ${
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
                <div className="flex w-full flex-col gap-6 lg:w-[300px]">
                  <QueueProgress entries={ALL_ENTRIES} />
                  <LiveActivity entries={ALL_ENTRIES} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patient' && (
            <DemoPatientView />
          )}

          {activeTab === 'analytics' && (
            <DemoAnalytics />
          )}
        </div>

        {/* Final CTA */}
        <section className="border-t border-border/[0.07] px-4 py-16 sm:px-6 sm:py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-8 text-center shadow-lg sm:p-16">
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-80 sm:w-80" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Ready to Modernize Your Facility Queue Experience?
              </h2>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base sm:text-lg">
                Get started free. No credit card required. Your clinic will be live in under a minute.
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
      </div>
    </div>
  );
}
