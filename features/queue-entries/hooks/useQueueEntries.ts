'use client';

import { useQuery } from '@tanstack/react-query';
import type { QueueEntryDTO } from '@/types';

async function fetchEntries(queueId: string): Promise<QueueEntryDTO[]> {
  const res = await fetch(`/api/queue-entries?queueId=${queueId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export function useQueueEntries(queueId: string | null) {
  return useQuery({
    queryKey: ['queue-entries', queueId],
    queryFn: () => fetchEntries(queueId!),
    enabled: !!queueId,
  });
}
