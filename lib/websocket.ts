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
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('[websocket] Failed to emit event:', err);
  }
}
