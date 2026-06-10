'use client';

import { useMemo } from 'react';
import { Settings } from 'lucide-react';
import type { QueueDTO } from '@/types';
import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { QueueCard } from '@/components/dashboard/QueueCard';

interface LiveQueuesSectionProps {
  queues: QueueDTO[];
  selectedQueueId: string | null;
  onSelectQueue: (id: string) => void;
}

function QueueCardWrapper({
  queue,
  isSelected,
  onSelect,
}: {
  queue: QueueDTO;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { data: entries } = useQueueEntries(queue.id);
  const servingCount = useMemo(
    () => entries?.filter((e) => e.status === 'SERVING').length ?? 0,
    [entries],
  );

  return (
    <QueueCard
      queue={queue}
      isSelected={isSelected}
      servingCount={servingCount}
      onSelect={onSelect}
    />
  );
}

export function LiveQueuesSection({
  queues,
  selectedQueueId,
  onSelectQueue,
}: LiveQueuesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Live Queues</h2>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="h-3.5 w-3.5" />
          Manage
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {queues.map((queue) => (
          <QueueCardWrapper
            key={queue.id}
            queue={queue}
            isSelected={queue.id === selectedQueueId}
            onSelect={onSelectQueue}
          />
        ))}
      </div>
    </div>
  );
}
