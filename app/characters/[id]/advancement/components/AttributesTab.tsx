"use client";

import { useState, useCallback } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay, TextField } from "react-aria-components";
import type { Character, MergedRuleset } from "@/lib/types";
import { validateAttributeAdvancement, getAttributeMaximum, calculateAttributeCost, calculateEdgeCost } from "@/lib/rules/advancement";
import { X, ArrowUp } from "lucide-react";

interface AttributesTabProps {
  character: Character;
  ruleset: MergedRuleset;
  onCharacterUpdate: (updatedCharacter: Character) => void;
}

const ATTRIBUTE_NAMES: Record<string, string> = {
  body: "Body",
  agility: "Agility",
  reaction: "Reaction",
  strength: "Strength",
  willpower: "Willpower",
  logic: "Logic",
  intuition: "Intuition",
  charisma: "Charisma",
  edge: "Edge",
};

const PHYSICAL_ATTRIBUTES = ["body", "agility", "reaction", "strength"];
const MENTAL_ATTRIBUTES = ["willpower", "logic", "intuition", "charisma"];

export function AttributesTab({ character, ruleset, onCharacterUpdate }: AttributesTabProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // Handle advance click
  const handleAdvanceClick = useCallback(
    (attrId: string) => {
      const currentRating = attrId === 'edge' 
        ? (character.specialAttributes?.edge || 1)
        : (character.attributes[attrId] || 0);
      const maxRating = getAttributeMaximum(character, attrId, ruleset);
      const nextRating = Math.min(currentRating + 1, maxRating);
      
      setSelectedAttribute(attrId);
      setNewRating(nextRating);
      setNotes("");
      setErrorMessage(null);
      setIsModalOpen(true);
    },
    [character, ruleset]
  );

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!selectedAttribute || !newRating) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Validate
      const validation = validateAttributeAdvancement(
        character,
        selectedAttribute,
        newRating,
        ruleset
      );

      if (!validation.valid) {
        setErrorMessage(validation.errors.map((e) => e.message).join(", "));
        setIsSubmitting(false);
        return;
      }

      // Call API (handle edge specially if needed, but our API uses /attributes for standard and we might need /edge for edge)
      const endpoint = selectedAttribute === 'edge' 
        ? `/api/characters/${character.id}/advancement/edge`
        : `/api/characters/${character.id}/advancement/attributes`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attributeId: selectedAttribute !== 'edge' ? selectedAttribute : undefined,
          newRating,
          notes,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to advance attribute");
      }

      // Update character
      onCharacterUpdate(result.character);
      setIsModalOpen(false);
      setSelectedAttribute(null);
      setNewRating(undefined);
      setNotes("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to advance attribute");
    } finally {
      setIsSubmitting(false);
    }
  }, [character, selectedAttribute, newRating, notes, ruleset, onCharacterUpdate]);

  // Render attribute row
  const renderAttribute = (attrId: string) => {
    const currentRating = attrId === 'edge'
      ? (character.specialAttributes?.edge || 1)
      : (character.attributes[attrId] || 0);
    const maxRating = getAttributeMaximum(character, attrId, ruleset);
    const canAdvance = currentRating < maxRating;
    const nextRating = currentRating + 1;
    const cost = canAdvance ? (attrId === 'edge' ? calculateEdgeCost(nextRating) : calculateAttributeCost(nextRating)) : 0;
    const canAfford = character.karmaCurrent >= cost;

    return (
      <div
        key={attrId}
        className={`p-4 rounded-lg border ${
          canAdvance && canAfford
            ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer"
            : "border-zinc-800 bg-zinc-900/30 opacity-60"
        } transition-colors`}
        onClick={() => canAdvance && canAfford && handleAdvanceClick(attrId)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="font-medium text-zinc-100">
                {ATTRIBUTE_NAMES[attrId] || attrId}
              </span>
              <span className="text-2xl font-bold text-emerald-400">[{currentRating}]</span>
              {canAdvance && (
                <span className="text-sm text-zinc-400">
                  → <span className="text-emerald-300">[{nextRating}]</span>
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Max: {maxRating} {canAdvance && `• Cost: ${cost} karma`}
            </div>
          </div>
          {canAdvance && canAfford && (
            <Button
              onPress={() => handleAdvanceClick(attrId)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition-colors"
            >
              Advance
            </Button>
          )}
          {canAdvance && !canAfford && (
            <span className="text-xs text-red-400">Need {cost} karma</span>
          )}
          {!canAdvance && (
            <span className="text-xs text-zinc-500">Max rating</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Karma Display */}
      <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Current Karma</span>
          <span className="text-2xl font-bold text-amber-400">{character.karmaCurrent}</span>
        </div>
      </div>

      {/* Physical Attributes */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
          Physical Attributes
        </h3>
        <div className="space-y-3">
          {PHYSICAL_ATTRIBUTES.map(renderAttribute)}
        </div>
      </div>

      {/* Mental Attributes */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
          Mental Attributes
        </h3>
        <div className="space-y-3">
          {MENTAL_ATTRIBUTES.map(renderAttribute)}
        </div>
      </div>

      {/* Special Attributes */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
          Special Attributes
        </h3>
        <div className="space-y-3">
          {renderAttribute('edge')}
        </div>
      </div>

      {/* Advance Modal */}
      <ModalOverlay
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Modal className="max-w-md w-full mx-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl">
          <Dialog className="outline-none">
            {({ close }) => (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heading className="text-xl font-bold text-zinc-100">
                    Advance {selectedAttribute ? ATTRIBUTE_NAMES[selectedAttribute] : "Attribute"}
                  </Heading>
                  <Button
                    onPress={close}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
                    {errorMessage}
                  </div>
                )}

                {selectedAttribute && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        New Rating
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400">
                          Current: <span className="font-bold text-zinc-100">
                            {selectedAttribute === 'edge' 
                              ? (character.specialAttributes?.edge || 1)
                              : (character.attributes[selectedAttribute] || 0)}
                          </span>
                        </span>
                        <ArrowUp className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">
                          New: <span className="font-bold text-emerald-400">
                            {newRating}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Karma Cost:</span>
                        <span className="font-bold text-amber-400">
                          {newRating ? (selectedAttribute === 'edge' ? calculateEdgeCost(newRating) : calculateAttributeCost(newRating)) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-zinc-400">Available:</span>
                        <span className={character.karmaCurrent >= (newRating ? (selectedAttribute === 'edge' ? calculateEdgeCost(newRating) : calculateAttributeCost(newRating)) : 0)
                          ? "text-emerald-400"
                          : "text-red-400"
                        }>
                          {character.karmaCurrent}
                        </span>
                      </div>
                    </div>

                    <TextField
                      value={notes}
                      onChange={setNotes}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-zinc-300">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Why are you advancing this attribute?"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                      />
                    </TextField>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onPress={close}
                        className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={handleSubmit}
                        isDisabled={isSubmitting || !newRating || character.karmaCurrent < (newRating ? (selectedAttribute === 'edge' ? calculateEdgeCost(newRating) : calculateAttributeCost(newRating)) : 0)}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded transition-colors"
                      >
                        {isSubmitting ? "Advancing..." : "Advance Attribute"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}

