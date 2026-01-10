"use client";

import Link from "next/link";
import { Users, Shield, Zap, AlertTriangle, Crown, Star } from "lucide-react";
import type { GruntTeam, ID } from "@/lib/types";
import { ProfessionalRatingBadge } from "./ProfessionalRatingBadge";

interface GruntTeamCardProps {
  team: GruntTeam;
  campaignId: ID;
  userRole: "gm" | "player";
  onEdit?: (teamId: ID) => void;
  onDelete?: (teamId: ID) => void;
}

function getMoraleStatusColor(moraleBroken: boolean): string {
  if (moraleBroken) {
    return "text-red-600 dark:text-red-400";
  }
  return "text-green-600 dark:text-green-400";
}

function getMoraleStatusLabel(moraleBroken: boolean): string {
  return moraleBroken ? "Broken" : "Steady";
}

export function GruntTeamCard({
  team,
  campaignId,
  userRole,
  onEdit,
  onDelete,
}: GruntTeamCardProps) {
  const isGM = userRole === "gm";
  const activeCount = team.state?.activeCount ?? team.initialSize;
  const casualties = team.state?.casualties ?? 0;
  const totalSize = team.initialSize;
  const groupEdge = team.groupEdge ?? 0;
  const groupEdgeMax = team.groupEdgeMax ?? team.professionalRating;
  const moraleBroken = team.state?.moraleBroken ?? false;

  const hasLieutenant = !!team.lieutenant;
  const specialistCount = team.specialists?.length ?? 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700">
      <Link href={`/campaigns/${campaignId}/grunt-teams/${team.id}`} className="block p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {team.name}
            </h3>
          </div>
          <ProfessionalRatingBadge rating={team.professionalRating} />
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
            {team.description}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Active Count */}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-700 dark:text-zinc-300">
              {activeCount}/{totalSize}
            </span>
            {casualties > 0 && (
              <span className="text-red-500 dark:text-red-400">(-{casualties})</span>
            )}
          </div>

          {/* Group Edge */}
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-zinc-700 dark:text-zinc-300">
              {groupEdge}/{groupEdgeMax}
            </span>
          </div>

          {/* Morale Status */}
          <div className="flex items-center gap-1.5">
            <Shield className={`h-4 w-4 ${getMoraleStatusColor(moraleBroken)}`} />
            <span className={getMoraleStatusColor(moraleBroken)}>
              {getMoraleStatusLabel(moraleBroken)}
            </span>
          </div>
        </div>

        {/* Special Units */}
        {(hasLieutenant || specialistCount > 0) && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
            {hasLieutenant && (
              <span className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500" />
                <span>Lieutenant</span>
              </span>
            )}
            {specialistCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-indigo-500" />
                <span>
                  {specialistCount} Specialist{specialistCount !== 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Visibility Warning (GM only) */}
        {isGM && !team.visibility?.showToPlayers && (
          <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Hidden from players</span>
          </div>
        )}
      </Link>

      {/* Actions (GM only) */}
      {isGM && (onEdit || onDelete) && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-zinc-200 dark:border-zinc-800">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit(team.id);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(team.id);
              }}
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
