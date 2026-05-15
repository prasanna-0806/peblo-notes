export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`}
      aria-hidden
    />
  );
}

export function WorkspaceSkeleton() {
  return (
    <section className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
      <aside className="w-full md:w-72 border-r border-slate-800 p-3 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </aside>
      <section className="hidden md:flex flex-1 flex-col p-6 gap-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </section>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </section>
  );
}
