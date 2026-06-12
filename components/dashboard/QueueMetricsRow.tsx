'use client';

import { Users, PhoneCall, CheckCircle2, Clock } from 'lucide-react';

interface QueueMetricsRowProps {
  waitingCount: number;
  servingCount: number;
  completedToday: number;
  avgWaitTime: number;
}

const metricConfig = [
  { label: 'Waiting', icon: Users },
  { label: 'Serving', icon: PhoneCall },
  { label: 'Completed Today', icon: CheckCircle2 },
  { label: 'Avg Wait Time', icon: Clock },
];

export function QueueMetricsRow({
  waitingCount,
  servingCount,
  completedToday,
  avgWaitTime,
}: QueueMetricsRowProps) {
  const values = [waitingCount, servingCount, completedToday, avgWaitTime];

  return (
    <div className="grid grid-cols-4 gap-3">
      {metricConfig.map((m, i) => {
        const Icon = m.icon;
        const displayValue = i === 3 ? `${values[i]}m` : String(values[i]);
        return (
          <div
            key={m.label}
            className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/40 p-5 shadow-sm backdrop-blur-md"
          >
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {displayValue}
                </p>
                <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground">
                  {m.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
