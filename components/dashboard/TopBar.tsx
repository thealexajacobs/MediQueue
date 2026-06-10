'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Settings, LogOut, ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

interface TopBarProps {
  clinicName: string;
}

export function TopBar({ clinicName }: TopBarProps) {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showProfile) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfile]);

  return (
    <div className="flex h-14 items-center justify-between border-b border-border/40 bg-background px-6">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          M
        </div>
        <span className="text-sm font-semibold text-foreground">MediQueue</span>
      </Link>

      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div ref={menuRef} className="relative">
        <button
          onClick={() => setShowProfile((p) => !p)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <span>{clinicName}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showProfile ? 'rotate-180' : ''}`} />
        </button>

        {showProfile && (
          <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">{clinicName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Clinic Staff</p>
            </div>
            <div className="p-1">
              <Link
                href="/dashboard/settings"
                onClick={() => setShowProfile(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/auth?mode=login' })}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
