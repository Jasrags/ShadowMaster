"use client";

/**
 * Target Selector Component
 *
 * Provides a UI for selecting targets during combat actions.
 * Shows available targets in the combat session and allows
 * selection for attack actions.
 *
 * Phase 5.3.3: Target Selection
 */

import React, { useState, useMemo } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay, Heading } from "react-aria-components";
import { Target, X, Shield, Heart, AlertTriangle, User, Bot, Skull } from "lucide-react";
import { useCombatSession } from "@/lib/combat";
import type { CombatParticipant } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";

interface TargetSelectorProps {
  /** Character ID (to exclude self from targets) */
  characterId: string;
  /** Current theme */
  theme?: Theme;
  /** Callback when target is selected */
  onTargetSelect: (targetId: string, targetName: string) => void;
  /** Optional filter for valid target types */
  validTargetTypes?: Array<"character" | "npc" | "grunt" | "spirit" | "drone" | "device">;
  /** Whether to show as inline list or modal trigger */
  variant?: "inline" | "modal";
  /** Currently selected target ID */
  selectedTargetId?: string | null;
}

/**
 * Get icon for participant type
 */
function getParticipantIcon(type: string): React.ReactNode {
  switch (type) {
    case "character":
      return <User className="w-4 h-4" />;
    case "npc":
      return <Bot className="w-4 h-4" />;
    case "grunt":
      return <Skull className="w-4 h-4" />;
    case "spirit":
      return <AlertTriangle className="w-4 h-4" />;
    case "drone":
      return <Target className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
}

/**
 * Get status color for participant
 */
function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-emerald-500";
    case "waiting":
      return "text-amber-500";
    case "delayed":
      return "text-blue-500";
    case "out":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

interface TargetCardProps {
  participant: CombatParticipant;
  isSelected: boolean;
  onSelect: () => void;
  theme?: Theme;
}

function TargetCard({ participant, isSelected, onSelect, theme: themeProp }: TargetCardProps) {
  const theme = themeProp || THEMES[DEFAULT_THEME];
  const isDefeated = participant.status === "out";

  return (
    <Button
      onPress={onSelect}
      isDisabled={isDefeated}
      className={`
        w-full flex items-center gap-3 p-3 rounded border transition-all
        ${
          isSelected
            ? "border-amber-500 bg-amber-500/20 text-amber-500"
            : isDefeated
              ? "border-red-500/30 bg-red-500/10 opacity-50 cursor-not-allowed"
              : `${theme.components.card.wrapper} ${theme.components.card.border} ${theme.components.card.hover}`
        }
      `}
    >
      {/* Participant Icon */}
      <div
        className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${isSelected ? "bg-amber-500/30" : "bg-muted"}
      `}
      >
        {getParticipantIcon(participant.type)}
      </div>

      {/* Participant Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isSelected ? "text-amber-500" : theme.colors.heading}`}>
            {participant.name}
          </span>
          {participant.isGMControlled && (
            <span
              className={`text-[9px] px-1 py-0.5 rounded ${theme.fonts.mono} bg-muted text-muted-foreground`}
            >
              GM
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="capitalize">{participant.type}</span>
          <span className={getStatusColor(participant.status)}>{participant.status}</span>
          {participant.woundModifier !== 0 && (
            <span className="text-red-400 flex items-center gap-0.5">
              <Heart className="w-3 h-3" />
              {participant.woundModifier}
            </span>
          )}
        </div>
      </div>

      {/* Initiative Score */}
      <div className="text-right">
        <div className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>Init</div>
        <div
          className={`font-bold ${theme.fonts.mono} ${isSelected ? "text-amber-500" : theme.colors.accent}`}
        >
          {participant.initiativeScore}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <Target className="w-4 h-4 text-white" />
        </div>
      )}
    </Button>
  );
}

export function TargetSelector({
  characterId,
  theme: themeProp,
  onTargetSelect,
  validTargetTypes,
  variant = "modal",
  selectedTargetId,
}: TargetSelectorProps) {
  const theme = themeProp || THEMES[DEFAULT_THEME];
  const { session, participant } = useCombatSession();
  const [isOpen, setIsOpen] = useState(false);

  // Filter targets (exclude self, apply type filter, exclude defeated)
  const validTargets = useMemo(() => {
    if (!session) return [];

    return session.participants.filter((p) => {
      // Exclude self
      if (p.entityId === characterId) return false;

      // Apply type filter if specified
      if (validTargetTypes && !validTargetTypes.includes(p.type)) return false;

      return true;
    });
  }, [session, characterId, validTargetTypes]);

  // Get selected target info
  const selectedTarget = useMemo(() => {
    if (!selectedTargetId || !session) return null;
    return session.participants.find((p) => p.id === selectedTargetId) || null;
  }, [selectedTargetId, session]);

  // Handle target selection
  const handleSelectTarget = (target: CombatParticipant) => {
    onTargetSelect(target.id, target.name);
    setIsOpen(false);
  };

  // If not in combat, show disabled state
  if (!session || !participant) {
    return (
      <div
        className={`p-3 rounded border ${theme.components.card.wrapper} ${theme.components.card.border}`}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4" />
          <span>Start combat to select targets</span>
        </div>
      </div>
    );
  }

  // No valid targets
  if (validTargets.length === 0) {
    return (
      <div
        className={`p-3 rounded border ${theme.components.card.wrapper} ${theme.components.card.border}`}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4" />
          <span>No targets available</span>
        </div>
        <p className={`text-xs ${theme.colors.muted} mt-1`}>
          Add opponents using the Quick NPC panel
        </p>
      </div>
    );
  }

  // Inline variant - show list directly
  if (variant === "inline") {
    return (
      <div className="space-y-2">
        <div className={`text-xs uppercase ${theme.fonts.mono} ${theme.colors.muted}`}>
          Select Target
        </div>
        <div className="space-y-2">
          {validTargets.map((target) => (
            <TargetCard
              key={target.id}
              participant={target}
              isSelected={target.id === selectedTargetId}
              onSelect={() => handleSelectTarget(target)}
              theme={theme}
            />
          ))}
        </div>
      </div>
    );
  }

  // Modal variant - show button that opens modal
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        className={`
          w-full flex items-center justify-between gap-2 p-3 rounded border
          ${
            selectedTarget
              ? "border-amber-500/50 bg-amber-500/10"
              : `${theme.components.card.wrapper} ${theme.components.card.border}`
          }
          ${theme.components.card.hover}
          transition-colors
        `}
      >
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${selectedTarget ? "text-amber-500" : theme.colors.muted}`} />
          {selectedTarget ? (
            <span className="text-amber-500 font-medium">{selectedTarget.name}</span>
          ) : (
            <span className={theme.colors.muted}>Select Target...</span>
          )}
        </div>
        <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
          {validTargets.length} available
        </span>
      </Button>

      <ModalOverlay
        isDismissable
        className={({ isEntering, isExiting }) => `
          fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
          ${isEntering ? "animate-in fade-in duration-300" : ""}
          ${isExiting ? "animate-out fade-out duration-200" : ""}
        `}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-2xl
            ${isEntering ? "animate-in zoom-in-95 duration-300" : ""}
            ${isExiting ? "animate-out zoom-out-95 duration-200" : ""}
          `}
        >
          <Dialog className="outline-none">
            {({ close }) => (
              <div className="flex flex-col max-h-[80vh]">
                {/* Header */}
                <div
                  className={`flex items-center justify-between p-4 border-b ${theme.colors.border}`}
                >
                  <div className="flex items-center gap-2">
                    <Target className={`w-5 h-5 ${theme.colors.accent}`} />
                    <Heading slot="title" className={`text-lg font-bold ${theme.colors.heading}`}>
                      Select Target
                    </Heading>
                  </div>
                  <Button
                    onPress={close}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Target List */}
                <div className="p-4 space-y-2 overflow-y-auto">
                  {validTargets.map((target) => (
                    <TargetCard
                      key={target.id}
                      participant={target}
                      isSelected={target.id === selectedTargetId}
                      onSelect={() => handleSelectTarget(target)}
                      theme={theme}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${theme.colors.border} flex justify-end gap-2`}>
                  <Button
                    onPress={close}
                    className={`
                      px-4 py-2 rounded text-sm font-medium
                      ${theme.components.card.wrapper} ${theme.components.card.border}
                      ${theme.colors.muted} hover:text-foreground
                      transition-colors
                    `}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
