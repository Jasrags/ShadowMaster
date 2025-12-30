"use client";

/**
 * React hooks for augmentation management
 *
 * Provides hooks for:
 * - Fetching installed augmentations
 * - Installing new augmentations
 * - Removing augmentations
 * - Upgrading augmentation grades
 * - Validating installations before committing
 */

import { useState, useCallback, useMemo } from "react";
import type {
  CyberwareItem,
  BiowareItem,
  CyberwareGrade,
  BiowareGrade,
} from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Essence summary for a character's augmentations
 */
export interface EssenceSummary {
  current: number;
  lost: number;
  fromCyberware: number;
  fromBioware: number;
}

/**
 * State returned by useCharacterAugmentations
 */
export interface AugmentationsState {
  cyberware: CyberwareItem[];
  bioware: BiowareItem[];
  essenceSummary: EssenceSummary;
  loading: boolean;
  error: string | null;
}

/**
 * Request to install an augmentation
 */
export interface InstallAugmentationRequest {
  type: "cyberware" | "bioware";
  catalogId: string;
  grade: CyberwareGrade | BiowareGrade;
  rating?: number;
}

/**
 * Response from install operation
 */
export interface InstallAugmentationResult {
  success: boolean;
  installedItem?: CyberwareItem | BiowareItem;
  essenceChange?: number;
  magicLoss?: number;
  warnings?: string[];
  error?: string;
}

/**
 * Response from remove operation
 */
export interface RemoveAugmentationResult {
  success: boolean;
  removedItem?: CyberwareItem | BiowareItem;
  essenceRestored?: number;
  error?: string;
}

/**
 * Response from upgrade operation
 */
export interface UpgradeAugmentationResult {
  success: boolean;
  augmentation?: CyberwareItem | BiowareItem;
  essenceRefund?: number;
  error?: string;
}

/**
 * Validation error/warning
 */
export interface ValidationMessage {
  code: string;
  message: string;
}

/**
 * Projection data from validation
 */
export interface ValidationProjection {
  essenceCost: number;
  currentEssence: number;
  projectedEssence: number;
  projectedMagicLoss?: number;
  catalogItem: {
    id: string;
    name: string;
    category: string;
    description?: string;
    essenceCost: number;
    cost: number;
    availability: number;
  };
}

/**
 * Response from validation operation
 */
export interface ValidateAugmentationResult {
  success: boolean;
  valid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  projection?: ValidationProjection;
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
// useCharacterAugmentations
// =============================================================================

/**
 * Hook to fetch and manage a character's installed augmentations
 *
 * @example
 * ```tsx
 * function AugmentationsPanel({ characterId }) {
 *   const { cyberware, bioware, essenceSummary, loading, error, refetch } =
 *     useCharacterAugmentations(characterId);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return (
 *     <div>
 *       <EssenceDisplay essence={essenceSummary.current} />
 *       <CyberwareList items={cyberware} />
 *       <BiowareList items={bioware} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useCharacterAugmentations(characterId: string | null): AugmentationsState & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<AugmentationsState>({
    cyberware: [],
    bioware: [],
    essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
    loading: false,
    error: null,
  });

  const fetchAugmentations = useCallback(async () => {
    if (!characterId) {
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/characters/${characterId}/augmentations`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch augmentations");
      }

      setState({
        cyberware: data.cyberware,
        bioware: data.bioware,
        essenceSummary: data.essenceSummary,
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
      fetchAugmentations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  return {
    ...state,
    refetch: fetchAugmentations,
  };
}

// =============================================================================
// useInstallAugmentation
// =============================================================================

/**
 * Hook to install a new augmentation on a character
 *
 * @example
 * ```tsx
 * function InstallButton({ characterId, catalogItem, grade }) {
 *   const { install, loading, error, data } = useInstallAugmentation(characterId);
 *
 *   const handleInstall = async () => {
 *     const result = await install({
 *       type: "cyberware",
 *       catalogId: catalogItem.id,
 *       grade: grade,
 *     });
 *
 *     if (result.success) {
 *       toast.success(`Installed ${result.installedItem.name}`);
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
export function useInstallAugmentation(characterId: string | null): {
  install: (request: InstallAugmentationRequest) => Promise<InstallAugmentationResult>;
  reset: () => void;
} & MutationState<InstallAugmentationResult> {
  const [state, setState] = useState<MutationState<InstallAugmentationResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const install = useCallback(
    async (request: InstallAugmentationRequest): Promise<InstallAugmentationResult> => {
      if (!characterId) {
        const result: InstallAugmentationResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(`/api/characters/${characterId}/augmentations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        const data: InstallAugmentationResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Installation failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: InstallAugmentationResult = {
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
// useRemoveAugmentation
// =============================================================================

/**
 * Hook to remove an augmentation from a character
 *
 * @example
 * ```tsx
 * function RemoveButton({ characterId, augmentationId }) {
 *   const { remove, loading } = useRemoveAugmentation(characterId);
 *
 *   const handleRemove = async () => {
 *     const result = await remove(augmentationId);
 *     if (result.success) {
 *       toast.success(`Removed augmentation, restored ${result.essenceRestored} essence`);
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
export function useRemoveAugmentation(characterId: string | null): {
  remove: (augmentationId: string) => Promise<RemoveAugmentationResult>;
  reset: () => void;
} & MutationState<RemoveAugmentationResult> {
  const [state, setState] = useState<MutationState<RemoveAugmentationResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(
    async (augmentationId: string): Promise<RemoveAugmentationResult> => {
      if (!characterId) {
        const result: RemoveAugmentationResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/${augmentationId}`,
          { method: "DELETE" }
        );

        const data: RemoveAugmentationResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Removal failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: RemoveAugmentationResult = {
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
// useUpgradeAugmentation
// =============================================================================

/**
 * Hook to upgrade an augmentation's grade
 *
 * @example
 * ```tsx
 * function UpgradeButton({ characterId, augmentationId, newGrade }) {
 *   const { upgrade, loading } = useUpgradeAugmentation(characterId);
 *
 *   const handleUpgrade = async () => {
 *     const result = await upgrade(augmentationId, newGrade);
 *     if (result.success) {
 *       toast.success(`Upgraded to ${newGrade} grade`);
 *     }
 *   };
 *
 *   return (
 *     <Button onClick={handleUpgrade} disabled={loading}>
 *       Upgrade to {newGrade}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useUpgradeAugmentation(characterId: string | null): {
  upgrade: (
    augmentationId: string,
    newGrade: CyberwareGrade | BiowareGrade
  ) => Promise<UpgradeAugmentationResult>;
  reset: () => void;
} & MutationState<UpgradeAugmentationResult> {
  const [state, setState] = useState<MutationState<UpgradeAugmentationResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const upgrade = useCallback(
    async (
      augmentationId: string,
      newGrade: CyberwareGrade | BiowareGrade
    ): Promise<UpgradeAugmentationResult> => {
      if (!characterId) {
        const result: UpgradeAugmentationResult = {
          success: false,
          error: "No character ID provided",
        };
        setState({ data: result, loading: false, error: result.error ?? null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/${augmentationId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newGrade }),
          }
        );

        const data: UpgradeAugmentationResult = await response.json();

        if (!response.ok) {
          setState({ data, loading: false, error: data.error ?? "Upgrade failed" });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: UpgradeAugmentationResult = {
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

  return { ...state, upgrade, reset };
}

// =============================================================================
// useValidateAugmentation
// =============================================================================

/**
 * Hook to validate an augmentation installation before committing
 *
 * Use this to preview essence costs, magic loss, and validation errors
 * before actually installing an augmentation.
 *
 * @example
 * ```tsx
 * function AugmentationPreview({ characterId, catalogItem, grade }) {
 *   const { validate, loading, data } = useValidateAugmentation(characterId);
 *
 *   useEffect(() => {
 *     validate({
 *       type: "cyberware",
 *       catalogId: catalogItem.id,
 *       grade: grade,
 *     });
 *   }, [catalogItem, grade]);
 *
 *   if (loading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <p>Essence Cost: {data?.projection?.essenceCost}</p>
 *       <p>Projected Essence: {data?.projection?.projectedEssence}</p>
 *       {data?.projection?.projectedMagicLoss && (
 *         <p>Magic Loss: {data.projection.projectedMagicLoss}</p>
 *       )}
 *       {data?.errors.map((e) => (
 *         <ErrorMessage key={e.code}>{e.message}</ErrorMessage>
 *       ))}
 *       {data?.warnings.map((w) => (
 *         <WarningMessage key={w.code}>{w.message}</WarningMessage>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useValidateAugmentation(characterId: string | null): {
  validate: (request: InstallAugmentationRequest) => Promise<ValidateAugmentationResult>;
  reset: () => void;
} & MutationState<ValidateAugmentationResult> {
  const [state, setState] = useState<MutationState<ValidateAugmentationResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const validate = useCallback(
    async (request: InstallAugmentationRequest): Promise<ValidateAugmentationResult> => {
      if (!characterId) {
        const result: ValidateAugmentationResult = {
          success: false,
          valid: false,
          errors: [{ code: "NO_CHARACTER", message: "No character ID provided" }],
          warnings: [],
        };
        setState({ data: result, loading: false, error: null });
        return result;
      }

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(
          `/api/characters/${characterId}/augmentations/validate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          }
        );

        const data: ValidateAugmentationResult = await response.json();

        if (!response.ok && !data.success) {
          setState({
            data,
            loading: false,
            error: data.error ?? null,
          });
          return data;
        }

        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const result: ValidateAugmentationResult = {
          success: false,
          valid: false,
          errors: [
            {
              code: "FETCH_ERROR",
              message: error instanceof Error ? error.message : "Unknown error",
            },
          ],
          warnings: [],
        };
        setState({
          data: result,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return result;
      }
    },
    [characterId]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, validate, reset };
}

// =============================================================================
// useAugmentationDetails
// =============================================================================

/**
 * Hook to fetch details of a specific augmentation
 *
 * @example
 * ```tsx
 * function AugmentationDetail({ characterId, augmentationId }) {
 *   const { augmentation, type, loading, error } =
 *     useAugmentationDetails(characterId, augmentationId);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return (
 *     <div>
 *       <h2>{augmentation.name}</h2>
 *       <p>Type: {type}</p>
 *       <p>Grade: {augmentation.grade}</p>
 *       <p>Essence: {augmentation.essenceCost}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAugmentationDetails(
  characterId: string | null,
  augmentationId: string | null
): {
  augmentation: CyberwareItem | BiowareItem | null;
  type: "cyberware" | "bioware" | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<{
    augmentation: CyberwareItem | BiowareItem | null;
    type: "cyberware" | "bioware" | null;
    loading: boolean;
    error: string | null;
  }>({
    augmentation: null,
    type: null,
    loading: false,
    error: null,
  });

  const fetchDetails = useCallback(async () => {
    if (!characterId || !augmentationId) {
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `/api/characters/${characterId}/augmentations/${augmentationId}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch augmentation details");
      }

      setState({
        augmentation: data.augmentation,
        type: data.type,
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
  }, [characterId, augmentationId]);

  // Auto-fetch on mount and ID changes
  useMemo(() => {
    if (characterId && augmentationId) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId, augmentationId]);

  return {
    ...state,
    refetch: fetchDetails,
  };
}

// =============================================================================
// COMPUTED HOOKS
// =============================================================================

/**
 * Calculate total attribute bonuses from installed augmentations
 */
export function useAugmentationBonuses(
  cyberware: CyberwareItem[],
  bioware: BiowareItem[]
): Record<string, number> {
  return useMemo(() => {
    const bonuses: Record<string, number> = {};

    for (const item of cyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }

    for (const item of bioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }

    return bonuses;
  }, [cyberware, bioware]);
}

/**
 * Calculate total initiative dice bonus from installed augmentations
 */
export function useInitiativeDiceBonus(cyberware: CyberwareItem[]): number {
  return useMemo(() => {
    return cyberware.reduce(
      (sum, item) => sum + (item.initiativeDiceBonus || 0),
      0
    );
  }, [cyberware]);
}

/**
 * Get cyberware with capacity (for enhancement installation)
 */
export function useCyberwareWithCapacity(cyberware: CyberwareItem[]): CyberwareItem[] {
  return useMemo(() => {
    return cyberware.filter((item) => item.capacity && item.capacity > 0);
  }, [cyberware]);
}

/**
 * Calculate remaining capacity for a cyberware item
 */
export function useRemainingCapacity(item: CyberwareItem): number {
  return useMemo(() => {
    const capacity = item.capacity || 0;
    const used = item.capacityUsed || 0;
    return Math.max(0, capacity - used);
  }, [item.capacity, item.capacityUsed]);
}
