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

const baseBtnClass = 'group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 transition-all duration-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:gap-3 sm:py-6';

const primaryBtnClass = `${baseBtnClass} border border-white/15 bg-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_10px_rgba(14,165,233,0.15)] hover:-translate-y-1 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_20px_rgba(14,165,233,0.3)] hover:brightness-105 disabled:hover:shadow-none`;

const secondaryBtnClass = `${baseBtnClass} border border-white/25 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:bg-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_12px_rgba(0,0,0,0.1)] disabled:opacity-40 disabled:hover:shadow-none`;

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
    <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-border/40 bg-gradient-to-b from-card/60 to-background/80 p-3 backdrop-blur-xl shadow-lg shadow-black/5 sm:rounded-3xl sm:p-6">
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative grid grid-cols-4 gap-2 sm:gap-5">
        {actions.map(({ label, icon: Icon, key, primary }) => (
          <button
            key={key}
            onClick={handlers[key]}
            disabled={disabled[key]}
            className={primary ? primaryBtnClass : secondaryBtnClass}
          >
            <div className={`transition-transform duration-300 group-hover:scale-110 ${primary ? 'text-primary-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <span className={`text-center text-[10px] font-bold tracking-wide transition-colors duration-300 leading-tight sm:text-sm ${primary ? 'text-primary-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
