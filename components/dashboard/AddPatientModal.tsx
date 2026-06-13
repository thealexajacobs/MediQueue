'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Loader2, Copy, Printer, Check, ChevronDown, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { addPatientSchema, type AddPatientInput } from '@/features/queue-entries/schemas/entry';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import type { QueueDTO } from '@/types';

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  queueId: string;
  queueName: string;
  queues?: QueueDTO[];
}

interface AddedPatient {
  id: string;
  patientName: string;
  queueNumber: number;
  publicUrl: string;
}

export function AddPatientModal({ open, onClose, queueId, queueName, queues }: AddPatientModalProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [addedPatient, setAddedPatient] = useState<AddedPatient | null>(null);
  const [selectedQueueId, setSelectedQueueId] = useState(queueId);
  const [deptOpen, setDeptOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const selectedQueue = queues?.find((q) => q.id === selectedQueueId);
  const displayQueueName = selectedQueue?.name ?? queueName;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddPatientInput>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: { queueId, patientName: '', phone: '' },
  });

  const patientNameValue = watch('patientName');
  const hasPatientName = (patientNameValue ?? '').trim().length > 0;

  /* Close department dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Reset state when the selected queue changes externally */
  useEffect(() => {
    setSelectedQueueId(queueId);
  }, [queueId]);

  async function onSubmit(data: AddPatientInput) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, queueId: selectedQueueId }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to add patient');
        return;
      }
      setAddedPatient(json.data);
      queryClient.invalidateQueries({ queryKey: ['queue-entries', selectedQueueId] });
      toast.success('Patient added to queue');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setAddedPatient(null);
    setCopied(false);
    reset();
    onClose();
  }

  function copyLink() {
    if (addedPatient?.publicUrl) {
      navigator.clipboard.writeText(addedPatient.publicUrl);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={addedPatient ? 'Patient Added' : 'Add Patient'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border/20 bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              {addedPatient ? (
                <Check className="h-4.5 w-4.5 text-primary" />
              ) : (
                <UserPlus className="h-4.5 w-4.5 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {addedPatient ? 'Patient Added' : 'Add Patient'}
              </h2>
              {!addedPatient && (
                <p className="text-xs text-muted-foreground">{displayQueueName}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {addedPatient ? (
            /* ========== Success State ========== */
            <div className="flex flex-col items-center gap-5">
              {/* Queue number badge */}
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Queue Number
                </p>
                <p className="mt-1 font-mono text-5xl font-bold tracking-tight text-primary">
                  #{String(addedPatient.queueNumber).padStart(3, '0')}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {addedPatient.patientName}
                </p>
              </div>

              {/* QR Code */}
              <div className="rounded-xl border-[1.5px] border-border/20 bg-white p-4">
                <QRCodeSVG value={addedPatient.publicUrl} size={160} />
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Share this QR code with the patient to track their queue status.
              </p>

              {/* Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/30 bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/30 bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>

              <button
                onClick={handleClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                <Check className="h-4 w-4" />
                Done
              </button>
            </div>
          ) : (
            /* ========== Form State ========== */
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Department selector */}
              {queues && queues.length > 1 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Department
                  </label>
                  <div className="relative" ref={deptRef}>
                    <button
                      type="button"
                      onClick={() => setDeptOpen(!deptOpen)}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-foreground transition-colors hover:bg-muted/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <span className="text-sm">{selectedQueue?.name ?? displayQueueName}</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${deptOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {deptOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border-[1.5px] border-border/30 bg-card shadow-lg">
                        {queues.map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => { setSelectedQueueId(q.id); setDeptOpen(false); }}
                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/40 ${
                              q.id === selectedQueueId ? 'bg-muted/40 font-medium text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {q.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Patient name */}
              <div>
                <label htmlFor="patientName" className="mb-1.5 block text-sm font-medium text-foreground">
                  Patient name <span className="text-destructive">*</span>
                </label>
                <input
                  id="patientName"
                  type="text"
                  autoFocus
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  placeholder="Full name"
                  {...register('patientName')}
                />
                {errors.patientName && (
                  <p className="mt-1 text-sm text-destructive">{errors.patientName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  Phone <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  placeholder="+2348012345678"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!hasPatientName || isLoading}
                className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Add to queue'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
