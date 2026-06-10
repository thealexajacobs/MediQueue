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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Next Up
        </p>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {waiting.length} waiting
        </span>
      </div>

      {waiting.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-6">
          <Clock className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No patients waiting</p>
        </div>
      ) : (
        <div className="mt-4 space-y-1">
          {waiting.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/20"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {entry.position}
              </span>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {pad(entry.queueNumber)} {entry.patientName}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {timeSince(entry.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
