"use client";

import { useState } from "react";
import type { Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Car } from "lucide-react";

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

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const VEHICLE_SECTIONS = [
  { key: "vehicles" as const, label: "Vehicles" },
  { key: "drones" as const, label: "Drones" },
  { key: "rccs" as const, label: "RCCs" },
];

// ---------------------------------------------------------------------------
// VehicleRow
// ---------------------------------------------------------------------------

function VehicleRow({ item }: { item: VehicleItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = isRCC(item)
    ? (item.customName ?? item.name)
    : isDrone(item)
      ? (item.customName ?? item.name)
      : item.name;

  const badgeText = isRCC(item) ? "RCC" : isDrone(item) ? item.size : item.type;

  const primaryLabel = isRCC(item) ? "DR" : "Body";
  const primaryValue = isRCC(item) ? item.deviceRating : item.body;

  return (
    <div
      data-testid="vehicle-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {displayName}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-type">
              Type{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {badgeText.charAt(0).toUpperCase() + badgeText.slice(1)}
              </span>
            </span>
            <span data-testid="stat-body">
              {primaryLabel}{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {primaryValue}
              </span>
            </span>
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

          {/* Availability */}
          {item.availability != null && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span data-testid="stat-availability">
                Avail{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.availability}
                  {item.legality ? formatLegality(item.legality) : ""}
                </span>
              </span>
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

          {/* Notes */}
          {item.notes && (
            <div data-testid="notes" className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {item.notes}
            </div>
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
}

export function VehiclesDisplay({ vehicles, drones, rccs }: VehiclesDisplayProps) {
  const hasContent =
    (vehicles && vehicles.length > 0) || (drones && drones.length > 0) || (rccs && rccs.length > 0);

  if (!hasContent) return null;

  const grouped: Record<"vehicles" | "drones" | "rccs", VehicleItem[]> = {
    vehicles: vehicles ?? [],
    drones: drones ?? [],
    rccs: rccs ?? [],
  };

  return (
    <DisplayCard title="Vehicles & Drones" icon={<Car className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {VEHICLE_SECTIONS.map(({ key, label }) => {
          if (grouped[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {grouped[key].map((item, idx) => (
                  <VehicleRow key={`${item.name}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
