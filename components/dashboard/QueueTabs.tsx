'use client';

import type { QueueDTO } from '@/types';

interface QueueTabsProps {
  queues: QueueDTO[];
  selectedQueueId: string | null;
  onSelectQueue: (id: string) => void;
}

export function QueueTabs({ queues, selectedQueueId, onSelectQueue }: QueueTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {queues.map((queue) => {
        const isActive = queue.id === selectedQueueId;
        return (
          <button
            key={queue.id}
            onClick={() => onSelectQueue(queue.id)}
            className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {queue.name}
          </button>
        );
      })}
    </div>
  );
}
