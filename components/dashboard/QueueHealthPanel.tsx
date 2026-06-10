'use client';

import { Activity, Clock, TrendingUp, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

interface QueueHealthPanelProps {
  waitingCount: number;
  avgWaitTime: number;
  servedToday: number;
}

function StatusDot({ status }: { status: 'healthy' | 'busy' | 'delayed' }) {
  const colors = { healthy: 'bg-emerald-500', busy: 'bg-amber-500', delayed: 'bg-red-500' };
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors[status]}`}
      />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colors[status]}`} />
    </span>
  );
}

function MetricRow({
  label,
  value,
  status,
  icon,
}: {
  label: string;
  value: string;
  status: 'healthy' | 'busy' | 'delayed';
  icon: React.ReactNode;
}) {
  const bg = {
    healthy: 'bg-emerald-50 border-emerald-200',
    busy: 'bg-amber-50 border-amber-200',
    delayed: 'bg-red-50 border-red-200',
  };
  const text = {
    healthy: 'text-emerald-700',
    busy: 'text-amber-700',
    delayed: 'text-red-700',
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${bg[status]}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm font-semibold ${text[status]}`}>{value}</p>
      </div>
      <StatusDot status={status} />
    </div>
  );
}

export function QueueHealthPanel({
  waitingCount,
  avgWaitTime,
  servedToday,
}: QueueHealthPanelProps) {
  const throughput = servedToday > 0 ? (servedToday / 8).toFixed(1) : '0.0';
  const completionRate =
    servedToday + waitingCount > 0
      ? Math.round((servedToday / (servedToday + waitingCount)) * 100)
      : 0;
  const overallStatus =
    waitingCount > 15 ? 'delayed' : waitingCount > 8 ? 'busy' : 'healthy';
  const waitStatus = avgWaitTime > 30 ? 'delayed' : avgWaitTime > 15 ? 'busy' : 'healthy';
  const throughputStatus = Number(throughput) > 4 ? 'healthy' : Number(throughput) > 2 ? 'busy' : 'delayed';
  const completionStatus = completionRate > 70 ? 'healthy' : completionRate > 40 ? 'busy' : 'delayed';

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Queue Health
        </h3>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            overallStatus === 'healthy'
              ? 'bg-emerald-50 text-emerald-700'
              : overallStatus === 'busy'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              overallStatus === 'healthy'
                ? 'bg-emerald-500'
                : overallStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            }`}
          />
          {overallStatus === 'healthy' ? 'Stable' : overallStatus === 'busy' ? 'Busy' : 'Congested'}
        </span>
      </div>

      <div className="space-y-2">
        <MetricRow
          label="Current Status"
          value={
            overallStatus === 'healthy'
              ? 'Operating normally'
              : overallStatus === 'busy'
                ? 'High traffic period'
                : 'Queue congested'
          }
          status={overallStatus}
          icon={
            overallStatus === 'healthy' ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            )
          }
        />
        <MetricRow
          label="Wait Prediction"
          value={`~${avgWaitTime} min average`}
          status={waitStatus}
          icon={<Clock className="h-4 w-4 text-violet-600" />}
        />
        <MetricRow
          label="Throughput"
          value={`${throughput} patients/hr`}
          status={throughputStatus}
          icon={<TrendingUp className="h-4 w-4 text-sky-600" />}
        />
        <MetricRow
          label="Completion Rate"
          value={`${completionRate}% today`}
          status={completionStatus}
          icon={<Zap className="h-4 w-4 text-amber-600" />}
        />
      </div>
    </div>
  );
}
