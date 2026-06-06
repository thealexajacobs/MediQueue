'use client';

import { useState } from 'react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Spinner } from '@/components/ui/Spinner';
import { BarChart3, Users, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';

interface AnalyticsDashboardProps {
  queues: { id: string; name: string }[];
}

export function AnalyticsDashboard({ queues }: AnalyticsDashboardProps) {
  const [selectedQueueId, setSelectedQueueId] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAnalytics(selectedQueueId);

  return (
    <div className="flex min-h-screen flex-col bg-background p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground" aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </a>
          <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        </div>
        <select
          value={selectedQueueId ?? ''}
          onChange={(e) => setSelectedQueueId(e.target.value || undefined)}
          className="h-10 rounded-sm border border-border bg-card px-3 text-sm text-foreground"
        >
          <option value="">All queues</option>
          {queues.map((q) => (
            <option key={q.id} value={q.id}>{q.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner label="Loading analytics..." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Today</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.summary.totalPatientsToday ?? 0}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Completed</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.summary.totalCompleted ?? 0}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Sessions</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.summary.totalSessions ?? 0}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Records</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.records.length ?? 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
