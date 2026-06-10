'use client';

import { useQueues } from '@/features/queues/hooks/useQueueMutations';
import { useQueueStore } from '@/features/queues/hooks/useQueueStore';
import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { useMemo } from 'react';
import { Users, CheckCircle2, Clock, Settings } from 'lucide-react';

export function QueueSwitcher() {
  const { data: queues, isLoading } = useQueues();
  const selectedQueueId = useQueueStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useQueueStore((s) => s.setSelectedQueueId);

  const { data: allEntries } = useQueueEntries(selectedQueueId);

  const queueMeta = useMemo(() => {
    if (!queues) return [];
    return queues.map((q) => {
      const isSelected = q.id === selectedQueueId;
      const waiting = q.waitingCount ?? 0;
      return { ...q, isSelected, waiting };
    });
  }, [queues, selectedQueueId]);

  const servingName = useMemo(() => {
    if (!allEntries) return null;
    const s = allEntries.find((e) => e.status === 'SERVING');
    return s ? s.patientName : null;
  }, [allEntries]);

  if (isLoading) {
    return (
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-48 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (!queues?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Service Queues
        </h2>
        <button
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Queue settings"
        >
          <Settings className="h-3.5 w-3.5" />
          Manage
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {queueMeta.map((queue) => (
          <button
            key={queue.id}
            onClick={() => setSelectedQueueId(queue.id)}
            className={`group relative flex min-w-[180px] shrink-0 flex-col gap-2 rounded-xl border p-3.5 text-left transition-all ${
              queue.isSelected
                ? 'border-primary/40 bg-primary/[0.03] shadow-sm shadow-primary/5 ring-1 ring-primary/20'
                : 'border-border bg-card hover:border-muted-foreground/20 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-semibold ${
                  queue.isSelected ? 'text-primary' : 'text-foreground'
                }`}
              >
                {queue.name}
              </span>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                  queue.isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {queue.waiting}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {queue.waiting} wait{queue.waiting !== 1 ? 'ing' : ''}
              </span>
              {servingName && queue.isSelected && (
                <span className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {servingName}
                </span>
              )}
            </div>

            {queue.isSelected && (
              <div className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-primary/60" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
