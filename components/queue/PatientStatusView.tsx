'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { CheckCircle2, SkipForward, RefreshCw, AlertCircle, Users, ArrowRight } from 'lucide-react';
import type { WSQueueEvent } from '@/types';

interface PublicQueueData {
  entry: {
    id: string;
    queueNumber: number;
    patientName: string;
    status: string;
    position: number;
  };
  queue: {
    id: string;
    name: string;
    status: string;
  };
  serving: {
    queueNumber: number;
    patientName: string;
  } | null;
            waitingCount: number;
            totalInQueue: number;
            estWaitMinutes: number;
}

interface PatientStatusViewProps {
  entryId: string;
}

const TIME_MARKS = [
  { label: 'Checked In', key: 'checked_in' },
  { label: 'In Queue', key: 'in_queue' },
  { label: 'Currently Serving', key: 'serving' },
];

function StatusDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 dark:bg-emerald-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
    </span>
  );
}

export function PatientStatusView({ entryId }: PatientStatusViewProps) {
  const [data, setData] = useState<PublicQueueData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/queue-entries/${entryId}/public`);
      const json = await res.json();
      if (!json.success) {
        setError(json.message || 'Failed to load');
        return;
      }
      setData(json.data);
      setError(null);
    } catch {
      setError('Failed to connect. Retrying...');
    } finally {
      setIsLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    if (!data?.queue?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      query: { queueId: data.queue.id },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('queue_event', (event: WSQueueEvent) => {
      if (event.queueId === data.queue.id) {
        fetchStatus();
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [data?.queue?.id, fetchStatus]);

  if (error && !data) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        <div className="relative mx-auto max-w-sm rounded-2xl border border-border/20 bg-card/60 p-8 text-center shadow-lg backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Queue session unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your queue status...</p>
        </div>
      </div>
    );
  }

  const isCompleted = data.entry.status === 'COMPLETED' || data.entry.status === 'SKIPPED';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[200px] w-[600px] -translate-x-1/2 bg-gradient-to-t from-primary/[0.02] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 py-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          M
        </div>

        <div className="mt-10 w-full max-w-sm">
          {isCompleted ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl font-semibold text-foreground">
                {data.entry.status === 'COMPLETED' ? "You've been served!" : 'Entry skipped'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.entry.status === 'COMPLETED'
                  ? 'Thank you for your patience. Have a great day!'
                  : 'Please contact the reception desk for assistance.'}
              </p>
            </div>
          ) : (
            <>
              {/* Now Serving Badge */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1">
                  <StatusDot />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {data.serving ? 'Now Serving' : 'Queue is opening'}
                  </span>
                </div>
              </div>

              {/* Queue Number */}
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Queue Number</p>
                <p className="font-mono text-5xl font-black tracking-tighter text-foreground sm:text-6xl">
                  #{String(data.entry.queueNumber).padStart(3, '0')}
                </p>
              </div>

              {/* Position Bar */}
              <div className="mt-8">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Your Position</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${data.totalInQueue > 1 ? ((data.entry.position - 1) / (data.totalInQueue - 1)) * 100 : 0}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground/60">
                  <span>Queue: {data.totalInQueue}</span>
                  <span>{data.waitingCount} ahead of you</span>
                </div>
              </div>

              {/* Now Serving Card */}
              {data.serving && (
                <div className="relative mt-6 flex h-48 flex-col overflow-hidden rounded-2xl p-5 shadow-xl sm:h-56 sm:p-6"
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
                  <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-[100px]" />

                  <div className="relative z-10 flex flex-1 flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 drop-shadow-sm sm:text-xs">
                          Now Serving
                        </span>
                      </div>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70 border border-white/10 backdrop-blur-md sm:text-xs">
                        {data.queue.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p className="font-mono text-[clamp(1.75rem,_4vw_+_0.5rem,_2.75rem)] leading-none font-black tracking-tighter text-white drop-shadow-lg">
                        #{String(data.serving.queueNumber).padStart(3, '0')}
                      </p>
                      <p className="text-sm font-bold tracking-tight text-white/90 sm:text-base">
                        {data.serving.patientName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm sm:text-xs">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        In consultation
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Timeline */}
              <div className="mt-8 space-y-3">
                {data.entry.status === 'WAITING' && (
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Checked In</p>
                    </div>
                    <span className="text-xs text-muted-foreground/50">Done</span>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${data.entry.status === 'WAITING' ? 'bg-primary/10 text-primary' : 'border border-border/30 text-muted-foreground/50'}`}>
                    {data.entry.status === 'WAITING' ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${data.entry.status === 'WAITING' ? 'text-foreground' : 'text-foreground'}`}>
                      In Queue
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground/50">
                    {data.entry.status === 'WAITING' ? 'Position ' + data.entry.position : 'Done'}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/30 text-muted-foreground/50">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-muted-foreground/50">Currently Serving</p>
                  </div>
                  <span className="text-xs text-muted-foreground/30">In progress</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {data.waitingCount} ahead
                </div>
              </div>
            </>
          )}

          {/* Branding */}
          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground/40">
              Powered by{' '}
              <span className="font-semibold text-muted-foreground/60">MediQueue</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
