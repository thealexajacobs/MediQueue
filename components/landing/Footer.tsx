import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-12 lg:gap-16">
          <div className="max-w-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                M
              </div>
              <span className="text-sm font-semibold text-foreground">MediQueue</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Real-time queue management for medical facilities. Replace your manual queue board with a live digital system.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16 lg:gap-20">
            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Product</h4>
              <ul className="space-y-3">
                <li><a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a></li>
                <li><a href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a></li>
                <li><a href="/#analytics" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Analytics</a></li>
                <li><Link href="/auth?mode=register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Get Started</Link></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Contact</h4>
              <ul className="space-y-3">
                <li><a href="mailto:hello@mediqueue.com" className="text-sm text-muted-foreground transition-colors hover:text-foreground">hello@mediqueue.com</a></li>
                <li><span className="text-sm text-muted-foreground">Support: help@mediqueue.com</span></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-6 sm:mt-12 sm:flex-row sm:pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MediQueue. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Built for medical facility reception teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
