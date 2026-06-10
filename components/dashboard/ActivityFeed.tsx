'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Activity,
  UserPlus,
  Phone,
  SkipForward,
  CheckCircle2,
} from 'lucide-react';
import type { QueueEventDTO } from '@/types';

const EVENT_ICONS: Record<string, React.ReactNode> = {
  PATIENT_ADDED: <UserPlus className="h-3.5 w-3.5 text-primary" />,
  PATIENT_CALLED: <Phone className="h-3.5 w-3.5 text-amber-600" />,
  PATIENT_SKIPPED: <SkipForward className="h-3.5 w-3.5 text-muted-foreground" />,
  PATIENT_COMPLETED: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
};

const EVENT_LABELS: Record<string, string> = {
  PATIENT_ADDED: 'Patient added to queue',
  PATIENT_CALLED: 'Patient called',
  PATIENT_SKIPPED: 'Patient skipped',
  PATIENT_COMPLETED: 'Patient completed',
};

function TimeAgo({ date }: { date: Date }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    function update() {
      const diff = Date.now() - new Date(date).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) setLabel('Just now');
      else if (mins === 1) setLabel('1m ago');
      else if (mins < 60) setLabel(`${mins}m ago`);
      else setLabel(`${Math.floor(mins / 60)}h ago`);
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [date]);

  return <span className="shrink-0 text-xs text-muted-foreground">{label}</span>;
}

export function ActivityFeed() {
  const [events, setEvents] = useState<QueueEventDTO[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (events.length > prevCountRef.current) {
      prevCountRef.current = events.length;
      const el = containerRef.current;
      if (el) {
        requestAnimationFrame(() => {
          el.scrollTop = 0;
        });
      }
    }
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Activity
          </h3>
        </div>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Activity className="h-6 w-6 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">Waiting for activity...</p>
          <p className="text-[11px] text-muted-foreground/60">
            Queue events will appear here in real time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Activity
        </h3>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500">
          <span className="h-full w-full animate-ping rounded-full bg-emerald-500" />
        </span>
      </div>

      <div ref={containerRef} className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
        {events.map((event, i) => (
          <div
            key={event.id ?? i}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background">
              {EVENT_ICONS[event.eventType] ?? (
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {EVENT_LABELS[event.eventType] ?? event.eventType}
              </p>
            </div>
            <TimeAgo date={new Date(event.timestamp)} />
          </div>
        ))}
      </div>
    </div>
  );
}
