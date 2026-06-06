'use client';

import { Button } from '@/components/ui/Button';
import { useEntryMutations } from '@/features/queue-entries/hooks/useEntryMutations';
import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { Plus, SkipForward, PhoneCall, CheckCircle2 } from 'lucide-react';

interface ActionsBarProps {
  queueId: string | null;
  onAddPatient: () => void;
}

export function ActionsBar({ queueId, onAddPatient }: ActionsBarProps) {
  const { callNext, skip, complete } = useEntryMutations(queueId);
  const { data: entries } = useQueueEntries(queueId);

  const waitingEntries = entries?.filter((e) => e.status === 'WAITING') ?? [];
  const servingEntry = entries?.find((e) => e.status === 'SERVING');
  const nextEntry = waitingEntries.sort((a, b) => a.position - b.position)[0];
  const hasWaiting = waitingEntries.length > 0;

  async function handleCallNext() {
    if (!nextEntry) return;
    await callNext.mutateAsync(nextEntry.id);
  }

  async function handleSkip() {
    if (!nextEntry) return;
    await skip.mutateAsync(nextEntry.id);
  }

  async function handleComplete() {
    if (!servingEntry) return;
    await complete.mutateAsync(servingEntry.id);
  }

  return (
    <div className="flex items-center gap-2 border-t border-border bg-card p-3">
      <Button variant="primary" onClick={onAddPatient} className="h-12 flex-1 text-sm">
        <Plus className="h-5 w-5" />
        Add patient
      </Button>

      {hasWaiting && (
        <>
          <Button
            variant="primary"
            onClick={handleCallNext}
            isLoading={callNext.isPending}
            disabled={!!servingEntry || callNext.isPending}
            className="h-12 flex-1 text-sm"
          >
            <PhoneCall className="h-5 w-5" />
            Call next
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkip}
            disabled={skip.isPending}
            className="h-12 flex-1 text-sm"
          >
            <SkipForward className="h-5 w-5" />
            Skip
          </Button>
        </>
      )}

      {servingEntry && (
        <Button
          variant="primary"
          onClick={handleComplete}
          isLoading={complete.isPending}
          className="h-12 flex-1 text-sm"
        >
          <CheckCircle2 className="h-5 w-5" />
          Complete
        </Button>
      )}
    </div>
  );
}
