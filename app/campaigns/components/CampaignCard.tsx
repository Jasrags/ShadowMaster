import type { Campaign, CampaignStatus } from "@/lib/types";
import { Calendar, Users, Crown, BookOpen } from "lucide-react";

interface CampaignCardProps {
    campaign: Campaign;
    userRole: "gm" | "player";
    onView: (campaignId: string) => void;
}

const statusColors: Record<CampaignStatus, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    archived: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const gameplayLevelLabels = {
    street: "Street Level",
    experienced: "Experienced",
    "prime-runner": "Prime Runner",
};

export default function CampaignCard({ campaign, userRole, onView }: CampaignCardProps) {
    return (
        <div
            onClick={() => onView(campaign.id)}
            className="group cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
        >
            {campaign.imageUrl && (
                <div className="h-32 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {campaign.title}
                            </h3>
                            {userRole === "gm" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <Crown className="h-3 w-3" />
                                    GM
                                </span>
                            )}
                        </div>

                        {campaign.description && (
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                {campaign.description}
                            </p>
                        )}

                        {campaign.tags && campaign.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {campaign.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                        #{tag}
                                    </span>
                                ))}
                                {campaign.tags.length > 3 && (
                                    <span className="text-xs text-zinc-500">+{campaign.tags.length - 3}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <span className={`ml-4 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[campaign.status]}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{campaign.editionCode.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{campaign.playerIds.length} players</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                            {gameplayLevelLabels[campaign.gameplayLevel]}
                        </span>
                    </div>
                    {campaign.createdAt && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
