'use client';

import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { Spinner } from '@/components/ui/Spinner';
import { Clock, Users } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface LiveStatusPanelProps {
  queueId: string | null;
}

export function LiveStatusPanel({ queueId }: LiveStatusPanelProps) {
  const { data: entries, isLoading } = useQueueEntries(queueId);

  if (isLoading || !entries) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Loading status..." />
      </div>
    );
  }

  const serving = entries.find((e) => e.status === 'SERVING');
  const waiting = entries.filter((e) => e.status === 'WAITING');
  const waitingCount = waiting.length;

  const avgServeMinutes = 12;
  const estWait = waitingCount * avgServeMinutes;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Now serving
        </p>
        {serving ? (
          <p className="mt-1 font-mono text-5xl font-bold text-foreground">
            #{String(serving.queueNumber).padStart(3, '0')}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">—</p>
        )}
        {serving && (
          <p className="mt-1 text-sm text-muted-foreground">{serving.patientName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Queue</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{waitingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Est. wait</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ~{estWait < 60 ? `${estWait}m` : `${Math.floor(estWait / 60)}h ${estWait % 60}m`}
          </p>
        </div>
      </div>
    </div>
  );
}
