export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-14 animate-pulse items-center justify-between border-b border-border/40 px-6">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="h-5 w-20 rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="w-full shrink-0 space-y-6 lg:w-[340px]">
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
