"use client";

import { useState } from "react";
import type { GearItem } from "@/lib/types";
import type { DrugCatalogItemData } from "@/lib/rules/loader-types";
import { useDrugs } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Pill } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

function formatEffectKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function formatEffectEntries(effects: Record<string, unknown>): [string, string][] {
  const skip = new Set(["description", "duration"]);
  return Object.entries(effects)
    .filter(([k]) => !skip.has(k))
    .filter(([, v]) => typeof v === "number" || typeof v === "boolean")
    .map(([k, v]) => {
      const label = formatEffectKey(k);
      if (typeof v === "boolean") return [label, "Yes"] as [string, string];
      const num = v as number;
      return [label, num > 0 ? `+${num}` : `${num}`] as [string, string];
    });
}

// ---------------------------------------------------------------------------
// DrugRow
// ---------------------------------------------------------------------------

function DrugRow({ drug, catalogData }: { drug: GearItem; catalogData?: DrugCatalogItemData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasExpandableContent = !!catalogData || drug.availability != null || !!drug.notes;

  const activeEntries = catalogData?.effects?.active
    ? formatEffectEntries(catalogData.effects.active)
    : [];
  const activeDescription =
    catalogData?.effects?.active && typeof catalogData.effects.active.description === "string"
      ? catalogData.effects.active.description
      : null;

  const crashEntries = catalogData?.effects?.crash
    ? formatEffectEntries(catalogData.effects.crash)
    : [];
  const crashDescription =
    catalogData?.effects?.crash && typeof catalogData.effects.crash.description === "string"
      ? catalogData.effects.crash.description
      : null;
  const crashDuration =
    catalogData?.effects?.crash && typeof catalogData.effects.crash.duration === "string"
      ? (catalogData.effects.crash.duration as string)
      : null;

  return (
    <div
      data-testid="drug-row"
      className={`px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50${
        hasExpandableContent
          ? " cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
          : ""
      }`}
      onClick={hasExpandableContent ? () => setIsExpanded(!isExpanded) : undefined}
    >
      {/* Collapsed row */}
      <div className="flex min-w-0 items-center gap-1.5">
        {hasExpandableContent ? (
          <span data-testid="expand-button" className="shrink-0 text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <div data-testid="spacer" className="w-3.5 shrink-0" />
        )}
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {drug.name}
        </span>
        {drug.rating != null && (
          <span
            data-testid="rating-badge"
            className="shrink-0 rounded border border-amber-500/20 bg-amber-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-300"
          >
            R{drug.rating}
          </span>
        )}
        {drug.quantity > 1 && (
          <span
            data-testid="quantity-badge"
            className="shrink-0 rounded border border-zinc-300/40 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          >
            ×{drug.quantity}
          </span>
        )}
      </div>

      {/* Expanded section */}
      {isExpanded && hasExpandableContent && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Description */}
          {catalogData?.description && (
            <p
              data-testid="drug-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {catalogData.description}
            </p>
          )}

          {/* Delivery stats */}
          {catalogData && (
            <div
              data-testid="delivery-stats"
              className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span>
                Vector{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {catalogData.vector.join(", ")}
                </span>
              </span>
              <span>
                Speed{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {catalogData.speed}
                </span>
              </span>
              <span>
                Duration{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {catalogData.duration}
                </span>
              </span>
            </div>
          )}

          {/* Active effects */}
          {(activeEntries.length > 0 || activeDescription) && (
            <div data-testid="active-effects-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Active Effects
              </div>
              {activeEntries.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activeEntries.map(([label, value]) => {
                    const isNegative = value.startsWith("-");
                    return (
                      <span
                        key={label}
                        data-testid="active-effect-badge"
                        className={`rounded-full border px-1.5 py-px font-mono text-[9px] font-semibold ${
                          isNegative
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-500 dark:text-rose-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {value === "Yes" ? label : `${value} ${label}`}
                      </span>
                    );
                  })}
                </div>
              )}
              {activeDescription && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{activeDescription}</p>
              )}
            </div>
          )}

          {/* Crash effects */}
          {(crashEntries.length > 0 || crashDescription) && (
            <div data-testid="crash-effects-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Crash
              </div>
              {crashDescription && (
                <p
                  data-testid="crash-description"
                  className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                  {crashDescription}
                </p>
              )}
              {crashEntries.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {crashEntries.map(([label, value]) => (
                    <span
                      key={label}
                      data-testid="crash-effect-badge"
                      className="rounded-full border border-rose-500/20 bg-rose-500/10 px-1.5 py-px font-mono text-[9px] font-semibold text-rose-500 dark:text-rose-400"
                    >
                      {value === "Yes" ? label : `${value} ${label}`}
                    </span>
                  ))}
                </div>
              )}
              {crashDuration && (
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Duration{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {crashDuration}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Addiction stats */}
          {catalogData && (
            <div
              data-testid="addiction-stats"
              className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span>
                Addiction{" "}
                <span className="rounded border border-zinc-300/40 bg-zinc-100 px-1 py-px font-mono text-[9px] font-semibold uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {catalogData.addictionType}
                </span>
              </span>
              <span>
                Rating{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {catalogData.addictionRating}
                </span>
              </span>
              <span>
                Threshold{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {catalogData.addictionThreshold}
                </span>
              </span>
            </div>
          )}

          {/* Availability */}
          {(drug.availability != null || catalogData?.availability != null) && (
            <div
              data-testid="stat-availability"
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              Avail{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drug.availability ?? catalogData?.availability}
                {(drug.legality && formatLegality(drug.legality)) ||
                  (catalogData?.legality && formatLegality(catalogData.legality)) ||
                  ""}
              </span>
            </div>
          )}

          {/* Cost */}
          <div data-testid="stat-cost" className="text-xs text-zinc-500 dark:text-zinc-400">
            Cost{" "}
            <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
              ¥{drug.cost}
            </span>
          </div>

          {/* Notes */}
          {drug.notes && (
            <p data-testid="drug-notes" className="text-xs text-zinc-500 dark:text-zinc-400">
              {drug.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DrugsDisplay
// ---------------------------------------------------------------------------

interface DrugsDisplayProps {
  drugs: GearItem[];
}

export function DrugsDisplay({ drugs }: DrugsDisplayProps) {
  const catalog = useDrugs();

  if (drugs.length === 0) return null;

  return (
    <DisplayCard title="Drugs & Toxins" icon={<Pill className="h-4 w-4 text-zinc-400" />}>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        {drugs.map((drug, idx) => {
          const catalogData = catalog.find((c: DrugCatalogItemData) => c.name === drug.name);
          return <DrugRow key={`${drug.name}-${idx}`} drug={drug} catalogData={catalogData} />;
        })}
      </div>
    </DisplayCard>
  );
}
