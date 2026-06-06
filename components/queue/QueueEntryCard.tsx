'use client';

import { StatusBadge } from '@/components/queue/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Phone } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface QueueEntryCardProps {
  entry: QueueEntryDTO;
  onCall: (id: string) => void;
  onSkip: (id: string) => void;
  onComplete: (id: string) => void;
  isCalling?: boolean;
}

export function QueueEntryCard({
  entry,
  onCall,
  onSkip,
  onComplete,
  isCalling,
}: QueueEntryCardProps) {
  const isWaiting = entry.status === 'WAITING';
  const isServing = entry.status === 'SERVING';

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-2xl font-bold text-foreground">
          #{String(entry.queueNumber).padStart(3, '0')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {entry.patientName}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={entry.status} />
            {entry.phone && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {entry.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {isWaiting && (
          <>
            <Button
              variant="primary"
              onClick={() => onCall(entry.id)}
              disabled={isCalling}
              isLoading={isCalling}
              aria-label={`Call ${entry.patientName}`}
              className="h-9 text-xs"
            >
              Call
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSkip(entry.id)}
              aria-label={`Skip ${entry.patientName}`}
              className="h-9 text-xs"
            >
              Skip
            </Button>
          </>
        )}
        {isServing && (
          <Button
            variant="primary"
            onClick={() => onComplete(entry.id)}
            aria-label={`Complete ${entry.patientName}`}
            className="h-9 text-xs"
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
