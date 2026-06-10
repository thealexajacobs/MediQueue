'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useQueues, useCreateQueue } from '@/features/queues/hooks/useQueueMutations';
import { useQueueStore } from '@/features/queues/hooks/useQueueStore';
import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { useEntryMutations } from '@/features/queue-entries/hooks/useEntryMutations';
import { useQueueSubscription } from '@/lib/useQueueSubscription';
import { TopBar } from '@/components/dashboard/TopBar';
import { QueueTabs } from '@/components/dashboard/QueueTabs';
import { CurrentPatientHero } from '@/components/dashboard/CurrentPatientHero';
import { QueueMetricsRow } from '@/components/dashboard/QueueMetricsRow';
import { ActionBar } from '@/components/dashboard/ActionBar';
import { QueueProgress } from '@/components/dashboard/QueueProgress';
import { LiveActivity } from '@/components/dashboard/LiveActivity';
import { AddPatientDrawer } from '@/components/dashboard/AddPatientDrawer';
import { Dialog } from '@/components/ui/Dialog';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Loader2 } from 'lucide-react';
import type { QueueDTO } from '@/types';

interface DashboardShellProps {
  clinicName?: string;
  clinicId?: string;
  initialQueues?: QueueDTO[];
}

export function DashboardShell({ clinicName: propClinicName, clinicId, initialQueues }: DashboardShellProps) {
  const { data: queues, isLoading: queuesLoading } = useQueues(initialQueues);
  const selectedQueueId = useQueueStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useQueueStore((s) => s.setSelectedQueueId);
  const { data: entries, isLoading: entriesLoading } = useQueueEntries(selectedQueueId);
  const { callNext, skip, complete } = useEntryMutations(selectedQueueId);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const { mutateAsync: createQueue, isPending: isCreatingQueue } = useCreateQueue();
  const queryClient = useQueryClient();

  useQueueSubscription({
    clinicId: clinicId ?? '',
    queueId: selectedQueueId ?? undefined,
    enabled: !!selectedQueueId,
  });

  useEffect(() => {
    if (queues?.length && !selectedQueueId) {
      setSelectedQueueId(queues[0].id);
    }
  }, [queues, selectedQueueId, setSelectedQueueId]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['queue-entries', selectedQueueId] });
  }, [selectedQueueId, queryClient]);

  const waitingEntries = useMemo(
    () =>
      (entries ?? [])
        .filter((e) => e.status === 'WAITING')
        .sort((a, b) => a.position - b.position),
    [entries],
  );

  const handleAddPatient = useCallback(() => setIsAddDrawerOpen(true), []);
  const handleCompleteAndCallNext = useCallback(async () => {
    const next = waitingEntries.length > 0 ? waitingEntries[0] : null;
    if (next) {
      await callNext.mutateAsync(next.id);
    }
  }, [waitingEntries, callNext]);
  const handleSkip = useCallback(() => {
    const serving = entries?.find((e) => e.status === 'SERVING');
    if (serving) skip.mutate(serving.id);
  }, [entries, skip]);
  const handleCreateDepartment = useCallback(async () => {
    const name = newDepartmentName.trim();
    if (!name) return;
    try {
      const queue = await createQueue({ name });
      setNewDepartmentName('');
      setIsAddDepartmentOpen(false);
      setSelectedQueueId(queue.id);
    } catch {
      // error toast is handled by the mutation
    }
  }, [newDepartmentName, createQueue, setSelectedQueueId]);

  const handleComplete = useCallback(() => {
    const serving = entries?.find((e) => e.status === 'SERVING');
    if (serving) complete.mutate(serving.id);
  }, [entries, complete]);

  if (queuesLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex h-14 animate-pulse items-center justify-between border-b border-border/40 px-6">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-5 w-20 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="w-full shrink-0 space-y-6 lg:w-[340px]">
            <div className="h-72 animate-pulse rounded-xl bg-muted" />
            <div className="h-72 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!queues?.length) return null;

  const currentQueue = queues.find((q) => q.id === selectedQueueId);
  const servingEntry = entries?.find((e) => e.status === 'SERVING') ?? null;
  const nextEntry = waitingEntries.length > 0 ? waitingEntries[0] : null;
  const servingCount = entries?.filter((e) => e.status === 'SERVING').length ?? 0;
  const completedToday = entries?.filter((e) => e.status === 'COMPLETED').length ?? 0;
  const avgWaitTime = 12;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar clinicName={propClinicName ?? 'Clinic'} />

      <div className="flex items-center border-b border-border/40 px-6 py-4">
        <QueueTabs
          queues={queues}
          selectedQueueId={selectedQueueId}
          onSelectQueue={setSelectedQueueId}
        />
        <button
          onClick={() => setIsAddDepartmentOpen(true)}
          className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Add department"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            {entriesLoading ? (
              <div className="flex items-center justify-center py-24">
                <Spinner label="Loading patients..." />
              </div>
            ) : (
              <>
                <CurrentPatientHero
                  servingEntry={servingEntry}
                  queueName={currentQueue?.name ?? ''}
                  waitingCount={waitingEntries.length}
                  totalEntries={entries?.length ?? 0}
                />

                <QueueMetricsRow
                  waitingCount={waitingEntries.length}
                  servingCount={servingCount}
                  completedToday={completedToday}
                  avgWaitTime={avgWaitTime}
                />

                <ActionBar
                  onAddPatient={handleAddPatient}
                  onCompleteAndCallNext={handleCompleteAndCallNext}
                  onSkip={handleSkip}
                  onComplete={handleComplete}
                  hasServing={!!servingEntry}
                  hasNext={!!nextEntry}
                  isCalling={callNext.isPending}
                />
              </>
            )}
          </div>

          <div className="w-full shrink-0 space-y-6 lg:w-[340px]">
            <QueueProgress entries={entries ?? []} />
            <LiveActivity entries={entries ?? []} />
          </div>
        </div>
      </div>

      {selectedQueueId && (
        <AddPatientDrawer
          open={isAddDrawerOpen}
          onClose={() => setIsAddDrawerOpen(false)}
          queueId={selectedQueueId}
          queueName={currentQueue?.name ?? ''}
        />
      )}

      <Dialog
        open={isAddDepartmentOpen}
        onClose={() => { setIsAddDepartmentOpen(false); setNewDepartmentName(''); }}
        title="Add Department"
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleCreateDepartment(); }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="dept-name" className="mb-1.5 block text-sm font-medium text-foreground">
              Department Name
            </label>
            <input
              id="dept-name"
              type="text"
              autoFocus
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="e.g. General Consultation"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setIsAddDepartmentOpen(false); setNewDepartmentName(''); }}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newDepartmentName.trim() || isCreatingQueue}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingQueue ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Add Department
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
