import { env } from '@/lib/env';
import type { QueueEventType } from '@/types';

interface EmitEventPayload {
  type: QueueEventType;
  facilityId: string;
  queueId: string;
  entryId?: string;
}

export async function emitQueueEvent(payload: EmitEventPayload): Promise<void> {
  try {
    const url = `${env.SOCKET_SERVER_URL}/emit`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (env.SOCKET_AUTH_TOKEN) {
      headers['x-socket-token'] = env.SOCKET_AUTH_TOKEN;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    await fetch(url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
    clearTimeout(timeout);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn('[websocket] Emit timeout — WS server may be down');
    } else {
      console.error('[websocket] Failed to emit event:', err);
    }
  }
}
