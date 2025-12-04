export default function CharactersLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-48 bg-bg-muted rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-bg-muted rounded animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-8">
        <section>
          <div className="h-7 w-48 bg-bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-bg p-4 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-bg-muted" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-bg-muted rounded mb-2" />
                    <div className="h-4 w-1/2 bg-bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

