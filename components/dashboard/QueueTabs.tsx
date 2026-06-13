'use client';

import type { QueueDTO } from '@/types';

interface QueueTabsProps {
  queues: QueueDTO[];
  selectedQueueId: string | null;
  onSelectQueue: (id: string) => void;
}

export function QueueTabs({ queues, selectedQueueId, onSelectQueue }: QueueTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto min-w-0">
      {queues.map((queue) => {
        const isActive = queue.id === selectedQueueId;
        return (
          <button
            key={queue.id}
            onClick={() => onSelectQueue(queue.id)}
            className={`relative shrink-0 whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:py-3 sm:text-sm ${
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {queue.name}
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
