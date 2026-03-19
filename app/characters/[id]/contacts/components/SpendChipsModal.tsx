"use client";

import React, { useState } from "react";
import { ModalOverlay, Modal, Dialog, Button } from "react-aria-components";
import type { SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { calculateChipDiceBonus, calculateLoyaltyImprovementCost } from "@/lib/rules/chips";
import { getChipCostModifier } from "@/lib/rules/relationship-qualities";

interface SpendChipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    action: "dice-bonus" | "loyalty-improvement";
    chipsToSpend?: number;
    targetLoyalty?: number;
    notes?: string;
  }) => Promise<void>;
  contact: SocialContact;
  theme?: Theme;
}

const MAX_CHIPS_FOR_DICE = 4;

export function SpendChipsModal({
  isOpen,
  onClose,
  onSubmit,
  contact,
  theme,
}: SpendChipsModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  const [action, setAction] = useState<"dice-bonus" | "loyalty-improvement">("dice-bonus");
  const [chipsToSpend, setChipsToSpend] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chipBalance = contact.favorBalance;
  const maxDiceChips = Math.min(chipBalance, MAX_CHIPS_FOR_DICE);
  const diceBonus = calculateChipDiceBonus(chipsToSpend);

  const targetLoyalty = contact.loyalty + 1;
  const loyaltyCost = calculateLoyaltyImprovementCost(contact.loyalty, targetLoyalty);
  const qualities = contact.relationshipQualities ?? [];
  const qualityAdj = loyaltyCost.valid
    ? getChipCostModifier(loyaltyCost.chipsRequired, qualities)
    : null;
  const adjustedLoyaltyCost = qualityAdj?.adjustedCost ?? loyaltyCost.chipsRequired;
  const canAffordLoyalty = chipBalance >= adjustedLoyaltyCost && loyaltyCost.valid;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (action === "dice-bonus") {
        await onSubmit({ action, chipsToSpend, notes: notes || undefined });
      } else {
        await onSubmit({ action, targetLoyalty, notes: notes || undefined });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spend chips");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    action === "dice-bonus" ? chipsToSpend > 0 && chipsToSpend <= maxDiceChips : canAffordLoyalty;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <Modal className="w-full max-w-md animate-in zoom-in-95">
        <Dialog
          className={`rounded-lg border ${t.colors.border} ${t.colors.card} p-6 outline-none`}
        >
          {() => (
            <>
              <h2 className={`text-lg font-bold mb-4 ${t.colors.heading}`}>
                Spend Chips — {contact.name}
              </h2>

              <div className="mb-4 text-sm text-muted-foreground">
                Available chips: <span className="font-mono text-cyan-400">{chipBalance}</span>
              </div>

              {/* Action Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAction("dice-bonus")}
                  className={`flex-1 px-3 py-2 rounded text-sm font-mono uppercase transition-colors ${
                    action === "dice-bonus"
                      ? `${t.colors.accentBg} text-white`
                      : `border ${t.colors.border} text-muted-foreground hover:text-foreground`
                  }`}
                >
                  Dice Bonus
                </button>
                <button
                  type="button"
                  onClick={() => setAction("loyalty-improvement")}
                  className={`flex-1 px-3 py-2 rounded text-sm font-mono uppercase transition-colors ${
                    action === "loyalty-improvement"
                      ? `${t.colors.accentBg} text-white`
                      : `border ${t.colors.border} text-muted-foreground hover:text-foreground`
                  }`}
                >
                  Improve Loyalty
                </button>
              </div>

              {/* Dice Bonus Mode */}
              {action === "dice-bonus" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                      Chips to Spend (1-{MAX_CHIPS_FOR_DICE})
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setChipsToSpend(n)}
                          disabled={n > chipBalance}
                          className={`w-10 h-10 rounded font-mono font-bold transition-colors ${
                            chipsToSpend === n
                              ? `${t.colors.accentBg} text-white`
                              : n > chipBalance
                                ? "border border-border/30 text-muted-foreground/30 cursor-not-allowed"
                                : `border ${t.colors.border} text-foreground hover:bg-muted`
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">
                      Result
                    </div>
                    <div className={`text-lg font-bold ${t.colors.accent}`}>
                      +{diceBonus} dice to negotiation roll
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Remaining chips: {chipBalance - chipsToSpend}
                    </div>
                  </div>
                </div>
              )}

              {/* Loyalty Improvement Mode */}
              {action === "loyalty-improvement" && (
                <div className="space-y-3">
                  {!loyaltyCost.valid ? (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {loyaltyCost.reason}
                    </div>
                  ) : (
                    <>
                      <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Loyalty {contact.loyalty} → {targetLoyalty}
                          </span>
                          <span className="text-lg font-bold text-pink-400">{targetLoyalty}</span>
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Chips required:</span>
                            <span className="font-mono text-cyan-400">
                              {adjustedLoyaltyCost}
                              {qualityAdj && qualityAdj.reason !== "No quality modifier" && (
                                <span className="text-blue-400 ml-1">({qualityAdj.reason})</span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Downtime weeks:</span>
                            <span className="font-mono">{loyaltyCost.downtimeWeeks}</span>
                          </div>
                        </div>
                      </div>

                      {!canAffordLoyalty && (
                        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                          Insufficient chips: need {adjustedLoyaltyCost}, have {chipBalance}
                        </div>
                      )}

                      {contact.loyaltyImprovementBlocked && (
                        <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                          Loyalty improvement permanently blocked (Intimidation used)
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mt-4">
                <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  rows={2}
                  className={`w-full px-3 py-2 text-sm rounded border ${t.colors.border} bg-background text-foreground resize-none`}
                  placeholder="Context for this chip spend..."
                />
              </div>

              {error && (
                <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onPress={onClose}
                  className={`px-4 py-2 rounded text-sm border ${t.colors.border} text-muted-foreground hover:text-foreground transition-colors`}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSubmit}
                  isDisabled={!canSubmit || submitting}
                  className={`px-4 py-2 rounded text-sm ${t.colors.accentBg} text-white disabled:opacity-50`}
                >
                  {submitting
                    ? "Spending..."
                    : action === "dice-bonus"
                      ? `Spend ${chipsToSpend} Chip${chipsToSpend !== 1 ? "s" : ""}`
                      : `Improve Loyalty`}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
