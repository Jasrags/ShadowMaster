"use client";

/**
 * React hooks for cyberlimb management
 *
 * Provides hooks for:
 * - Fetching installed cyberlimbs
 * - Installing new cyberlimbs
 * - Removing cyberlimbs
 * - Toggling wireless mode
 * - Adding/removing enhancements
 * - Adding/removing accessories
 */

import { useState, useCallback, useMemo } from "react";
import type { CyberwareGrade } from "@/lib/types";
import type { CyberlimbLocation, CyberlimbEnhancementType } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Summary of a cyberlimb for list display
 */
export interface CyberlimbSummary {
  id?: string;
  catalogId: string;
  name: string;
  location: CyberlimbLocation;
  limbType: string;
  appearance: string;
  grade: CyberwareGrade;
  essenceCost: number;
  strength: number;
  agility: number;
  capacity: {
    total: number;
    used: number;
    remaining: number;
  };
  enhancementCount: number;
  accessoryCount: number;
  wirelessEnabled: boolean;
  condition: string;
}

/**
 * Detailed view of a cyberlimb
 */
export interface CyberlimbDetail {
  id?: string;
  catalogId: string;
  name: string;
  location: string;
  limbType: string;
  appearance: string;
  grade: string;
  essenceCost: number;
  cost: number;
  availability: number;
  baseStrength: number;
  baseAgility: number;
  customStrength: number;
  customAgility: number;
  effectiveStrength: number;
  effectiveAgility: number;
  capacity: {
    total: number;
    usedByEnhancements: number;
    usedByAccessories: number;
    usedByWeapons: number;
    remaining: number;
  };
  enhancements: Array<{
    id: string;
    catalogId: string;
    name: string;
    enhancementType: string;
    rating: number;
    capacityUsed: number;
  }>;
  accessories: Array<{
    id: string;
    catalogId: string;
    name: string;
    rating?: number;
    capacityUsed: number;
  }>;
  weapons: Array<{
    id: string;
    catalogId: string;
    name: string;
    damage: string;
    ap: number;
    capacityUsed: number;
  }>;
  wirelessEnabled: boolean;
  condition: string;
  installedAt: string;
}

/**
 * State returned by useCharacterCyberlimbs
 */
export interface CyberlimbsState {
  cyberlimbs: CyberlimbSummary[];
  totalCMBonus: number;
  totalEssenceLost: number;
  loading: boolean;
  error: string | null;
}

/**
 * Request to install a cyberlimb
 */
export interface InstallCyberlimbRequest {
  catalogId: string;
  location: CyberlimbLocation;
  grade: CyberwareGrade;
  customization?: {
    strengthCustomization?: number;
    agilityCustomization?: number;
  };
  confirmReplacement?: boolean;
}

/**
 * Response from install operation
 */
export interface InstallCyberlimbResult {
  success: boolean;
  installedLimb?: CyberlimbSummary;
  removedLimbs?: string[];
  essenceChange?: number;
  magicLoss?: number;
  warnings?: string[];
  error?: string;
}

/**
 * Response from remove operation
 */
export interface RemoveCyberlimbResult {
  success: boolean;
  removedLimb?: string;
  essenceRestored?: number;
  error?: string;
}

/**
 * Response from wireless toggle operation
 */
export interface ToggleWirelessResult {
  success: boolean;
  limb?: CyberlimbDetail;
  error?: string;
}

/**
 * Request to add an enhancement
 */
export interface AddEnhancementRequest {
  catalogId: string;
  rating: number;
  grade?: CyberwareGrade;
}

/**
 * Response from add enhancement operation
 */
export interface AddEnhancementResult {
  success: boolean;
  enhancement?: {
    id: string;
    catalogId: string;
    name: string;
    enhancementType: string;
    rating: number;
    capacityUsed: number;
    cost: number;
  };
  limbCapacityRemaining?: number;
  error?: string;
}

/**
 * Response from remove enhancement operation
 */
export interface RemoveEnhancementResult {
  success: boolean;
  removedEnhancement?: string;
  capacityRestored?: number;
  limbCapacityRemaining?: number;
  error?: string;
}

/**
 * Request to add an accessory
 */
export interface AddAccessoryRequest {
  catalogId: string;
  rating?: number;
}

/**
 * Response from add accessory operation
 */
export interface AddAccessoryResult {
  success: boolean;
  accessory?: {
    id: string;
    catalogId: string;
    name: string;
    rating?: number;
    capacityUsed: number;
    cost: number;
  };
  limbCapacityRemaining?: number;
  error?: string;
}

/**
 * Response from remove accessory operation
 */
export interface RemoveAccessoryResult {
  success: boolean;
  removedAccessory?: string;
  capacityRestored?: number;
  limbCapacityRemaining?: number;
  error?: string;
}

/**
 * Mutation state for async operations
 */
export interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// =============================================================================
// useCharacterCyberlimbs
// =============================================================================

/**
 * Hook to fetch and manage a character's installed cyberlimbs
 *
 * @example
 * ```tsx
 * function CyberlimbsPanel({ characterId }) {
 *   const { cyberlimbs, totalCMBonus, totalEssenceLost, loading, error, refetch } =
 *     useCharacterCyberlimbs(characterId);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return (
 *     <div>
 *       <p>CM Bonus: +{totalCMBonus}</p>
 *       <p>Essence Lost: {totalEssenceLost}</p>
 *       <CyberlimbList items={cyberlimbs} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useCharacterCyberlimbs(characterId: string | null): CyberlimbsState & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<CyberlimbsState>({
    cyberlimbs: [],
    totalCMBonus: 0,
    totalEssenceLost: 0,
    loading: false,
    error: null,
  });

  const fetchCyberlimbs = useCallback(async () => {
    if (!characterId) {
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/characters/${characterId}/augmentations/cyberlimbs`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch cyberlimbs");
      }

      setState({
        cyberlimbs: data.cyberlimbs,
        totalCMBonus: data.totalCMBonus,
        totalEssenceLost: data.totalEssenceLost,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, [characterId]);

  // Auto-fetch on mount and characterId change
  useMemo(() => {
    if (characterId) {
      fetchCyberlimbs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  return {
    ...state,
    refetch: fetchCyberlimbs,
  };
}

// =============================================================================
// useInstallCyberlimb
// =============================================================================

/**
 * Hook to install a new cyberlimb on a character
 *
 * @example
 * ```tsx
 * function InstallButton({ characterId, catalogId, location, grade }) {
 *   const { install, loading, error } = useInstallCyberlimb(characterId);
 *
 *   const handleInstall = async () => {
 *     const result = await install({
 *       catalogId,
 *       location,
 *       grade,
 *     });
 *
 *     if (result.success) {
 *       toast.success(`Installed ${result.installedLimb.name}`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleInstall} disabled={loading}>
 *       {loading ? "Installing..." : "Install"}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useInstallCyberlimb(characterId: string | null): {
  install: (request: InstallCyberlimbRequest) => Promise<InstallCyberlimbResult>;
  reset: () => void;
} & MutationState<InstallCyberlimbResult> {
  const [state, setState] = useState<MutationState<InstallCyberlimbResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const install = useCallback(
    async (request: InstallCyberlimbRequest): Promise<InstallCyberlimbResult> => {
      if (!characterId) {
        const result: InstallCyberlimbResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(`/api/characters/${characterId}/augmentations/cyberlimbs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        const data: InstallCyberlimbResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Installation failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: InstallCyberlimbResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, install, reset };
}

// =============================================================================
// useRemoveCyberlimb
// =============================================================================

/**
 * Hook to remove a cyberlimb from a character
 *
 * @example
 * ```tsx
 * function RemoveButton({ characterId, limbId }) {
 *   const { remove, loading } = useRemoveCyberlimb(characterId);
 *
 *   const handleRemove = async () => {
 *     const result = await remove(limbId);
 *     if (result.success) {
 *       toast.success(`Removed ${result.removedLimb}, restored ${result.essenceRestored} essence`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleRemove} disabled={loading} variant="destructive">
 *       Remove
 *     </Button>
 *   );
 * }
 * ```
 */
export function useRemoveCyberlimb(characterId: string | null): {
  remove: (limbId: string) => Promise<RemoveCyberlimbResult>;
  reset: () => void;
} & MutationState<RemoveCyberlimbResult> {
  const [state, setState] = useState<MutationState<RemoveCyberlimbResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(
    async (limbId: string): Promise<RemoveCyberlimbResult> => {
      if (!characterId) {
        const result: RemoveCyberlimbResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}`,
          { method: "DELETE" }
        );

        const data: RemoveCyberlimbResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Removal failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: RemoveCyberlimbResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, remove, reset };
}

// =============================================================================
// useToggleCyberlimbWireless
// =============================================================================

/**
 * Hook to toggle wireless mode on a cyberlimb
 *
 * @example
 * ```tsx
 * function WirelessToggle({ characterId, limbId, enabled }) {
 *   const { toggle, loading } = useToggleCyberlimbWireless(characterId);
 *
 *   return (
 *     <Switch
 *       checked={enabled}
 *       onChange={(newValue) => toggle(limbId, newValue)}
 *       disabled={loading}
 *     />
 *   );
 * }
 * ```
 */
export function useToggleCyberlimbWireless(characterId: string | null): {
  toggle: (limbId: string, enabled: boolean) => Promise<ToggleWirelessResult>;
  reset: () => void;
} & MutationState<ToggleWirelessResult> {
  const [state, setState] = useState<MutationState<ToggleWirelessResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const toggle = useCallback(
    async (limbId: string, enabled: boolean): Promise<ToggleWirelessResult> => {
      if (!characterId) {
        const result: ToggleWirelessResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wirelessEnabled: enabled }),
          }
        );

        const data: ToggleWirelessResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Toggle failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: ToggleWirelessResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, toggle, reset };
}

// =============================================================================
// useCyberlimbDetails
// =============================================================================

/**
 * Hook to fetch details of a specific cyberlimb
 *
 * @example
 * ```tsx
 * function CyberlimbDetail({ characterId, limbId }) {
 *   const { limb, loading, error, refetch } =
 *     useCyberlimbDetails(characterId, limbId);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return (
 *     <div>
 *       <h2>{limb.name}</h2>
 *       <p>STR: {limb.effectiveStrength}</p>
 *       <p>AGI: {limb.effectiveAgility}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCyberlimbDetails(
  characterId: string | null,
  limbId: string | null
): {
  limb: CyberlimbDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<{
    limb: CyberlimbDetail | null;
    loading: boolean;
    error: string | null;
  }>({
    limb: null,
    loading: false,
    error: null,
  });

  const fetchDetails = useCallback(async () => {
    if (!characterId || !limbId) {
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch cyberlimb details");
      }

      setState({
        limb: data.limb,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, [characterId, limbId]);

  // Auto-fetch on mount and ID changes
  useMemo(() => {
    if (characterId && limbId) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId, limbId]);

  return {
    ...state,
    refetch: fetchDetails,
  };
}

// =============================================================================
// useAddCyberlimbEnhancement
// =============================================================================

/**
 * Hook to add an enhancement to a cyberlimb
 *
 * @example
 * ```tsx
 * function AddEnhancementButton({ characterId, limbId, catalogId, rating }) {
 *   const { add, loading } = useAddCyberlimbEnhancement(characterId);
 *
 *   const handleAdd = async () => {
 *     const result = await add(limbId, { catalogId, rating });
 *     if (result.success) {
 *       toast.success(`Added ${result.enhancement.name}`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleAdd} disabled={loading}>
 *       Add Enhancement
 *     </Button>
 *   );
 * }
 * ```
 */
export function useAddCyberlimbEnhancement(characterId: string | null): {
  add: (limbId: string, request: AddEnhancementRequest) => Promise<AddEnhancementResult>;
  reset: () => void;
} & MutationState<AddEnhancementResult> {
  const [state, setState] = useState<MutationState<AddEnhancementResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const add = useCallback(
    async (limbId: string, request: AddEnhancementRequest): Promise<AddEnhancementResult> => {
      if (!characterId) {
        const result: AddEnhancementResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}/enhancements`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          }
        );

        const data: AddEnhancementResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Add failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: AddEnhancementResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, add, reset };
}

// =============================================================================
// useRemoveCyberlimbEnhancement
// =============================================================================

/**
 * Hook to remove an enhancement from a cyberlimb
 *
 * @example
 * ```tsx
 * function RemoveEnhancementButton({ characterId, limbId, enhancementId }) {
 *   const { remove, loading } = useRemoveCyberlimbEnhancement(characterId);
 *
 *   const handleRemove = async () => {
 *     const result = await remove(limbId, enhancementId);
 *     if (result.success) {
 *       toast.success(`Removed ${result.removedEnhancement}`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleRemove} disabled={loading} variant="destructive">
 *       Remove
 *     </Button>
 *   );
 * }
 * ```
 */
export function useRemoveCyberlimbEnhancement(characterId: string | null): {
  remove: (limbId: string, enhancementId: string) => Promise<RemoveEnhancementResult>;
  reset: () => void;
} & MutationState<RemoveEnhancementResult> {
  const [state, setState] = useState<MutationState<RemoveEnhancementResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(
    async (limbId: string, enhancementId: string): Promise<RemoveEnhancementResult> => {
      if (!characterId) {
        const result: RemoveEnhancementResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}/enhancements/${enhancementId}`,
          { method: "DELETE" }
        );

        const data: RemoveEnhancementResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Remove failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: RemoveEnhancementResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, remove, reset };
}

// =============================================================================
// useAddCyberlimbAccessory
// =============================================================================

/**
 * Hook to add an accessory to a cyberlimb
 *
 * @example
 * ```tsx
 * function AddAccessoryButton({ characterId, limbId, catalogId }) {
 *   const { add, loading } = useAddCyberlimbAccessory(characterId);
 *
 *   const handleAdd = async () => {
 *     const result = await add(limbId, { catalogId });
 *     if (result.success) {
 *       toast.success(`Added ${result.accessory.name}`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleAdd} disabled={loading}>
 *       Add Accessory
 *     </Button>
 *   );
 * }
 * ```
 */
export function useAddCyberlimbAccessory(characterId: string | null): {
  add: (limbId: string, request: AddAccessoryRequest) => Promise<AddAccessoryResult>;
  reset: () => void;
} & MutationState<AddAccessoryResult> {
  const [state, setState] = useState<MutationState<AddAccessoryResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const add = useCallback(
    async (limbId: string, request: AddAccessoryRequest): Promise<AddAccessoryResult> => {
      if (!characterId) {
        const result: AddAccessoryResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}/accessories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          }
        );

        const data: AddAccessoryResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Add failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: AddAccessoryResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, add, reset };
}

// =============================================================================
// useRemoveCyberlimbAccessory
// =============================================================================

/**
 * Hook to remove an accessory from a cyberlimb
 *
 * @example
 * ```tsx
 * function RemoveAccessoryButton({ characterId, limbId, accessoryId }) {
 *   const { remove, loading } = useRemoveCyberlimbAccessory(characterId);
 *
 *   const handleRemove = async () => {
 *     const result = await remove(limbId, accessoryId);
 *     if (result.success) {
 *       toast.success(`Removed ${result.removedAccessory}`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleRemove} disabled={loading} variant="destructive">
 *       Remove
 *     </Button>
 *   );
 * }
 * ```
 */
export function useRemoveCyberlimbAccessory(characterId: string | null): {
  remove: (limbId: string, accessoryId: string) => Promise<RemoveAccessoryResult>;
  reset: () => void;
} & MutationState<RemoveAccessoryResult> {
  const [state, setState] = useState<MutationState<RemoveAccessoryResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(
    async (limbId: string, accessoryId: string): Promise<RemoveAccessoryResult> => {
      if (!characterId) {
        const result: RemoveAccessoryResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/cyberlimbs/${limbId}/accessories/${accessoryId}`,
          { method: "DELETE" }
        );

        const data: RemoveAccessoryResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Remove failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: RemoveAccessoryResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, remove, reset };
}
