"use client";

import { useState, useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Zap } from "lucide-react";
import type { AdeptPower } from "@/lib/types";
import { useAdeptPowers } from "@/lib/rules";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";

interface AdeptPowersDisplayProps {
  adeptPowers: AdeptPower[];
}

const ACTIVATION_LABELS: Record<string, string> = {
  free: "Free Action",
  simple: "Simple Action",
  complex: "Complex Action",
  interrupt: "Interrupt",
};

function PowerRow({
  power,
  catalogEntry,
}: {
  power: AdeptPower;
  catalogEntry: AdeptPowerCatalogItem | undefined;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasExpandableContent = !!(
    power.specification ||
    catalogEntry?.description ||
    catalogEntry?.activation
  );

  return (
    <div className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t border-zinc-200 dark:border-zinc-800/50">
      {/* Collapsed row: Chevron + Name + Rating */}
      <div className="flex min-w-0 items-center gap-1.5">
        {hasExpandableContent ? (
          <button
            data-testid="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="inline-block w-3.5 shrink-0" />
        )}
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {power.name}
        </span>
        {power.rating && power.rating > 0 && (
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">{power.rating}</span>
        )}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {catalogEntry?.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {catalogEntry.description}
            </p>
          )}
          {catalogEntry?.activation && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Activation:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {ACTIVATION_LABELS[catalogEntry.activation] || catalogEntry.activation}
              </span>
            </div>
          )}
          {power.specification && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Specification:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {power.specification}
              </span>
            </div>
          )}
          {catalogEntry?.hasRating && catalogEntry.maxRating && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Rating:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {power.rating || 1} / {catalogEntry.maxRating}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdeptPowersDisplay({ adeptPowers }: AdeptPowersDisplayProps) {
  const catalog = useAdeptPowers();

  const catalogMap = useMemo(() => {
    const map = new Map<string, AdeptPowerCatalogItem>();
    for (const item of catalog) {
      map.set(item.id, item);
    }
    return map;
  }, [catalog]);

  if (!adeptPowers || adeptPowers.length === 0) return null;

  return (
    <DisplayCard title="Adept Powers" icon={<Zap className="h-4 w-4 text-amber-400" />}>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        {adeptPowers.map((power, idx) => (
          <PowerRow
            key={power.id || idx}
            power={power}
            catalogEntry={catalogMap.get(power.catalogId)}
          />
        ))}
      </div>
    </DisplayCard>
  );
}
