'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Failed to send reset link');
        setIsLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
          <Link href="/login" className="text-sm font-medium text-primary underline underline-offset-2">Back to login</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Forgot password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
                placeholder="you@clinic.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
