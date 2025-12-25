"use client";

import { PROFESSIONAL_RATING_DESCRIPTIONS, type ProfessionalRating } from "@/lib/types";

interface ProfessionalRatingBadgeProps {
  rating: ProfessionalRating;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const RATING_COLORS: Record<ProfessionalRating, { bg: string; text: string; border: string }> = {
  0: {
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-600 dark:text-zinc-400",
    border: "border-zinc-300 dark:border-zinc-700",
  },
  1: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-300 dark:border-green-700",
  },
  2: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-700",
  },
  3: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  4: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-700",
  },
  5: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
  },
  6: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-300 dark:border-purple-700",
  },
};

const SIZE_CLASSES = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function ProfessionalRatingBadge({
  rating,
  showLabel = false,
  size = "sm",
}: ProfessionalRatingBadgeProps) {
  const colors = RATING_COLORS[rating];
  const description = PROFESSIONAL_RATING_DESCRIPTIONS[rating];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-medium ${colors.bg} ${colors.text} ${colors.border} ${SIZE_CLASSES[size]}`}
      title={description}
    >
      <span className="font-bold">PR {rating}</span>
      {showLabel && <span className="hidden sm:inline">- {description.split(":")[0]}</span>}
    </span>
  );
}
