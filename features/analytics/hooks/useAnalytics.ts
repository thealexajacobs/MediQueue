'use client';

import { useQuery } from '@tanstack/react-query';

interface AnalyticsSummary {
  totalPatientsToday: number;
  totalCompleted: number;
  totalSessions: number;
}

interface AnalyticsData {
  records: unknown[];
  summary: AnalyticsSummary;
}

async function fetchAnalytics(queueId?: string): Promise<AnalyticsData> {
  const params = new URLSearchParams();
  if (queueId) params.set('queueId', queueId);
  params.set('days', '7');

  const res = await fetch(`/api/analytics?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export function useAnalytics(queueId?: string) {
  return useQuery({
    queryKey: ['analytics', queueId],
    queryFn: () => fetchAnalytics(queueId),
  });
}
