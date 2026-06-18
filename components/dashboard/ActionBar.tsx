'use client';

import { UserPlus, ArrowRight, SkipForward, CheckCircle2 } from 'lucide-react';

interface ActionBarProps {
  onAddPatient: () => void;
  onCompleteAndCallNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  hasServing: boolean;
  hasNext: boolean;
  isCalling: boolean;
}

const actions = [
  { label: 'Add Patient', icon: UserPlus, key: 'add' as const, primary: false },
  { label: 'Call Next', icon: ArrowRight, key: 'next' as const, primary: true },
  { label: 'Skip', icon: SkipForward, key: 'skip' as const, primary: false },
  { label: 'Complete', icon: CheckCircle2, key: 'complete' as const, primary: false },
];

export function ActionBar({
  onAddPatient,
  onCompleteAndCallNext,
  onSkip,
  onComplete,
  hasServing,
  hasNext,
  isCalling,
}: ActionBarProps) {
  const handlers: Record<string, () => void> = {
    add: onAddPatient,
    next: onCompleteAndCallNext,
    skip: onSkip,
    complete: onComplete,
  };

  const disabled: Record<string, boolean> = {
    add: false,
    next: (!hasServing && !hasNext) || isCalling,
    skip: !hasServing,
    complete: !hasServing,
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
        {actions.map(({ label, icon: Icon, key, primary }) => (
          <button
            key={key}
            onClick={handlers[key]}
            disabled={disabled[key]}
            className={`group relative flex flex-row items-center justify-center gap-3 rounded-xl px-4 py-5 text-sm font-medium transition-all duration-200
              ${primary
                ? 'bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95'
                : 'border border-border/40 bg-card text-muted-foreground hover:border-border/60 hover:text-foreground hover:shadow-sm active:bg-muted/60'
              }
              disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none sm:flex-col sm:items-center sm:justify-center sm:gap-3 sm:rounded-2xl sm:py-6 sm:text-base ${key === 'add' || key === 'next' ? 'col-span-2 sm:col-span-1' : ''}`}
          >
            <Icon className={`h-6 w-6 shrink-0 sm:h-6 sm:w-6 ${primary ? 'text-primary-foreground' : ''}`} />
            <span className="text-sm font-semibold leading-tight sm:text-xs sm:text-center">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
