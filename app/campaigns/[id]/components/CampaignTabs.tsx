"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface CampaignTabsProps {
    activeTab: "overview" | "characters" | "notes" | "sessions" | "roster" | "locations";
    onTabChange: (tab: "overview" | "characters" | "notes" | "sessions" | "roster" | "locations") => void;
    isGM: boolean;
}

export default function CampaignTabs({ activeTab, onTabChange, isGM }: CampaignTabsProps) {
    const params = useParams();
    const campaignId = params.id as string;

    const tabs = [
        { id: "overview" as const, label: "Overview" },
        { id: "characters" as const, label: "Characters" },
        { id: "locations" as const, label: "Locations", isLink: true },
        { id: "notes" as const, label: "Notes" },
        { id: "sessions" as const, label: "Sessions" },
        ...(isGM ? [{ id: "roster" as const, label: "Roster" }] : []),
    ];

    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8" aria-label="Campaign tabs">
                {tabs.map((tab) => (
                    tab.isLink ? (
                        <Link
                            key={tab.id}
                            href={`/campaigns/${campaignId}/locations`}
                            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ) : (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
                                }`}
                            aria-current={activeTab === tab.id ? "page" : undefined}
                        >
                            {tab.label}
                        </button>
                    )
                ))}
            </nav>
        </div>
    );
}

