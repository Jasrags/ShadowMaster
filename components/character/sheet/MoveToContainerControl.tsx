"use client";

import type { Character } from "@/lib/types";
import { canAddToContainer, addItemToContainer, isContainer } from "@/lib/rules/inventory";

interface MoveToContainerControlProps {
  character: Character;
  itemId: string;
  onCharacterUpdate: (updated: Character) => void;
}

export function MoveToContainerControl({
  character,
  itemId,
  onCharacterUpdate,
}: MoveToContainerControlProps) {
  // Find all containers on the character
  const containers = (character.gear || []).filter(
    (g) => g.id && g.id !== itemId && isContainer(g)
  );

  if (containers.length === 0) return null;

  return (
    <div data-testid="move-to-container" className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Move to
      </span>
      <select
        data-testid="container-select"
        className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        defaultValue=""
        onChange={(e) => {
          const containerId = e.target.value;
          if (!containerId) return;
          const result = addItemToContainer(character, itemId, containerId);
          if (result.success && result.character) {
            onCharacterUpdate(result.character);
          }
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Container…
        </option>
        {containers.map((c) => {
          const check = canAddToContainer(character, itemId, c.id!);
          return (
            <option key={c.id} value={c.id!} disabled={!check.allowed}>
              {c.name}
              {!check.allowed ? ` (${check.reason})` : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}
