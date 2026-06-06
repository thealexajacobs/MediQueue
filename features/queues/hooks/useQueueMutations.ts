'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueueDTO } from '@/types';
import type { CreateQueueInput, UpdateQueueInput } from '@/features/queues/schemas/queue';

async function fetchQueues(): Promise<QueueDTO[]> {
  const res = await fetch('/api/queues');
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export function useQueues() {
  return useQuery({
    queryKey: ['queues'],
    queryFn: fetchQueues,
  });
}

export function useCreateQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateQueueInput) => {
      const res = await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
  });
}

export function useUpdateQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateQueueInput & { id: string }) => {
      const res = await fetch(`/api/queues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
  });
}

export function useDeleteQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/queues/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
  });
}
