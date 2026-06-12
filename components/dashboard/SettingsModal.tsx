'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  X, Loader2, Pencil, Archive, Plus, Image,
  Check, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueues, useCreateQueue, useUpdateQueue, useDeleteQueue } from '@/features/queues/hooks/useQueueMutations';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  clinicName?: string;
  clinicId?: string;
  userName?: string;
  userEmail?: string;
}

export function SettingsModal({ open, onClose, clinicName, clinicId, userName, userEmail }: SettingsModalProps) {
  const { data: session, update: updateSession } = useSession();
  const { data: queues } = useQueues();
  const createQueue = useCreateQueue();
  const updateQueue = useUpdateQueue();
  const deleteQueue = useDeleteQueue();

  const [facilityName, setFacilityName] = useState(clinicName ?? '');
  const [facilityDirty, setFacilityDirty] = useState(false);
  const [savingFacility, setSavingFacility] = useState(false);

  const [displayName, setDisplayName] = useState(userName ?? session?.user?.name ?? '');
  const [profileDirty, setProfileDirty] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [sendingReset, setSendingReset] = useState(false);

  const [editingQueueId, setEditingQueueId] = useState<string | null>(null);
  const [editingQueueName, setEditingQueueName] = useState('');
  const [archivingQueueId, setArchivingQueueId] = useState<string | null>(null);

  const [showAddQueue, setShowAddQueue] = useState(false);
  const [newQueueName, setNewQueueName] = useState('');

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const addQueueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFacilityName(clinicName ?? '');
      setDisplayName(userName ?? session?.user?.name ?? '');
      setFacilityDirty(false);
      setProfileDirty(false);
      setSendingReset(false);
      setShowAddQueue(false);
      setNewQueueName('');
      setLogoPreview(null);
    }
  }, [open, clinicName, userName, session]);

  useEffect(() => {
    if (showAddQueue && addQueueInputRef.current) {
      addQueueInputRef.current.focus();
    }
  }, [showAddQueue]);

  async function handleSaveFacility() {
    if (!facilityName.trim()) return;
    setSavingFacility(true);
    try {
      const res = await fetch('/api/clinics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: facilityName.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setFacilityDirty(false);
      toast.success('Facility name updated');
    } catch {
      toast.error('Failed to update facility name');
    } finally {
      setSavingFacility(false);
    }
  }

  async function handleSaveProfile() {
    if (!displayName.trim()) return;
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setProfileDirty(false);
      await updateSession({ name: displayName.trim() });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSendResetLink() {
    setSendingReset(true);
    try {
      const email = userEmail ?? session?.user?.email;
      if (!email) {
        toast.error('No email address on file');
        return;
      }
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send reset link');
      toast.success('Password reset link sent to your email');
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setSendingReset(false);
    }
  }

  async function handleAddQueue() {
    const name = newQueueName.trim();
    if (!name) return;
    try {
      await createQueue.mutateAsync({ name });
      setNewQueueName('');
      setShowAddQueue(false);
      toast.success('Queue added');
    } catch {
      toast.error('Failed to add queue');
    }
  }

  async function handleRenameQueue(id: string) {
    try {
      await updateQueue.mutateAsync({ id, name: editingQueueName.trim() });
      setEditingQueueId(null);
      toast.success('Queue renamed');
    } catch {
      toast.error('Failed to rename queue');
    }
  }

  async function handleArchiveQueue(id: string) {
    setArchivingQueueId(id);
    try {
      await deleteQueue.mutateAsync(id);
      toast.success('Queue archived');
    } catch {
      toast.error('Failed to archive queue');
    } finally {
      setArchivingQueueId(null);
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-background shadow-xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/10 px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">

            {/* ========== FACILITY ========== */}
            <section>
              <h3 className="text-sm font-semibold text-foreground">Facility</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Basic facility identity information used throughout the system.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="facility-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Facility Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="facility-name"
                      type="text"
                      value={facilityName}
                      onChange={(e) => { setFacilityName(e.target.value); setFacilityDirty(true); }}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveFacility}
                      disabled={!facilityDirty || !facilityName.trim() || savingFacility}
                      isLoading={savingFacility}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Facility Logo <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                      ) : (
                        <Image className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40">
                      <Image className="h-4 w-4" />
                      Choose file
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border/10" />

            {/* ========== QUEUES ========== */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Queues</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Manage service queues used in daily operations.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddQueue(!showAddQueue)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Queue
                </Button>
              </div>

              {showAddQueue && (
                <div className="mt-3 flex gap-2">
                  <input
                    ref={addQueueInputRef}
                    type="text"
                    value={newQueueName}
                    onChange={(e) => setNewQueueName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddQueue(); if (e.key === 'Escape') { setShowAddQueue(false); setNewQueueName(''); } }}
                    className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Queue name"
                  />
                  <Button size="sm" onClick={handleAddQueue} isLoading={createQueue.isPending} disabled={!newQueueName.trim()}>
                    Add
                  </Button>
                </div>
              )}

              <div className="mt-3 space-y-1.5">
                {queues?.map((queue) => (
                  <div
                    key={queue.id}
                    className="flex items-center gap-2 rounded-lg border border-border/20 bg-card px-3 py-2.5"
                  >
                    {editingQueueId === queue.id ? (
                      <>
                        <input
                          type="text"
                          value={editingQueueName}
                          onChange={(e) => setEditingQueueName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleRenameQueue(queue.id); if (e.key === 'Escape') setEditingQueueId(null); }}
                          className="h-8 flex-1 rounded border border-input bg-background px-2 text-sm text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameQueue(queue.id)}
                          disabled={updateQueue.isPending}
                          className="rounded p-1 text-primary hover:bg-primary/10"
                          aria-label="Confirm rename"
                        >
                          {updateQueue.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingQueueId(null)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted/40"
                          aria-label="Cancel rename"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{queue.name}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => { setEditingQueueId(queue.id); setEditingQueueName(queue.name); }}
                            className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            aria-label={`Rename ${queue.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchiveQueue(queue.id)}
                            disabled={archivingQueueId === queue.id}
                            className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            aria-label={`Archive ${queue.name}`}
                          >
                            {archivingQueueId === queue.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Archive className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {!queues?.length && (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No queues yet. Add one to get started.
                  </p>
                )}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border/10" />

            {/* ========== ACCOUNT ========== */}
            <section>
              <h3 className="text-sm font-semibold text-foreground">Account</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Manage your personal account settings.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="display-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => { setDisplayName(e.target.value); setProfileDirty(true); }}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={!profileDirty || !displayName.trim() || savingProfile}
                      isLoading={savingProfile}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="flex h-10 items-center rounded-lg border border-border/30 bg-muted/20 px-3 text-sm text-muted-foreground">
                    {userEmail ?? session?.user?.email ?? '—'}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendResetLink}
                    disabled={sendingReset}
                    isLoading={sendingReset}
                  >
                    Send Reset Link
                  </Button>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    We'll send you an email with a link to securely reset your password.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
