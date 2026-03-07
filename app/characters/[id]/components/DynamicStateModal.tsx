"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { X, Settings2 } from "lucide-react";
import type {
  Character,
  QualitySelection,
  AddictionState,
  AllergyState,
  DependentState,
  CodeOfHonorState,
} from "@/lib/types";
import { useQualities } from "@/lib/rules";
import {
  formatEffectBadge,
  isUnifiedEffect,
  resolveRatingBasedValue,
  buildCharacterStateFlags,
} from "@/lib/rules/effects";
import type { EffectBadgeContext } from "@/lib/rules/effects";
import { AddictionTracker } from "./trackers/AddictionTracker";
import { AllergyTracker } from "./trackers/AllergyTracker";
import { DependentTracker } from "./trackers/DependentTracker";
import { CodeOfHonorTracker } from "./trackers/CodeOfHonorTracker";

interface DynamicStateModalProps {
  character: Character;
  selection: QualitySelection;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdate: (updatedCharacter: Character) => void;
}

export function DynamicStateModal({
  character,
  selection,
  isOpen,
  onOpenChange,
  onUpdate,
}: DynamicStateModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleUpdate = async (
    updates: Partial<AddictionState | AllergyState | DependentState | CodeOfHonorState>
  ) => {
    try {
      setError(null);
      const response = await fetch(
        `/api/characters/${character.id}/qualities/${selection.qualityId}/state`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to update state");
      }

      if (result.character) {
        onUpdate(result.character);
        setSuccessFlash(true);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setSuccessFlash(false), 600);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      console.error("State update error:", err);
    }
  };

  // Auto-initialize dynamic state when modal opens for uninitialized qualities
  useEffect(() => {
    if (isOpen && !selection.dynamicState && !isInitializing) {
      setIsInitializing(true);
      handleUpdate({}).finally(() => setIsInitializing(false));
    }
  }, [isOpen, selection.dynamicState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute effect badges for this quality
  const { positive: positiveData, negative: negativeData } = useQualities();
  const allCatalog = [...positiveData, ...negativeData];
  const qualityData = allCatalog.find((q) => q.id === selection.qualityId);
  const rawEffects = ((qualityData?.effects || []) as unknown[]).filter(isUnifiedEffect);

  const characterStateFlags = buildCharacterStateFlags(character);
  const charRating = selection.rating;
  const addictionState =
    selection.dynamicState?.type === "addiction" ? selection.dynamicState.state : undefined;
  const ratingEntry =
    qualityData?.ratings && charRating !== undefined
      ? (qualityData.ratings as Record<string, Record<string, unknown>>)[String(charRating)]
      : undefined;

  const effectBadges = rawEffects
    .map((effect) => {
      const ctx: EffectBadgeContext = {
        rating: charRating,
        dependencyType: addictionState?.substanceType,
        activeCharacterStates: characterStateFlags,
      };
      if (typeof effect.value === "string" && ratingEntry) {
        const resolved = resolveRatingBasedValue(effect, ratingEntry);
        if (resolved !== null) ctx.resolvedValue = resolved;
      }
      return formatEffectBadge(effect, ctx);
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);

  const renderTracker = () => {
    const type = selection.dynamicState?.type;
    const props = {
      selection,
      onUpdate: handleUpdate,
      character,
    };

    switch (type) {
      case "addiction":
        return <AddictionTracker {...props} />;
      case "allergy":
        return <AllergyTracker {...props} />;
      case "dependent":
        return <DependentTracker {...props} />;
      case "code-of-honor":
        return <CodeOfHonorTracker {...props} />;
      default:
        return (
          <div className="p-8 text-center text-muted-foreground italic">
            {isInitializing || !selection.dynamicState
              ? "Initializing tracker..."
              : `No specialized tracker available for ${type} state.`}
          </div>
        );
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={({ isEntering, isExiting }) => `
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
        ${isEntering ? "animate-in fade-in duration-200" : ""}
        ${isExiting ? "animate-out fade-out duration-150" : ""}
      `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
          w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden
          ${isEntering ? "animate-in zoom-in-95 duration-200" : ""}
          ${isExiting ? "animate-out zoom-out-95 duration-150" : ""}
        `}
      >
        <Dialog className="outline-none">
          {({ close }) => (
            <div className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <Heading
                    slot="title"
                    className="text-sm font-bold text-foreground uppercase tracking-wider"
                  >
                    Manage Quality State
                  </Heading>
                </div>
                <Button
                  onPress={close}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors outline-none"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div
                data-testid="modal-content"
                className={`flex-1 overflow-y-auto p-6 transition-colors duration-300${successFlash ? " border-l-2 border-emerald-500/40" : ""}`}
              >
                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-medium">
                    {error}
                  </div>
                )}

                {effectBadges.length > 0 && (
                  <div
                    data-testid="active-effects-section"
                    className="mb-4 p-3 bg-muted/20 rounded border border-border/30 space-y-2"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      Active Effects
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {effectBadges.map((badge, idx) => (
                        <span
                          key={idx}
                          data-testid="effect-badge"
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.colorClass}`}
                        >
                          {badge.label}
                          {badge.trigger && (
                            <span
                              className={
                                badge.triggerActive ? "font-semibold text-red-400" : "opacity-50"
                              }
                            >
                              · {badge.trigger}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {renderTracker()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-background/30 flex justify-end">
                <Button
                  onPress={close}
                  className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded text-xs font-bold transition-colors outline-none"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
