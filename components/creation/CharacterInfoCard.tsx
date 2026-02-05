"use client";

/**
 * CharacterInfoCard
 *
 * Card for entering character biographical information during creation.
 * Features:
 * - Street name input with length limit
 * - Physical description
 * - Background/history
 * - All fields optional
 */

import { useCallback } from "react";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_CHARACTER_NAME_LENGTH = 100;

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

  // Name length tracking
  const nameLength = characterName.length;
  const isNameNearLimit = nameLength >= MAX_CHARACTER_NAME_LENGTH - 10; // Within 10 chars of limit
  const isNameAtOrOverLimit = nameLength >= MAX_CHARACTER_NAME_LENGTH;

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
            maxLength={MAX_CHARACTER_NAME_LENGTH + 10} // Allow slight overflow for feedback
            className={`w-full rounded border bg-white px-2 py-1.5 text-sm focus:outline-none dark:bg-zinc-800 dark:text-zinc-100 ${
              isNameAtOrOverLimit
                ? "border-amber-500 focus:border-amber-600 dark:border-amber-500"
                : "border-zinc-300 focus:border-blue-500 dark:border-zinc-600"
            }`}
            placeholder="Your runner handle"
          />
          <div className="mt-1 flex items-center justify-between">
            <span
              className={`text-xs ${
                isNameAtOrOverLimit
                  ? "font-medium text-amber-600 dark:text-amber-400"
                  : isNameNearLimit
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-zinc-400"
              }`}
            >
              {nameLength}/{MAX_CHARACTER_NAME_LENGTH}
            </span>
            {isNameAtOrOverLimit && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Name exceeds recommended length
              </span>
            )}
          </div>
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
            Description:{" "}
            {description.length > 0
              ? `${description.split(/\s+/).filter(Boolean).length} words`
              : "—"}
          </span>
          <span>
            Background:{" "}
            {background.length > 0
              ? `${background.split(/\s+/).filter(Boolean).length} words`
              : "—"}
          </span>
        </div>
      </div>
    </CreationCard>
  );
}
