"use client";

/**
 * CardSkeleton
 *
 * Loading skeleton for creation cards during dynamic import.
 * Matches the structure of CreationCard for seamless loading transitions.
 */

interface CardSkeletonProps {
  /** Title to show in the skeleton header */
  title: string;
  /** Number of content rows to show */
  rows?: number;
  /** Additional className */
  className?: string;
}

export function CardSkeleton({
  title,
  rows = 3,
  className = "",
}: CardSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
      aria-busy="true"
      aria-label={`Loading ${title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="mt-1 h-3 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
