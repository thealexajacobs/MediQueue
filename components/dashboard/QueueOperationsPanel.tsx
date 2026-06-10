'use client';

import { Phone, SkipForward, CheckCircle2, Clock, User } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface QueueOperationsPanelProps {
  servingEntry: QueueEntryDTO | null;
  nextEntry: QueueEntryDTO | null;
  queueName: string;
  waitingCount: number;
  onCallNext: (id: string) => void;
  onSkip: (id: string) => void;
  onComplete: (id: string) => void;
  isCalling: boolean;
}

function pad(num: number): string {
  return `#${String(num).padStart(3, '0')}`;
}

function CalloutCard({
  label,
  entry,
  accentColor,
  accentBg,
  children,
}: {
  label: string;
  entry: QueueEntryDTO | null;
  accentColor: string;
  accentBg: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {entry && (
          <span
            className={`rounded-full ${accentBg} ${accentColor} px-2.5 py-0.5 font-mono text-sm font-bold`}
          >
            {pad(entry.queueNumber)}
          </span>
        )}
      </div>

      {entry ? (
        <div>
          <p className="text-xl font-bold text-foreground">{entry.patientName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {label === 'Now Serving'
              ? `Called at ${new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : `Waiting since ${new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </p>
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {label === 'Now Serving' ? 'No patient being served' : 'No patients in queue'}
          </p>
        </div>
      )}
    </div>
  );
}

export function QueueOperationsPanel({
  servingEntry,
  nextEntry,
  queueName,
  waitingCount,
  onCallNext,
  onSkip,
  onComplete,
  isCalling,
}: QueueOperationsPanelProps) {
  const estimatedWait = waitingCount * 12;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{queueName}</h2>
          <p className="text-xs text-muted-foreground">
            {waitingCount} patient{waitingCount !== 1 ? 's' : ''} in queue
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CalloutCard
          label="Now Serving"
          entry={servingEntry}
          accentColor="text-primary"
          accentBg="bg-primary/10"
        >
          {servingEntry && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onComplete(servingEntry.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete
              </button>
              <button
                onClick={() => onSkip(servingEntry.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </button>
            </div>
          )}
        </CalloutCard>

        <CalloutCard
          label="Next in Line"
          entry={nextEntry}
          accentColor="text-amber-700"
          accentBg="bg-amber-50"
        >
          {nextEntry && (
            <div className="mt-4">
              {servingEntry ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground/60"
                >
                  <Clock className="h-4 w-4" />
                  Finish current patient first
                </button>
              ) : (
                <button
                  onClick={() => onCallNext(nextEntry.id)}
                  disabled={isCalling}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Phone className="h-4 w-4" />
                  {isCalling ? 'Calling...' : 'Call Next'}
                </button>
              )}
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Est. wait ~{estimatedWait < 60 ? `${estimatedWait}m` : `${Math.floor(estimatedWait / 60)}h ${estimatedWait % 60}m`}
              </p>
            </div>
          )}
        </CalloutCard>
      </div>
    </div>
  );
}
