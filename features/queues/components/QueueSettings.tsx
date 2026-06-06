'use client';

import { useState } from 'react';
import { useQueues, useUpdateQueue, useDeleteQueue } from '@/features/queues/hooks/useQueueMutations';
import { X, Pencil, Trash2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function QueueSettings({ onClose }: { onClose: () => void }) {
  const { data: queues } = useQueues();
  const updateQueue = useUpdateQueue();
  const deleteQueue = useDeleteQueue();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  async function handleRename(id: string) {
    try {
      await updateQueue.mutateAsync({ id, name: editName });
      setEditingId(null);
      toast.success('Queue renamed');
    } catch {
      toast.error('Failed to rename queue');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteQueue.mutateAsync(id);
      toast.success('Queue deleted');
    } catch {
      toast.error('Failed to delete queue');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Queue settings</h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {queues?.map((queue) => (
            <div
              key={queue.id}
              className="flex items-center justify-between rounded-sm border border-border bg-background p-3"
            >
              {editingId === queue.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-9 flex-1 rounded-sm border border-border bg-card px-2 text-sm text-foreground"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRename(queue.id)}
                    disabled={updateQueue.isPending}
                    className="rounded-sm p-1.5 text-primary hover:bg-primary/10"
                    aria-label="Confirm rename"
                  >
                    {updateQueue.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-foreground">{queue.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{queue.status.toLowerCase()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingId(queue.id); setEditName(queue.name); }}
                      className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground"
                      aria-label={`Rename ${queue.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(queue.id, queue.name)}
                      disabled={deleteQueue.isPending}
                      className="rounded-sm p-1.5 text-destructive hover:bg-destructive/10"
                      aria-label={`Delete ${queue.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
