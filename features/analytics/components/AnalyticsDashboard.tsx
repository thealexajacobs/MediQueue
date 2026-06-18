'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { BarChart3, TrendingUp, ArrowLeft, ChevronDown } from 'lucide-react';
import type { HourlyBucket, DailyBucket } from '@/features/analytics/hooks/useAnalytics';

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7', label: 'Last 7 Days' },
] as const;

const HOUR_LABELS = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

function formatDayLabel(label: string): string {
  const d = new Date(label + 'T12:00:00Z');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (label === todayStr) return 'Today';
  if (label === yesterdayStr) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState('today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, error, isError } = useAnalytics(period);

  const currentLabel = PERIODS.find((p) => p.value === period)?.label ?? 'Today';

  const maxChartCount = useMemo(() => {
    if (!data?.chartData?.buckets?.length) return 1;
    return Math.max(...data.chartData.buckets.map((b: HourlyBucket | DailyBucket) => b.count), 1);
  }, [data]);

  const queuePerformance = data?.queuePerformance ?? [];
  const hasData = data != null && ((data.summary.totalPatients ?? 0) > 0 || (data.summary.totalCompleted ?? 0) > 0);
  const summary = data?.summary;
  const chartData = data?.chartData;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[200px] w-[600px] -translate-x-1/2 bg-gradient-to-t from-primary/[0.02] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10">
        <div className="flex h-14 items-center border-b border-border/[0.07] bg-background/70 backdrop-blur-xl px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
              <p className="text-xs text-muted-foreground">{currentLabel}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border/20 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground backdrop-blur-sm transition-colors"
              >
                {currentLabel}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-lg border border-border/20 bg-card shadow-lg backdrop-blur-xl overflow-hidden">
                    {PERIODS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => { setPeriod(p.value); setDropdownOpen(false); }}
                        className={`block w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-muted ${
                          period === p.value ? 'text-foreground bg-muted/50' : 'text-muted-foreground'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {isError ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <BarChart3 className="h-8 w-8 text-destructive/60" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Failed to load analytics</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : !hasData ? (
            !data ? (
              <>
                <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-border/20 bg-card/60 p-4 sm:rounded-2xl sm:p-5">
                      <div className="h-8 w-16 rounded bg-muted sm:h-9" />
                      <div className="mt-2 h-3 w-20 rounded bg-muted" />
                    </div>
                  ))}
                </div>
                <div className="mb-8 animate-pulse rounded-xl border border-border/20 bg-card/60 p-5 sm:rounded-2xl sm:p-6">
                  <div className="mb-4 h-4 w-28 rounded bg-muted" />
                  <div className="flex items-end gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div className="w-full rounded-sm bg-muted" style={{ height: `${20 + Math.sin(i) * 30 + 10}px` }} />
                        <div className="h-3 w-4 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="animate-pulse rounded-xl border border-border/20 bg-card/60 p-5 sm:rounded-2xl sm:p-6">
                  <div className="mb-4 h-4 w-32 rounded bg-muted" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-4 flex-1 rounded bg-muted" />
                        <div className="h-4 w-16 rounded bg-muted" />
                        <div className="h-4 w-12 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <BarChart3 className="h-8 w-8 text-primary/60" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">No analytics yet</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  No queue activity has been recorded for this period. Analytics will appear once patients begin moving through queues.
                </p>
              </div>
            )
          ) : (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: 'Patients Served', value: summary?.totalPatients ?? 0 },
                  { label: 'Average Wait Time', value: summary ? `${summary.averageWaitTime}m` : '0m' },
                  { label: 'Active Queues', value: summary?.activeQueues ?? 0 },
                  { label: 'Completed Patients', value: summary?.totalCompleted ?? 0 },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/20 bg-card/60 p-4 shadow-sm backdrop-blur-md sm:rounded-2xl sm:p-5">
                    <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{m.value}</p>
                    <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground sm:text-sm sm:font-normal sm:tracking-normal">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-8 rounded-xl border border-border/20 bg-card/60 p-5 shadow-sm backdrop-blur-md sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm sm:font-semibold sm:tracking-normal">
                    {chartData!.type === 'daily' ? 'Daily Activity' : 'Hourly Activity'}
                  </h2>
                </div>
                {!chartData!.buckets?.length || chartData!.buckets.every((b: HourlyBucket | DailyBucket) => b.count === 0) ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded for this period.</p>
                ) : (
                  <div className="flex items-end gap-1 sm:gap-2">
                    {(chartData!.buckets ?? []).map((b: HourlyBucket | DailyBucket, i: number) => {
                      const count = b.count;
                      const heightPct = maxChartCount > 0 ? (count / maxChartCount) * 100 : 0;
                      const label = chartData!.type === 'daily'
                        ? formatDayLabel((b as DailyBucket).label)
                        : HOUR_LABELS[(b as HourlyBucket).hour];
                      return (
                        <div key={i} className="group relative flex flex-1 flex-col items-center">
                          <div
                            className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
                            style={{ height: `${Math.max(heightPct, 4)}px` }}
                          />
                          <span className="mt-1.5 text-[8px] text-muted-foreground sm:text-[10px]">
                            {label}
                          </span>
                          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                            {count} patients
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border/20 bg-card/60 p-5 shadow-sm backdrop-blur-md sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm sm:font-semibold sm:tracking-normal">
                    Queue Performance
                  </h2>
                </div>
                {queuePerformance.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No queue data available.</p>
                ) : (
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
                        {queuePerformance.map((q) => (
                          <tr key={q.name} className="border-b border-border/5 last:border-none">
                            <td className="py-3 pr-4 font-medium text-foreground">{q.name}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{q.served}</td>
                            <td className="py-3 text-muted-foreground">{q.avgWait} min</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}