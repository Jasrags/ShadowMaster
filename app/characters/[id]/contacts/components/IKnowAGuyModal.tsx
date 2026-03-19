"use client";

import React, { useState } from "react";
import { ModalOverlay, Modal, Dialog, Button } from "react-aria-components";
import type { ContactArchetype } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { calculateEdgeCost } from "@/lib/rules/i-know-a-guy";

interface IKnowAGuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    connection: number;
    archetype: string;
    name: string;
    description?: string;
  }) => Promise<void>;
  currentEdge: number;
  archetypes?: ContactArchetype[];
  theme?: Theme;
}

export function IKnowAGuyModal({
  isOpen,
  onClose,
  onSubmit,
  currentEdge,
  archetypes,
  theme,
}: IKnowAGuyModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState("");
  const [connection, setConnection] = useState(1);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edgeCost = calculateEdgeCost(connection);
  const canAfford = currentEdge >= edgeCost;
  const karmaCostToConfirm = connection + 1; // Connection + Loyalty(1)

  const handleSubmit = async () => {
    if (!name.trim() || !archetype.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        connection,
        archetype: archetype.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setArchetype("");
      setConnection(1);
      setDescription("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to acquire contact");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = name.trim().length > 0 && archetype.trim().length > 0 && canAfford;

  // Max connection the character can afford
  const maxAffordableConnection = Math.min(12, Math.floor(currentEdge / 2));

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
              <h2 className={`text-lg font-bold mb-1 ${t.colors.heading}`}>I Know a Guy</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Spend Edge to pull a contact from your past. Loyalty starts at 1. Must confirm with
                Karma after the mission or the contact is lost.
              </p>

              <div className="mb-4 text-sm text-muted-foreground">
                Available Edge: <span className="font-mono text-amber-400">{currentEdge}</span>
              </div>

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={200}
                    className={`w-full px-3 py-2 text-sm rounded border ${t.colors.border} bg-background text-foreground`}
                    placeholder="Who do you know?"
                  />
                </div>

                {/* Archetype */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                    Archetype *
                  </label>
                  {archetypes && archetypes.length > 0 ? (
                    <select
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value)}
                      className={`w-full px-3 py-2 text-sm rounded border ${t.colors.border} bg-background text-foreground`}
                    >
                      <option value="">Select archetype...</option>
                      {archetypes.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value)}
                      maxLength={200}
                      className={`w-full px-3 py-2 text-sm rounded border ${t.colors.border} bg-background text-foreground`}
                      placeholder="e.g., Fixer, Street Doc, Mr. Johnson"
                    />
                  )}
                </div>

                {/* Connection */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                    Connection (1-12)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                      const cost = calculateEdgeCost(n);
                      const affordable = currentEdge >= cost;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setConnection(n)}
                          disabled={!affordable}
                          className={`w-8 h-8 rounded text-xs font-mono font-bold transition-colors ${
                            connection === n
                              ? `${t.colors.accentBg} text-white`
                              : affordable
                                ? `border ${t.colors.border} text-foreground hover:bg-muted`
                                : "border border-border/30 text-muted-foreground/30 cursor-not-allowed"
                          }`}
                          title={`Cost: ${cost} Edge`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  {maxAffordableConnection === 0 && (
                    <div className="mt-1 text-xs text-red-400">
                      Insufficient Edge for any connection level
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-mono block mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className={`w-full px-3 py-2 text-sm rounded border ${t.colors.border} bg-background text-foreground resize-none`}
                    placeholder="How do you know them?"
                  />
                </div>

                {/* Cost Breakdown */}
                <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono mb-2">
                    Cost Breakdown
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edge Cost (2 × Connection):</span>
                      <span
                        className={`font-mono ${canAfford ? "text-amber-400" : "text-red-400"}`}
                      >
                        {edgeCost} Edge
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edge Remaining:</span>
                      <span className="font-mono text-muted-foreground">
                        {Math.max(0, currentEdge - edgeCost)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/30 pt-1 mt-1">
                      <span className="text-muted-foreground">
                        Karma to Confirm (post-mission):
                      </span>
                      <span className="font-mono text-pink-400">{karmaCostToConfirm}K</span>
                    </div>
                  </div>
                </div>

                {!canAfford && (
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    Insufficient Edge: need {edgeCost}, have {currentEdge}
                  </div>
                )}
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
                  {submitting ? "Acquiring..." : `Spend ${edgeCost} Edge`}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
