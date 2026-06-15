'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Spinner } from '@/components/ui/Spinner';
import { BarChart3, Users, Clock, CheckCircle2, Layers, TrendingUp, ArrowLeft } from 'lucide-react';

const HOUR_LABELS = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

export function AnalyticsDashboard() {
  const { data, isLoading } = useAnalytics();

  const maxHourlyCount = useMemo(() => {
    if (!data?.hourlyActivity?.length) return 0;
    return Math.max(...data.hourlyActivity.map((h) => h.count), 1);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner label="Loading analytics..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        <div className="relative z-10 flex h-14 items-center border-b border-border/[0.07] bg-background/70 backdrop-blur-xl px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <BarChart3 className="h-8 w-8 text-primary/60" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">No analytics yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            No queue activity has been recorded yet. Analytics will appear once patients begin moving through queues.
          </p>
        </div>
      </div>
    );
  }

  const { summary, queuePerformance, hourlyActivity } = data;
  const hasData = summary.totalPatientsToday > 0 || summary.totalCompleted > 0;

  const metrics = [
    { label: 'Patients Today', value: summary.totalPatientsToday },
    { label: 'Avg Wait', value: `${summary.averageWaitTime}m` },
    { label: 'Active Queues', value: summary.activeQueues },
    { label: 'Completed Today', value: summary.totalCompleted },
  ];

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
              <p className="text-xs text-muted-foreground">Today&apos;s overview</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/20 bg-card/60 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-medium text-muted-foreground">Today</span>
            </div>
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary/60" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">No analytics yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                No queue activity has been recorded yet. Analytics will appear once patients begin moving through queues.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metrics.map((m) => (
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
                    Hourly Activity
                  </h2>
                </div>
                {hourlyActivity.every((h) => h.count === 0) ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded today.</p>
                ) : (
                  <div className="flex items-end gap-1 sm:gap-2">
                    {hourlyActivity.map((h) => {
                      const heightPct = maxHourlyCount > 0 ? (h.count / maxHourlyCount) * 100 : 0;
                      return (
                        <div key={h.hour} className="group relative flex flex-1 flex-col items-center">
                          <div
                            className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
                            style={{ height: `${Math.max(heightPct, 4)}px` }}
                          />
                          <span className="mt-1.5 text-[8px] text-muted-foreground sm:text-[10px]">
                            {HOUR_LABELS[h.hour]}
                          </span>
                          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                            {h.count} patients
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
                          <th className="pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg Wait</th>
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
