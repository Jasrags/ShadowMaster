"use client";

import { DisplayCard } from "./DisplayCard";
import { Car } from "lucide-react";
import type { Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";

interface VehiclesDisplayProps {
  vehicles?: Vehicle[];
  drones?: CharacterDrone[];
  rccs?: CharacterRCC[];
}

function VehicleItem({ vehicle }: { vehicle: Vehicle | CharacterDrone | CharacterRCC }) {
  const isRCC = "deviceRating" in vehicle;
  const isDrone = "size" in vehicle;

  return (
    <div className="p-3 rounded transition-all group bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-bold text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
            {vehicle.name}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono">
            {isRCC ? "RCC" : isDrone ? `${(vehicle as CharacterDrone).size} Drone` : "Vehicle"}
          </div>
        </div>
        {isRCC && (
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono">
              Rating
            </div>
            <div className="text-lg font-bold font-mono text-orange-500 dark:text-orange-400">
              {(vehicle as CharacterRCC).deviceRating}
            </div>
          </div>
        )}
      </div>

      {!isRCC && (
        <div className="grid grid-cols-4 gap-2 text-center border-t border-zinc-200 dark:border-zinc-700/50 pt-2">
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Hand
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as Vehicle).handling}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Spd
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as Vehicle).speed}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Body
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as Vehicle).body}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Armor
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as Vehicle).armor}
            </div>
          </div>
        </div>
      )}

      {isRCC && (
        <div className="grid grid-cols-2 gap-4 text-center border-t border-zinc-200 dark:border-zinc-700/50 pt-2">
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Data Proc
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as CharacterRCC).dataProcessing}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
              Firewall
            </div>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
              {(vehicle as CharacterRCC).firewall}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VehiclesDisplay({ vehicles, drones, rccs }: VehiclesDisplayProps) {
  const hasContent =
    (rccs && rccs.length > 0) || (vehicles && vehicles.length > 0) || (drones && drones.length > 0);

  if (!hasContent) return null;

  return (
    <DisplayCard title="Vehicles & Drones" icon={<Car className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {rccs?.map((rcc, idx) => (
          <VehicleItem key={`rcc-${idx}`} vehicle={rcc} />
        ))}
        {vehicles?.map((v, idx) => (
          <VehicleItem key={`veh-${idx}`} vehicle={v} />
        ))}
        {drones?.map((d, idx) => (
          <VehicleItem key={`drone-${idx}`} vehicle={d} />
        ))}
      </div>
    </DisplayCard>
  );
}
