'use client';

import { useState } from 'react';
import { useQueues } from '@/features/queues/hooks/useQueueMutations';
import { useQueueStore } from '@/features/queues/hooks/useQueueStore';
import { QueueSettings } from '@/features/queues/components/QueueSettings';
import { Settings } from 'lucide-react';

export function QueueSwitcher() {
  const { data: queues, isLoading } = useQueues();
  const selectedQueueId = useQueueStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useQueueStore((s) => s.setSelectedQueueId);
  const [showSettings, setShowSettings] = useState(false);

  if (isLoading) {
    return (
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <div className="h-8 w-24 animate-pulse rounded-sm bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-sm bg-muted" />
      </div>
    );
  }

  if (!queues?.length) return null;

  return (
    <div className="flex items-center gap-1 border-b border-border px-4 py-2 overflow-x-auto">
      {queues.map((queue) => (
        <button
          key={queue.id}
          onClick={() => setSelectedQueueId(queue.id)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors
            ${
              selectedQueueId === queue.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
          {queue.name}
          {(queue.waitingCount ?? 0) > 0 && (
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold
                ${
                  selectedQueueId === queue.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                }`}
            >
              {queue.waitingCount}
            </span>
          )}
        </button>
      ))}
      <button
        onClick={() => setShowSettings(true)}
        className="ml-auto flex items-center gap-1 rounded-sm px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        aria-label="Queue settings"
      >
        <Settings className="h-4 w-4" />
      </button>

      {showSettings && <QueueSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
