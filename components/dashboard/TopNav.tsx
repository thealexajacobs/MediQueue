'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface TopNavProps {
  clinicName: string;
}

export function TopNav({ clinicName }: TopNavProps) {
  const [dateTime, setDateTime] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      setDateTime(
        new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">MediQueue</span>
        </div>

        <div className="hidden h-4 w-px bg-border md:block" />

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm font-medium text-foreground">{clinicName}</span>
          <span className="hidden text-xs text-muted-foreground lg:inline">• {dateTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`relative hidden transition-all duration-200 md:block ${
            searchFocused ? 'md:w-64' : 'md:w-48'
          }`}
        >
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
            ⌘K
          </kbd>
        </div>

        <button
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowProfileMenu((p) => !p)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {clinicName.charAt(0)}
            </div>
            <ChevronDown className="h-3 w-3 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">{clinicName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Clinic Administrator</p>
              </div>
              <div className="p-1">
                <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth?mode=login' })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
