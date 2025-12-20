"use client";

interface CampaignTabsProps {
    activeTab: "overview" | "characters" | "notes" | "roster" | "locations" | "posts" | "calendar";
    onTabChange: (tab: "overview" | "characters" | "notes" | "roster" | "locations" | "posts" | "calendar") => void;
    isGM: boolean;
}

export default function CampaignTabs({ activeTab, onTabChange, isGM }: CampaignTabsProps) {

    const tabs = [
        { id: "overview" as const, label: "Overview" },
        { id: "posts" as const, label: "Bulletin Board" },
        { id: "calendar" as const, label: "Calendar" },
        { id: "characters" as const, label: "Characters" },
        { id: "locations" as const, label: "Locations" },
        { id: "notes" as const, label: "Notes" },

        ...(isGM ? [{ id: "roster" as const, label: "Roster" }] : []),
    ];

    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8" aria-label="Campaign tabs">
                {tabs.map((tab) => (
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
                ))}
            </nav>
        </div>
    );
}

