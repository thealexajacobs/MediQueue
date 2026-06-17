'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, ChevronDown, BarChart3 } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface TopBarProps {
  clinicName: string;
  hideExtras?: boolean;
  onSettingsClick?: () => void;
}

export function TopBar({ clinicName, hideExtras, onSettingsClick }: TopBarProps) {
  const router = useRouter();
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
    <div className="flex h-14 items-center justify-between border-b border-border/[0.07] bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <span className="text-sm font-semibold text-foreground">MediQueue</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {!hideExtras && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowProfile((p) => !p)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
            >
              <span className="text-primary">{clinicName}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border-[1.5px] border-border/30 bg-card shadow-lg">
                <div className="p-1">
                  <Link
                    href="/dashboard/analytics"
                    onClick={() => setShowProfile(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                  <div className="my-1 border-t border-border/10" />
                  <button
                    onClick={() => { setShowProfile(false); onSettingsClick?.(); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={async () => {
                      setShowProfile(false);
                      await signOut({ redirect: false });
                      router.push('/login');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
