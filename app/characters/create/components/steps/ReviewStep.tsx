"use client";

import { useMemo } from "react";
import { useMetatypes, useSkills, useQualities, useSpells, useComplexForms, usePriorityTable } from "@/lib/rules";
import type { CreationState, ID, Contact } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
  onComplete: (characterId: ID) => void;
}

interface KnowledgeSkill {
  name: string;
  category: string;
  rating: number;
}

interface LanguageSkill {
  name: string;
  rating: number;
  isNative?: boolean;
}

interface GearItem {
  id: string;
  name: string;
  quantity: number;
  cost: number;
}

interface LifestyleSelection {
  id: string;
  name: string;
  months: number;
  cost: number;
}

export function ReviewStep({ state, updateState, budgetValues }: StepProps) {
  const metatypes = useMetatypes();
  const { activeSkills, skillGroups } = useSkills();
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const spellsCatalog = useSpells();
  const complexFormsCatalog = useComplexForms();
  const priorityTable = usePriorityTable();

  // Get character name from state or default to empty
  const characterName = (state.selections.characterName as string) || "";

  // Update character name in state
  const setCharacterName = (name: string) => {
    updateState({
      selections: {
        ...state.selections,
        characterName: name,
      },
    });
  };

  // Get selected metatype data
  const selectedMetatype = useMemo(() => {
    const metatypeId = state.selections.metatype as string;
    return metatypes.find((m) => m.id === metatypeId);
  }, [metatypes, state.selections.metatype]);

  // Get magical path and tradition
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const tradition = (state.selections.tradition as string) || "";
  const isMagical = magicalPath !== "mundane" && magicalPath !== "adept";
  const isTechnomancer = magicalPath === "technomancer";

  // Get attributes from state
  const attributes = (state.selections.attributes || {}) as Record<string, number>;
  const specialAttributes = (state.selections.specialAttributes || {}) as Record<string, number>;
  const selectedSkills = (state.selections.skills || {}) as Record<string, number>;
  const selectedSkillGroups = (state.selections.skillGroups || {}) as Record<string, number>;
  const skillSpecializations = (state.selections.skillSpecializations || {}) as Record<string, string[]>;
  const knowledgeSkills = (state.selections.knowledgeSkills || []) as KnowledgeSkill[];
  const languages = (state.selections.languages || []) as LanguageSkill[];
  const selectedPositiveQualities = (state.selections.positiveQualities || []) as string[];
  const selectedNegativeQualities = (state.selections.negativeQualities || []) as string[];
  const contacts = (state.selections.contacts || []) as Contact[];
  const gear = (state.selections.gear || []) as GearItem[];
  const lifestyle = state.selections.lifestyle as LifestyleSelection | undefined;
  const selectedSpells = (state.selections.spells || []) as string[];
  const selectedComplexForms = (state.selections.complexForms || []) as string[];

  // Get free spells/complex forms from priority
  const { freeSpells, freeComplexForms } = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return { freeSpells: 0, freeComplexForms: 0 };
    }
    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{ path: string; spells?: number; complexForms?: number }>;
    };
    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return {
      freeSpells: option?.spells || 0,
      freeComplexForms: option?.complexForms || 0,
    };
  }, [state.priorities?.magic, priorityTable, magicalPath]);

  // Calculate totals
  const attrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
  const attrTotal = budgetValues["attribute-points"] || 0;
  const skillSpent = (state.budgets["skill-points-spent"] as number) || 0;
  const skillTotal = budgetValues["skill-points"] || 0;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
  const karmaSpentSpells = (state.budgets["karma-spent-spells"] as number) || 0;
  const karmaSpentComplexForms = (state.budgets["karma-spent-complex-forms"] as number) || 0;

  const karmaTotal = (budgetValues["karma"] || 25) + karmaGainedNegative;
  const karmaSpent = karmaSpentPositive + karmaSpentGear + karmaSpentSpells + karmaSpentComplexForms;
  const karmaRemaining = karmaTotal - karmaSpent;

  const nuyenTotal = budgetValues["nuyen"] || 0;
  const nuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;
  const nuyenRemaining = nuyenTotal - nuyenSpent;

  // Get spell names from IDs
  const getSpellName = (id: string): string => {
    if (!spellsCatalog) return id;
    for (const category of Object.values(spellsCatalog)) {
      const spell = category.find((s: { id: string; name: string }) => s.id === id);
      if (spell) return spell.name;
    }
    return id;
  };

  // Get complex form names from IDs
  const getComplexFormName = (id: string): string => {
    const form = complexFormsCatalog?.find((cf) => cf.id === id);
    return form?.name || id;
  };

  // Calculate derived stats
  const derivedStats = useMemo(() => {
    const body = (attributes.body || 0) + (selectedMetatype?.attributes.body && "min" in selectedMetatype.attributes.body ? selectedMetatype.attributes.body.min : 1);
    const agility = (attributes.agility || 0) + (selectedMetatype?.attributes.agility && "min" in selectedMetatype.attributes.agility ? selectedMetatype.attributes.agility.min : 1);
    const reaction = (attributes.reaction || 0) + (selectedMetatype?.attributes.reaction && "min" in selectedMetatype.attributes.reaction ? selectedMetatype.attributes.reaction.min : 1);
    const strength = (attributes.strength || 0) + (selectedMetatype?.attributes.strength && "min" in selectedMetatype.attributes.strength ? selectedMetatype.attributes.strength.min : 1);
    const willpower = (attributes.willpower || 0) + (selectedMetatype?.attributes.willpower && "min" in selectedMetatype.attributes.willpower ? selectedMetatype.attributes.willpower.min : 1);
    const logic = (attributes.logic || 0) + (selectedMetatype?.attributes.logic && "min" in selectedMetatype.attributes.logic ? selectedMetatype.attributes.logic.min : 1);
    const intuition = (attributes.intuition || 0) + (selectedMetatype?.attributes.intuition && "min" in selectedMetatype.attributes.intuition ? selectedMetatype.attributes.intuition.min : 1);
    const charisma = (attributes.charisma || 0) + (selectedMetatype?.attributes.charisma && "min" in selectedMetatype.attributes.charisma ? selectedMetatype.attributes.charisma.min : 1);
    const essence = 6;

    return {
      initiative: intuition + reaction,
      physicalLimit: Math.ceil(((strength * 2) + body + reaction) / 3),
      mentalLimit: Math.ceil(((logic * 2) + intuition + willpower) / 3),
      socialLimit: Math.ceil(((charisma * 2) + willpower + Math.ceil(essence)) / 3),
      physicalCM: Math.ceil(body / 2) + 8,
      stunCM: Math.ceil(willpower / 2) + 8,
      composure: charisma + willpower,
      judgeIntentions: charisma + intuition,
      memory: logic + willpower,
      liftCarry: body + strength,
    };
  }, [attributes, selectedMetatype]);

  // Validation checks
  const validationIssues = useMemo(() => {
    const issues: { type: "error" | "warning"; message: string }[] = [];

    if (!characterName.trim()) {
      issues.push({ type: "warning", message: "Character name not set" });
    }

    if (Object.keys(state.priorities || {}).length < 5) {
      issues.push({ type: "error", message: "Priorities incomplete" });
    }

    if (!state.selections.metatype) {
      issues.push({ type: "error", message: "Metatype not selected" });
    }

    if (attrTotal > 0 && attrSpent < attrTotal - 5) {
      issues.push({ type: "warning", message: `${attrTotal - attrSpent} attribute points unspent` });
    }

    if (skillTotal > 0 && skillSpent < skillTotal * 0.5) {
      issues.push({ type: "warning", message: "Many skill points remaining" });
    }

    if (karmaRemaining > 7) {
      issues.push({ type: "warning", message: `${karmaRemaining} Karma remaining (max 7 carryover)` });
    }

    if (nuyenRemaining > 5000) {
      issues.push({ type: "warning", message: `${nuyenRemaining.toLocaleString()} nuyen remaining (max 5,000 carryover)` });
    }

    return issues;
  }, [characterName, state.priorities, state.selections.metatype, attrTotal, attrSpent, skillTotal, skillSpent, karmaRemaining, nuyenRemaining]);

  const hasErrors = validationIssues.some((i) => i.type === "error");

  return (
    <div className="space-y-6">
      {/* Character Name Input */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Character Name</span>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter your character's name..."
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Priorities */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Priorities</h3>
          <div className="mt-3 space-y-2">
            {Object.entries(state.priorities || {}).map(([category, level]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize text-zinc-600 dark:text-zinc-400">{category}</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {String(level)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metatype & Magic */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Identity</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Metatype</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {selectedMetatype?.name || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Path</span>
              <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {magicalPath.replace("-", " ")}
              </span>
            </div>
            {tradition && isMagical && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Tradition</span>
                <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
                  {tradition}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Resource Summary */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Resources</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Attributes</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {attrSpent} / {attrTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Skills</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {skillSpent} / {skillTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Karma</span>
              <span className={`font-medium ${karmaRemaining > 7 ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {karmaRemaining} remaining
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Nuyen</span>
              <span className={`font-medium ${nuyenRemaining > 5000 ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {nuyenRemaining.toLocaleString()} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      {Object.keys(attributes).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Attributes</h3>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {["body", "agility", "reaction", "strength", "willpower", "logic", "intuition", "charisma"].map((attr) => {
              const metatypeAttr = selectedMetatype?.attributes[attr];
              const minValue = metatypeAttr && "min" in metatypeAttr ? metatypeAttr.min : 1;
              const totalValue = (attributes[attr] || 0) + minValue;
              return (
                <div key={attr} className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
                  <div className="text-[10px] font-medium uppercase text-zinc-500 dark:text-zinc-400">
                    {attr.slice(0, 3)}
                  </div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {totalValue}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Special Attributes */}
          <div className="mt-3 flex gap-4">
            <div className="rounded bg-amber-100 px-3 py-2 text-center dark:bg-amber-900/30">
              <div className="text-[10px] font-medium uppercase text-amber-600 dark:text-amber-400">Edge</div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                {(specialAttributes.edge || 0) + (selectedMetatype?.attributes.edge && "min" in selectedMetatype.attributes.edge ? selectedMetatype.attributes.edge.min : 1)}
              </div>
            </div>
            {(magicalPath === "magician" || magicalPath === "mystic-adept" || magicalPath === "aspected-mage" || magicalPath === "adept") && (
              <div className="rounded bg-purple-100 px-3 py-2 text-center dark:bg-purple-900/30">
                <div className="text-[10px] font-medium uppercase text-purple-600 dark:text-purple-400">Magic</div>
                <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {(specialAttributes.magic || 0) + 1}
                </div>
              </div>
            )}
            {magicalPath === "technomancer" && (
              <div className="rounded bg-cyan-100 px-3 py-2 text-center dark:bg-cyan-900/30">
                <div className="text-[10px] font-medium uppercase text-cyan-600 dark:text-cyan-400">Resonance</div>
                <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                  {(specialAttributes.resonance || 0) + 1}
                </div>
              </div>
            )}
            <div className="rounded bg-rose-100 px-3 py-2 text-center dark:bg-rose-900/30">
              <div className="text-[10px] font-medium uppercase text-rose-600 dark:text-rose-400">Essence</div>
              <div className="text-lg font-bold text-rose-700 dark:text-rose-300">6.0</div>
            </div>
          </div>
        </div>
      )}

      {/* Derived Stats */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Derived Stats</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded bg-blue-50 p-2 text-center dark:bg-blue-900/20">
            <div className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Initiative</div>
            <div className="font-bold text-blue-700 dark:text-blue-300">{derivedStats.initiative} + 1d6</div>
          </div>
          <div className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Physical Limit</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{derivedStats.physicalLimit}</div>
          </div>
          <div className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Mental Limit</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{derivedStats.mentalLimit}</div>
          </div>
          <div className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Social Limit</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{derivedStats.socialLimit}</div>
          </div>
          <div className="rounded bg-red-50 p-2 text-center dark:bg-red-900/20">
            <div className="text-[10px] font-medium text-red-600 dark:text-red-400">Physical CM</div>
            <div className="font-bold text-red-700 dark:text-red-300">{derivedStats.physicalCM}</div>
          </div>
          <div className="rounded bg-amber-50 p-2 text-center dark:bg-amber-900/20">
            <div className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Stun CM</div>
            <div className="font-bold text-amber-700 dark:text-amber-300">{derivedStats.stunCM}</div>
          </div>
          <div className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Composure</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{derivedStats.composure}</div>
          </div>
          <div className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Memory</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">{derivedStats.memory}</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {Object.keys(selectedSkills).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Skills ({Object.keys(selectedSkills).length})
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(selectedSkills)
              .sort(([, a], [, b]) => b - a)
              .map(([skillId, rating]) => {
                const skill = activeSkills.find((s) => s.id === skillId);
                const specs = skillSpecializations[skillId] || [];
                return (
                  <div
                    key={skillId}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm dark:bg-emerald-900/50"
                  >
                    <span className="font-medium text-emerald-800 dark:text-emerald-200">
                      {skill?.name || skillId}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">{rating}</span>
                    {specs.length > 0 && (
                      <span className="text-xs text-emerald-500">({specs.join(", ")})</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Skill Groups */}
      {Object.keys(selectedSkillGroups).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Skill Groups</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(selectedSkillGroups).map(([groupId, rating]) => {
              const group = skillGroups.find((g) => g.id === groupId);
              return (
                <div
                  key={groupId}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900/50"
                >
                  <span className="font-medium text-purple-800 dark:text-purple-200">
                    {group?.name || groupId}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400">{rating}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Knowledge Skills & Languages */}
      {(knowledgeSkills.length > 0 || languages.length > 0) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Knowledge & Languages</h3>
          <div className="mt-3 space-y-3">
            {knowledgeSkills.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Knowledge Skills</div>
                <div className="flex flex-wrap gap-2">
                  {knowledgeSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm dark:bg-indigo-900/50"
                    >
                      <span className="font-medium text-indigo-800 dark:text-indigo-200">{skill.name}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{skill.rating}</span>
                      <span className="text-xs text-indigo-500">({skill.category})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Languages</div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm dark:bg-teal-900/50"
                    >
                      <span className="font-medium text-teal-800 dark:text-teal-200">{lang.name}</span>
                      <span className="text-teal-600 dark:text-teal-400">
                        {lang.isNative ? "N" : lang.rating}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Qualities */}
      {(selectedPositiveQualities.length > 0 || selectedNegativeQualities.length > 0) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Qualities</h3>
          <div className="mt-3 space-y-3">
            {selectedPositiveQualities.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">Positive</div>
                <div className="flex flex-wrap gap-2">
                  {selectedPositiveQualities.map((qId) => {
                    const quality = positiveQualities.find((q) => q.id === qId);
                    return (
                      <span
                        key={qId}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                      >
                        {quality?.name || qId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedNegativeQualities.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-amber-600 dark:text-amber-400">Negative</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNegativeQualities.map((qId) => {
                    const quality = negativeQualities.find((q) => q.id === qId);
                    return (
                      <span
                        key={qId}
                        className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                      >
                        {quality?.name || qId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spells */}
      {selectedSpells.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Spells ({selectedSpells.length})
            {selectedSpells.length > freeSpells && (
              <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                ({selectedSpells.length - freeSpells} purchased with Karma)
              </span>
            )}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSpells.map((spellId, index) => (
              <span
                key={spellId}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  index < freeSpells
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                }`}
              >
                {getSpellName(spellId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complex Forms */}
      {selectedComplexForms.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Complex Forms ({selectedComplexForms.length})
            {selectedComplexForms.length > freeComplexForms && (
              <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                ({selectedComplexForms.length - freeComplexForms} purchased with Karma)
              </span>
            )}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedComplexForms.map((formId, index) => (
              <span
                key={formId}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  index < freeComplexForms
                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                }`}
              >
                {getComplexFormName(formId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contacts */}
      {contacts.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Contacts ({contacts.length})
          </h3>
          <div className="mt-3 space-y-2">
            {contacts.map((contact, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-zinc-50 p-2 dark:bg-zinc-700/50">
                <div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{contact.name}</span>
                  {contact.type && (
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">({contact.type})</span>
                  )}
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-blue-600 dark:text-blue-400">C{contact.connection}</span>
                  <span className="text-rose-600 dark:text-rose-400">L{contact.loyalty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gear & Lifestyle */}
      {(gear.length > 0 || lifestyle) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Gear & Lifestyle</h3>
          <div className="mt-3 space-y-3">
            {lifestyle && (
              <div className="rounded bg-emerald-50 p-2 dark:bg-emerald-900/20">
                <span className="font-medium text-emerald-800 dark:text-emerald-200">
                  {lifestyle.name} Lifestyle
                </span>
                <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-400">
                  ({lifestyle.months} month{lifestyle.months > 1 ? "s" : ""})
                </span>
              </div>
            )}
            {gear.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gear.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-700"
                  >
                    <span className="text-zinc-800 dark:text-zinc-200">{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="text-zinc-500 dark:text-zinc-400">x{item.quantity}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Status */}
      <div
        className={`rounded-lg p-4 ${
          hasErrors
            ? "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            : validationIssues.length > 0
            ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
            : "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
        }`}
      >
        <h3
          className={`text-sm font-semibold ${
            hasErrors
              ? "text-red-800 dark:text-red-200"
              : validationIssues.length > 0
              ? "text-amber-800 dark:text-amber-200"
              : "text-emerald-800 dark:text-emerald-200"
          }`}
        >
          {hasErrors ? "Issues to Resolve" : validationIssues.length > 0 ? "Warnings" : "Ready to Create"}
        </h3>
        {validationIssues.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {validationIssues.map((issue, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 text-sm ${
                  issue.type === "error"
                    ? "text-red-700 dark:text-red-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {issue.type === "error" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {issue.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
            Your character is complete and ready to be created!
          </p>
        )}
      </div>
    </div>
  );
}
