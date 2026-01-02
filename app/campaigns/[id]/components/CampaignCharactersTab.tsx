"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Campaign, Character } from "@/lib/types";
import { Plus, Loader2, User, Search } from "lucide-react";

interface CampaignCharactersTabProps {
    campaign: Campaign;
    isGM: boolean;
}

export default function CampaignCharactersTab({ campaign, isGM }: CampaignCharactersTabProps) {
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchCharacters() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/campaigns/${campaign.id}/characters`);
                const data = await res.json();

                if (data.success) {
                    setCharacters(data.characters || []);
                } else {
                    setError(data.error || "Failed to load characters");
                }
            } catch {
                setError("An error occurred while loading characters");
            } finally {
                setLoading(false);
            }
        }

        fetchCharacters();
    }, [campaign.id]);

    const filteredCharacters = characters.filter((char) =>
        char.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateCharacter = () => {
        router.push(`/characters/create/sheet?campaignId=${campaign.id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search characters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white"
                    />
                </div>
                <button
                    onClick={handleCreateCharacter}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4" />
                    Create Character
                </button>
            </div>

            {/* Character List */}
            {filteredCharacters.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-black">
                    <User className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        {searchQuery ? "No matching characters" : "No characters yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {searchQuery
                            ? "Try a different search term."
                            : "Create a character to add them to this campaign."}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleCreateCharacter}
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Character
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCharacters.map((character) => (
                        <div
                            key={character.id}
                            onClick={() => router.push(`/characters/${character.id}`)}
                            className="group cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <User className="h-5 w-5 text-zinc-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                                        {character.name || "Unnamed Character"}
                                    </h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {character.metatype}
                                        {character.magicalPath && character.magicalPath !== "mundane" && ` • ${character.magicalPath}`}
                                    </p>
                                    {isGM && character.ownerId && (
                                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                                            Player ID: {character.ownerId.slice(0, 8)}...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
