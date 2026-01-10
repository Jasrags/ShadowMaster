"use client";

import type { LocationVisibility } from "@/lib/types";

interface LocationVisibilityBadgeProps {
  visibility: LocationVisibility;
  className?: string;
}

const VISIBILITY_CONFIG: Record<
  LocationVisibility,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  "gm-only": {
    label: "GM Only",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    icon: "🔒",
  },
  players: {
    label: "Players",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    icon: "👥",
  },
  public: {
    label: "Public",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    icon: "🌐",
  },
};

export function LocationVisibilityBadge({
  visibility,
  className = "",
}: LocationVisibilityBadgeProps) {
  const config = VISIBILITY_CONFIG[visibility] || VISIBILITY_CONFIG.players;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
