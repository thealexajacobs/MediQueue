'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, CheckCircle, Circle, CircleCheck, Layers, Users, ChevronRight } from 'lucide-react';

const STEP_LABELS = ['Queue', 'Complete'];

const STEP_CONFIG = [
  {
    heading: 'How would you like to manage your queues?',
    supporting: 'Pick the option that matches how your facility runs. You can change this later.',
  },
  {
    heading: "You're all set!",
    supporting: 'Your queue management system has been created successfully.',
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showDepartmentSelection, setShowDepartmentSelection] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'single' | null>('single');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    'General Consultation', 'Pharmacy', 'Laboratory',
  ]);
  const [customDeptInput, setCustomDeptInput] = useState('');

  const totalSteps = 2;
  const cfg = STEP_CONFIG[step - 1] ?? STEP_CONFIG[0];

  async function handleCreateQueues(names: string[]) {
    setIsLoading(true);
    setError(null);

    try {
      for (const name of names) {
        await fetch('/api/queues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
      }

      setStep(2);
      setIsLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  function handleSingleClick() {
    handleCreateQueues(['General Consultation']);
  }

  function toggleDepartment(name: string) {
    setSelectedDepartments((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name],
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const idx = i + 1;
            const isComplete = idx < step;
            const isCurrent = idx === step;
            return (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isComplete
                    ? 'bg-primary'
                    : isCurrent
                      ? 'bg-primary/60'
                      : 'bg-muted'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="text-center">
        {step === 2 && (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>
        )}
        <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
          {step === 1 && showDepartmentSelection ? 'Select your departments' : cfg.heading}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 1 && showDepartmentSelection
            ? 'Choose the departments you want to create separate queues for.'
            : cfg.supporting}
        </p>
      </div>

      <div className="rounded-xl bg-background p-4 sm:p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {step === 1 && !showDepartmentSelection && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setSelectedOption('single')}
              disabled={isLoading}
              className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                selectedOption === 'single'
                  ? 'border-primary bg-primary/[0.02] shadow-sm shadow-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  selectedOption === 'single' ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Users className={`h-6 w-6 ${
                    selectedOption === 'single' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-semibold ${
                    selectedOption === 'single' ? 'text-primary' : 'text-foreground'
                  }`}>
                    Single Queue
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    One queue for all patients.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Small clinics', 'Pharmacies', 'Independent practices'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 pt-1">
                  {selectedOption === 'single' ? (
                    <CircleCheck className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowDepartmentSelection(true)}
              className="w-full rounded-2xl border-2 border-border p-5 text-left transition-all hover:border-primary/30 hover:bg-muted/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Layers className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground">
                    Multiple Department Queues
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Separate queues for each department.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Hospitals', 'Multi-specialty clinics', 'Diagnostic centers'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 pt-1">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
                </div>
              </div>
            </button>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleSingleClick}
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 1 && showDepartmentSelection && (
          <div className="space-y-5">
            <div className="flex gap-2">
              <input
                type="text"
                value={customDeptInput}
                placeholder=" "
                onChange={(e) => setCustomDeptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmed = customDeptInput.trim();
                    if (trimmed && !selectedDepartments.includes(trimmed)) {
                      setSelectedDepartments((prev) => [...prev, trimmed]);
                      setCustomDeptInput('');
                    }
                  }
                }}
                className="h-10 flex-1 rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-primary/20 [&:not(:placeholder-shown):not(:focus)]:bg-muted/85"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = customDeptInput.trim();
                  if (trimmed && !selectedDepartments.includes(trimmed)) {
                    setSelectedDepartments((prev) => [...prev, trimmed]);
                    setCustomDeptInput('');
                  }
                }}
                disabled={!customDeptInput.trim()}
                className="flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {['General Consultation', 'Pediatrics', 'Dental', 'Pharmacy', 'Laboratory', 'Radiology', 'Cardiology', 'Ophthalmology', 'ENT', 'Orthopedics', ...selectedDepartments.filter((d) => !['General Consultation', 'Pediatrics', 'Dental', 'Pharmacy', 'Laboratory', 'Radiology', 'Cardiology', 'Ophthalmology', 'ENT', 'Orthopedics'].includes(d))].map((dept) => {
                const isSelected = selectedDepartments.includes(dept);
                const isCustom = !['General Consultation', 'Pediatrics', 'Dental', 'Pharmacy', 'Laboratory', 'Radiology', 'Cardiology', 'Ophthalmology', 'ENT', 'Orthopedics'].includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => toggleDepartment(dept)}
                    className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/[0.02]'
                        : 'border-border hover:border-primary/30 hover:bg-muted/20'
                    }`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                      isSelected ? 'bg-primary' : 'border-2 border-muted-foreground/30'
                    }`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 16 16">
                          <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {dept}
                      {isCustom && <span className="ml-1 text-[10px] text-muted-foreground/50">(custom)</span>}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleCreateQueues(selectedDepartments)}
                disabled={isLoading || selectedDepartments.length === 0}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Finish setup
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-6 py-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
