'use client';

import { useState } from 'react';
import { X, Loader2, Copy, Printer, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPatientSchema, type AddPatientInput } from '@/features/queue-entries/schemas/entry';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

interface AddPatientDrawerProps {
  open: boolean;
  onClose: () => void;
  queueId: string;
  queueName: string;
}

interface AddedPatient {
  id: string;
  patientName: string;
  queueNumber: number;
  publicUrl: string;
}

export function AddPatientDrawer({ open, onClose, queueId, queueName }: AddPatientDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [addedPatient, setAddedPatient] = useState<AddedPatient | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPatientInput>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: { queueId, patientName: '', phone: '' },
  });

  async function onSubmit(data: AddPatientInput) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, queueId }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to add patient');
        return;
      }
      setAddedPatient(json.data);
      toast.success('Patient added to queue');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setAddedPatient(null);
    reset();
    onClose();
  }

  function copyLink() {
    if (addedPatient?.publicUrl) {
      navigator.clipboard.writeText(addedPatient.publicUrl);
      toast.success('Link copied');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-background shadow-xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {addedPatient ? 'Patient Added' : 'Add Patient'}
            </h2>
            {!addedPatient && (
              <p className="text-xs text-muted-foreground mt-0.5">{queueName}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {addedPatient ? (
            <div className="flex flex-col items-center gap-6 pt-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Queue Number</p>
                <p className="font-mono text-4xl font-bold tracking-tight text-primary">
                  #{String(addedPatient.queueNumber).padStart(3, '0')}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {addedPatient.patientName}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-5">
                <QRCodeSVG value={addedPatient.publicUrl} size={200} />
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Share this QR code with the patient to track their queue status.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
