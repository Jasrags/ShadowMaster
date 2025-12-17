"use client";

import Link from "next/link";
import type { Location, ID } from "@/lib/types";
import { LocationTypeBadge } from "./LocationTypeBadge";
import { LocationVisibilityBadge } from "./LocationVisibilityBadge";

interface LocationCardProps {
    location: Location;
    campaignId: ID;
    userRole: "gm" | "player";
    onEdit?: (locationId: ID) => void;
    onDelete?: (locationId: ID) => void;
}

export function LocationCard({
    location,
    campaignId,
    userRole,
    onEdit,
    onDelete,
}: LocationCardProps) {
    const isGM = userRole === "gm";

    // Count related content
    const npcCount = location.npcIds?.length || 0;
    const gruntCount = location.gruntTeamIds?.length || 0;
    const encounterCount = location.encounterIds?.length || 0;
    const childCount = location.childLocationIds?.length || 0;

    return (
        <div className="rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700">
            <Link
                href={`/campaigns/${campaignId}/locations/${location.id}`}
                className="block p-4"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                            {location.name}
                        </h3>
                        {location.parentLocationId && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Sub-location</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <LocationTypeBadge type={location.type} />
                        {isGM && <LocationVisibilityBadge visibility={location.visibility} />}
                    </div>
                </div>

                {/* Description */}
                {location.description && (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
                        {location.description}
                    </p>
                )}

                {/* Location Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {location.city && (
                        <span className="flex items-center gap-1">
                            <span>📍</span>
                            <span>
                                {location.district
                                    ? `${location.district}, ${location.city}`
                                    : location.city}
                            </span>
                        </span>
                    )}
                    {location.securityRating && (
                        <span className="flex items-center gap-1">
                            <span>🛡️</span>
                            <span>Security: {location.securityRating}</span>
                        </span>
                    )}
                    {location.visitCount !== undefined && location.visitCount > 0 && (
                        <span className="flex items-center gap-1">
                            <span>👣</span>
                            <span>{location.visitCount} visits</span>
                        </span>
                    )}
                </div>

                {/* Related Content Counts */}
                {(npcCount > 0 || gruntCount > 0 || encounterCount > 0 || childCount > 0) && (
                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                        {npcCount > 0 && (
                            <span>{npcCount} NPC{npcCount !== 1 ? "s" : ""}</span>
                        )}
                        {gruntCount > 0 && (
                            <span>{gruntCount} Grunt Team{gruntCount !== 1 ? "s" : ""}</span>
                        )}
                        {encounterCount > 0 && (
                            <span>{encounterCount} Encounter{encounterCount !== 1 ? "s" : ""}</span>
                        )}
                        {childCount > 0 && (
                            <span>{childCount} Sub-location{childCount !== 1 ? "s" : ""}</span>
                        )}
                    </div>
                )}

                {/* Tags */}
                {location.tags && location.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {location.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400"
                            >
                                {tag}
                            </span>
                        ))}
                        {location.tags.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                +{location.tags.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </Link>

            {/* Actions (GM only) */}
            {isGM && (onEdit || onDelete) && (
                <div className="flex items-center gap-2 px-4 py-2 border-t border-zinc-200 dark:border-zinc-800">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(location.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(location.id)}
                            className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
