"use client";

import { useState } from "react";
import type { Character, Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";
import type { DeviceCondition } from "@/lib/types/gear-state";
import type {
  VehiclesCatalogData,
  VehicleCatalogItemData,
  DroneCatalogItemData,
  RCCCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { useVehiclesCatalog } from "@/lib/rules";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { DisplayCard } from "./DisplayCard";
import { WirelessIndicator } from "@/app/characters/[id]/components/WirelessIndicator";
import { ChevronDown, ChevronRight, Car, Wifi, WifiOff } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

type VehicleItem = Vehicle | CharacterDrone | CharacterRCC;

function isRCC(item: VehicleItem): item is CharacterRCC {
  return "deviceRating" in item;
}

function isDrone(item: VehicleItem): item is CharacterDrone {
  return "size" in item;
}

function isMatrixCapable(item: VehicleItem): boolean {
  return isDrone(item) || isRCC(item);
}

// ---------------------------------------------------------------------------
// Condition badge helper
// ---------------------------------------------------------------------------

function getConditionBadge(
  condition?: DeviceCondition
): { label: string; className: string } | null {
  if (!condition || condition === "functional") return null;
  if (condition === "bricked") {
    return {
      label: "BRICKED",
      className:
        "shrink-0 rounded border border-red-500/30 bg-red-500/10 px-1 text-[9px] font-bold uppercase text-red-500",
    };
  }
  if (condition === "destroyed") {
    return {
      label: "DESTROYED",
      className:
        "shrink-0 rounded border border-red-800/30 bg-red-800/10 px-1 text-[9px] font-bold uppercase text-red-800 dark:text-red-400",
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wireless toggle helpers
// ---------------------------------------------------------------------------

function toggleDroneWireless(
  character: Character,
  droneIndex: number,
  enabled: boolean,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedDrones = character.drones?.map((d, idx) =>
    idx === droneIndex
      ? {
          ...d,
          state: {
            ...d.state,
            readiness: d.state?.readiness ?? ("stored" as const),
            wirelessEnabled: enabled,
          },
        }
      : d
  );

  onCharacterUpdate({ ...character, drones: updatedDrones });
}

function toggleRCCWireless(
  character: Character,
  rccIndex: number,
  enabled: boolean,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedRCCs = character.rccs?.map((r, idx) =>
    idx === rccIndex
      ? {
          ...r,
          state: {
            ...r.state,
            readiness: r.state?.readiness ?? ("stored" as const),
            wirelessEnabled: enabled,
          },
        }
      : r
  );

  onCharacterUpdate({ ...character, rccs: updatedRCCs });
}

// ---------------------------------------------------------------------------
// Catalog lookup helpers
// ---------------------------------------------------------------------------

function findCatalogVehicle(
  catalog: VehiclesCatalogData | null,
  catalogId: string
): VehicleCatalogItemData | undefined {
  if (!catalog) return undefined;
  for (const arr of [catalog.groundcraft, catalog.watercraft, catalog.aircraft]) {
    const found = arr?.find((v) => v.id === catalogId);
    if (found) return found;
  }
  return undefined;
}

function findCatalogDrone(
  catalog: VehiclesCatalogData | null,
  catalogId: string
): DroneCatalogItemData | undefined {
  if (!catalog) return undefined;
  return catalog.drones?.find((d) => d.id === catalogId);
}

function findCatalogRCC(
  catalog: VehiclesCatalogData | null,
  catalogId: string
): RCCCatalogItemData | undefined {
  if (!catalog) return undefined;
  return catalog.rccs?.find((r) => r.id === catalogId);
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const VEHICLE_SECTIONS = [
  { key: "vehicles" as const, label: "Vehicles" },
  { key: "drones" as const, label: "Drones" },
  { key: "rccs" as const, label: "RCCs" },
];

// ---------------------------------------------------------------------------
// Catalog entry union
// ---------------------------------------------------------------------------

type CatalogEntry = {
  description?: string;
  page?: number;
  source?: string;
  cost?: number;
  availability?: number;
  legality?: string;
  weaponMounts?: { standard?: number; heavy?: number };
};

function getCatalogEntry(
  catalog: VehiclesCatalogData | null,
  item: VehicleItem
): CatalogEntry | undefined {
  if (!item.catalogId) return undefined;
  if (isRCC(item)) return findCatalogRCC(catalog, item.catalogId);
  if (isDrone(item)) return findCatalogDrone(catalog, item.catalogId);
  return findCatalogVehicle(catalog, item.catalogId);
}

// ---------------------------------------------------------------------------
// VehicleRow
// ---------------------------------------------------------------------------

interface VehicleRowProps {
  item: VehicleItem;
  catalogEntry?: CatalogEntry;
  sectionKey: "vehicles" | "drones" | "rccs";
  itemIndex: number;
  character?: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

function VehicleRow({
  item,
  catalogEntry,
  sectionKey,
  itemIndex,
  character,
  onCharacterUpdate,
  editable,
}: VehicleRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = isRCC(item)
    ? (item.customName ?? item.name)
    : isDrone(item)
      ? (item.customName ?? item.name)
      : item.name;

  const badgeText = isRCC(item) ? "RCC" : isDrone(item) ? item.size : item.type;
  const badgeLabel = badgeText.charAt(0).toUpperCase() + badgeText.slice(1);

  const cost = item.cost || catalogEntry?.cost || 0;

  // Condition and wireless state
  const condition = item.state?.condition;
  const conditionBadge = getConditionBadge(condition);
  const hasWireless = isMatrixCapable(item) && item.state != null;
  const wirelessEnabled = item.state?.wirelessEnabled ?? false;
  const globalWireless = character ? isGlobalWirelessEnabled(character) : true;
  const isWirelessActive = hasWireless && wirelessEnabled && globalWireless;

  // Toggle handler for this item
  const handleWirelessToggle = (enabled: boolean) => {
    if (!character || !onCharacterUpdate) return;
    if (sectionKey === "drones") {
      toggleDroneWireless(character, itemIndex, enabled, onCharacterUpdate);
    } else if (sectionKey === "rccs") {
      toggleRCCWireless(character, itemIndex, enabled, onCharacterUpdate);
    }
  };

  return (
    <div
      data-testid="vehicle-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Type badge + Condition badge + Wifi icon */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span
          title={displayName}
          className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200"
        >
          {displayName}
        </span>
        <span
          data-testid="type-badge"
          className="shrink-0 rounded border border-zinc-400/20 bg-zinc-400/10 px-1 text-[9px] font-bold uppercase text-zinc-500 dark:text-zinc-400"
        >
          {badgeLabel}
        </span>
        {conditionBadge && (
          <span data-testid="condition-badge" className={conditionBadge.className}>
            {conditionBadge.label}
          </span>
        )}

        {/* Spacer to push wifi icon right */}
        {hasWireless && <span className="ml-auto" />}

        {/* State-aware wifi icon for Matrix-capable devices */}
        {hasWireless &&
          (isWirelessActive ? (
            <Wifi
              data-testid="wireless-icon"
              className="h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
            />
          ) : (
            <WifiOff
              data-testid="wireless-icon-off"
              className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            />
          ))}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Description */}
          {catalogEntry?.description && (
            <p
              data-testid="description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {catalogEntry.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {!isRCC(item) ? (
              <span data-testid="stat-body">
                Body{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.body}
                </span>
              </span>
            ) : (
              <span data-testid="stat-body">
                DR{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.deviceRating}
                </span>
              </span>
            )}
            {!isRCC(item) && (
              <>
                <span data-testid="stat-handling">
                  Handling{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.handling}
                  </span>
                </span>
                <span data-testid="stat-speed">
                  Speed{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.speed}
                  </span>
                </span>
                <span data-testid="stat-acceleration">
                  Accel{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.acceleration}
                  </span>
                </span>
                <span data-testid="stat-pilot">
                  Pilot{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.pilot}
                  </span>
                </span>
                <span data-testid="stat-sensor">
                  Sensor{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.sensor}
                  </span>
                </span>
                <span data-testid="stat-armor">
                  Armor{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.armor}
                  </span>
                </span>
              </>
            )}

            {!isRCC(item) && !isDrone(item) && item.seats != null && (
              <span data-testid="stat-seats">
                Seats{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.seats}
                </span>
              </span>
            )}

            {isRCC(item) && (
              <>
                <span data-testid="stat-data-processing">
                  Data Proc{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.dataProcessing}
                  </span>
                </span>
                <span data-testid="stat-firewall">
                  Firewall{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.firewall}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Avail + Cost row */}
          {(item.availability != null || cost > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              {item.availability != null && (
                <span data-testid="stat-availability">
                  Avail{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.availability}
                    {item.legality ? formatLegality(item.legality) : ""}
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
            </div>
          )}

          {/* Weapon Mounts — Drones only */}
          {isDrone(item) && catalogEntry?.weaponMounts && (
            <div data-testid="weapon-mounts-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Weapon Mounts
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                {catalogEntry.weaponMounts.standard != null &&
                  catalogEntry.weaponMounts.standard > 0 && (
                    <span data-testid="weapon-mount-standard">
                      Standard ×{catalogEntry.weaponMounts.standard}
                    </span>
                  )}
                {catalogEntry.weaponMounts.heavy != null && catalogEntry.weaponMounts.heavy > 0 && (
                  <span data-testid="weapon-mount-heavy">
                    Heavy ×{catalogEntry.weaponMounts.heavy}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Autosofts — Drone installed */}
          {isDrone(item) && item.installedAutosofts && item.installedAutosofts.length > 0 && (
            <div data-testid="autosofts-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Installed Autosofts
              </div>
              <div className="space-y-0.5">
                {item.installedAutosofts.map((soft, idx) => (
                  <div
                    key={`${soft}-${idx}`}
                    data-testid="autosoft-row"
                    className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {soft}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autosofts — RCC running */}
          {isRCC(item) && item.runningAutosofts && item.runningAutosofts.length > 0 && (
            <div data-testid="autosofts-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Running Autosofts
              </div>
              <div className="space-y-0.5">
                {item.runningAutosofts.map((soft, idx) => (
                  <div
                    key={`${soft}-${idx}`}
                    data-testid="autosoft-row"
                    className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {soft}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wireless toggle — drones & RCCs only when editable */}
          {isMatrixCapable(item) && editable && onCharacterUpdate && character && (
            <div data-testid="wireless-toggle" className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Wireless
              </span>
              <WirelessIndicator
                enabled={wirelessEnabled}
                globalEnabled={globalWireless}
                condition={condition}
                onToggle={handleWirelessToggle}
                size="sm"
              />
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div data-testid="notes" className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {item.notes}
            </div>
          )}

          {/* Source reference */}
          {catalogEntry?.page != null && (
            <p
              data-testid="source-reference"
              className="text-[10px] text-zinc-400 dark:text-zinc-600"
            >
              {catalogEntry.source ?? "Core"} p.{catalogEntry.page}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VehiclesDisplay
// ---------------------------------------------------------------------------

interface VehiclesDisplayProps {
  vehicles?: Vehicle[];
  drones?: CharacterDrone[];
  rccs?: CharacterRCC[];
  character?: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function VehiclesDisplay({
  vehicles,
  drones,
  rccs,
  character,
  onCharacterUpdate,
  editable,
}: VehiclesDisplayProps) {
  const catalog = useVehiclesCatalog();

  const hasContent =
    (vehicles && vehicles.length > 0) || (drones && drones.length > 0) || (rccs && rccs.length > 0);

  if (!hasContent) return null;

  const grouped: Record<"vehicles" | "drones" | "rccs", VehicleItem[]> = {
    vehicles: vehicles ?? [],
    drones: drones ?? [],
    rccs: rccs ?? [],
  };

  return (
    <DisplayCard
      id="sheet-vehicles"
      title="Vehicles & Drones"
      icon={<Car className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {VEHICLE_SECTIONS.map(({ key, label }) => {
          if (grouped[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {grouped[key].map((item, idx) => {
                  const entry = getCatalogEntry(catalog, item);
                  return (
                    <VehicleRow
                      key={`${item.name}-${idx}`}
                      item={item}
                      catalogEntry={entry}
                      sectionKey={key}
                      itemIndex={idx}
                      character={character}
                      onCharacterUpdate={onCharacterUpdate}
                      editable={editable}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
