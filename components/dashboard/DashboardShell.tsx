'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { QueueHealthPanel } from '@/components/dashboard/QueueHealthPanel';
import dynamic from 'next/dynamic';
import { SettingsModal } from '@/components/dashboard/SettingsModal';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, Loader2 } from 'lucide-react';

const AddPatientModal = dynamic(
  () => import('@/components/dashboard/AddPatientModal').then((m) => m.AddPatientModal),
  { loading: () => null }
);

interface DashboardShellProps {
  clinicName?: string;
  clinicLogo?: string | null;
  clinicId?: string;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({ clinicName: propClinicName, clinicLogo, clinicId, userName, userEmail }: DashboardShellProps) {
  const router = useRouter();
  const { data: queues, isLoading: queuesLoading } = useQueues();
  const selectedQueueId = useQueueStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useQueueStore((s) => s.setSelectedQueueId);
  const { data: entries, isLoading: entriesLoading } = useQueueEntries(selectedQueueId);
  const { callNext, skip, complete } = useEntryMutations(selectedQueueId);

  const { data: facility } = useQuery({
    queryKey: ['facility', clinicId],
    queryFn: async () => {
      const res = await fetch('/api/clinics');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    enabled: !!clinicId,
  });

  const clinicName = facility?.name ?? propClinicName ?? 'Facility';
  const currentLogo = facility?.logo ?? clinicLogo;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const stableEntriesRef = useRef(entries);
  const stableQueueIdRef = useRef(selectedQueueId);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const { mutateAsync: createQueue, isPending: isCreatingQueue } = useCreateQueue();

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
    if (entries && !entriesLoading) {
      stableEntriesRef.current = entries;
      stableQueueIdRef.current = selectedQueueId;
    }
  }, [entries, entriesLoading, selectedQueueId]);

  const displayEntries = entriesLoading && !entries && stableQueueIdRef.current === selectedQueueId ? (stableEntriesRef.current ?? []) : (entries ?? []);

  const waitingEntries = useMemo(
    () =>
      displayEntries
        .filter((e) => e.status === 'WAITING')
        .sort((a, b) => a.position - b.position),
    [displayEntries],
  );

  const completedEntries = useMemo(
    () => displayEntries.filter((e) => e.status === 'COMPLETED'),
    [displayEntries],
  );

  const avgWaitTime = useMemo(() => {
    if (completedEntries.length === 0) return 0;
    const totalMs = completedEntries.reduce((sum, e) => sum + (new Date(e.updatedAt).getTime() - new Date(e.createdAt).getTime()), 0);
    return Math.round(totalMs / completedEntries.length / 60000);
  }, [completedEntries]);

  const handleAddPatient = useCallback(() => setIsAddModalOpen(true), []);
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

  if (!queues?.length) {
    router.replace('/onboarding');
    return null;
  }

  const currentQueue = queues.find((q) => q.id === selectedQueueId);
  const servingEntry = displayEntries.find((e) => e.status === 'SERVING') ?? null;
  const nextEntry = waitingEntries.length > 0 ? waitingEntries[0] : null;
  const servingCount = displayEntries.filter((e) => e.status === 'SERVING').length;
  const completedToday = displayEntries.filter((e) => e.status === 'COMPLETED').length;

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-[20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <TopBar
          clinicName={clinicName}
          clinicLogo={currentLogo}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

      <div className="flex items-center border-b border-border/10 px-4 sm:px-6 min-w-0">
        <QueueTabs
          queues={queues}
          selectedQueueId={selectedQueueId}
          onSelectQueue={setSelectedQueueId}
        />
        <button
          onClick={() => setIsAddDepartmentOpen(true)}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Add department"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-8 sm:space-y-6">
            {entriesLoading && !stableEntriesRef.current ? (
              <>
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="h-44 animate-pulse rounded-xl bg-muted sm:h-52" />
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                    ))}
                  </div>
                </div>
              </>
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
            <AlertsPanel waitingCount={waitingEntries.length} avgWaitTime={avgWaitTime} />
            <QueueProgress entries={displayEntries} />
            <LiveActivity entries={displayEntries} />
          </div>
        </div>
      </div>

      {selectedQueueId && (
        <AddPatientModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          queueId={selectedQueueId}
          queueName={currentQueue?.name ?? ''}
          queues={queues}
        />
      )}

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        clinicName={clinicName}
        clinicLogo={currentLogo}
        clinicId={clinicId}
        userName={userName ?? ''}
        userEmail={userEmail ?? ''}
      />

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
              className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-border/30 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
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
    </div>
  );
}
