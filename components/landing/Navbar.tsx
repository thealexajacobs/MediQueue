'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Analytics', href: '/#analytics' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/[0.07] bg-background/70 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">MediQueue</span>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/auth"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/auth?mode=register"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30"
          >
            Get Started
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-border/40 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-4 pt-2 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="my-1 h-px bg-border/40" />
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign in
            </Link>
            <div className="my-1 h-px bg-border/40" />
            <Link
              href="/auth?mode=register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Get Started
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
