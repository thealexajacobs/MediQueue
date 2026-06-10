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
            className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {displayValue}
            </p>
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
          </div>
        );
      })}
    </div>
  );
}
