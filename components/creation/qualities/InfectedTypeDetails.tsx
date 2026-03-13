"use client";

/**
 * InfectedTypeDetails
 *
 * Displays details about a selected HMHVV infected type, including
 * strain, karma cost, powers, and weaknesses.
 */

import type { InfectedTypeData } from "@/lib/rules/loader-types";

interface InfectedTypeDetailsProps {
  infectedType: InfectedTypeData;
}

function formatPowerName(powerId: string): string {
  return powerId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function InfectedTypeDetails({ infectedType }: InfectedTypeDetailsProps) {
  return (
    <div className="mt-3 space-y-3 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-purple-700 dark:text-purple-300">
          {infectedType.name}
        </h5>
        <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-800 dark:text-purple-300">
          {infectedType.hmhvvStrain.toUpperCase().replace(/-/g, " ")}
        </span>
      </div>

      {/* Karma Cost */}
      <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Karma:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{infectedType.karmaCost}</strong>
        </span>
        {infectedType.karmaCostAwakened !== undefined && (
          <span>
            Awakened:{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {infectedType.karmaCostAwakened}
            </strong>
          </span>
        )}
        <span>
          Base:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            {infectedType.baseMetatypes.join(", ")}
          </strong>
        </span>
      </div>

      {/* Attribute Bonuses */}
      {(infectedType.physicalAttributeBonus > 0 || infectedType.mentalAttributeBonus > 0) && (
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Attribute Bonuses: </span>
          {infectedType.physicalAttributeBonus > 0 && (
            <span className="mr-2">Physical +{infectedType.physicalAttributeBonus}</span>
          )}
          {infectedType.mentalAttributeBonus > 0 && (
            <span>Mental +{infectedType.mentalAttributeBonus}</span>
          )}
        </div>
      )}

      {/* Mandatory Powers */}
      {infectedType.mandatoryPowers.length > 0 && (
        <div>
          <h6 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Mandatory Powers
          </h6>
          <div className="mt-1 flex flex-wrap gap-1">
            {infectedType.mandatoryPowers.map((power) => (
              <span
                key={power}
                className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                {formatPowerName(power)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Optional Powers */}
      {infectedType.optionalPowers.length > 0 && (
        <div>
          <h6 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Optional Powers
          </h6>
          <div className="mt-1 flex flex-wrap gap-1">
            {infectedType.optionalPowers.map((power) => (
              <span
                key={power}
                className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {formatPowerName(power)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {infectedType.weaknesses.length > 0 && (
        <div>
          <h6 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Weaknesses
          </h6>
          <div className="mt-1 flex flex-wrap gap-1">
            {infectedType.weaknesses.map((weakness) => (
              <span
                key={weakness}
                className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"
              >
                {formatPowerName(weakness)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Essence Drain */}
      {infectedType.essenceDrain && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
          {infectedType.essenceDrain.description}
        </p>
      )}

      {/* Notes */}
      {infectedType.notes && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{infectedType.notes}</p>
      )}
    </div>
  );
}
