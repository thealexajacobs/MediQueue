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
  { label: 'Add Patient', icon: UserPlus, key: 'add' as const, primary: true },
  { label: 'Call Next', icon: ArrowRight, key: 'next' as const, primary: false },
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="grid grid-cols-4 gap-4">
        {actions.map(({ label, icon: Icon, key, primary }) => (
          <button
            key={key}
            onClick={handlers[key]}
            disabled={disabled[key]}
            className={
              primary
                ? 'flex flex-col items-center justify-center gap-2.5 rounded-xl bg-primary py-5 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'
                : 'flex flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-background py-5 transition-all hover:bg-muted active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'
            }
          >
            <Icon className={`h-6 w-6 ${primary ? 'text-primary-foreground' : 'text-foreground'}`} />
            <span className={`text-center text-xs font-semibold ${primary ? 'text-primary-foreground' : 'text-foreground'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
