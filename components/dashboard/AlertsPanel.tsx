'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, TrendingUp, CheckCircle2, X, Info } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
}

const STYLES: Record<string, { border: string; bg: string; text: string; icon: React.ReactNode }> = {
  warning: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  },
  info: {
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    icon: <Info className="h-4 w-4 text-sky-600" />,
  },
  success: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  },
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-800',
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
  },
};

export function AlertsPanel({
  waitingCount,
  avgWaitTime,
}: {
  waitingCount: number;
  avgWaitTime: number;
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const alerts: Alert[] = [];

  if (waitingCount > 15) {
    alerts.push({
      id: 'congestion',
      type: 'warning',
      title: 'High traffic',
      message: `Queue is congested — ${waitingCount} patients waiting. Consider opening additional service lines.`,
    });
  } else if (waitingCount > 8) {
    alerts.push({
      id: 'busy',
      type: 'info',
      title: 'Busy period',
      message: `${waitingCount} patients in queue. Average wait time is ~${avgWaitTime} minutes.`,
    });
  } else if (waitingCount > 0) {
    alerts.push({
      id: 'normal',
      type: 'success',
      title: 'Operating normally',
      message: `${waitingCount} patient${waitingCount !== 1 ? 's' : ''} in queue. Everything on track.`,
    });
  }

  if (avgWaitTime > 20 && waitingCount > 0) {
    alerts.push({
      id: 'wait-time',
      type: 'warning',
      title: 'Extended wait times',
      message: `Patients are waiting longer than expected (~${avgWaitTime}m). Consider increasing throughput.`,
    });
  }

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((alert) => {
        const style = STYLES[alert.type];
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-lg border ${style.border} ${style.bg} p-3`}
          >
            <div className="mt-0.5 shrink-0">{style.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold ${style.text}`}>{alert.title}</p>
              <p className={`mt-0.5 text-[11px] leading-relaxed opacity-80 ${style.text}`}>
                {alert.message}
              </p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
              className={`shrink-0 rounded p-0.5 transition-colors hover:opacity-100 ${style.text} opacity-50`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
