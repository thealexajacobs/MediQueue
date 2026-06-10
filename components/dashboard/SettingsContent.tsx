'use client';

import { DashboardSubLayout } from '@/components/dashboard/DashboardSubLayout';
import { Building2, Mail, Shield, User } from 'lucide-react';

export function SettingsContent() {
  const clinicName = 'Clinic Settings';

  return (
    <DashboardSubLayout clinicName={clinicName}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your clinic settings and preferences.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Clinic Information</h3>
                <p className="text-xs text-muted-foreground">Clinic name, address, contact details</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <User className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Staff Management</h3>
                <p className="text-xs text-muted-foreground">Invite and manage staff accounts</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Email and SMS notification preferences</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Security</h3>
                <p className="text-xs text-muted-foreground">Password, authentication, access control</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSubLayout>
  );
}
