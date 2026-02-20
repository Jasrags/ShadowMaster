"use client";

import { useState } from "react";
import type { FocusItem } from "@/lib/types";
import type { FocusCatalogItemData } from "@/lib/rules/RulesetContext";
import { useFoci } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

// ---------------------------------------------------------------------------
// FocusRow
// ---------------------------------------------------------------------------

function FocusRow({ item, catalogItem }: { item: FocusItem; catalogItem?: FocusCatalogItemData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Resolve stats: character item takes priority, catalog fills gaps
  const avail = item.availability ?? catalogItem?.availability;
  const legalityStr = item.legality ?? catalogItem?.legality;
  const cost = item.cost || catalogItem?.costMultiplier || 0;

  const hasExpandableContent =
    avail != null || cost > 0 || !!item.karmaToBond || !!item.notes || !!catalogItem?.description;

  return (
    <div
      data-testid="focus-row"
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
          {item.name}
        </span>
        {item.bonded && (
          <span
            data-testid="bonded-badge"
            className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-emerald-500"
          >
            Bonded
          </span>
        )}
        <span
          data-testid="force-pill"
          className="ml-auto shrink-0 rounded border border-violet-500/20 bg-violet-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-violet-600 dark:text-violet-300"
        >
          F{item.force}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && hasExpandableContent && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stats row */}
          {(avail != null || cost > 0 || !!item.karmaToBond) && (
            <div
              data-testid="stats-row"
              className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
            >
              {avail != null && (
                <span data-testid="stat-availability">
                  Avail{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {avail}
                    {legalityStr ? formatLegality(legalityStr) : ""}
                  </span>
                </span>
              )}
              {cost > 0 && (
                <span data-testid="stat-cost">
                  Cost{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    ¥{cost.toLocaleString()}
                  </span>
                </span>
              )}
              {item.karmaToBond > 0 && (
                <span data-testid="stat-karma">
                  Bond{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.karmaToBond} karma
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {catalogItem?.description && (
            <p
              data-testid="focus-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {catalogItem.description}
            </p>
          )}

          {/* Notes */}
          {item.notes && (
            <p data-testid="focus-notes" className="text-xs text-zinc-500 dark:text-zinc-400">
              {item.notes}
            </p>
          )}

          {/* Source reference */}
          {catalogItem?.page != null && (
            <p
              data-testid="source-reference"
              className="text-[10px] text-zinc-400 dark:text-zinc-600"
            >
              {catalogItem.source ?? "Core"} p.{catalogItem.page}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FociDisplay
// ---------------------------------------------------------------------------

interface FociDisplayProps {
  foci: FocusItem[];
}

export function FociDisplay({ foci }: FociDisplayProps) {
  const catalog = useFoci();

  if (foci.length === 0) return null;

  return (
    <DisplayCard
      id="sheet-foci"
      title="Foci"
      icon={<Sparkles className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        {foci.map((focus, idx) => {
          const catalogItem = catalog.find((c) => c.id === focus.catalogId);
          return (
            <FocusRow
              key={focus.id || focus.catalogId || `focus-${idx}`}
              item={focus}
              catalogItem={catalogItem}
            />
          );
        })}
      </div>
    </DisplayCard>
  );
}
