'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/dashboard/patients', icon: Users },
  { label: 'Queues', href: '/dashboard/queues', icon: ListOrdered },

  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  clinicName: string;
}

export function Sidebar({ clinicName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          M
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-foreground">{clinicName}</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div
          className={`rounded-xl bg-muted/50 p-3 ${collapsed ? 'flex flex-col items-center' : ''}`}
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          {!collapsed && (
            <div className="mt-2">
              <p className="text-xs font-medium text-foreground">Need help?</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Check our documentation or contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
