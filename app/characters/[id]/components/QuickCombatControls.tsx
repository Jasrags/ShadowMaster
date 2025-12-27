"use client";

/**
 * Quick Combat Controls
 *
 * Provides controls for starting, managing, and ending solo combat sessions
 * directly from the character sheet. This enables testing action execution
 * without requiring multiplayer infrastructure.
 *
 * Phase 5.3.1: Quick Combat Mode
 */

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  Play,
  Pause,
  Square,
  SkipForward,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { useCombatSession } from "@/lib/combat";
import type { Character } from "@/lib/types";
import type { Theme } from "@/lib/themes";

interface QuickCombatControlsProps {
  /** Character data */
  character: Character;
  /** Edition code */
  editionCode: string;
  /** Current theme */
  theme: Theme;
  /** Callback when combat state changes */
  onCombatStateChange?: (isInCombat: boolean) => void;
}

/**
 * Calculate initiative dice based on character attributes
 */
function calculateInitiativeDice(character: Character): number {
  const attrs = character.attributes || {};
  // SR5: Initiative = Reaction + Intuition + 1d6 (base)
  // Characters with cyberware might have additional dice
  const baseDice = 1;
  // TODO: Add modifier from cyberware/adept powers/spells
  return baseDice;
}

/**
 * Roll initiative (Reaction + Intuition + Xd6)
 */
function rollInitiative(character: Character): {
  score: number;
  dice: number[];
  base: number;
} {
  const attrs = character.attributes || {};
  const reaction = attrs.reaction || 1;
  const intuition = attrs.intuition || 1;
  const base = reaction + intuition;

  const numDice = calculateInitiativeDice(character);
  const dice: number[] = [];

  for (let i = 0; i < numDice; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }

  const diceTotal = dice.reduce((sum, d) => sum + d, 0);
  const score = base + diceTotal;

  return { score, dice, base };
}

export function QuickCombatControls({
  character,
  editionCode,
  theme,
  onCombatStateChange,
}: QuickCombatControlsProps) {
  // Combat session context
  const {
    session,
    participant,
    isInCombat,
    isMyTurn,
    isLoading,
    error,
    endTurn,
    delayTurn,
    leaveSession,
  } = useCombatSession();

  // Local state
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastInitiativeRoll, setLastInitiativeRoll] = useState<{
    score: number;
    dice: number[];
    base: number;
  } | null>(null);

  // Calculate initiative pool for display
  const initiativePool = useMemo(() => {
    const attrs = character.attributes || {};
    return (attrs.reaction || 1) + (attrs.intuition || 1);
  }, [character]);

  // Start a quick combat session
  const startQuickCombat = useCallback(async () => {
    setIsStarting(true);
    setLocalError(null);

    try {
      // Step 1: Create a combat session
      const createResponse = await fetch("/api/combat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Quick Combat - ${character.name}`,
          editionCode,
        }),
      });

      const createData = await createResponse.json();
      if (!createData.success) {
        throw new Error(createData.error || "Failed to create combat session");
      }

      const sessionId = createData.session.id;

      // Step 2: Roll initiative
      const initiative = rollInitiative(character);
      setLastInitiativeRoll(initiative);

      // Step 3: Add character as participant
      const addResponse = await fetch(`/api/combat/${sessionId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "character",
          entityId: character.id,
          name: character.name,
          initiativeScore: initiative.score,
          initiativeDice: initiative.dice,
          isGMControlled: false,
          woundModifier: -Math.floor((character.condition?.physicalDamage || 0) / 3) - Math.floor((character.condition?.stunDamage || 0) / 3),
        }),
      });

      const addData = await addResponse.json();
      if (!addData.success) {
        throw new Error(addData.error || "Failed to add to combat");
      }

      // Step 4: Set phase to action
      await fetch(`/api/combat/${sessionId}/turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "phase", phase: "action" }),
      });

      // Notify parent of state change
      onCombatStateChange?.(true);

      // Force a page reload to pick up the new session
      // This is a temporary solution until we have proper state management
      window.location.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start combat";
      setLocalError(message);
    } finally {
      setIsStarting(false);
    }
  }, [character, editionCode, onCombatStateChange]);

  // End the current combat session
  const endQuickCombat = useCallback(async () => {
    if (!session) return;

    setIsEnding(true);
    setLocalError(null);

    try {
      const response = await fetch(`/api/combat/${session.id}?action=end&reason=completed`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to end combat");
      }

      // Leave the session locally
      await leaveSession();

      // Notify parent
      onCombatStateChange?.(false);
      setLastInitiativeRoll(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end combat";
      setLocalError(message);
    } finally {
      setIsEnding(false);
    }
  }, [session, leaveSession, onCombatStateChange]);

  // Handle end turn
  const handleEndTurn = useCallback(async () => {
    const success = await endTurn();
    if (!success) {
      setLocalError("Failed to end turn");
    }
  }, [endTurn]);

  // Handle delay turn
  const handleDelayTurn = useCallback(async () => {
    const success = await delayTurn();
    if (!success) {
      setLocalError("Failed to delay turn");
    }
  }, [delayTurn]);

  // Display error
  const displayError = localError || error;

  // If not in combat, show start button
  if (!isInCombat) {
    return (
      <div className={`rounded-lg overflow-hidden ${theme.components.section.wrapper}`}>
        <div className={`p-4 space-y-3 ${theme.components.section.header}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className={`w-5 h-5 ${theme.colors.accent}`} />
              <span className={`font-medium ${theme.colors.heading}`}>Quick Combat</span>
            </div>
            <div className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
              Initiative: {initiativePool} + 1d6
            </div>
          </div>

          {displayError && (
            <div className={`flex items-center gap-2 p-2 rounded text-xs border ${theme.components.badge.negative}`}>
              <AlertCircle className="w-4 h-4" />
              {displayError}
            </div>
          )}

          <Button
            onPress={startQuickCombat}
            isDisabled={isStarting}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded font-medium
              bg-amber-500/20 text-amber-500 border border-amber-500/30
              hover:bg-amber-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting Combat...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Quick Combat
              </>
            )}
          </Button>

          <p className={`text-xs ${theme.colors.muted}`}>
            Start a solo combat session to test action execution and track your turn.
          </p>
        </div>
      </div>
    );
  }

  // In combat - show combat controls
  return (
    <div className={`rounded-lg overflow-hidden border-2 border-amber-500/50 ${theme.components.section.wrapper}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between p-3
          ${theme.components.section.header}
          hover:opacity-80 transition-opacity
        `}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Swords className="w-5 h-5 text-amber-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="font-medium text-amber-500">Combat Active</span>
        </div>
        <div className="flex items-center gap-3">
          {session && (
            <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
              Round {session.round}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className={`w-4 h-4 ${theme.colors.muted}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${theme.colors.muted}`} />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`p-4 space-y-4 border-t ${theme.colors.border}`}>
          {/* Combat Status */}
          <div className="grid grid-cols-2 gap-3">
            {/* Round & Turn */}
            <div className={`p-3 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted} mb-1`}>
                Round / Turn
              </div>
              <div className={`${theme.fonts.mono} font-bold text-amber-500`}>
                {session?.round || 1} / {(session?.currentTurn || 0) + 1}
              </div>
            </div>

            {/* Initiative */}
            <div className={`p-3 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted} mb-1`}>
                Initiative
              </div>
              <div className={`${theme.fonts.mono} font-bold ${theme.colors.accent}`}>
                {participant?.initiativeScore || lastInitiativeRoll?.score || "—"}
              </div>
              {lastInitiativeRoll && (
                <div className={`text-[10px] ${theme.colors.muted}`}>
                  {lastInitiativeRoll.base} + [{lastInitiativeRoll.dice.join(", ")}]
                </div>
              )}
            </div>
          </div>

          {/* Turn Status */}
          {isMyTurn ? (
            <div className={`
              flex items-center gap-2 p-3 rounded border
              bg-emerald-500/20 border-emerald-500/30 text-emerald-500
            `}>
              <Zap className="w-5 h-5" />
              <span className="font-medium">Your Turn!</span>
            </div>
          ) : (
            <div className={`
              flex items-center gap-2 p-3 rounded border
              ${theme.components.card.wrapper} ${theme.colors.muted}
            `}>
              <Clock className="w-5 h-5" />
              <span>Waiting for turn...</span>
            </div>
          )}

          {/* Action Economy */}
          {participant?.actionsRemaining && (
            <div className={`p-3 rounded ${theme.components.card.wrapper} ${theme.components.card.border}`}>
              <div className={`text-[10px] uppercase ${theme.fonts.mono} ${theme.colors.muted} mb-2`}>
                Actions Remaining
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${theme.colors.muted}`}>Free</span>
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${participant.actionsRemaining.free > 0
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {participant.actionsRemaining.free > 10 ? "∞" : participant.actionsRemaining.free}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${theme.colors.muted}`}>Simple</span>
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${participant.actionsRemaining.simple > 0
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {participant.actionsRemaining.simple}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${theme.colors.muted}`}>Complex</span>
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${participant.actionsRemaining.complex > 0
                      ? "bg-purple-500/20 text-purple-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {participant.actionsRemaining.complex}
                  </span>
                </div>
                <div title="Interrupt Available">
                  <Shield className={`w-4 h-4 ${
                    participant.actionsRemaining.interrupt
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  }`} />
                </div>
              </div>
            </div>
          )}

          {/* Participants Count */}
          {session && session.participants.length > 1 && (
            <div className={`flex items-center gap-2 text-sm ${theme.colors.muted}`}>
              <Users className="w-4 h-4" />
              <span>{session.participants.length} participants in combat</span>
            </div>
          )}

          {displayError && (
            <div className={`flex items-center gap-2 p-2 rounded text-xs border ${theme.components.badge.negative}`}>
              <AlertCircle className="w-4 h-4" />
              {displayError}
            </div>
          )}

          {/* Turn Controls */}
          <div className="flex items-center gap-2">
            <Button
              onPress={handleEndTurn}
              isDisabled={!isMyTurn || isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-3 py-2 rounded font-medium text-sm
                bg-blue-500/20 text-blue-500 border border-blue-500/30
                hover:bg-blue-500/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <SkipForward className="w-4 h-4" />
              End Turn
            </Button>
            <Button
              onPress={handleDelayTurn}
              isDisabled={!isMyTurn || isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-3 py-2 rounded font-medium text-sm
                ${theme.components.card.wrapper} ${theme.components.card.border}
                ${theme.colors.muted}
                hover:opacity-80
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Clock className="w-4 h-4" />
              Delay
            </Button>
          </div>

          {/* End Combat */}
          <Button
            onPress={endQuickCombat}
            isDisabled={isEnding}
            className={`
              w-full flex items-center justify-center gap-2
              px-3 py-2 rounded font-medium text-sm
              bg-rose-500/20 text-rose-500 border border-rose-500/30
              hover:bg-rose-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            {isEnding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ending Combat...
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                End Combat
              </>
            )}
          </Button>
        </div>
      )}

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className={`px-4 py-2 flex items-center justify-between border-t ${theme.colors.border}`}>
          <div className="flex items-center gap-4">
            {isMyTurn && (
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Your Turn
              </span>
            )}
            {participant?.actionsRemaining && (
              <div className={`flex items-center gap-2 text-xs ${theme.fonts.mono}`}>
                <span className={participant.actionsRemaining.simple > 0 ? "text-blue-500" : "text-muted-foreground"}>
                  S:{participant.actionsRemaining.simple}
                </span>
                <span className={participant.actionsRemaining.complex > 0 ? "text-purple-500" : "text-muted-foreground"}>
                  C:{participant.actionsRemaining.complex}
                </span>
              </div>
            )}
          </div>
          <div className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
            Init: {participant?.initiativeScore || "—"}
          </div>
        </div>
      )}
    </div>
  );
}
