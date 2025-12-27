"use client";

/**
 * CombatModeIndicator Component
 *
 * Visual indicator for when a character is in active combat.
 * Shows combat session info, current turn indicator, and action economy.
 */

import React from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  Clock,
  Zap,
  Users,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  Shield,
  X,
} from "lucide-react";
import { useCombatSession, useActionEconomy } from "@/lib/combat";
import type { Theme } from "@/lib/themes";

interface CombatModeIndicatorProps {
  /** Current theme */
  theme: Theme;
  /** Callback when user wants to view full combat tracker */
  onOpenCombatTracker?: () => void;
}

export function CombatModeIndicator({
  theme,
  onOpenCombatTracker,
}: CombatModeIndicatorProps) {
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

  const actionEconomy = useActionEconomy();

  // Don't render if not in combat
  if (!isInCombat || !session || !participant) {
    return null;
  }

  // Get current turn participant name
  const currentTurnId = session.initiativeOrder[session.currentTurn];
  const currentTurnParticipant = session.participants.find((p) => p.id === currentTurnId);

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        ${theme.components.section.wrapper}
        ${isMyTurn ? "ring-2 ring-emerald-500 ring-opacity-50" : ""}
      `}
    >
      {/* Combat Active Banner */}
      <div
        className={`
          flex items-center justify-between px-4 py-2
          ${isMyTurn
            ? "bg-emerald-500/20 border-b border-emerald-500/30"
            : "bg-amber-500/10 border-b border-amber-500/20"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Swords
            className={`w-5 h-5 ${isMyTurn ? "text-emerald-500" : "text-amber-500"}`}
          />
          <span
            className={`font-bold text-sm ${
              isMyTurn ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {isMyTurn ? "YOUR TURN" : "IN COMBAT"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
            Round {session.round}
          </span>
          <span className={`text-xs ${theme.colors.muted}`}>•</span>
          <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
            {session.name}
          </span>
        </div>
      </div>

      {/* Combat Info */}
      <div className="p-4 space-y-4">
        {/* Turn Order Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${theme.colors.muted}`} />
            <span className={`text-sm ${theme.colors.muted}`}>Current Turn:</span>
            <span className={`text-sm font-medium ${theme.colors.heading}`}>
              {currentTurnParticipant?.name || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${theme.colors.muted}`} />
            <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
              {session.participants.filter((p) => p.status === "active").length}/
              {session.participants.length} active
            </span>
          </div>
        </div>

        {/* Initiative Score */}
        <div
          className={`
            flex items-center justify-between p-3 rounded
            ${theme.components.card.wrapper} ${theme.components.card.border}
          `}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
              Initiative
            </span>
          </div>
          <span className={`text-lg font-bold ${theme.fonts.mono} text-cyan-500`}>
            {participant.initiativeScore}
          </span>
        </div>

        {/* Action Economy */}
        {actionEconomy && (
          <div
            className={`
              p-3 rounded space-y-2
              ${theme.components.card.wrapper} ${theme.components.card.border}
            `}
          >
            <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
              Actions Remaining
            </div>
            <div className="flex items-center gap-3">
              {/* Free Actions */}
              <div className="flex items-center gap-1" title="Free Actions">
                <span className={`text-xs ${theme.colors.muted}`}>F</span>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${actionEconomy.free > 0
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {actionEconomy.free}
                </span>
              </div>

              {/* Simple Actions */}
              <div className="flex items-center gap-1" title="Simple Actions">
                <span className={`text-xs ${theme.colors.muted}`}>S</span>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${actionEconomy.simple > 0
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {actionEconomy.simple}
                </span>
              </div>

              {/* Complex Actions */}
              <div className="flex items-center gap-1" title="Complex Actions">
                <span className={`text-xs ${theme.colors.muted}`}>C</span>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-bold ${theme.fonts.mono}
                    ${actionEconomy.complex > 0
                      ? "bg-purple-500/20 text-purple-500"
                      : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {actionEconomy.complex}
                </span>
              </div>

              {/* Interrupt */}
              <div className="flex items-center gap-1" title="Interrupt Available">
                <Shield
                  className={`w-4 h-4 ${
                    actionEconomy.interrupt ? "text-amber-500" : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Wound Modifier Warning */}
        {participant.woundModifier !== 0 && (
          <div
            className={`
              flex items-center gap-2 p-2 rounded text-xs border
              ${theme.components.badge.negative}
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Wound Modifier: {participant.woundModifier}</span>
          </div>
        )}

        {/* Combat Actions */}
        {isMyTurn && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button
              onPress={() => endTurn()}
              isDisabled={isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-3 py-2 rounded text-sm
                bg-emerald-500/20 text-emerald-500 border border-emerald-500/30
                hover:bg-emerald-500/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <SkipForward className="w-4 h-4" />
              End Turn
            </Button>
            <Button
              onPress={() => delayTurn()}
              isDisabled={isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-3 py-2 rounded text-sm
                bg-amber-500/20 text-amber-500 border border-amber-500/30
                hover:bg-amber-500/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Pause className="w-4 h-4" />
              Delay
            </Button>
          </div>
        )}

        {/* View Combat Tracker / Leave Session */}
        <div className="flex items-center gap-2 pt-2">
          {onOpenCombatTracker && (
            <Button
              onPress={onOpenCombatTracker}
              className={`
                flex-1 flex items-center justify-center gap-2
                px-3 py-2 rounded text-sm
                ${theme.components.card.wrapper} ${theme.components.card.border}
                ${theme.colors.muted}
                hover:opacity-80
                transition-colors
              `}
            >
              <Play className="w-4 h-4" />
              Combat Tracker
            </Button>
          )}
          <Button
            onPress={() => leaveSession()}
            isDisabled={isLoading}
            className={`
              px-3 py-2 rounded text-sm
              bg-red-500/10 text-red-500 border border-red-500/20
              hover:bg-red-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
            aria-label="Leave combat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-xs text-red-500 p-2 rounded bg-red-500/10">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for header/navbar display
 */
export function CombatModeChip({ theme }: { theme: Theme }) {
  const { isInCombat, isMyTurn, session } = useCombatSession();

  if (!isInCombat || !session) return null;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        ${isMyTurn
          ? "bg-emerald-500/20 border border-emerald-500/30"
          : "bg-amber-500/10 border border-amber-500/20"
        }
      `}
    >
      <Swords
        className={`w-4 h-4 ${isMyTurn ? "text-emerald-500 animate-pulse" : "text-amber-500"}`}
      />
      <span
        className={`text-xs font-bold ${theme.fonts.mono} ${
          isMyTurn ? "text-emerald-500" : "text-amber-500"
        }`}
      >
        {isMyTurn ? "YOUR TURN" : `R${session.round}`}
      </span>
    </div>
  );
}
