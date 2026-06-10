'use client';

import { Plus, FileText } from 'lucide-react';

interface PageHeaderProps {
  onAddPatient: () => void;
  onViewReports: () => void;
}

export function PageHeader({ onAddPatient, onViewReports }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Good morning, welcome back
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onViewReports}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          View Reports
        </button>
        <button
          onClick={onAddPatient}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>
    </div>
  );
}
