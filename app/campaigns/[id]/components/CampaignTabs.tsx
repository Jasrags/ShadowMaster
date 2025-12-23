"use client";

export type CampaignTabId = "overview" | "characters" | "notes" | "roster" | "locations" | "posts" | "calendar" | "approvals";

interface CampaignTabsProps {
    activeTab: CampaignTabId;
    onTabChange: (tab: CampaignTabId) => void;
    userRole: "gm" | "player" | null;
    pendingApprovalsCount?: number;
}

export default function CampaignTabs({ activeTab, onTabChange, userRole, pendingApprovalsCount = 0 }: CampaignTabsProps) {
    const isGM = userRole === "gm";
    const isMember = userRole !== null;

    const allTabs = [
        { id: "overview" as const, label: "Overview", public: true },
        { id: "posts" as const, label: "Bulletin Board", public: false },
        { id: "calendar" as const, label: "Calendar", public: false },
        { id: "characters" as const, label: "Characters", public: false },
        { id: "locations" as const, label: "Locations", public: false },
        { id: "notes" as const, label: "Notes", public: false },
        ...(isGM ? [{ id: "roster" as const, label: "Roster", public: false }] : []),
        ...(isGM ? [{ id: "approvals" as const, label: "Approvals", badge: pendingApprovalsCount, public: false }] : []),
    ];

    const tabs = allTabs.filter(tab => tab.public || isMember);

    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8" aria-label="Campaign tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                            ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                            : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
                            }`}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                        {tab.label}
                        {"badge" in tab && tab.badge !== undefined && tab.badge > 0 && (
                            <span className="inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1.5">
                                {tab.badge > 99 ? "99+" : tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}

