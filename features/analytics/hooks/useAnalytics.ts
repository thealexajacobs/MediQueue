'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

export interface QueuePerformanceEntry {
  name: string;
  served: number;
  avgWait: number;
}

export interface HourlyBucket {
  hour: number;
  count: number;
}

export interface DailyBucket {
  label: string;
  count: number;
}

export interface ChartData {
  type: 'hourly' | 'daily';
  buckets: HourlyBucket[] | DailyBucket[];
}

export interface AnalyticsSummary {
  totalPatients: number;
  totalCompleted: number;
  averageWaitTime: number;
  activeQueues: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  queuePerformance: QueuePerformanceEntry[];
  chartData: ChartData;
  period: string;
}

async function fetchAnalytics(period: string): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics?period=${period}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export function useAnalytics(period: string) {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => fetchAnalytics(period),
    placeholderData: keepPreviousData,
  });
}