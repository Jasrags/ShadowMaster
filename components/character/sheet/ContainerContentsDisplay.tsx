"use client";

import type { Character } from "@/lib/types";
import type { ContainerProperties } from "@/lib/types/gear-state";
import {
  getContainerContents,
  getContainerContentWeight,
  removeItemFromContainer,
  MAX_CONTAINER_DEPTH,
  isContainer,
} from "@/lib/rules/inventory";
import { getReadinessLabel, getReadinessColor } from "./readiness-helpers";
import { Minus, Package } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContainerContentsDisplayProps {
  character: Character;
  containerId: string;
  containerProperties: ContainerProperties;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
  depth?: number;
}

// ---------------------------------------------------------------------------
// ContainerContentsDisplay
// ---------------------------------------------------------------------------

export function ContainerContentsDisplay({
  character,
  containerId,
  containerProperties,
  onCharacterUpdate,
  editable,
  depth = 1,
}: ContainerContentsDisplayProps) {
  const contents = getContainerContents(character, containerId);
  const currentWeight = getContainerContentWeight(character, containerId);
  const maxWeight = containerProperties.weightCapacity;
  const pct = maxWeight > 0 ? Math.min((currentWeight / maxWeight) * 100, 100) : 0;

  const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div data-testid="container-contents" className="mt-1.5 space-y-1.5">
      {/* Capacity bar */}
      <div data-testid="capacity-bar" className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
          {currentWeight.toFixed(1)} / {maxWeight} kg
        </span>
      </div>

      {/* Contents */}
      {contents.length === 0 ? (
        <p
          data-testid="container-empty"
          className="text-[11px] italic text-zinc-400 dark:text-zinc-500 pl-1"
        >
          Empty
        </p>
      ) : (
        <div className="space-y-0.5">
          {contents.map((item) => {
            const itemId = "id" in item ? (item.id as string) : undefined;
            const readiness = item.state?.readiness ?? "carried";
            const itemIsContainer = isContainer(item);

            return (
              <div key={itemId ?? item.name} style={{ marginLeft: `${depth * 16}px` }}>
                <div data-testid="contained-item" className="flex items-center gap-1.5 py-0.5">
                  <Package className="h-3 w-3 shrink-0 text-zinc-400" />
                  <span className="truncate text-[12px] text-zinc-700 dark:text-zinc-300">
                    {item.name}
                  </span>
                  <span
                    className={`shrink-0 rounded border px-1 py-0.5 text-[9px] font-medium ${getReadinessColor(readiness)}`}
                  >
                    {getReadinessLabel(readiness)}
                  </span>

                  {editable && onCharacterUpdate && itemId && (
                    <button
                      data-testid="remove-from-container"
                      onClick={(e) => {
                        e.stopPropagation();
                        const result = removeItemFromContainer(character, itemId);
                        if (result.success && result.character) {
                          onCharacterUpdate(result.character);
                        }
                      }}
                      className="ml-auto shrink-0 rounded p-0.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove from container"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Recursive container display */}
                {itemIsContainer &&
                  itemId &&
                  "containerProperties" in item &&
                  item.containerProperties &&
                  depth < MAX_CONTAINER_DEPTH && (
                    <ContainerContentsDisplay
                      character={character}
                      containerId={itemId}
                      containerProperties={item.containerProperties as ContainerProperties}
                      onCharacterUpdate={onCharacterUpdate}
                      editable={editable}
                      depth={depth + 1}
                    />
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
