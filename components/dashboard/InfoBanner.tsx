'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

interface InfoBannerProps {
  waitingCount: number;
  avgWaitTime: number;
}

export function InfoBanner({ waitingCount, avgWaitTime }: InfoBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const statusText =
    waitingCount === 0
      ? 'No patients currently waiting. Queue is empty.'
      : waitingCount > 15
        ? `High traffic — ${waitingCount} patients waiting (avg ${avgWaitTime} min wait). Consider opening additional service lines.`
        : `Queue is operating normally. ${waitingCount} patient${waitingCount !== 1 ? 's' : ''} waiting (avg ${avgWaitTime} min wait).`;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/[0.03] px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Info className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Queue Status</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{statusText}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
