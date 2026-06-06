import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Forgot password</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form className="flex w-full max-w-sm flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-sm border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
            placeholder="you@clinic.com"
          />
        </div>

        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/auth?mode=login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
