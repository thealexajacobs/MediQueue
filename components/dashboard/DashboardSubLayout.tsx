'use client';

import { TopBar } from '@/components/dashboard/TopBar';

interface DashboardSubLayoutProps {
  clinicName: string;
  children: React.ReactNode;
}

export function DashboardSubLayout({ clinicName, children }: DashboardSubLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar clinicName={clinicName} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
