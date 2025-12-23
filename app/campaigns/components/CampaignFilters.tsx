"use client";

import { Filter, X } from "lucide-react";

interface CampaignFiltersProps {
    edition: string;
    onEditionChange: (edition: string) => void;
    gameplayLevel: string;
    onGameplayLevelChange: (level: string) => void;
    selectedTags: string[];
    tagInput: string;
    onTagInputChange: (input: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

export default function CampaignFilters({
    edition,
    onEditionChange,
    gameplayLevel,
    onGameplayLevelChange,
    selectedTags,
    tagInput,
    onTagInputChange,
    onAddTag,
    onRemoveTag,
}: CampaignFiltersProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
            <div className="mb-4 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-50">
                <Filter className="h-4 w-4" />
                Filters
            </div>

            <div className="space-y-4">
                {/* Edition */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Edition
                    </label>
                    <select
                        value={edition}
                        onChange={(e) => onEditionChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    >
                        <option value="sr5">Shadowrun 5th Edition</option>
                        <option value="sr6">Shadowrun 6th World</option>
                    </select>
                </div>

                {/* Level */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Gameplay Level
                    </label>
                    <select
                        value={gameplayLevel}
                        onChange={(e) => onGameplayLevelChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    >
                        <option value="">Any Level</option>
                        <option value="street">Street Level</option>
                        <option value="experienced">Experienced</option>
                        <option value="prime-runner">Prime Runner</option>
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Tags
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => onTagInputChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onAddTag()}
                            className="block w-full min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            placeholder="Add tag..."
                        />
                        <button
                            onClick={onAddTag}
                            className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                            +
                        </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedTags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {tag}
                                <button onClick={() => onRemoveTag(tag)} className="hover:text-indigo-900 dark:hover:text-indigo-200">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
