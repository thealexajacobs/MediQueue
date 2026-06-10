'use client';

import { UserPlus, BarChart3, Link2, QrCode } from 'lucide-react';

interface QuickActionsProps {
  onAddPatient: () => void;
  onViewAnalytics: () => void;
}

export function QuickActions({ onAddPatient, onViewAnalytics }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onAddPatient}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <UserPlus className="h-4 w-4" />
        Add Patient
      </button>

      <button
        onClick={onViewAnalytics}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]"
      >
        <BarChart3 className="h-4 w-4" />
        Analytics
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]">
        <Link2 className="h-4 w-4" />
        Share Queue
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]">
        <QrCode className="h-4 w-4" />
        QR Code
      </button>

      <div className="ml-auto hidden text-xs text-muted-foreground md:block">
        Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">A</kbd> to add patient
      </div>
    </div>
  );
}
