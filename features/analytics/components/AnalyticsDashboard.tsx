'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Spinner } from '@/components/ui/Spinner';
import { BarChart3, Users, Clock, CheckCircle2, Layers, TrendingUp, ArrowLeft } from 'lucide-react';

const HOUR_LABELS = ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];

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
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex h-14 items-center border-b border-border/[0.07] bg-background px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
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
    { label: 'Patients Today', value: summary.totalPatientsToday, icon: Users, color: 'text-primary' },
    { label: 'Avg Wait Time', value: `${summary.averageWaitTime}m`, icon: Clock, color: 'text-amber-500' },
    { label: 'Active Queues', value: summary.activeQueues, icon: Layers, color: 'text-emerald-500' },
    { label: 'Completed Today', value: summary.totalCompleted, icon: CheckCircle2, color: 'text-sky-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
            <p className="text-xs text-muted-foreground">Queue performance and patient flow summary</p>
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
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="rounded-xl border border-border/20 bg-card/40 p-5 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ${m.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</span>
                    </div>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{m.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-8 rounded-xl border border-border/20 bg-card/40 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Queue Performance</h2>
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

            <div className="rounded-xl border border-border/20 bg-card/40 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Daily Activity</h2>
              </div>
              {hourlyActivity.every((h) => h.count === 0) ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded today.</p>
              ) : (
                <div className="flex items-end gap-1">
                  {hourlyActivity.map((h) => {
                    const heightPct = maxHourlyCount > 0 ? (h.count / maxHourlyCount) * 100 : 0;
                    return (
                      <div key={h.hour} className="group relative flex flex-1 flex-col items-center">
                        <div
                          className="w-full rounded-sm bg-primary/60 transition-all hover:bg-primary/80"
                          style={{ height: `${Math.max(heightPct, 4)}px` }}
                        />
                        <span className="mt-1.5 text-[10px] text-muted-foreground">
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
          </>
        )}
      </div>
    </div>
  );
}
