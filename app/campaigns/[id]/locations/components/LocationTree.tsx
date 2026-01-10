"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, MapPin, Building, Folder, File } from "lucide-react";
import type { Location } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LocationTreeProps {
  locations: Location[];
  campaignId: string;
}

interface TreeNodeProps {
  location: Location;
  allLocations: Location[];
  campaignId: string;
  depth?: number;
}

function TreeNode({ location, allLocations, campaignId, depth = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const children = allLocations.filter((l) => l.parentLocationId === location.id);

  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
          depth > 0 && "ml-6"
        )}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-200 dark:hover:bg-zinc-700",
            !hasChildren && "invisible"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          )}
        </button>

        <Link
          href={`/campaigns/${campaignId}/locations/${location.id}`}
          className="flex flex-1 items-center gap-2"
        >
          <LocationIcon type={location.type} className="h-4 w-4 text-indigo-500" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{location.name}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {location.type.replace("-", " ")}
          </span>
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical line for visual hierarchy */}
          <div
            className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-zinc-200 dark:bg-zinc-800"
            style={{ height: "calc(100% - 1rem)" }}
          />
          <div className="flex flex-col">
            {children.map((child) => (
              <TreeNode
                key={child.id}
                location={child}
                allLocations={allLocations}
                campaignId={campaignId}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LocationTree({ locations, campaignId }: LocationTreeProps) {
  // Find root nodes (no parent or parent not in the list)
  // Note: The parent check is important in case we are filtering the list
  const locationIds = new Set(locations.map((l) => l.id));
  const roots = locations.filter(
    (l) => !l.parentLocationId || !locationIds.has(l.parentLocationId)
  );

  if (roots.length === 0 && locations.length > 0) {
    // Fallback for when current view has items but no roots (circular or weird filter)
    return <div className="text-zinc-500">Tree view unavailable for current filter.</div>;
  }

  return (
    <div className="space-y-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      {roots.map((root) => (
        <TreeNode key={root.id} location={root} allLocations={locations} campaignId={campaignId} />
      ))}
    </div>
  );
}

function LocationIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "physical":
    case "meeting-place":
    case "safe-house":
      return <MapPin className={className} />;
    case "corporate":
    case "commercial":
    case "industrial":
    case "residential":
      return <Building className={className} />;
    case "matrix-host":
    case "data":
      return <Folder className={className} />; // Or a better icon
    default:
      return <File className={className} />;
  }
}
