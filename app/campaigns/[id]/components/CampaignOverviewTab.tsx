import Image from "next/image";
import Link from "next/link";
import type { Campaign, Book, CreationMethod } from "@/lib/types";
import { BookOpen, Zap, Shield, Clock, Users, MapPin, Swords } from "lucide-react";
import { CampaignActivityFeed } from "./CampaignActivityFeed";

export interface CampaignOverviewTabProps {
    campaign: Campaign;
    books: Book[];
    creationMethods: CreationMethod[];
    isGM?: boolean;
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

export default function CampaignOverviewTab({ 
    campaign, 
    books, 
    creationMethods, 
    isGM = false 
}: CampaignOverviewTabProps) {
    const levelInfo = gameplayLevelDetails[campaign.gameplayLevel];

    return (
        <div className="space-y-8">
            {/* Hero Image Section */}
            {campaign.imageUrl && (
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-zinc-200 shadow-lg dark:border-zinc-800">
                    <Image
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6">
                        <h2 className="text-3xl font-black text-white drop-shadow-md">
                            {campaign.title}
                        </h2>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details & Rules */}
            <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {campaign.description && (
                    <section>
                        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            About this Campaign
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg italic border-l-4 border-indigo-500 pl-4">
                            {campaign.description}
                        </p>
                    </section>
                )}

                {/* Ruleset Summary */}
                <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50 underline decoration-indigo-500/30 underline-offset-8">
                        <Shield className="h-5 w-5 text-indigo-500" />
                        Campaign Ruleset
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Edition */}
                        <div className="p-4 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Edition</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
                                {campaign.editionCode.toUpperCase()}
                            </p>
                        </div>
                        {/* Gameplay Level */}
                        <div className="p-4 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Gameplay Level</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{levelInfo.icon}</span>
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">{levelInfo.label}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{levelInfo.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Enabled Books */}
                    <section>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50 underline decoration-indigo-500/30 underline-offset-8">
                            <BookOpen className="h-5 w-5 text-indigo-500" />
                            Sourcebooks ({books.length})
                        </h3>
                        {books.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {books.map((book) => (
                                    <div
                                        key={book.id}
                                        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black hover:border-indigo-500/50 transition-colors shadow-sm"
                                    >
                                        <BookOpen className="h-4 w-4 shrink-0 text-zinc-400" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{book.title}</span>
                                        {book.isCore && (
                                            <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                Core
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 italic">No books enabled.</p>
                        )}
                    </section>

                    {/* Creation Methods */}
                    <section>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50 underline decoration-indigo-500/30 underline-offset-8">
                            <Zap className="h-5 w-5 text-indigo-500" />
                            Creation Rules ({creationMethods.length})
                        </h3>
                        {creationMethods.length > 0 ? (
                            <div className="space-y-3">
                                {creationMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black shadow-sm"
                                    >
                                        <p className="font-bold text-zinc-900 dark:text-zinc-50">{method.name}</p>
                                        {method.description && (
                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                                {method.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 italic">No creation methods specified.</p>
                        )}
                    </section>
                </div>

                {/* GM Notes Section */}
                {isGM && campaign.gmNotes && (
                    <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-900/20 backdrop-blur-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-400 underline decoration-amber-500/30 underline-offset-8 text-nowrap">
                            <Shield className="h-5 w-5" />
                            GM Eyes Only
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {campaign.gmNotes}
                        </p>
                    </section>
                )}

                {/* GM Quick Actions */}
                {isGM && (
                    <section className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/50 dark:bg-indigo-900/20 backdrop-blur-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-900 dark:text-indigo-400 underline decoration-indigo-500/30 underline-offset-8 text-nowrap">
                            <Swords className="h-5 w-5" />
                            GM Tools
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link
                                href={`/campaigns/${campaign.id}/locations`}
                                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black hover:border-indigo-500/50 transition-colors shadow-sm group"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Locations</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage campaign locations</p>
                                </div>
                            </Link>
                            <Link
                                href={`/campaigns/${campaign.id}/grunt-teams`}
                                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black hover:border-indigo-500/50 transition-colors shadow-sm group"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                    <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Grunt Teams</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage NPC grunt squads</p>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}
            </div>

            {/* Right Column: Activity & Stats */}
            <div className="space-y-8">
                {/* Campaign Metadata */}
                <section className="rounded-xl border border-zinc-200 bg-zinc-50/30 p-6 dark:border-zinc-800 dark:bg-zinc-900/30 backdrop-blur-sm">
                    <h3 className="mb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        Campaign Details
                    </h3>
                    <div className="space-y-4">
                        {(campaign.startDate || campaign.endDate) && (
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-indigo-500" />
                                <div className="text-sm">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Timeline</p>
                                    <p className="text-zinc-500 dark:text-zinc-400">
                                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "???"} 
                                        {" - "}
                                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Ongoing"}
                                    </p>
                                </div>
                            </div>
                        )}
                        {campaign.tags && campaign.tags.length > 0 && (
                            <div className="flex items-start gap-3">
                                <Zap className="h-4 w-4 text-indigo-500 mt-1" />
                                <div className="text-sm">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Tags</p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {campaign.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center rounded-md bg-white border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-black dark:border-zinc-800 dark:text-zinc-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Campaign Stats */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-black shadow-sm group hover:border-indigo-500/50 transition-colors">
                        <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-500 transition-colors">
                            {campaign.playerIds.length}
                        </p>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Players</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-black shadow-sm group hover:border-indigo-500/50 transition-colors">
                        <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-500 transition-colors">
                            {campaign.maxPlayers ?? "∞"}
                        </p>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-nowrap">Max Capacity</p>
                    </div>
                </section>

                {/* Activity Feed */}
                <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm backdrop-blur-sm h-full max-h-[600px] flex flex-col min-h-[400px]">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        Live Feed
                    </h3>
                    <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                        <CampaignActivityFeed campaignId={campaign.id} />
                    </div>
                </section>
            </div>
        </div>
        </div>
    );
}
