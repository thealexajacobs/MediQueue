'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { CheckCircle2, SkipForward, RefreshCw, AlertCircle, Users, Clock, ArrowRight } from 'lucide-react';
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
  estWaitMinutes: number;
}

interface PatientStatusViewProps {
  entryId: string;
}

function PositionBar({ position, total }: { position: number; total: number }) {
  const pct = Math.min((position / Math.max(total, 1)) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
        <span>Your position</span>
        <span>{position} of {total}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-1000 ease-out"
          style={{ width: `${100 - pct}%` }}
        />
      </div>
    </div>
  );
}

function AnimatedNumber({ num, label }: { num: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/50 mb-2">{label}</p>
      <div className="relative">
        <p className="font-mono text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700">
          #{String(num).padStart(3, '0')}
        </p>
        <div className="absolute -inset-8 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  WAITING: 'from-blue-600 via-indigo-700 to-purple-900',
  SERVING: 'from-emerald-600 via-teal-700 to-cyan-900',
  COMPLETED: 'from-emerald-600 via-green-700 to-teal-900',
  SKIPPED: 'from-amber-600 via-orange-700 to-red-900',
};

const STATUS_BADGE: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  WAITING: { label: 'In Queue', icon: Users, color: 'bg-blue-500/20 text-blue-300 ring-blue-500/30' },
  SERVING: { label: 'Now Being Served', icon: CheckCircle2, color: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30' },
  SKIPPED: { label: 'Skipped', icon: SkipForward, color: 'bg-amber-500/20 text-amber-300 ring-amber-500/30' },
};

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 max-w-sm w-full backdrop-blur-xl">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-lg font-semibold text-white">Queue session unavailable</h1>
          <p className="mt-2 text-sm text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-white/50">Loading your queue status...</p>
        </div>
      </div>
    );
  }

  const isCompleted = data.entry.status === 'COMPLETED' || data.entry.status === 'SKIPPED';
  const statusCfg = STATUS_BADGE[data.entry.status] ?? STATUS_BADGE.WAITING;
  const StatusIcon = statusCfg.icon;
  const gradientFrom = STATUS_COLORS[data.entry.status] ?? STATUS_COLORS.WAITING;

  return (
    <div className={`relative flex min-h-screen flex-col bg-gradient-to-br ${gradientFrom} overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 backdrop-blur-sm ${statusCfg.color}`}>
              <StatusIcon className="h-3 w-3" />
              {statusCfg.label}
            </span>
          </div>

          <p className="text-center text-sm font-medium text-white/60 tracking-wide mt-3">
            {data.queue.name}
          </p>

          <div className="mt-8 text-center">
            <AnimatedNumber num={data.entry.queueNumber} label="Your Queue Number" />
          </div>

          {isCompleted ? (
            <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-300" />
              </div>
              <p className="text-xl font-semibold text-white">
                {data.entry.status === 'COMPLETED' ? "You've been served!" : 'Entry skipped'}
              </p>
              <p className="mt-2 text-sm text-white/60">
                {data.entry.status === 'COMPLETED'
                  ? 'Thank you for your patience. Have a great day!'
                  : 'Please contact the reception desk for assistance.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <PositionBar position={data.entry.position} total={data.entry.position + data.waitingCount} />

                {data.serving ? (
                  <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                    <p className="relative text-xs font-medium uppercase tracking-[0.15em] text-white/50">Now Serving</p>
                    <p className="relative mt-2 font-mono text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      #{String(data.serving.queueNumber).padStart(3, '0')}
                    </p>
                    <p className="relative mt-1 text-sm text-white/70">{data.serving.patientName}</p>
                    <div className="relative mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                      <Clock className="h-3 w-3" />
                      Estimated wait ~{data.estWaitMinutes} min
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Queue is opening
                    </div>
                    <p className="mt-2 text-xs text-white/40">Waiting for the first patient to be called</p>
                  </div>
                )}
              </div>

              <div className="mt-10 flex items-center justify-center gap-6 text-xs text-white/40 animate-in fade-in duration-700 delay-500">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {data.waitingCount} ahead
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  ~{data.estWaitMinutes} min wait
                </div>
              </div>
            </>
          )}

          <div className="mt-12 text-center animate-in fade-in duration-700 delay-700">
            <p className="text-xs text-white/30">
              Powered by <span className="font-semibold text-white/40">MediQueue</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
