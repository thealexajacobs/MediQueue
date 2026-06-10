'use client';

import { Activity, Clock } from 'lucide-react';
import { QueueStatus } from '@/types';
import type { QueueDTO } from '@/types';

interface QueueCardProps {
  queue: QueueDTO;
  isSelected: boolean;
  servingCount: number;
  onSelect: (id: string) => void;
}

const statusConfig: Record<string, { label: string; dot: string; bg: string }> = {
  ACTIVE: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  PAUSED: { label: 'Paused', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  CLOSED: { label: 'Closed', dot: 'bg-muted-foreground', bg: 'bg-muted text-muted-foreground' },
};

function RelativeTime({ date }: { date: Date }) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const label =
    mins < 1 ? 'Just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
  return <>{label}</>;
}

export function QueueCard({ queue, isSelected, servingCount, onSelect }: QueueCardProps) {
  const cfg = statusConfig[queue.status] ?? statusConfig.CLOSED;
  const waiting = queue.waitingCount ?? 0;

  return (
    <button
      onClick={() => onSelect(queue.id)}
      className={`group relative w-full rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? 'border-primary/40 bg-primary/[0.02] shadow-sm shadow-primary/5 ring-1 ring-primary/20'
          : 'border-border bg-card hover:border-muted-foreground/20 hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`text-sm font-semibold ${
            isSelected ? 'text-primary' : 'text-foreground'
          }`}
        >
          {queue.name}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          {queue.status === QueueStatus.ACTIVE ? (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <Activity className="h-3.5 w-3.5" />
          )}
          {queue.status === QueueStatus.ACTIVE ? 'Live' : 'Offline'}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <RelativeTime date={queue.updatedAt} />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
        <div>
          <p className="text-lg font-bold text-foreground">{waiting}</p>
          <p className="text-[11px] text-muted-foreground">Waiting</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{servingCount}</p>
          <p className="text-[11px] text-muted-foreground">Serving</p>
        </div>
      </div>

      {isSelected && (
        <div className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-primary/60" />
      )}
    </button>
  );
}
