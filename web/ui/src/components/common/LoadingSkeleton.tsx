interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

export function LoadingSkeleton({ rows = 5, columns = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Search bar skeleton */}
      <div className="h-10 bg-sr-gray border border-sr-light-gray rounded-md animate-pulse" />

      {/* Table skeleton */}
      <div className="border border-sr-light-gray rounded-lg overflow-hidden">
        {/* Header skeleton */}
        <div className="bg-sr-gray border-b border-sr-light-gray">
          <div className="flex">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="flex-1 px-4 py-3 border-r border-sr-light-gray last:border-r-0"
              >
                <div className="h-4 bg-sr-light-gray rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex border-b border-sr-light-gray last:border-b-0"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 px-4 py-3 border-r border-sr-light-gray last:border-r-0"
              >
                <div className="h-4 bg-sr-gray rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-sr-gray rounded animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-sr-gray rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

