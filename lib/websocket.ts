import { env } from '@/lib/env';
import type { QueueEventType } from '@/types';

interface EmitEventPayload {
  type: QueueEventType;
  clinicId: string;
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
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('[websocket] Failed to emit event:', err);
  }
}
