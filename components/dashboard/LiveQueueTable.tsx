'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Search,
  Phone,
  SkipForward,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import type { QueueEntryDTO } from '@/types';

interface LiveQueueTableProps {
  entries: QueueEntryDTO[];
  onCall: (id: string) => void;
  onSkip: (id: string) => void;
  onComplete: (id: string) => void;
  isCalling: boolean;
}

function pad(num: number): string {
  return `#${String(num).padStart(3, '0')}`;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  WAITING: {
    label: 'Waiting',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  SERVING: {
    label: 'Serving',
    classes: 'bg-primary/10 text-primary border-primary/20',
  },
  COMPLETED: {
    label: 'Completed',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  SKIPPED: {
    label: 'Skipped',
    classes: 'bg-muted text-muted-foreground border-border',
  },
};

type SortKey = 'queueNumber' | 'patientName' | 'position' | 'createdAt';

export function LiveQueueTable({
  entries,
  onCall,
  onSkip,
  onComplete,
  isCalling,
}: LiveQueueTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    let list = [...entries];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.patientName.toLowerCase().includes(q) ||
          pad(e.queueNumber).includes(q),
      );
    }
    list.sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'queueNumber') return (a.queueNumber - b.queueNumber) * m;
      if (sortKey === 'position') return (a.position - b.position) * m;
      if (sortKey === 'createdAt')
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * m;
      return a.patientName.localeCompare(b.patientName) * m;
    });
    return list;
  }, [entries, search, sortKey, sortDir]);

  function toggle(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return <ArrowUpDown className={`h-3 w-3 ${sortDir === 'asc' ? 'rotate-0' : 'rotate-180'}`} />;
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <UserPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No patients in queue</h3>
          <p className="max-w-xs text-xs text-muted-foreground">
            Add a patient to start managing your queue. Patients will appear here in real time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Queue List
          <span className="ml-2 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {entries.length}
          </span>
        </h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search queue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-36 rounded-md border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {(
                [
                  { key: 'queueNumber', label: 'Queue #', hide: null },
                  { key: 'patientName', label: 'Patient', hide: null },
                  { key: 'createdAt', label: 'Check-In', hide: 'sm' as const },
                  { key: 'position', label: 'Position', hide: 'md' as const },
                ] as const
              ).map(({ key, label, hide }) => (
                <th
                  key={key}
                  className={`cursor-pointer px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground ${hide ? `hidden ${hide}:table-cell` : ''}`}
                  onClick={() => toggle(key)}
                >
                  <span className="flex items-center gap-1">
                    {label}
                    <SortIcon column={key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => {
              const cfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.WAITING;
              const isWaiting = entry.status === 'WAITING';
              const isServing = entry.status === 'SERVING';
              return (
                <tr
                  key={entry.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5 font-mono text-sm font-bold text-foreground">
                    {pad(entry.queueNumber)}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-foreground">{entry.patientName}</p>
                    {entry.phone && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{entry.phone}</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground sm:table-cell">
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">
                    {entry.position}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {isWaiting && (
                        <button
                          onClick={() => onCall(entry.id)}
                          disabled={isCalling}
                          className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                          title="Call patient"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {isServing && (
                        <>
                          <button
                            onClick={() => onComplete(entry.id)}
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                            title="Complete"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onSkip(entry.id)}
                            className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80"
                            title="Skip"
                          >
                            <SkipForward className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {!isWaiting && !isServing && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
