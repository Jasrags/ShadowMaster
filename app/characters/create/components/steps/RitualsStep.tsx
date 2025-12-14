"use client";

import { useMemo, useState, useCallback } from "react";
import { useRituals, useRitualKeywords, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { RitualData } from "@/lib/rules";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

const RITUAL_KARMA_COST = 5;

// Ritual keywords that can be used for filtering
const KEYWORD_FILTERS = [
  { id: "all", name: "All Rituals" },
  { id: "anchored", name: "Anchored" },
  { id: "spell", name: "Spell" },
  { id: "minion", name: "Minion" },
  { id: "material-link", name: "Material Link" },
  { id: "spotter", name: "Spotter" },
];

// Paths that can learn rituals (only those with Ritual Spellcasting skill access)
const RITUAL_PATHS = ["magician", "mystic-adept", "aspected-mage"];

// Aspected mages can only learn rituals if they chose Sorcery group
const SORCERY_GROUP = "sorcery";

export function RitualsStep({ state, updateState, budgetValues }: StepProps) {
  const rituals = useRituals();
  const ritualKeywords = useRitualKeywords();
  const priorityTable = usePriorityTable();

  const [keywordFilter, setKeywordFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get selected magical path and aspected group
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const aspectedGroup = (state.selections["aspected-mage-group"] as string) || null;

  // Check if character can learn rituals
  const canLearnRituals = useMemo(() => {
    if (!RITUAL_PATHS.includes(magicalPath)) return false;
    // Aspected mages can only learn rituals if they chose Sorcery group
    if (magicalPath === "aspected-mage" && aspectedGroup !== SORCERY_GROUP) {
      return false;
    }
    return true;
  }, [magicalPath, aspectedGroup]);

  // Get magic priority and rating
  const magicRating = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return 0;
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        magicRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return option?.magicRating || 0;
  }, [state.priorities?.magic, priorityTable, magicalPath]);

  // Get current selections
  const selectedRituals = (state.selections.rituals || []) as string[];

  // Calculate Karma
  const karmaBase = budgetValues["karma"] || 25;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const karmaToNuyen = (state.selections["karma-to-nuyen"] as number) || 0;
  const karmaSpentOnSkills = (state.budgets["karma-spent-skills"] as number) || 0;
  const karmaSpentOnAttributes = (state.budgets["karma-spent-attributes"] as number) || 0;
  const karmaSpentOnSpells = (state.budgets["karma-spent-spells"] as number) || 0;
  const karmaSpentOnRituals = (state.budgets["karma-spent-rituals"] as number) || 0;

  const totalKarmaSpent =
    karmaSpentPositive +
    karmaToNuyen +
    karmaSpentOnSkills +
    karmaSpentOnAttributes +
    karmaSpentOnSpells +
    karmaSpentOnRituals;
  const availableKarma = karmaBase + karmaGainedNegative - totalKarmaSpent;

  // Filter rituals
  const filteredRituals = useMemo(() => {
    let result = rituals;

    if (keywordFilter !== "all") {
      result = result.filter((r) => r.keywords.includes(keywordFilter));
    }

    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [rituals, keywordFilter, searchQuery]);

  // Toggle ritual selection
  const toggleRitual = useCallback(
    (ritualId: string) => {
      const isSelected = selectedRituals.includes(ritualId);
      let newRituals: string[];
      let newKarmaSpent: number;

      if (isSelected) {
        // Remove ritual
        newRituals = selectedRituals.filter((id) => id !== ritualId);
        newKarmaSpent = karmaSpentOnRituals - RITUAL_KARMA_COST;
      } else {
        // Check if we have enough karma
        if (availableKarma < RITUAL_KARMA_COST) return;

        // Add ritual
        newRituals = [...selectedRituals, ritualId];
        newKarmaSpent = karmaSpentOnRituals + RITUAL_KARMA_COST;
      }

      updateState({
        selections: {
          ...state.selections,
          rituals: newRituals,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-rituals": newKarmaSpent,
        },
      });
    },
    [
      selectedRituals,
      karmaSpentOnRituals,
      availableKarma,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Get keyword info by id
  const getKeywordInfo = useCallback(
    (keywordId: string) => {
      return ritualKeywords.find((k) => k.id === keywordId);
    },
    [ritualKeywords]
  );

  // Format keyword names for display
  const formatKeywordName = (keywordId: string) => {
    const keyword = getKeywordInfo(keywordId);
    return keyword?.name || keywordId.charAt(0).toUpperCase() + keywordId.slice(1).replace(/-/g, " ");
  };

  // If character can't learn rituals, show appropriate message
  if (!canLearnRituals) {
    if (magicalPath === "aspected-mage" && aspectedGroup !== SORCERY_GROUP) {
      return (
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Ritual Spellcasting Not Available
            </h3>
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              As an Aspected Magician who chose the <strong>{aspectedGroup?.charAt(0).toUpperCase()}{aspectedGroup?.slice(1)}</strong> group,
              you do not have access to Ritual Spellcasting. Only Sorcery-aspected mages can learn rituals.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Ritual Spellcasting Not Available
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your character&apos;s magical path does not include Ritual Spellcasting.
            Only Magicians, Mystic Adepts, and Sorcery-aspected Mages can learn rituals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
          Ritual Spellcasting
        </h3>
        <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
          Rituals are powerful magical workings that take longer to perform than spells but can achieve effects
          beyond normal spellcasting. Each ritual costs <strong>5 Karma</strong> to learn.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="text-purple-800 dark:text-purple-200">
            <strong>Rituals Known:</strong> {selectedRituals.length}
          </span>
          <span className="text-purple-800 dark:text-purple-200">
            <strong>Karma Spent:</strong> {karmaSpentOnRituals}
          </span>
          <span className="text-purple-800 dark:text-purple-200">
            <strong>Available Karma:</strong> {availableKarma}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Keyword Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Filter by Keyword
          </label>
          <select
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {KEYWORD_FILTERS.map((kw) => (
              <option key={kw.id} value={kw.id}>
                {kw.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rituals..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Selected Rituals Summary */}
      {selectedRituals.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            Selected Rituals ({selectedRituals.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedRituals.map((ritualId) => {
              const ritual = rituals.find((r) => r.id === ritualId);
              if (!ritual) return null;
              return (
                <button
                  key={ritualId}
                  onClick={() => toggleRitual(ritualId)}
                  className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 hover:bg-green-200 dark:bg-green-800/50 dark:text-green-200 dark:hover:bg-green-700/50"
                >
                  {ritual.name}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rituals List */}
      <div className="space-y-3">
        {filteredRituals.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-8">
            No rituals found matching your filters.
          </p>
        ) : (
          filteredRituals.map((ritual) => {
            const isSelected = selectedRituals.includes(ritual.id);
            const canAfford = availableKarma >= RITUAL_KARMA_COST;
            const canSelect = isSelected || canAfford;

            return (
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                isSelected={isSelected}
                canSelect={canSelect}
                onToggle={() => toggleRitual(ritual.id)}
                formatKeywordName={formatKeywordName}
                getKeywordInfo={getKeywordInfo}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// Ritual Card Component
interface RitualCardProps {
  ritual: RitualData;
  isSelected: boolean;
  canSelect: boolean;
  onToggle: () => void;
  formatKeywordName: (keywordId: string) => string;
  getKeywordInfo: (keywordId: string) => { id: string; name: string; description: string } | undefined;
}

function RitualCard({
  ritual,
  isSelected,
  canSelect,
  onToggle,
  formatKeywordName,
  getKeywordInfo,
}: RitualCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
          : !canSelect
            ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
              {ritual.name}
            </h4>
            {isSelected && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                Selected
              </span>
            )}
          </div>

          {/* Keywords */}
          <div className="mt-2 flex flex-wrap gap-1">
            {ritual.keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                title={getKeywordInfo(keyword)?.description}
              >
                {formatKeywordName(keyword)}
              </span>
            ))}
            {ritual.spellCategory && (
              <span className="inline-flex rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                {ritual.spellCategory.charAt(0).toUpperCase() + ritual.spellCategory.slice(1)} Spells
              </span>
            )}
          </div>

          {/* Duration */}
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <strong>Duration:</strong> {ritual.duration}
            {ritual.canBePermanent && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                (Can be made permanent with Karma)
              </span>
            )}
          </div>

          {/* Description Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2 text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>

          {showDetails && (
            <div className="mt-2 space-y-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {ritual.description}
              </p>

              {/* Minion Stats for Watcher/Homunculus */}
              {ritual.minionStats && (
                <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                  <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Minion Statistics
                  </h5>

                  {/* Attributes */}
                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    {Object.entries(ritual.minionStats.attributes).map(([attr, value]) => (
                      value !== undefined && (
                        <div key={attr} className="text-center">
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            {attr.charAt(0).toUpperCase()}
                          </span>
                          <span className="ml-1 text-zinc-800 dark:text-zinc-200">
                            {value === null ? "—" : String(value)}
                          </span>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Initiative */}
                  {(ritual.minionStats.initiative || ritual.minionStats.astralInitiative) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {ritual.minionStats.initiative && (
                        <span><strong>Initiative:</strong> {ritual.minionStats.initiative}</span>
                      )}
                      {ritual.minionStats.astralInitiative && (
                        <span><strong>Astral Initiative:</strong> {ritual.minionStats.astralInitiative}</span>
                      )}
                    </div>
                  )}

                  {/* Skills & Powers */}
                  <div className="mt-2 text-xs">
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <strong>Skills:</strong> {ritual.minionStats.skills.join(", ")}
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <strong>Powers:</strong> {ritual.minionStats.powers.join(", ")}
                    </div>
                  </div>

                  {/* Notes */}
                  {ritual.minionStats.notes && (
                    <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-500">
                      {ritual.minionStats.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Select Button */}
        <button
          onClick={onToggle}
          disabled={!canSelect}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isSelected
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : !canSelect
                ? "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          }`}
        >
          {isSelected ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
}
