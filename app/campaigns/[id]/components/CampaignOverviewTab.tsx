import type { Campaign, Book, CreationMethod } from "@/lib/types";
import { BookOpen, Zap, Shield } from "lucide-react";

interface CampaignOverviewTabProps {
    campaign: Campaign;
    books: Book[];
    creationMethods: CreationMethod[];
}

const gameplayLevelDetails = {
    street: {
        label: "Street Level",
        description: "Characters are fresh from the shadows. Limited resources, lower karma.",
        icon: "🏚️",
    },
    experienced: {
        label: "Experienced",
        description: "Standard starting characters with balanced resources.",
        icon: "⚔️",
    },
    "prime-runner": {
        label: "Prime Runner",
        description: "Elite characters with maximum resources and karma.",
        icon: "🌟",
    },
};

export default function CampaignOverviewTab({ campaign, books, creationMethods }: CampaignOverviewTabProps) {
    const levelInfo = gameplayLevelDetails[campaign.gameplayLevel];

    return (
        <div className="space-y-6">
            {/* Description */}
            {campaign.description && (
                <section>
                    <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        About this Campaign
                    </h3>
                    <p className="text-zinc-700 dark:text-zinc-300">{campaign.description}</p>
                </section>
            )}

            {/* Ruleset Summary */}
            <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    Ruleset Configuration
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Edition */}
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Edition</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {campaign.editionCode.toUpperCase()}
                        </p>
                    </div>
                    {/* Gameplay Level */}
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gameplay Level</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{levelInfo.icon}</span>
                            <div>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{levelInfo.label}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{levelInfo.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enabled Books */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    Enabled Books ({books.length})
                </h3>
                {books.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black"
                            >
                                <BookOpen className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">{book.title}</span>
                                {book.isCore && (
                                    <span className="ml-auto rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        Core
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No books enabled.</p>
                )}
            </section>

            {/* Creation Methods */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    <Zap className="h-5 w-5 text-indigo-500" />
                    Allowed Creation Methods ({creationMethods.length})
                </h3>
                {creationMethods.length > 0 ? (
                    <div className="space-y-2">
                        {creationMethods.map((method) => (
                            <div
                                key={method.id}
                                className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black"
                            >
                                <p className="font-medium text-zinc-900 dark:text-zinc-50">{method.name}</p>
                                {method.description && (
                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        {method.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No creation methods specified.</p>
                )}
            </section>

            {/* Campaign Stats */}
            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-black">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {campaign.playerIds.length}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Players</p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-black">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {campaign.maxPlayers ?? "∞"}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Max Players</p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-black">
                    <p className="text-2xl font-bold capitalize text-zinc-900 dark:text-zinc-50">
                        {campaign.visibility}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Visibility</p>
                </div>
            </section>
        </div>
    );
}
