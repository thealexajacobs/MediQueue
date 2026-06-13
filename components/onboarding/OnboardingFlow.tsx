'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, ChevronRight, Users, Layers, Circle, CircleCheck, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

const step1Schema = z.object({
  facilityName: z.string().min(1, 'Facility name is required').max(100).trim(),
  email: z.string().email('Enter a valid email address').trim(),
  password: z.string().min(8, 'At least 8 characters'),
});

type Step1Data = z.infer<typeof step1Schema>;

const STEP_LABELS = ['Workspace', 'Queue', 'Complete'];

const STEP_CONFIG = [
  {
    heading: 'Create your healthcare workspace',
    supporting: 'Set up your workspace in minutes.',
  },
  {
    heading: 'How would you like to manage your queues?',
    supporting: 'Pick the option that matches how your facility runs. You can change this later.',
  },
  {
    heading: "You're all set!",
    supporting: 'Your queue management system has been created successfully.',
  },
];

interface OnboardingFlowProps {
  skipRegistration?: boolean;
  initialStep?: number;
}

export function OnboardingFlow({ skipRegistration, initialStep = 1 }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [showDepartmentSelection, setShowDepartmentSelection] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'single' | null>('single');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    'General Consultation', 'Pharmacy', 'Laboratory',
  ]);
  const [customDeptInput, setCustomDeptInput] = useState('');

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
  });

  const totalSteps = 3;
  const cfg = STEP_CONFIG[step - 1] ?? STEP_CONFIG[0];

  async function handleStep1(data: Step1Data) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: data.facilityName,
          name: data.email.split('@')[0],
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Registration failed');
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push('/login');
        return;
      }

      setStep1Data(data);
      setStep(2);
      setIsLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

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

      setStep(3);
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
        {step === 3 && (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>
        )}
        <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
          {step === 2 && showDepartmentSelection ? 'Select your departments' : cfg.heading}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 2 && showDepartmentSelection
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

        {step === 1 && !skipRegistration && (
          <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-5">
            <div>
              <label htmlFor="facilityName" className="mb-1.5 block text-sm font-medium text-foreground">
                Facility Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="facilityName"
                  type="text"
                  autoFocus
                  autoComplete="organization"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"

                  {...step1Form.register('facilityName')}
                />
              </div>
              {step1Form.formState.errors.facilityName ? (
                <p className="mt-1 text-xs text-destructive">{step1Form.formState.errors.facilityName.message}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">The name of your clinic, hospital, or pharmacy.</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"

                  {...step1Form.register('email')}
                />
              </div>
              {step1Form.formState.errors.email && (
                <p className="mt-1 text-xs text-destructive">{step1Form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"

                  {...step1Form.register('password')}
                />
                {step1Form.watch('password') && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {step1Form.formState.errors.password && (
                <p className="mt-1 text-xs text-destructive">{step1Form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !step1Form.formState.isValid}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
              Sign in
            </a>
          </p>
        )}

        {step === 2 && !showDepartmentSelection && (
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
              <button
                type="button"
                onClick={() => setStep(1)}
                className="block w-full text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 2 && showDepartmentSelection && (
          <div className="space-y-5">
            <div className="flex gap-2">
              <input
                type="text"
                value={customDeptInput}
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
                className="h-10 flex-1 rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"

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

        {step === 3 && (
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
