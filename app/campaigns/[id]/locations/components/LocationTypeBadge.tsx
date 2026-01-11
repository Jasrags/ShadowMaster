"use client";

import type { LocationType } from "@/lib/types";

interface LocationTypeBadgeProps {
  type: LocationType;
  className?: string;
}

const TYPE_CONFIG: Record<LocationType, { label: string; bgColor: string; textColor: string }> = {
  physical: {
    label: "Physical",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  "matrix-host": {
    label: "Matrix Host",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
  },
  astral: {
    label: "Astral",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
  },
  "safe-house": {
    label: "Safe House",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
  },
  "meeting-place": {
    label: "Meeting Place",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
  },
  corporate: {
    label: "Corporate",
    bgColor: "bg-slate-500/20",
    textColor: "text-slate-400",
  },
  "gang-territory": {
    label: "Gang Territory",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
  },
  residential: {
    label: "Residential",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-400",
  },
  commercial: {
    label: "Commercial",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
  },
  industrial: {
    label: "Industrial",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-400",
  },
  underground: {
    label: "Underground",
    bgColor: "bg-stone-500/20",
    textColor: "text-stone-400",
  },
  other: {
    label: "Other",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
  },
};

export function LocationTypeBadge({ type, className = "" }: LocationTypeBadgeProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.other;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
}
