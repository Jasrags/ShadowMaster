"use client";

import React, { useState } from "react";
import { ModalOverlay, Modal, Dialog, Button } from "react-aria-components";
import type { SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { calculateConfirmationKarmaCost } from "@/lib/rules/i-know-a-guy";

interface ConfirmEdgeContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  contact: SocialContact;
  characterKarma: number;
  theme?: Theme;
}

export function ConfirmEdgeContactModal({
  isOpen,
  onClose,
  onConfirm,
  contact,
  characterKarma,
  theme,
}: ConfirmEdgeContactModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const karmaCost = calculateConfirmationKarmaCost(contact.connection);
  const canAfford = characterKarma >= karmaCost;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm contact");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <Modal className="w-full max-w-sm animate-in zoom-in-95">
        <Dialog
          className={`rounded-lg border ${t.colors.border} ${t.colors.card} p-6 outline-none`}
        >
          {() => (
            <>
              <h2 className={`text-lg font-bold mb-2 ${t.colors.heading}`}>Confirm Edge Contact</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Spend Karma to make &ldquo;{contact.name}&rdquo; a permanent contact. If you
                don&rsquo;t confirm, the contact will be lost.
              </p>

              <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border} mb-4`}>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className={t.colors.heading}>{contact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Archetype:</span>
                    <span className={t.colors.accent}>{contact.archetype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connection:</span>
                    <span className="font-mono">{contact.connection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loyalty:</span>
                    <span className="font-mono text-pink-400">{contact.loyalty}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/30 pt-2">
                    <span className="text-muted-foreground">Karma Cost:</span>
                    <span
                      className={`font-mono font-bold ${canAfford ? "text-pink-400" : "text-red-400"}`}
                    >
                      {karmaCost}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Karma:</span>
                    <span className="font-mono">{characterKarma}K</span>
                  </div>
                </div>
              </div>

              {!canAfford && (
                <div className="mb-4 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  Insufficient Karma: need {karmaCost}, have {characterKarma}
                </div>
              )}

              {error && (
                <div className="mb-4 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onPress={onClose}
                  className={`px-4 py-2 rounded text-sm border ${t.colors.border} text-muted-foreground hover:text-foreground transition-colors`}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleConfirm}
                  isDisabled={!canAfford || submitting}
                  className={`px-4 py-2 rounded text-sm ${t.colors.accentBg} text-white disabled:opacity-50`}
                >
                  {submitting ? "Confirming..." : `Spend ${karmaCost} Karma`}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
