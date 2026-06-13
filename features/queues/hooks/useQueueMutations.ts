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

export function useQueues(initialData?: QueueDTO[]) {
  return useQuery({
    queryKey: ['queues'],
    queryFn: fetchQueues,
    initialData,
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
      queryClient.invalidateQueries({ queryKey: ['archived-queues'] });
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
      queryClient.invalidateQueries({ queryKey: ['archived-queues'] });
    },
  });
}

async function fetchArchivedQueues(): Promise<QueueDTO[]> {
  const res = await fetch('/api/queues?all=true');
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return (json.data as QueueDTO[]).filter((q) => q.deletedAt);
}

export function useArchivedQueues() {
  return useQuery({
    queryKey: ['archived-queues'],
    queryFn: fetchArchivedQueues,
  });
}

export function useRestoreQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/queues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore: true }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      queryClient.invalidateQueries({ queryKey: ['archived-queues'] });
    },
  });
}
