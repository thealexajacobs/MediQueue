'use client';

import { memo } from 'react';
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

export const QueueMetricsRow = memo(function QueueMetricsRow({
  waitingCount,
  servingCount,
  completedToday,
  avgWaitTime,
}: QueueMetricsRowProps) {
  const values = [waitingCount, servingCount, completedToday, avgWaitTime];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {metricConfig.map((m, i) => {
        const Icon = m.icon;
        const displayValue = i === 3 ? `${values[i]}m` : String(values[i]);
        return (
          <div
            key={m.label}
            className="relative overflow-hidden rounded-xl border border-border/20 bg-card p-3 shadow-sm sm:rounded-2xl sm:p-5"
          >
            <div className="relative z-10 flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {displayValue}
                </p>
                <p className="text-[10px] font-medium tracking-wider text-muted-foreground sm:mt-1 sm:text-xs">
                  {m.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
