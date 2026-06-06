'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useQueues } from '@/features/queues/hooks/useQueueMutations';
import { useQueueStore } from '@/features/queues/hooks/useQueueStore';
import { useQueueEntries } from '@/features/queue-entries/hooks/useQueueEntries';
import { useQueueSubscription } from '@/lib/useQueueSubscription';
import { LiveStatusPanel } from '@/components/dashboard/LiveStatusPanel';
import { ActionsBar } from '@/components/dashboard/ActionsBar';
import { QueueEntryCard } from '@/components/queue/QueueEntryCard';
import { PatientAddModal } from '@/components/queue/PatientAddModal';
import { useEntryMutations } from '@/features/queue-entries/hooks/useEntryMutations';
import { QueueSettings } from '@/features/queues/components/QueueSettings';
import { Spinner } from '@/components/ui/Spinner';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Users, BarChart3, LogOut, LayoutDashboard, ChevronDown, Settings } from 'lucide-react';

export function DashboardShell() {
  const { data: queues, isLoading: queuesLoading } = useQueues();
  const selectedQueueId = useQueueStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useQueueStore((s) => s.setSelectedQueueId);
  const { data: entries, isLoading: entriesLoading } = useQueueEntries(selectedQueueId);
  const { callNext, skip, complete } = useEntryMutations(selectedQueueId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showQueueDropdown, setShowQueueDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const queryClient = useQueryClient();

  const { lastEvent } = useQueueSubscription({
    clinicId: '',
    queueId: selectedQueueId ?? undefined,
    enabled: !!selectedQueueId,
  });

  useEffect(() => {
    if (lastEvent) {
      queryClient.invalidateQueries({ queryKey: ['queue-entries', selectedQueueId] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    }
  }, [lastEvent, selectedQueueId, queryClient]);

  useEffect(() => {
    if (queues?.length && !selectedQueueId) {
      setSelectedQueueId(queues[0].id);
    }
  }, [queues, selectedQueueId, setSelectedQueueId]);

  if (queuesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  if (!queues?.length) return null;

  const currentQueue = queues.find((q) => q.id === selectedQueueId);
  const waitingEntries = entries?.filter((e) => e.status === 'WAITING')
    .sort((a, b) => a.position - b.position) ?? [];
  const servingEntry = entries?.find((e) => e.status === 'SERVING') ?? null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            M
          </div>
          <span className="text-sm font-semibold text-foreground">MediQueue</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </div>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <button
            onClick={() => setShowSettings(true)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="relative">
            <button
              onClick={() => setShowQueueDropdown(!showQueueDropdown)}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {currentQueue?.name ?? 'Select queue'}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {showQueueDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowQueueDropdown(false)} />
                <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
                  {queues.map((queue) => (
                    <button
                      key={queue.id}
                      onClick={() => { setSelectedQueueId(queue.id); setShowQueueDropdown(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        queue.id === selectedQueueId
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {queue.name}
                      {(queue.waitingCount ?? 0) > 0 && (
                        <span className="rounded-full bg-muted-foreground/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {queue.waitingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {entriesLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner label="Loading patients..." />
                </div>
              ) : entries?.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No patients currently waiting.</p>
                  <p className="text-xs text-muted-foreground">
                    Add a patient to get started.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Waiting list
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                        {waitingEntries.length}
                      </span>
                    </h2>
                    {servingEntry && (
                      <p className="text-xs text-muted-foreground">
                        Serving: <span className="font-mono font-semibold text-foreground">#{String(servingEntry.queueNumber).padStart(3, '0')}</span>
                      </p>
                    )}
                  </div>
                  {waitingEntries.map((entry) => (
                    <QueueEntryCard
                      key={entry.id}
                      entry={entry}
                      onCall={(id) => callNext.mutate(id)}
                      onSkip={(id) => skip.mutate(id)}
                      onComplete={(id) => complete.mutate(id)}
                      isCalling={callNext.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            <ActionsBar
              queueId={selectedQueueId}
              onAddPatient={() => setIsAddModalOpen(true)}
            />
          </div>

          <aside className="w-full border-t border-border lg:w-72 lg:border-l lg:border-t-0">
            <LiveStatusPanel queueId={selectedQueueId} />
          </aside>
        </div>
      </div>

      {selectedQueueId && (
        <PatientAddModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          queueId={selectedQueueId}
        />
      )}
      {showSettings && <QueueSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
