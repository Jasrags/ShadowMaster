"use client";

import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import { Info } from "lucide-react";

interface AdvancementSettingsFormProps {
    settings: CampaignAdvancementSettings;
    onChange: (settings: CampaignAdvancementSettings) => void;
}

export default function AdvancementSettingsForm({ settings, onChange }: AdvancementSettingsFormProps) {
    const handleChange = (field: keyof CampaignAdvancementSettings, value: number | boolean) => {
        onChange({
            ...settings,
            [field]: value,
        });
    };

    return (
        <div className="space-y-8">
            {/* Karma Multipliers */}
            <div>
                <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Karma Multipliers
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Attribute Multiplier
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Cost = New Rating × Multiplier (Default: 5)
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.attributeKarmaMultiplier}
                            onChange={(e) => handleChange("attributeKarmaMultiplier", parseInt(e.target.value) || 5)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Active Skill Multiplier
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Cost = New Rating × Multiplier (Default: 2)
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.skillKarmaMultiplier}
                            onChange={(e) => handleChange("skillKarmaMultiplier", parseInt(e.target.value) || 2)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Skill Group Multiplier
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Cost = New Rating × Multiplier (Default: 5)
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.skillGroupKarmaMultiplier}
                            onChange={(e) => handleChange("skillGroupKarmaMultiplier", parseInt(e.target.value) || 5)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Knowledge Skill Multiplier
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Cost = New Rating × Multiplier (Default: 1)
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.knowledgeSkillKarmaMultiplier}
                            onChange={(e) => handleChange("knowledgeSkillKarmaMultiplier", parseInt(e.target.value) || 1)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Fixed Costs */}
            <div>
                <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Fixed Karma Costs
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Specialization Cost
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Default: 7 Karma
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.specializationKarmaCost}
                            onChange={(e) => handleChange("specializationKarmaCost", parseInt(e.target.value) || 7)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Spell/Ritual/Prep Cost
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Default: 5 Karma
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.spellKarmaCost}
                            onChange={(e) => handleChange("spellKarmaCost", parseInt(e.target.value) || 5)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Complex Form Cost
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Default: 4 Karma
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={settings.complexFormKarmaCost}
                            onChange={(e) => handleChange("complexFormKarmaCost", parseInt(e.target.value) || 4)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Rating Caps */}
            <div>
                <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Advancement Limits
                </h3>
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="flex">
                        <div className="shrink-0">
                            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Rating Caps
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <p>
                                    These caps limit how high a rating can be raised through advancement.
                                    Metatype maximums (augmented) still apply if lower than these caps.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Attribute Rating Cap
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={settings.attributeRatingCap}
                            onChange={(e) => handleChange("attributeRatingCap", parseInt(e.target.value) || 6)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Skill Rating Cap
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={settings.skillRatingCap}
                            onChange={(e) => handleChange("skillRatingCap", parseInt(e.target.value) || 12)}
                            className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Training Rules */}
            <div>
                <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Training Rules
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Training Time Multiplier
                        </label>
                        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                            Adjusts training times (e.g., 0.5 for half time). Set to 0 for instant (if allowed).
                        </p>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={settings.trainingTimeMultiplier}
                            onChange={(e) => handleChange("trainingTimeMultiplier", parseFloat(e.target.value) || 1)}
                            className="block w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                        />
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-5 items-center">
                            <input
                                id="allowInstantAdvancement"
                                type="checkbox"
                                checked={settings.allowInstantAdvancement}
                                onChange={(e) => handleChange("allowInstantAdvancement", e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="text-sm">
                            <label htmlFor="allowInstantAdvancement" className="font-medium text-zinc-700 dark:text-zinc-300">
                                Allow Instant Advancement
                            </label>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                If checked, training times are ignored completely.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-5 items-center">
                            <input
                                id="requireApproval"
                                type="checkbox"
                                checked={settings.requireApproval}
                                onChange={(e) => handleChange("requireApproval", e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="text-sm">
                            <label htmlFor="requireApproval" className="font-medium text-zinc-700 dark:text-zinc-300">
                                Require GM Approval
                            </label>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                If checked, all advancement requests must be approved by the GM.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
