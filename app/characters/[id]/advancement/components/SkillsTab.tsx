"use client";

import { useState, useMemo, useCallback } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay, TextField } from "react-aria-components";
import type { Character, MergedRuleset } from "@/lib/types";
import { useSkills } from "@/lib/rules";
import { validateSkillAdvancement, getSkillMaximum, calculateActiveSkillCost } from "@/lib/rules/advancement";
import { X, ArrowUp, Search } from "lucide-react";

interface SkillsTabProps {
  character: Character;
  ruleset: MergedRuleset;
  onCharacterUpdate: (updatedCharacter: Character) => void;
}

export function SkillsTab({ character, ruleset, onCharacterUpdate }: SkillsTabProps) {
  const { activeSkills } = useSkills();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return activeSkills;
    const query = searchQuery.toLowerCase();
    return activeSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        skill.id.toLowerCase().includes(query)
    );
  }, [activeSkills, searchQuery]);

  // Handle advance click
  const handleAdvanceClick = useCallback(
    (skillId: string) => {
      const currentRating = character.skills[skillId] || 0;
      const maxRating = getSkillMaximum(character, skillId, ruleset);
      const nextRating = Math.min(currentRating + 1, maxRating);
      
      setSelectedSkill(skillId);
      setNewRating(nextRating);
      setErrorMessage(null);
      setIsModalOpen(true);
    },
    [character, ruleset]
  );

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!selectedSkill || !newRating) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Validate
      const validation = validateSkillAdvancement(
        character,
        selectedSkill,
        newRating,
        ruleset
      );

      if (!validation.valid) {
        setErrorMessage(validation.errors.map((e) => e.message).join(", "));
        setIsSubmitting(false);
        return;
      }

      // Call API
      const response = await fetch(`/api/characters/${character.id}/advancement/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkill,
          newRating,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to advance skill");
      }

      // Update character
      onCharacterUpdate(result.character);
      setIsModalOpen(false);
      setSelectedSkill(null);
      setNewRating(undefined);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to advance skill");
    } finally {
      setIsSubmitting(false);
    }
  }, [character, selectedSkill, newRating, ruleset, onCharacterUpdate]);

  // Get skill info
  const getSkillInfo = useCallback(
    (skillId: string) => {
      const currentRating = character.skills[skillId] || 0;
      const maxRating = getSkillMaximum(character, skillId, ruleset);
      const canAdvance = currentRating < maxRating;
      const nextRating = currentRating + 1;
      const cost = canAdvance ? calculateActiveSkillCost(nextRating) : 0;
      const canAfford = character.karmaCurrent >= cost;
      const skill = activeSkills.find((s) => s.id === skillId);

      return { currentRating, maxRating, canAdvance, nextRating, cost, canAfford, skill };
    },
    [character, ruleset, activeSkills]
  );

  return (
    <div className="space-y-6">
      {/* Karma Display */}
      <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Current Karma</span>
          <span className="text-2xl font-bold text-amber-400">{character.karmaCurrent}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <TextField
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full"
        >
          <input
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </TextField>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
        {filteredSkills.map((skill) => {
          const { currentRating, maxRating, canAdvance, nextRating, cost, canAfford } =
            getSkillInfo(skill.id);

          return (
            <div
              key={skill.id}
              className={`p-4 rounded-lg border ${
                canAdvance && canAfford
                  ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer"
                  : "border-zinc-800 bg-zinc-900/30 opacity-60"
              } transition-colors`}
              onClick={() => canAdvance && canAfford && handleAdvanceClick(skill.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-zinc-100">{skill.name}</span>
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
                    onPress={() => handleAdvanceClick(skill.id)}
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
        })}
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
                    Advance {selectedSkill ? activeSkills.find((s) => s.id === selectedSkill)?.name : "Skill"}
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

                {selectedSkill && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        New Rating
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400">
                          Current: <span className="font-bold text-zinc-100">
                            {character.skills[selectedSkill] || 0}
                          </span>
                        </span>
                        <ArrowUp className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">
                          New: <span className="font-bold text-emerald-400">
                            {newRating || character.skills[selectedSkill] || 0}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Karma Cost:</span>
                        <span className="font-bold text-amber-400">
                          {newRating ? calculateActiveSkillCost(newRating) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-zinc-400">Available:</span>
                        <span className={character.karmaCurrent >= (newRating ? calculateActiveSkillCost(newRating) : 0)
                          ? "text-emerald-400"
                          : "text-red-400"
                        }>
                          {character.karmaCurrent}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onPress={close}
                        className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={handleSubmit}
                        isDisabled={isSubmitting || !newRating || character.karmaCurrent < (newRating ? calculateActiveSkillCost(newRating) : 0)}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded transition-colors"
                      >
                        {isSubmitting ? "Advancing..." : "Advance Skill"}
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

