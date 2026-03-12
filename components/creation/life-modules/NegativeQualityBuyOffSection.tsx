"use client";

/**
 * NegativeQualityBuyOffSection
 *
 * Displays module-granted negative qualities with toggle buttons to buy them off.
 * Per Run Faster p.67, characters can spend remaining karma to remove
 * negative qualities gained from life modules at 1x karma cost.
 */

import { useMemo, useCallback } from "react";
import { XCircle, Undo2 } from "lucide-react";
import type { LifeModuleQualityGrant } from "@/lib/types/life-modules";
import type { QualityData } from "@/lib/rules/loader-types";
import {
  getModuleGrantedNegativeQualities,
  calculateBuyOffCost,
} from "@/lib/rules/life-modules/buy-off";

interface NegativeQualityBuyOffSectionProps {
  /** All quality grants from resolved life modules */
  readonly grantedQualities: readonly LifeModuleQualityGrant[];
  /** Quality IDs currently bought off */
  readonly boughtOffIds: readonly string[];
  /** Negative quality catalog for name/karma lookups */
  readonly qualityCatalog: readonly QualityData[];
  /** Callback to update bought-off IDs */
  readonly onBuyOffChange: (updatedIds: readonly string[]) => void;
}

export function NegativeQualityBuyOffSection({
  grantedQualities,
  boughtOffIds,
  qualityCatalog,
  onBuyOffChange,
}: NegativeQualityBuyOffSectionProps) {
  const catalogMap = useMemo(() => new Map(qualityCatalog.map((q) => [q.id, q])), [qualityCatalog]);

  // All module-granted negative qualities (including bought-off ones for display)
  const negativeGrants = useMemo(
    () => getModuleGrantedNegativeQualities(grantedQualities),
    [grantedQualities]
  );

  const boughtOffSet = useMemo(() => new Set(boughtOffIds), [boughtOffIds]);

  const handleToggleBuyOff = useCallback(
    (qualityId: string) => {
      if (boughtOffSet.has(qualityId)) {
        onBuyOffChange(boughtOffIds.filter((id) => id !== qualityId));
      } else {
        onBuyOffChange([...boughtOffIds, qualityId]);
      }
    },
    [boughtOffIds, boughtOffSet, onBuyOffChange]
  );

  if (negativeGrants.length === 0) return null;

  return (
    <div className="space-y-1.5 border-t border-zinc-100 pt-2 dark:border-zinc-800">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Negative Quality Buy-Off
      </h4>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
        Spend karma to remove module-granted negative qualities (Run Faster p.67)
      </p>
      <div className="space-y-0.5">
        {negativeGrants.map((grant) => {
          const catalogEntry = catalogMap.get(grant.id);
          const name = catalogEntry?.name ?? grant.id;
          const cost = catalogEntry ? calculateBuyOffCost(catalogEntry) : 0;
          const isBoughtOff = boughtOffSet.has(grant.id);

          return (
            <div
              key={grant.id}
              className={`flex items-center justify-between rounded px-2 py-1 ${
                isBoughtOff
                  ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`truncate text-xs ${
                    isBoughtOff
                      ? "text-zinc-400 line-through dark:text-zinc-500"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono text-zinc-400">{cost}K</span>
                <button
                  onClick={() => handleToggleBuyOff(grant.id)}
                  className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                    isBoughtOff
                      ? "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                  }`}
                  title={isBoughtOff ? "Undo buy-off" : `Buy off for ${cost} Karma`}
                >
                  {isBoughtOff ? (
                    <>
                      <Undo2 className="h-2.5 w-2.5" />
                      Undo
                    </>
                  ) : (
                    <>
                      <XCircle className="h-2.5 w-2.5" />
                      Buy Off
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
