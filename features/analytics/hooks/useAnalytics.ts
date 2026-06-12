'use client';

import { useQuery } from '@tanstack/react-query';

export interface QueuePerformanceEntry {
  name: string;
  served: number;
  avgWait: number;
}

export interface HourlyActivityEntry {
  hour: number;
  count: number;
}

export interface AnalyticsSummary {
  totalPatientsToday: number;
  totalCompleted: number;
  averageWaitTime: number;
  activeQueues: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  queuePerformance: QueuePerformanceEntry[];
  hourlyActivity: HourlyActivityEntry[];
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch('/api/analytics');
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });
}
