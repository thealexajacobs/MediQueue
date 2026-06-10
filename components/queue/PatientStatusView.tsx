'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { RefreshCw, AlertCircle } from 'lucide-react';
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-xl font-semibold text-foreground">Queue session unavailable</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const isCompleted = data.entry.status === 'COMPLETED' || data.entry.status === 'SKIPPED';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {data.queue.name}
        </p>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Your queue number</p>
          <p className="mt-1 font-mono text-6xl font-bold text-foreground">
            #{String(data.entry.queueNumber).padStart(3, '0')}
          </p>
        </div>

        {isCompleted ? (
          <div className="mt-8">
            <p className="text-lg font-medium text-green-600">
              {data.entry.status === 'COMPLETED' ? 'You have been served' : 'This entry has been skipped'}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">Position in line</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {data.entry.position}
                <span className="text-lg text-muted-foreground">
                  /{data.entry.position + data.waitingCount}
                </span>
              </p>
            </div>

            {data.serving ? (
              <div className="mt-8 rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Now serving
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                  #{String(data.serving.queueNumber).padStart(3, '0')}
                </p>
                <p className="text-sm text-muted-foreground">{data.serving.patientName}</p>
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Waiting for the first patient to be called</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Estimated wait ~{data.estWaitMinutes} min
            </div>
          </>
        )}
      </div>
    </div>
  );
}
