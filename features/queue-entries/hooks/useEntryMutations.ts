'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EntryStatus } from '@/types';
import type { QueueEntryDTO } from '@/types';

async function updateEntry(id: string, action: 'call' | 'skip' | 'complete') {
  const res = await fetch(`/api/queue-entries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as QueueEntryDTO;
}

export function useEntryMutations(queueId: string | null) {
  const queryClient = useQueryClient();

  const callNext = useMutation({
    mutationFn: (id: string) => updateEntry(id, 'call'),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['queue-entries', queueId] });
      const previous = queryClient.getQueryData<QueueEntryDTO[]>(['queue-entries', queueId]);
      if (previous) {
        queryClient.setQueryData<QueueEntryDTO[]>(['queue-entries', queueId], (old) =>
          old?.map((e) =>
            e.id === id
              ? { ...e, status: EntryStatus.SERVING }
              : e.status === EntryStatus.SERVING
                ? { ...e, status: EntryStatus.COMPLETED }
                : e,
          ),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['queue-entries', queueId], context.previous);
      }
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
      toast.error('Failed to call patient. Refreshed data.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
    },
  });

  const skip = useMutation({
    mutationFn: (id: string) => updateEntry(id, 'skip'),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['queue-entries', queueId] });
      const previous = queryClient.getQueryData<QueueEntryDTO[]>(['queue-entries', queueId]);
      if (previous) {
        queryClient.setQueryData<QueueEntryDTO[]>(['queue-entries', queueId], (old) =>
          old?.map((e) => (e.id === id ? { ...e, status: EntryStatus.SKIPPED } : e)),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['queue-entries', queueId], context.previous);
      }
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
      toast.error('Failed to skip patient. Refreshed data.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
    },
  });

  const complete = useMutation({
    mutationFn: (id: string) => updateEntry(id, 'complete'),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['queue-entries', queueId] });
      const previous = queryClient.getQueryData<QueueEntryDTO[]>(['queue-entries', queueId]);
      if (previous) {
        queryClient.setQueryData<QueueEntryDTO[]>(['queue-entries', queueId], (old) =>
          old?.map((e) => (e.id === id ? { ...e, status: EntryStatus.COMPLETED } : e)),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['queue-entries', queueId], context.previous);
      }
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
      toast.error('Failed to complete patient. Refreshed data.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', queueId] });
    },
  });

  return { callNext, skip, complete };
}
