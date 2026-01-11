"use client";

import React, { useState } from "react";
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
          body: JSON.stringify({ updates }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to update state");
      }

      if (result.character) {
        onUpdate(result.character);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      console.error("State update error:", err);
    }
  };

  const renderTracker = () => {
    const type = selection.dynamicState?.type;
    const props = {
      selection,
      onUpdate: handleUpdate,
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
            No specialized tracker available for {type} state.
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
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-medium">
                    {error}
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
