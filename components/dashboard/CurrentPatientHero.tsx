'use client';

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

export function CurrentPatientHero({
  servingEntry,
  queueName,
  waitingCount,
  totalEntries,
}: CurrentPatientHeroProps) {
  if (!servingEntry) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm">
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
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(0,0%,15%) 50%, hsl(196,68%,51%) 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full" style={{ background: 'hsla(196,68%,51%,0.12)', filter: 'blur(80px)' }} />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full" style={{ background: 'hsla(196,68%,51%,0.06)', filter: 'blur(80px)' }} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'hsl(198, 100%, 71%)' }}>
              Now Serving
            </p>
          </div>

          <div>
            <p className="font-mono text-7xl font-black tracking-tight text-white">
              {pad(servingEntry.queueNumber)}
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold tracking-tight text-white/90">
              {servingEntry.patientName}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1" style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: 'rgb(52,211,153)', borderColor: 'rgba(52,211,153,0.2)' }}>
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                In consultation
              </span>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Waiting {timeSince(servingEntry.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{queueName}</p>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg px-3 py-2 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Waiting</p>
              <p className="text-lg font-bold text-white">{waitingCount}</p>
            </div>
            <div className="rounded-lg px-3 py-2 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Total</p>
              <p className="text-lg font-bold text-white">{totalEntries}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
