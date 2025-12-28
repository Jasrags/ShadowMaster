"use client";

/**
 * React Hooks for Action Resolution
 *
 * Provides hooks for dice rolling, Edge management, and pool building
 * with API integration and local state management.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import type {
  Character,
  ActionResult,
  ActionPool,
  PoolBuildOptions,
  ActionContext,
  EdgeActionType,
  EditionDiceRules,
  ActionHistoryStats,
  PoolModifier,
} from "@/lib/types";
// Import directly from specific files to avoid pulling in server-only code
// (action-executor.ts imports storage layer which uses Node.js 'fs')
import {
  buildActionPool,
  calculateWoundModifier,
  calculateLimit,
} from "./pool-builder";
import { DEFAULT_DICE_RULES } from "./dice-engine";

// =============================================================================
// useActionResolver Hook
// =============================================================================

export interface UseActionResolverOptions {
  /** Character ID for persistent rolls */
  characterId?: string;
  /** Maximum history items to keep locally */
  maxLocalHistory?: number;
  /** Whether to persist rolls to server */
  persistRolls?: boolean;
}

export interface UseActionResolverReturn {
  /** Roll dice with a pool configuration */
  roll: (
    pool: ActionPool | PoolBuildOptions,
    context?: ActionContext,
    edgeAction?: EdgeActionType
  ) => Promise<ActionResult | null>;
  /** Reroll the last action using Edge */
  reroll: (edgeAction: EdgeActionType) => Promise<ActionResult | null>;
  /** Current/last action result */
  currentResult: ActionResult | null;
  /** Local roll history */
  history: ActionResult[];
  /** Whether a roll is in progress */
  isRolling: boolean;
  /** Error message if last operation failed */
  error: string | null;
  /** Clear the current result */
  clearResult: () => void;
  /** Clear all history */
  clearHistory: () => void;
}

/**
 * Hook for managing action resolution with optional server persistence
 */
export function useActionResolver(
  options: UseActionResolverOptions = {}
): UseActionResolverReturn {
  const { characterId, maxLocalHistory = 10, persistRolls = true } = options;

  const [currentResult, setCurrentResult] = useState<ActionResult | null>(null);
  const [history, setHistory] = useState<ActionResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform a dice roll
   */
  const roll = useCallback(
    async (
      pool: ActionPool | PoolBuildOptions,
      context?: ActionContext,
      edgeAction?: EdgeActionType
    ): Promise<ActionResult | null> => {
      setIsRolling(true);
      setError(null);

      try {
        if (persistRolls && characterId) {
          // Server-side roll
          const response = await fetch(`/api/characters/${characterId}/actions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pool,
              context,
              edgeAction,
            }),
          });

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || "Roll failed");
          }

          const result = data.result as ActionResult;
          setCurrentResult(result);
          setHistory((prev) => [result, ...prev].slice(0, maxLocalHistory));
          return result;
        } else {
          // Client-side only roll (for demos/testing)
          const { executeRoll } = await import("./dice-engine");

          // Build pool if needed
          let actionPool: ActionPool;
          if ("totalDice" in pool) {
            actionPool = pool;
          } else {
            // Can't build pool without character data client-side
            // Use manual pool or basic options
            actionPool = {
              basePool: pool.manualPool || 6,
              modifiers: pool.situationalModifiers || [],
              totalDice: pool.manualPool || 6,
              limit: pool.limit,
              limitSource: pool.limitSource,
            };
          }

          const rollResult = executeRoll(actionPool.totalDice, DEFAULT_DICE_RULES, {
            limit: actionPool.limit,
          });

          const result: ActionResult = {
            id: crypto.randomUUID(),
            characterId: characterId || "",
            userId: "",
            pool: actionPool,
            dice: rollResult.dice,
            hits: rollResult.hits,
            rawHits: rollResult.rawHits,
            ones: rollResult.ones,
            isGlitch: rollResult.isGlitch,
            isCriticalGlitch: rollResult.isCriticalGlitch,
            edgeSpent: 0,
            rerollCount: 0,
            timestamp: new Date().toISOString(),
            context,
          };

          setCurrentResult(result);
          setHistory((prev) => [result, ...prev].slice(0, maxLocalHistory));
          return result;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Roll failed";
        setError(message);
        return null;
      } finally {
        setIsRolling(false);
      }
    },
    [characterId, persistRolls, maxLocalHistory]
  );

  /**
   * Reroll the current result using Edge
   */
  const reroll = useCallback(
    async (edgeAction: EdgeActionType): Promise<ActionResult | null> => {
      if (!currentResult) {
        setError("No result to reroll");
        return null;
      }

      setIsRolling(true);
      setError(null);

      try {
        if (persistRolls && characterId) {
          const response = await fetch(
            `/api/characters/${characterId}/actions/${currentResult.id}/reroll`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ edgeAction }),
            }
          );

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || "Reroll failed");
          }

          const result = data.result as ActionResult;
          setCurrentResult(result);
          // Update the history entry
          setHistory((prev) =>
            prev.map((h) => (h.id === currentResult.id ? result : h))
          );
          return result;
        } else {
          // Client-side reroll
          const { executeReroll } = await import("./dice-engine");

          const rerollResult = executeReroll(
            currentResult.dice,
            DEFAULT_DICE_RULES,
            currentResult.pool.limit
          );

          const result: ActionResult = {
            ...currentResult,
            dice: rerollResult.dice,
            hits: rerollResult.hits,
            rawHits: rerollResult.rawHits,
            ones: rerollResult.ones,
            isGlitch: rerollResult.isGlitch,
            isCriticalGlitch: rerollResult.isCriticalGlitch,
            edgeSpent: currentResult.edgeSpent + 1,
            edgeAction,
            rerollCount: currentResult.rerollCount + 1,
          };

          setCurrentResult(result);
          setHistory((prev) =>
            prev.map((h) => (h.id === currentResult.id ? result : h))
          );
          return result;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Reroll failed";
        setError(message);
        return null;
      } finally {
        setIsRolling(false);
      }
    },
    [currentResult, characterId, persistRolls]
  );

  const clearResult = useCallback(() => {
    setCurrentResult(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    roll,
    reroll,
    currentResult,
    history,
    isRolling,
    error,
    clearResult,
    clearHistory,
  };
}

// =============================================================================
// useEdge Hook
// =============================================================================

export interface UseEdgeReturn {
  /** Current Edge points */
  current: number;
  /** Maximum Edge points */
  maximum: number;
  /** Whether Edge can be spent */
  canSpend: boolean;
  /** Whether Edge can be restored */
  canRestore: boolean;
  /** Spend Edge points */
  spend: (amount?: number, reason?: string) => Promise<boolean>;
  /** Restore Edge points */
  restore: (amount?: number, reason?: string) => Promise<boolean>;
  /** Restore all Edge to maximum */
  restoreFull: (reason?: string) => Promise<boolean>;
  /** Refresh Edge from server */
  refresh: () => Promise<void>;
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Error message if last operation failed */
  error: string | null;
}

/**
 * Hook for managing Edge points
 */
export function useEdge(characterId: string): UseEdgeReturn {
  const [current, setCurrent] = useState(0);
  const [maximum, setMaximum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial Edge status
  useEffect(() => {
    async function fetchEdge() {
      try {
        const response = await fetch(`/api/characters/${characterId}/edge`);
        const data = await response.json();

        if (data.success) {
          setCurrent(data.edgeCurrent);
          setMaximum(data.edgeMaximum);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch Edge");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEdge();
  }, [characterId]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/characters/${characterId}/edge`);
      const data = await response.json();

      if (data.success) {
        setCurrent(data.edgeCurrent);
        setMaximum(data.edgeMaximum);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Edge");
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  const spend = useCallback(
    async (amount = 1, reason?: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/characters/${characterId}/edge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "spend", amount, reason }),
        });

        const data = await response.json();

        if (data.success) {
          setCurrent(data.edgeCurrent);
          setMaximum(data.edgeMaximum);
          return true;
        } else {
          setError(data.error);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to spend Edge");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [characterId]
  );

  const restore = useCallback(
    async (amount = 1, reason?: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/characters/${characterId}/edge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "restore", amount, reason }),
        });

        const data = await response.json();

        if (data.success) {
          setCurrent(data.edgeCurrent);
          setMaximum(data.edgeMaximum);
          return true;
        } else {
          setError(data.error);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to restore Edge");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [characterId]
  );

  const restoreFull = useCallback(
    async (reason?: string): Promise<boolean> => {
      return restore(maximum, reason);
    },
    [restore, maximum]
  );

  return {
    current,
    maximum,
    canSpend: current > 0,
    canRestore: current < maximum,
    spend,
    restore,
    restoreFull,
    refresh,
    isLoading,
    error,
  };
}

// =============================================================================
// usePoolBuilder Hook
// =============================================================================

export interface UsePoolBuilderReturn {
  /** Build an action pool */
  buildPool: (options: PoolBuildOptions) => ActionPool;
  /** Current wound modifier */
  woundModifier: number;
  /** Physical limit */
  physicalLimit: number;
  /** Mental limit */
  mentalLimit: number;
  /** Social limit */
  socialLimit: number;
  /** Add a situational modifier */
  addModifier: (modifier: PoolModifier) => void;
  /** Remove a situational modifier by index */
  removeModifier: (index: number) => void;
  /** Clear all situational modifiers */
  clearModifiers: () => void;
  /** Current situational modifiers */
  modifiers: PoolModifier[];
}

/**
 * Hook for building action pools from character data
 */
export function usePoolBuilder(
  character: Character | null,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): UsePoolBuilderReturn {
  const [modifiers, setModifiers] = useState<PoolModifier[]>([]);

  // Calculate wound modifier
  const woundModifier = useMemo(() => {
    if (!character) return 0;
    return calculateWoundModifier(
      character.condition?.physicalDamage || 0,
      character.condition?.stunDamage || 0,
      rules
    );
  }, [character, rules]);

  // Calculate limits
  const physicalLimit = useMemo(() => {
    if (!character) return 0;
    return calculateLimit(character, "physical");
  }, [character]);

  const mentalLimit = useMemo(() => {
    if (!character) return 0;
    return calculateLimit(character, "mental");
  }, [character]);

  const socialLimit = useMemo(() => {
    if (!character) return 0;
    return calculateLimit(character, "social");
  }, [character]);

  const buildPool = useCallback(
    (options: PoolBuildOptions): ActionPool => {
      if (!character) {
        return {
          basePool: options.manualPool || 0,
          modifiers: [],
          totalDice: Math.max(0, options.manualPool || 0),
        };
      }

      // Merge in tracked modifiers
      const allModifiers = [
        ...(options.situationalModifiers || []),
        ...modifiers,
      ];

      return buildActionPool(
        character,
        { ...options, situationalModifiers: allModifiers },
        rules
      );
    },
    [character, modifiers, rules]
  );

  const addModifier = useCallback((modifier: PoolModifier) => {
    setModifiers((prev) => [...prev, modifier]);
  }, []);

  const removeModifier = useCallback((index: number) => {
    setModifiers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearModifiers = useCallback(() => {
    setModifiers([]);
  }, []);

  return {
    buildPool,
    woundModifier,
    physicalLimit,
    mentalLimit,
    socialLimit,
    addModifier,
    removeModifier,
    clearModifiers,
    modifiers,
  };
}

// =============================================================================
// useActionHistory Hook
// =============================================================================

export interface UseActionHistoryReturn {
  /** Action history */
  actions: ActionResult[];
  /** History statistics */
  stats: ActionHistoryStats | null;
  /** Total actions (for pagination) */
  total: number;
  /** Whether loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Load more actions */
  loadMore: () => Promise<void>;
  /** Refresh history */
  refresh: () => Promise<void>;
  /** Has more actions to load */
  hasMore: boolean;
}

/**
 * Hook for fetching action history
 */
export function useActionHistory(
  characterId: string,
  options: {
    limit?: number;
    includeStats?: boolean;
  } = {}
): UseActionHistoryReturn {
  const { limit = 20, includeStats = false } = options;

  const [actions, setActions] = useState<ActionResult[]>([]);
  const [stats, setStats] = useState<ActionHistoryStats | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  // Fetch initial history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: "0",
          includeStats: includeStats.toString(),
        });

        const response = await fetch(
          `/api/characters/${characterId}/actions?${params}`
        );
        const data = await response.json();

        if (data.success) {
          setActions(data.actions);
          setTotal(data.total);
          if (data.stats) {
            setStats(data.stats);
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch history");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [characterId, limit, includeStats]);

  const loadMore = useCallback(async () => {
    if (actions.length >= total) return;

    setIsLoading(true);
    try {
      const newOffset = offset + limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: newOffset.toString(),
      });

      const response = await fetch(
        `/api/characters/${characterId}/actions?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setActions((prev) => [...prev, ...data.actions]);
        setOffset(newOffset);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setIsLoading(false);
    }
  }, [characterId, limit, offset, actions.length, total]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setOffset(0);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: "0",
        includeStats: includeStats.toString(),
      });

      const response = await fetch(
        `/api/characters/${characterId}/actions?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setActions(data.actions);
        setTotal(data.total);
        if (data.stats) {
          setStats(data.stats);
        }
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh");
    } finally {
      setIsLoading(false);
    }
  }, [characterId, limit, includeStats]);

  return {
    actions,
    stats,
    total,
    isLoading,
    error,
    loadMore,
    refresh,
    hasMore: actions.length < total,
  };
}
