"use client";

/**
 * CombatTrackerModal Component
 *
 * Modal wrapper for the CombatTracker component to be used
 * within the character sheet when in active combat.
 */

import React from "react";
import { Modal, ModalOverlay, Dialog, Heading, Button } from "react-aria-components";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { CombatTracker } from "@/components/combat";
import { useCombatSession } from "@/lib/combat";
import type { Theme } from "@/lib/themes";

interface CombatTrackerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Current theme */
  theme: Theme;
  /** Character ID for highlighting */
  characterId: string;
}

export function CombatTrackerModal({
  isOpen,
  onClose,
  theme,
  characterId,
}: CombatTrackerModalProps) {
  const { session, participant, isLoading, refreshSession, endTurn, delayTurn } =
    useCombatSession();

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  if (!session) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={({ isEntering, isExiting }) => `
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
        ${isEntering ? "animate-in fade-in duration-300" : ""}
        ${isExiting ? "animate-out fade-out duration-200" : ""}
      `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
          overflow-hidden rounded-xl border ${theme.colors.border} ${theme.colors.card} shadow-2xl
          ${isFullscreen ? "w-full h-full max-w-none max-h-none" : "w-full max-w-4xl max-h-[85vh]"}
          ${isEntering ? "animate-in zoom-in-95 duration-300" : ""}
          ${isExiting ? "animate-out zoom-out-95 duration-200" : ""}
        `}
      >
        <Dialog className="outline-none h-full flex flex-col">
          {({ close }) => (
            <>
              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b ${theme.colors.border}`}
              >
                <div className="flex items-center gap-3">
                  <Heading slot="title" className={`text-lg font-bold ${theme.colors.heading}`}>
                    Combat Tracker
                  </Heading>
                  <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
                    Round {session.round}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onPress={() => refreshSession()}
                    isDisabled={isLoading}
                    className={`
                      px-3 py-1.5 rounded text-xs
                      ${theme.components.card.wrapper} ${theme.components.card.border}
                      ${theme.colors.muted}
                      hover:opacity-80
                      disabled:opacity-50
                      transition-colors
                    `}
                  >
                    {isLoading ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button
                    onPress={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onPress={close}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <CombatTracker
                  session={session}
                  selectedParticipantId={participant?.id}
                  canControl={true}
                  showActionEconomy={true}
                  onAdvanceTurn={() => endTurn()}
                  onAdvanceRound={() => {
                    // Advance round would need a separate API call
                    refreshSession();
                  }}
                  onTogglePause={() => {
                    // Toggle pause would need a separate API call
                    refreshSession();
                  }}
                  onSelectParticipant={(id) => {
                    // Could highlight a different participant
                    console.log("Selected participant:", id);
                  }}
                  size="md"
                />
              </div>

              {/* Footer Actions */}
              {participant && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <div className={`text-sm ${theme.colors.muted}`}>
                    Playing as: <span className={theme.colors.heading}>{participant.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onPress={() => delayTurn()}
                      isDisabled={isLoading}
                      className={`
                        px-4 py-2 rounded text-sm
                        bg-amber-500/20 text-amber-500 border border-amber-500/30
                        hover:bg-amber-500/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors
                      `}
                    >
                      Delay Turn
                    </Button>
                    <Button
                      onPress={() => endTurn()}
                      isDisabled={isLoading}
                      className={`
                        px-4 py-2 rounded text-sm
                        bg-emerald-500/20 text-emerald-500 border border-emerald-500/30
                        hover:bg-emerald-500/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors
                      `}
                    >
                      End Turn
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

/**
 * Inline CombatTracker for embedding directly in character sheet
 */
interface InlineCombatTrackerProps {
  theme: Theme;
  characterId: string;
}

export function InlineCombatTracker({ theme, characterId }: InlineCombatTrackerProps) {
  const { session, participant, isLoading, refreshSession, endTurn } = useCombatSession();

  if (!session) return null;

  return (
    <div className={`rounded-lg overflow-hidden ${theme.components.section.wrapper}`}>
      <div className={`flex items-center justify-between p-3 ${theme.components.section.header}`}>
        <span className={`font-medium ${theme.colors.heading}`}>Combat Tracker</span>
        <Button
          onPress={() => refreshSession()}
          isDisabled={isLoading}
          className={`
            px-2 py-1 rounded text-xs
            ${theme.components.card.wrapper} ${theme.components.card.border}
            ${theme.colors.muted}
            hover:opacity-80
            disabled:opacity-50
            transition-colors
          `}
        >
          {isLoading ? "..." : "↻"}
        </Button>
      </div>
      <div className="p-4">
        <CombatTracker
          session={session}
          selectedParticipantId={participant?.id}
          canControl={true}
          showActionEconomy={true}
          onAdvanceTurn={() => endTurn()}
          onAdvanceRound={() => refreshSession()}
          onTogglePause={() => refreshSession()}
          size="sm"
        />
      </div>
    </div>
  );
}
