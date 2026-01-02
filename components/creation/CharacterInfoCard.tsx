"use client";

/**
 * CharacterInfoCard
 *
 * Card for entering character biographical information during creation.
 * Features:
 * - Street name input
 * - Physical description
 * - Background/history
 * - All fields optional
 */

import { useCallback } from "react";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";

// =============================================================================
// TYPES
// =============================================================================

interface CharacterInfoCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CharacterInfoCard({ state, updateState }: CharacterInfoCardProps) {
  // Get current values from state
  const characterName = (state.selections.characterName as string) || "";
  const description = (state.selections.description as string) || "";
  const background = (state.selections.background as string) || "";
  const gender = (state.selections.gender as string) || "";

  // Check completion status
  const hasName = characterName.trim().length > 0;
  const hasAnyInfo = hasName || description.trim().length > 0 || background.trim().length > 0;

  // Update handlers
  const handleUpdate = useCallback(
    (field: string, value: string) => {
      updateState({
        selections: {
          ...state.selections,
          [field]: value,
        },
      });
    },
    [state.selections, updateState]
  );

  return (
    <CreationCard
      title="Character Info"
      description={hasName ? characterName : "Name your runner"}
      status={hasName ? "valid" : hasAnyInfo ? "warning" : "pending"}
    >
      <div className="space-y-3">
        {/* Street Name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Street Name <span className="text-zinc-400">(Required)</span>
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => handleUpdate("characterName", e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Your runner handle"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Gender <span className="text-zinc-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={gender}
            onChange={(e) => handleUpdate("gender", e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Character's gender"
          />
        </div>

        {/* Physical Description */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Physical Description <span className="text-zinc-400">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => handleUpdate("description", e.target.value)}
            rows={2}
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Height, build, distinguishing features..."
          />
        </div>

        {/* Background */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Background <span className="text-zinc-400">(Optional)</span>
          </label>
          <textarea
            value={background}
            onChange={(e) => handleUpdate("background", e.target.value)}
            rows={3}
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="How did you become a shadowrunner? What drives you?"
          />
        </div>

        {/* Word count indicators */}
        <div className="flex justify-between text-xs text-zinc-400">
          <span>
            Description: {description.length > 0 ? `${description.split(/\s+/).filter(Boolean).length} words` : "—"}
          </span>
          <span>
            Background: {background.length > 0 ? `${background.split(/\s+/).filter(Boolean).length} words` : "—"}
          </span>
        </div>
      </div>
    </CreationCard>
  );
}
