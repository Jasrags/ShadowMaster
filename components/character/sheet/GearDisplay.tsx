"use client";

import { useState } from "react";
import type { GearItem } from "@/lib/types";
import type { GearItemData, GearCatalogData } from "@/lib/rules/RulesetContext";
import { useGear } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Package, Wifi } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

function formatCategoryLabel(category: string, catalog: GearCatalogData | null): string {
  if (catalog?.categories) {
    const found = catalog.categories.find((c) => c.id === category);
    if (found) return found.name;
  }
  // Fallback: kebab-case → Title Case
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Search all GearItemData sub-arrays in the catalog to find an item by name. */
function findCatalogItem(catalog: GearCatalogData | null, name: string): GearItemData | undefined {
  if (!catalog) return undefined;
  const arrays: (GearItemData[] | undefined)[] = [
    catalog.electronics,
    catalog.tools,
    catalog.survival,
    catalog.medical,
    catalog.security,
    catalog.miscellaneous,
    catalog.ammunition,
    catalog.rfidTags,
    catalog.industrialChemicals,
    catalog.visionEnhancements,
    catalog.audioEnhancements,
  ];
  for (const arr of arrays) {
    if (!arr) continue;
    const found = arr.find((item) => item.name === name);
    if (found) return found;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Category ordering
// ---------------------------------------------------------------------------

const CATEGORY_ORDER = ["electronics", "tools", "survival", "medical", "security", "miscellaneous"];

// ---------------------------------------------------------------------------
// GearRow
// ---------------------------------------------------------------------------

/** Extra fields present in the JSON data but not on the GearItemData TS type. */
type CatalogExtras = { wirelessBonus?: string; page?: number; source?: string };

function GearRow({ item, catalogItem }: { item: GearItem; catalogItem?: GearItemData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const extras = catalogItem as (GearItemData & CatalogExtras) | undefined;

  // Resolve stats: character item takes priority, catalog fills gaps
  const avail = item.availability ?? catalogItem?.availability;
  const legalityStr = item.legality ?? catalogItem?.legality;
  const cost = item.cost || catalogItem?.cost || 0;
  const weight = item.weight ?? catalogItem?.weight;

  const hasExpandableContent =
    avail != null ||
    cost > 0 ||
    !!item.modifications?.length ||
    !!item.notes ||
    !!item.specification ||
    !!catalogItem?.description ||
    !!extras?.wirelessBonus;

  return (
    <div
      data-testid="gear-row"
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
        {item.specification && (
          <span
            data-testid="specification-label"
            className="truncate text-[10px] text-zinc-400 dark:text-zinc-500"
          >
            ({item.specification})
          </span>
        )}
        {item.rating != null && (
          <span
            data-testid="rating-badge"
            className="shrink-0 rounded border border-indigo-500/20 bg-indigo-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300"
          >
            R{item.rating}
          </span>
        )}
        {item.quantity > 1 && (
          <span
            data-testid="quantity-badge"
            className="shrink-0 rounded border border-zinc-300/40 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          >
            ×{item.quantity}
          </span>
        )}
        {extras?.wirelessBonus && (
          <Wifi
            data-testid="wireless-icon"
            className="ml-auto h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
          />
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
          {catalogItem?.description && (
            <p
              data-testid="gear-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {catalogItem.description}
            </p>
          )}

          {/* Wireless bonus */}
          {extras?.wirelessBonus && (
            <div data-testid="wireless-bonus" className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">Wireless:</span>{" "}
              {extras.wirelessBonus}
            </div>
          )}

          {/* Stats row */}
          {(avail != null || cost > 0 || weight != null) && (
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
                    ¥{cost}
                  </span>
                </span>
              )}
              {weight != null && (
                <span data-testid="stat-weight">
                  Weight{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {weight}kg
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Capacity */}
          {item.capacity != null && (
            <div
              data-testid="capacity-section"
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              Capacity{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {item.capacityUsed ?? 0}/{item.capacity}
              </span>
            </div>
          )}

          {/* Modifications */}
          {item.modifications && item.modifications.length > 0 && (
            <div data-testid="modifications-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Modifications
              </div>
              <div className="space-y-0.5">
                {item.modifications.map((mod, idx) => (
                  <div
                    key={`${mod.catalogId}-${idx}`}
                    data-testid="mod-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    {mod.rating != null && (
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                        {mod.rating}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <p data-testid="gear-notes" className="text-xs text-zinc-500 dark:text-zinc-400">
              {item.notes}
            </p>
          )}

          {/* Source reference */}
          {extras?.page != null && (
            <p
              data-testid="source-reference"
              className="text-[10px] text-zinc-400 dark:text-zinc-600"
            >
              {extras.source ?? "Core"} p.{extras.page}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GearDisplay
// ---------------------------------------------------------------------------

interface GearDisplayProps {
  gear: GearItem[];
}

export function GearDisplay({ gear }: GearDisplayProps) {
  const catalog = useGear();

  if (!gear || gear.length === 0) {
    return (
      <DisplayCard title="General Gear" icon={<Package className="h-4 w-4 text-zinc-400" />}>
        <p className="text-sm text-zinc-500 italic">No gear acquired</p>
      </DisplayCard>
    );
  }

  // Group items by category
  const grouped: Record<string, GearItem[]> = {};
  for (const item of gear) {
    const cat = item.category || "miscellaneous";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  // Sort category keys: defined order first, then remaining alphabetically
  const categoryKeys = Object.keys(grouped);
  categoryKeys.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <DisplayCard title="General Gear" icon={<Package className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {categoryKeys.map((cat) => (
          <div key={cat}>
            <div
              data-testid="category-label"
              className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
            >
              {formatCategoryLabel(cat, catalog)}
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {grouped[cat].map((item, idx) => {
                const catalogItem = findCatalogItem(catalog, item.name);
                return (
                  <GearRow key={`${item.name}-${idx}`} item={item} catalogItem={catalogItem} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
