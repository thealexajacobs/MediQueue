export default function AnalyticsLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>
      <div className="relative z-10 flex h-14 items-center border-b border-border/[0.07] bg-background/70 backdrop-blur-xl px-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border/20 bg-card/60 p-4 sm:rounded-2xl sm:p-5">
              <div className="h-8 w-16 rounded bg-muted sm:h-9" />
              <div className="mt-2 h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="mb-8 animate-pulse rounded-xl border border-border/20 bg-card/60 p-5 sm:rounded-2xl sm:p-6">
          <div className="mb-4 h-4 w-28 rounded bg-muted" />
          <div className="flex items-end gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-sm bg-muted" style={{ height: `${20 + ((i * 37 + 13) % 35)}px` }} />
                <div className="h-3 w-4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-xl border border-border/20 bg-card/60 p-5 sm:rounded-2xl sm:p-6">
          <div className="mb-4 h-4 w-32 rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 flex-1 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-12 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
