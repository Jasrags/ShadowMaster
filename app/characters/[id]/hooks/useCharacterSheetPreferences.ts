"use client";

/**
 * useCharacterSheetPreferences Hook
 *
 * Manages per-character UI preferences in localStorage.
 * Preferences include theme, section collapse states, and dice roller visibility.
 *
 * Uses localStorage for persistence to support:
 * - Per-character preferences
 * - Fast loading without API calls
 * - Offline support
 */

import { useState, useEffect, useCallback } from "react";
import type { ThemeId } from "@/lib/themes";

// =============================================================================
// TYPES
// =============================================================================

export interface CharacterSheetPreferences {
  /** Selected theme for this character sheet */
  theme: ThemeId;
  /** Whether dice roller panel is expanded */
  diceRollerVisible: boolean;
  /** Section collapse states by section ID */
  collapsedSections: Record<string, boolean>;
  /** Last viewed tab in character sheet if applicable */
  lastTab?: string;
}

export interface UseCharacterSheetPreferencesResult {
  /** Current preferences */
  preferences: CharacterSheetPreferences;
  /** Loading state */
  isLoading: boolean;
  /** Update a single preference */
  updatePreference: <K extends keyof CharacterSheetPreferences>(
    key: K,
    value: CharacterSheetPreferences[K]
  ) => void;
  /** Toggle a section collapse state */
  toggleSection: (sectionId: string) => void;
  /** Reset to defaults */
  resetPreferences: () => void;
}

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_PREFERENCES: CharacterSheetPreferences = {
  theme: "neon-rain",
  diceRollerVisible: false,
  collapsedSections: {},
  lastTab: undefined,
};

// =============================================================================
// STORAGE KEYS
// =============================================================================

function getStorageKey(characterId: string): string {
  return `character-sheet-prefs:${characterId}`;
}

// =============================================================================
// HOOK
// =============================================================================

export function useCharacterSheetPreferences(
  characterId: string
): UseCharacterSheetPreferencesResult {
  const [preferences, setPreferences] = useState<CharacterSheetPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (!characterId) {
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(getStorageKey(characterId));
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<CharacterSheetPreferences>;
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
        });
      }
    } catch (error) {
      console.warn("Failed to load character sheet preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoading || !characterId) return;

    try {
      localStorage.setItem(getStorageKey(characterId), JSON.stringify(preferences));
    } catch (error) {
      console.warn("Failed to save character sheet preferences:", error);
    }
  }, [preferences, characterId, isLoading]);

  // Update a single preference
  const updatePreference = useCallback(
    <K extends keyof CharacterSheetPreferences>(
      key: K,
      value: CharacterSheetPreferences[K]
    ) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Toggle a section collapse state
  const toggleSection = useCallback((sectionId: string) => {
    setPreferences((prev) => ({
      ...prev,
      collapsedSections: {
        ...prev.collapsedSections,
        [sectionId]: !prev.collapsedSections[sectionId],
      },
    }));
  }, []);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    isLoading,
    updatePreference,
    toggleSection,
    resetPreferences,
  };
}

export default useCharacterSheetPreferences;
