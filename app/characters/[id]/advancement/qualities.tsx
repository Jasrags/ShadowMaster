"use client";

import { useState, useMemo, useCallback } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay, TextField, TextArea } from "react-aria-components";
import type { Character, QualitySelection } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { useQualities, useMergedRuleset, useRulesetStatus } from "@/lib/rules";
import { getQualityDefinition } from "@/lib/rules/qualities/utils";
import { validateQualityAcquisition, validateQualityRemoval, calculatePostCreationCost, calculateBuyOffCost } from "@/lib/rules/qualities/advancement";
import { X, Plus, AlertCircle } from "lucide-react";

interface QualitiesAdvancementProps {
  character: Character;
  onCharacterUpdate: (updatedCharacter: Character) => void;
}

export function QualitiesAdvancement({ character, onCharacterUpdate }: QualitiesAdvancementProps) {
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const ruleset = useMergedRuleset();
  const { loading, error } = useRulesetStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"positive" | "negative">("positive");
  const [selectedQuality, setSelectedQuality] = useState<QualityData | null>(null);
  const [isAcquireModalOpen, setIsAcquireModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [qualityToRemove, setQualityToRemove] = useState<{ id: string; selection: QualitySelection } | null>(null);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [specification, setSpecification] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter qualities based on search
  const filteredQualities = useMemo(() => {
    const qualities = activeTab === "positive" ? positiveQualities : negativeQualities;
    if (!searchQuery.trim()) return qualities;

    const query = searchQuery.toLowerCase();
    return qualities.filter(
      (q) =>
        q.name.toLowerCase().includes(query) ||
        q.summary.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
    );
  }, [positiveQualities, negativeQualities, activeTab, searchQuery]);

  // Get character's current qualities
  const characterQualityIds = useMemo(() => {
    const all = [
      ...(character.positiveQualities || []),
      ...(character.negativeQualities || []),
    ];
    return all.map((q) => q.qualityId || q.id).filter(Boolean) as string[];
  }, [character]);

  // Get available qualities (not already taken, or can be taken multiple times)
  const availableQualities = useMemo(() => {
    if (!ruleset) return [];

    return filteredQualities.filter((quality) => {
      // Check if already taken
      const hasQuality = characterQualityIds.includes(quality.id);
      if (!hasQuality) return true;

      // Check limit
      const limit = quality.limit || 1;
      const currentCount = characterQualityIds.filter((id) => id === quality.id).length;
      return currentCount < limit;
    });
  }, [filteredQualities, characterQualityIds, ruleset]);

  // Handle acquire quality
  const handleAcquireClick = useCallback((qualityData: QualityData) => {
    setSelectedQuality(qualityData);
    setRating(qualityData.maxRating ? 1 : undefined);
    setSpecification("");
    setNotes("");
    setErrorMessage(null);
    setIsAcquireModalOpen(true);
  }, []);

  // Handle remove quality (buy off negative quality)
  // Note: This function is defined for future use when buy-off functionality is fully implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveClick = useCallback((qualityId: string) => {
    const allQualities = [
      ...(character.positiveQualities || []),
      ...(character.negativeQualities || []),
    ];
    const selection = allQualities.find(
      (q) => (q.qualityId || q.id) === qualityId
    );

    if (!selection) return;

    const quality = ruleset ? getQualityDefinition(ruleset, qualityId) : null;
    if (!quality || quality.type === "positive") {
      setErrorMessage("Can only buy off negative qualities");
      return;
    }

    setQualityToRemove({ id: qualityId, selection });
    setErrorMessage(null);
    setIsRemoveModalOpen(true);
  }, [character, ruleset]);

  // Submit acquire quality
  const handleAcquireSubmit = useCallback(async () => {
    if (!selectedQuality || !ruleset) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Get Quality from ruleset
      const quality = getQualityDefinition(ruleset, selectedQuality.id);
      if (!quality) {
        setErrorMessage("Quality not found in ruleset");
        setIsSubmitting(false);
        return;
      }

      // Validate
      const validation = validateQualityAcquisition(character, selectedQuality.id, ruleset, {
        rating,
        specification: specification || undefined,
        notes: notes || undefined,
      });

      if (!validation.valid) {
        setErrorMessage(validation.errors.map((e) => e.message).join(", "));
        setIsSubmitting(false);
        return;
      }

      // Call API
      const response = await fetch(`/api/characters/${character.id}/qualities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qualityId: selectedQuality.id,
          rating,
          specification: specification || undefined,
          notes: notes || undefined,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to acquire quality");
      }

      // Update character
      onCharacterUpdate(result.character);
      setIsAcquireModalOpen(false);
      setSelectedQuality(null);
      setRating(undefined);
      setSpecification("");
      setNotes("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to acquire quality");
    } finally {
      setIsSubmitting(false);
    }
  }, [character, selectedQuality, ruleset, rating, specification, notes, onCharacterUpdate]);

  // Submit remove quality
  const handleRemoveSubmit = useCallback(async () => {
    if (!qualityToRemove || !ruleset) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Validate
      const validation = validateQualityRemoval(character, qualityToRemove.id, ruleset);

      if (!validation.valid) {
        setErrorMessage(validation.errors.map((e) => e.message).join(", "));
        setIsSubmitting(false);
        return;
      }

      // Call API
      const response = await fetch(
        `/api/characters/${character.id}/qualities/${qualityToRemove.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to buy off quality");
      }

      // Update character
      onCharacterUpdate(result.character);
      setIsRemoveModalOpen(false);
      setQualityToRemove(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to buy off quality");
    } finally {
      setIsSubmitting(false);
    }
  }, [character, qualityToRemove, ruleset, onCharacterUpdate]);

  // Calculate cost for selected quality
  const acquisitionCost = useMemo(() => {
    if (!selectedQuality || !ruleset) return 0;
    const quality = getQualityDefinition(ruleset, selectedQuality.id);
    if (!quality) return 0;
    return calculatePostCreationCost(quality, rating);
  }, [selectedQuality, ruleset, rating]);

  // Calculate buy-off cost
  const buyOffCost = useMemo(() => {
    if (!qualityToRemove || !ruleset) return 0;
    const quality = getQualityDefinition(ruleset, qualityToRemove.id);
    if (!quality) return 0;
    return calculateBuyOffCost(quality, qualityToRemove.selection.originalKarma);
  }, [qualityToRemove, ruleset]);

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading ruleset...</div>;
  }

  if (error || !ruleset) {
    return (
      <div className="p-8 text-center text-red-400">
        {error || "Failed to load ruleset"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Quality Advancement</h2>
        <p className="text-zinc-400 text-sm">
          Acquire new qualities or buy off negative qualities. Post-creation costs are 2× normal rates.
        </p>
        <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="font-medium">Current Karma:</span>
            <span className="text-zinc-100 font-bold">{character.karmaCurrent}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-700">
        <button
          onClick={() => setActiveTab("positive")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "positive"
              ? "text-zinc-100 border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Acquire Positive Qualities
        </button>
        <button
          onClick={() => setActiveTab("negative")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "negative"
              ? "text-zinc-100 border-b-2 border-red-500"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Buy Off Negative Qualities
        </button>
      </div>

      {/* Search */}
      <div className="w-full">
        <TextField
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full"
        >
          <input 
            placeholder="Search qualities..."
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </TextField>
      </div>

      {/* Quality List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableQualities.map((qualityData) => {
          // Convert QualityData to Quality for cost calculation
          const quality = ruleset ? getQualityDefinition(ruleset, qualityData.id) : null;
          if (!quality) return null;
          
          const cost = calculatePostCreationCost(quality);
          const canAfford = character.karmaCurrent >= cost;

          return (
            <div
              key={qualityData.id}
              className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-zinc-100">{qualityData.name}</h3>
                <span className="text-sm text-zinc-400">
                  {cost} karma (2×)
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                {qualityData.summary}
              </p>
              <Button
                onPress={() => handleAcquireClick(qualityData)}
                isDisabled={!canAfford}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  canAfford
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Acquire
              </Button>
            </div>
          );
        })}
      </div>

      {/* Acquire Modal */}
      <ModalOverlay
        isOpen={isAcquireModalOpen}
        onOpenChange={setIsAcquireModalOpen}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Modal className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <Dialog>
            {({ close }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Heading className="text-2xl font-bold text-zinc-100">
                    Acquire Quality: {selectedQuality?.name}
                  </Heading>
                  <Button onPress={close} className="text-zinc-400 hover:text-zinc-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {selectedQuality && (
                  <>
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <p className="text-zinc-300 mb-2">{selectedQuality.summary}</p>
                      {selectedQuality.description && (
                        <p className="text-sm text-zinc-400">{selectedQuality.description}</p>
                      )}
                    </div>

                    {selectedQuality.maxRating && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Rating (1-{selectedQuality.maxRating})
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={selectedQuality.maxRating}
                          value={rating || 1}
                          onChange={(e) => setRating(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100"
                        />
                      </div>
                    )}

                    {selectedQuality.requiresSpecification && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          {selectedQuality.specificationLabel || "Specification"}
                        </label>
                        <TextField value={specification} onChange={setSpecification}>
                          <input className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100" />
                        </TextField>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Notes (optional)
                      </label>
                      <TextArea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100"
                        rows={3}
                      />
                    </div>

                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Cost:</span>
                        <span className="text-xl font-bold text-zinc-100">
                          {acquisitionCost} karma (2× rate)
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-zinc-300">Current Karma:</span>
                        <span className="text-zinc-100">{character.karmaCurrent}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-zinc-300">Remaining:</span>
                        <span
                          className={`font-bold ${
                            character.karmaCurrent - acquisitionCost >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {character.karmaCurrent - acquisitionCost}
                        </span>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex gap-4 justify-end">
                      <Button
                        onPress={close}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={handleAcquireSubmit}
                        isDisabled={isSubmitting || character.karmaCurrent < acquisitionCost}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Acquiring..." : "Acquire Quality"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* Remove Modal */}
      <ModalOverlay
        isOpen={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Modal className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-lg w-full mx-4">
          <Dialog>
            {({ close }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Heading className="text-2xl font-bold text-zinc-100">
                    Buy Off Quality
                  </Heading>
                  <Button onPress={close} className="text-zinc-400 hover:text-zinc-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {qualityToRemove && ruleset && (
                  <>
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <p className="text-zinc-300">
                        Buy off this negative quality? This will cost 2× the original karma bonus.
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Buy-off Cost:</span>
                        <span className="text-xl font-bold text-zinc-100">
                          {buyOffCost} karma (2× rate)
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-zinc-300">Current Karma:</span>
                        <span className="text-zinc-100">{character.karmaCurrent}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-zinc-300">Remaining:</span>
                        <span
                          className={`font-bold ${
                            character.karmaCurrent - buyOffCost >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {character.karmaCurrent - buyOffCost}
                        </span>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex gap-4 justify-end">
                      <Button
                        onPress={close}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={handleRemoveSubmit}
                        isDisabled={isSubmitting || character.karmaCurrent < buyOffCost}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Buying Off..." : "Buy Off Quality"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}

