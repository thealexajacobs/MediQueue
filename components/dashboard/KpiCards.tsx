'use client';

import { Users, Stethoscope, CheckCircle2 } from 'lucide-react';

interface KpiCardsProps {
  waitingCount: number;
  servingName: string | null;
  servedToday: number;
  avgWaitTime: number;
}

interface KpiCardProps {
  label: string;
  value: string;
  supporting: string;
  icon: React.ReactNode;
}

function KpiCard({ label, value, supporting, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{supporting}</p>
    </div>
  );
}

export function KpiCards({
  waitingCount,
  servingName,
  servedToday,
  avgWaitTime,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard
        label="Waiting Patients"
        value={String(waitingCount)}
        supporting={`~${avgWaitTime} min average wait time`}
        icon={<Users className="h-4 w-4 text-primary" />}
      />
      <KpiCard
        label="Currently Serving"
        value={servingName ?? '—'}
        supporting={servingName ? 'In consultation now' : 'No patient being served'}
        icon={<Stethoscope className="h-4 w-4 text-amber-600" />}
      />
      <KpiCard
        label="Served Today"
        value={String(servedToday)}
        supporting={`${servedToday} patient${servedToday !== 1 ? 's' : ''} completed`}
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
      />
    </div>
  );
}
