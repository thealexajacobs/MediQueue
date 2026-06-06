'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPatientSchema, type AddPatientInput } from '@/features/queue-entries/schemas/entry';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Loader2, Check, Copy, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

interface PatientAddModalProps {
  open: boolean;
  onClose: () => void;
  queueId: string;
}

interface AddedPatient {
  id: string;
  patientName: string;
  queueNumber: number;
  publicUrl: string;
}

export function PatientAddModal({ open, onClose, queueId }: PatientAddModalProps) {
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

  function printQR() {
    window.print();
  }

  return (
    <Dialog open={open} onClose={handleClose} title={addedPatient ? 'Patient added' : 'Add patient'}>
      {addedPatient ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            {addedPatient.patientName} — Queue #{addedPatient.queueNumber}
          </p>

          <div className="rounded-lg border border-border bg-white p-4">
            <QRCodeSVG value={addedPatient.publicUrl} size={180} />
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyLink} className="h-9 text-xs">
              <Copy className="h-4 w-4" />
              Copy link
            </Button>
            <Button variant="secondary" onClick={printQR} className="h-9 text-xs">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>

          <Button variant="primary" onClick={handleClose} className="w-full">
            <Check className="h-4 w-4" />
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="patientName" className="mb-1 block text-sm text-muted-foreground">
              Patient name <span className="text-destructive">*</span>
            </label>
            <input
              id="patientName"
              type="text"
              autoFocus
              className="h-11 w-full rounded-sm border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
              placeholder="Full name"
              {...register('patientName')}
            />
            {errors.patientName && (
              <p className="mt-1 text-sm text-destructive">{errors.patientName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm text-muted-foreground">
              Phone <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="h-11 w-full rounded-sm border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
              placeholder="+2348012345678"
              {...register('phone')}
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to queue'}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
