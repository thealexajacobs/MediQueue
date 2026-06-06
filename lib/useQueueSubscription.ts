'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WSQueueEvent } from '@/types';

interface UseQueueSubscriptionOptions {
  clinicId: string;
  queueId?: string;
  enabled?: boolean;
}

interface UseQueueSubscriptionState {
  isConnected: boolean;
  lastEvent: WSQueueEvent | null;
  error: string | null;
}

export function useQueueSubscription({
  clinicId,
  queueId,
  enabled = true,
}: UseQueueSubscriptionOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<UseQueueSubscriptionState>({
    isConnected: false,
    lastEvent: null,
    error: null,
  });

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      query: { clinicId, queueId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      setState((prev) => ({ ...prev, isConnected: true, error: null }));
    });

    socket.on('disconnect', () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', (err) => {
      setState((prev) => ({ ...prev, error: err.message }));
    });

    socket.on('queue_event', (event: WSQueueEvent) => {
      setState((prev) => ({ ...prev, lastEvent: event }));
    });

    socketRef.current = socket;
  }, [clinicId, queueId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setState({ isConnected: false, lastEvent: null, error: null });
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

  return state;
}
