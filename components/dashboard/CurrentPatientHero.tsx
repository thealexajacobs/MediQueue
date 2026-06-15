'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface CurrentPatientHeroProps {
  servingEntry: QueueEntryDTO | null;
  queueName: string;
  waitingCount: number;
  totalEntries: number;
}

function pad(num: number): string {
  return `#${String(num).padStart(3, '0')}`;
}

function timeSince(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

export const CurrentPatientHero = memo(function CurrentPatientHero({
  servingEntry,
  queueName,
  waitingCount,
  totalEntries,
}: CurrentPatientHeroProps) {
  if (!servingEntry) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border-[1.5px] border-border/30 bg-card p-4 shadow-sm sm:h-80 sm:p-6">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {queueName}
            </p>
            <p className="text-xl font-semibold text-foreground">
              No one currently serving
            </p>
            <p className="text-sm text-muted-foreground">
              {waitingCount > 0 ? 'Call the next patient to begin' : 'Add a patient to get started'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-48 flex-col overflow-hidden rounded-xl p-4 shadow-xl sm:h-80 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(200, 30%, 15%) 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3 sm:space-y-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 drop-shadow-sm">
              Now Serving
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-mono text-[clamp(2.5rem,_5vw_+_1rem,_5.5rem)] leading-none font-black tracking-tighter text-white drop-shadow-lg">
              {pad(servingEntry.queueNumber)}
            </p>
            <p className="text-lg font-bold tracking-tight text-white/90 truncate max-w-[200px] sm:max-w-md sm:text-2xl">
              {servingEntry.patientName}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              In consultation
            </span>
            <span className="text-sm font-medium text-white/50">
              Waiting {timeSince(servingEntry.createdAt)}
            </span>
          </div>
        </div>

        <p className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 border border-white/10 backdrop-blur-md shadow-sm sm:px-4 sm:py-1.5 sm:text-sm">
          {queueName}
        </p>
      </div>
    </div>
  );
});
