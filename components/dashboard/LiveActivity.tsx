'use client';

import { useMemo } from 'react';
import { UserPlus, Phone, SkipForward, CheckCircle2, Activity } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';
import { EntryStatus, QueueEventType } from '@/types';

interface LiveActivityProps {
  entries: QueueEntryDTO[];
}

const eventConfig = {
  [EntryStatus.WAITING]: {
    icon: UserPlus,
    label: 'Patient Added',
    color: 'text-neutral-500',
    bg: 'bg-neutral-100',
  },
  [EntryStatus.SERVING]: {
    icon: Phone,
    label: 'Patient Called',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  [EntryStatus.COMPLETED]: {
    icon: CheckCircle2,
    label: 'Patient Completed',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  [EntryStatus.SKIPPED]: {
    icon: SkipForward,
    label: 'Patient Skipped',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function LiveActivity({ entries }: LiveActivityProps) {
  const events = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, [entries]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border-[1.5px] border-border/30 bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Activity
        </p>
        <div className="mt-6 flex flex-col items-center gap-2 py-6">
          <Activity className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/20 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground drop-shadow-sm">
          Live Activity
        </p>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </span>
      </div>

      <div className="mt-5 space-y-1.5">
        {events.map((entry) => {
          const cfg = eventConfig[entry.status] ?? eventConfig[EntryStatus.WAITING];
          const Icon = cfg.icon;
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm ${cfg.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {cfg.label}
                </p>
                <p className="text-xs font-medium text-muted-foreground/70 truncate">
                  {entry.patientName}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground/60">
                {timeAgo(entry.updatedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
