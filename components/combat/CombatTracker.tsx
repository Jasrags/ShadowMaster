"use client";

import React, { useMemo } from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  ChevronRight,
  RotateCcw,
  Pause,
  Play,
  Users,
  Clock,
  Skull,
  Heart,
  Zap,
  Shield,
} from "lucide-react";
import type { CombatSession, CombatParticipant, ActionAllocation } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface CombatTrackerProps {
  /** The combat session to display */
  session: CombatSession;
  /** Whether the current user can control the session */
  canControl?: boolean;
  /** Callback when advancing turn */
  onAdvanceTurn?: () => void;
  /** Callback when advancing round */
  onAdvanceRound?: () => void;
  /** Callback when toggling pause */
  onTogglePause?: () => void;
  /** Callback when selecting a participant */
  onSelectParticipant?: (participantId: string) => void;
  /** Currently selected participant ID */
  selectedParticipantId?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show action economy details */
  showActionEconomy?: boolean;
}

interface ParticipantRowProps {
  participant: CombatParticipant;
  isCurrentTurn: boolean;
  isSelected: boolean;
  onSelect?: () => void;
  showActionEconomy: boolean;
  size: "sm" | "md" | "lg";
}

// =============================================================================
// ACTION ECONOMY DISPLAY
// =============================================================================

function ActionEconomyBadges({
  actions,
  size,
}: {
  actions: ActionAllocation;
  size: "sm" | "md" | "lg";
}) {
  const badgeSize =
    size === "sm" ? "w-5 h-5 text-xs" : size === "md" ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm";

  return (
    <div className="flex items-center gap-1">
      {/* Free actions (unlimited) */}
      <div
        className={`${badgeSize} rounded flex items-center justify-center bg-zinc-700 text-zinc-400`}
        title="Free actions"
      >
        F
      </div>

      {/* Simple actions */}
      <div
        className={`${badgeSize} rounded flex items-center justify-center ${
          actions.simple > 0
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            : "bg-zinc-800 text-zinc-600"
        }`}
        title={`Simple actions: ${actions.simple}`}
      >
        {actions.simple}
      </div>

      {/* Complex action */}
      <div
        className={`${badgeSize} rounded flex items-center justify-center ${
          actions.complex > 0
            ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
            : "bg-zinc-800 text-zinc-600"
        }`}
        title={`Complex actions: ${actions.complex}`}
      >
        C
      </div>

      {/* Interrupt */}
      <div
        className={`${badgeSize} rounded flex items-center justify-center ${
          actions.interrupt
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            : "bg-zinc-800 text-zinc-600"
        }`}
        title={actions.interrupt ? "Interrupt available" : "Interrupt used"}
      >
        <Zap className="w-3 h-3" />
      </div>
    </div>
  );
}

// =============================================================================
// PARTICIPANT ROW
// =============================================================================

function ParticipantRow({
  participant,
  isCurrentTurn,
  isSelected,
  onSelect,
  showActionEconomy,
  size,
}: ParticipantRowProps) {
  const sizeClasses = {
    sm: { text: "text-xs", padding: "px-2 py-1.5", icon: "w-3 h-3" },
    md: { text: "text-sm", padding: "px-3 py-2", icon: "w-4 h-4" },
    lg: { text: "text-base", padding: "px-4 py-3", icon: "w-5 h-5" },
  };

  const s = sizeClasses[size];

  const statusIcon = useMemo(() => {
    switch (participant.status) {
      case "active":
        return <Heart className={`${s.icon} text-emerald-400`} />;
      case "delayed":
        return <Clock className={`${s.icon} text-amber-400`} />;
      case "out":
        return <Skull className={`${s.icon} text-rose-400`} />;
      case "waiting":
        return <Clock className={`${s.icon} text-blue-400 animate-pulse`} />;
      default:
        return null;
    }
  }, [participant.status, s.icon]);

  const woundColor = useMemo(() => {
    if (participant.woundModifier === 0) return "text-zinc-400";
    if (participant.woundModifier >= -1) return "text-amber-400";
    if (participant.woundModifier >= -2) return "text-orange-400";
    return "text-rose-400";
  }, [participant.woundModifier]);

  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center gap-2 ${s.padding} rounded-lg
        transition-all duration-200
        ${
          isCurrentTurn
            ? "bg-violet-500/20 border-2 border-violet-500/50"
            : isSelected
              ? "bg-zinc-700/50 border border-zinc-600"
              : "bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50"
        }
      `}
    >
      {/* Turn indicator */}
      {isCurrentTurn && <ChevronRight className={`${s.icon} text-violet-400 flex-shrink-0`} />}

      {/* Status icon */}
      <div className="flex-shrink-0">{statusIcon}</div>

      {/* Name and type */}
      <div className="flex-1 text-left min-w-0">
        <div className={`font-medium text-zinc-200 truncate ${s.text}`}>{participant.name}</div>
        {participant.isGMControlled && (
          <div className={`text-zinc-500 ${size === "lg" ? "text-sm" : "text-xs"}`}>
            GM Controlled
          </div>
        )}
      </div>

      {/* Initiative */}
      <div className="flex-shrink-0 text-right">
        <div className={`font-mono font-bold text-zinc-300 ${s.text}`}>
          {participant.initiativeScore}
        </div>
        <div className={`text-zinc-500 ${size === "lg" ? "text-sm" : "text-xs"}`}>Init</div>
      </div>

      {/* Wound modifier */}
      {participant.woundModifier !== 0 && (
        <div className={`flex-shrink-0 font-mono ${woundColor} ${s.text}`}>
          {participant.woundModifier}
        </div>
      )}

      {/* Action economy */}
      {showActionEconomy && participant.status === "active" && (
        <div className="flex-shrink-0">
          <ActionEconomyBadges actions={participant.actionsRemaining} size={size} />
        </div>
      )}
    </button>
  );
}

// =============================================================================
// COMBAT TRACKER
// =============================================================================

export function CombatTracker({
  session,
  canControl = false,
  onAdvanceTurn,
  onAdvanceRound,
  onTogglePause,
  onSelectParticipant,
  selectedParticipantId,
  size = "md",
  showActionEconomy = true,
}: CombatTrackerProps) {
  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2", gap: "gap-1" },
    md: { text: "text-sm", padding: "p-3", gap: "gap-2" },
    lg: { text: "text-base", padding: "p-4", gap: "gap-3" },
  };

  const s = sizeClasses[size];

  // Sort participants by initiative order
  const sortedParticipants = useMemo(() => {
    return [...session.participants].sort((a, b) => {
      const aIndex = session.initiativeOrder.indexOf(a.id);
      const bIndex = session.initiativeOrder.indexOf(b.id);
      // Participants not in order go to the end
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [session.participants, session.initiativeOrder]);

  // Current participant
  const currentParticipantId = session.initiativeOrder[session.currentTurn];

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { active: 0, delayed: 0, out: 0, waiting: 0 };
    session.participants.forEach((p) => {
      counts[p.status]++;
    });
    return counts;
  }, [session.participants]);

  const isPaused = session.status === "paused";
  const isCompleted = session.status === "completed" || session.status === "abandoned";

  return (
    <div className={`rounded-lg border border-zinc-700 bg-zinc-900/50 ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-rose-400" />
          <span className={`font-medium text-zinc-200 ${s.text}`}>{session.name || "Combat"}</span>
          {isPaused && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">
              Paused
            </span>
          )}
          {isCompleted && (
            <span className="px-2 py-0.5 rounded bg-zinc-500/20 text-zinc-400 text-xs">Ended</span>
          )}
        </div>

        {/* Round & Phase */}
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="flex items-center gap-1">
            <RotateCcw className="w-4 h-4" />
            <span className={s.text}>Round {session.round}</span>
          </div>
          <span className={`capitalize ${s.text}`}>{session.currentPhase}</span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex items-center gap-4 mb-4 text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span className={s.text}>{session.participants.length} total</span>
        </div>
        {statusCounts.active > 0 && (
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-emerald-400" />
            <span className={`text-emerald-400 ${s.text}`}>{statusCounts.active}</span>
          </div>
        )}
        {statusCounts.delayed > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className={`text-amber-400 ${s.text}`}>{statusCounts.delayed}</span>
          </div>
        )}
        {statusCounts.out > 0 && (
          <div className="flex items-center gap-1">
            <Skull className="w-3 h-3 text-rose-400" />
            <span className={`text-rose-400 ${s.text}`}>{statusCounts.out}</span>
          </div>
        )}
      </div>

      {/* Participant List */}
      <div className={`space-y-1.5 mb-4 max-h-80 overflow-y-auto ${s.gap}`}>
        {sortedParticipants.length === 0 ? (
          <div className={`text-center text-zinc-500 py-4 ${s.text}`}>No participants yet</div>
        ) : (
          sortedParticipants.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              isCurrentTurn={participant.id === currentParticipantId}
              isSelected={participant.id === selectedParticipantId}
              onSelect={() => onSelectParticipant?.(participant.id)}
              showActionEconomy={showActionEconomy}
              size={size}
            />
          ))
        )}
      </div>

      {/* Controls */}
      {canControl && !isCompleted && (
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-700">
          {/* Pause/Resume */}
          <Button
            onPress={onTogglePause}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg
              ${
                isPaused
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
              }
              transition-colors ${s.text}
            `}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </Button>

          {/* Next Turn */}
          <Button
            onPress={onAdvanceTurn}
            isDisabled={isPaused}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              bg-violet-600 text-white hover:bg-violet-500
              disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <ChevronRight className="w-4 h-4" />
            Next Turn
          </Button>

          {/* Next Round */}
          <Button
            onPress={onAdvanceRound}
            isDisabled={isPaused}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg
              bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700
              disabled:text-zinc-600 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <RotateCcw className="w-4 h-4" />
            New Round
          </Button>
        </div>
      )}

      {/* Environment Info (collapsed) */}
      {session.environment && (
        <div className="mt-3 pt-3 border-t border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-500">
            <Shield className="w-4 h-4" />
            <span className={s.text}>
              {session.environment.terrain || "Urban"} •{" "}
              {session.environment.visibility || "normal"} visibility
              {session.environment.weather && session.environment.weather !== "clear"
                ? ` • ${session.environment.weather}`
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
