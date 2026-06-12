'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import type { WSQueueEvent } from '@/types';

interface UseQueueSubscriptionOptions {
  clinicId: string;
  queueId?: string;
  enabled?: boolean;
}

export function useQueueSubscription({
  clinicId,
  queueId,
  enabled = true,
}: UseQueueSubscriptionOptions) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    if (!socketUrl) return;
    const socket = io(socketUrl, {
      query: { clinicId, queueId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
    });

    socket.on('queue_event', (_event: WSQueueEvent) => {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
    });

    socketRef.current = socket;
  }, [clinicId, queueId, queryClient]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return null;
}
