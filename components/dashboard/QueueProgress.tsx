'use client';

import { Clock, User } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface QueueProgressProps {
  entries: QueueEntryDTO[];
}

function pad(num: number): string {
  return `#${String(num).padStart(3, '0')}`;
}

function timeSince(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function QueueProgress({ entries }: QueueProgressProps) {
  const waiting = entries
    .filter((e) => e.status === 'WAITING')
    .sort((a, b) => a.position - b.position)
    .slice(0, 10);

  return (
    <div className="rounded-2xl border border-border/20 bg-card/40 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground drop-shadow-sm">
          Next Up
        </p>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm border border-primary/10">
          {waiting.length} waiting
        </span>
      </div>

      {waiting.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 opacity-60">
          <Clock className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">No patients waiting</p>
        </div>
      ) : (
        <div className="mt-5 space-y-1.5">
          {waiting.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:bg-white/5 hover:border-white/10 hover:shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background border border-border/30 text-xs font-bold text-muted-foreground shadow-sm group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                {entry.position}
              </span>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  <span className="text-muted-foreground/70 font-normal mr-1">{pad(entry.queueNumber)}</span>
                  {entry.patientName}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground/60">
                {timeSince(entry.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
