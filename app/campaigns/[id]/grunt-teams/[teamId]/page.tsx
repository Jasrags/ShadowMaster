"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Edit, Trash2, BarChart3, Swords, Settings } from "lucide-react";
import type { GruntTeam, IndividualGrunts, Campaign, ID } from "@/lib/types";
import { ProfessionalRatingBadge } from "../components/ProfessionalRatingBadge";
import { GruntTeamStatsTab } from "./components/GruntTeamStatsTab";
import { GruntTeamCombatTrackerTab } from "./components/GruntTeamCombatTrackerTab";

type TabType = "stats" | "combat" | "settings";

const TABS: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "stats", label: "Statistics", icon: BarChart3 },
  { id: "combat", label: "Combat Tracker", icon: Swords },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function GruntTeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<GruntTeam | null>(null);
  const [individualGrunts, setIndividualGrunts] = useState<IndividualGrunts | undefined>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [userRole, setUserRole] = useState<"gm" | "player" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("stats");

  const fetchTeam = useCallback(
    async (includeCombatState = false) => {
      try {
        const queryParams = includeCombatState ? "?includeCombatState=true" : "";
        const response = await fetch(`/api/grunt-teams/${teamId}${queryParams}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch grunt team");
        }

        setTeam(data.team);
        if (data.individualGrunts) {
          setIndividualGrunts(data.individualGrunts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [teamId]
  );

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch campaign");
      }

      setCampaign(data.campaign);
      setUserRole(data.userRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
    fetchTeam();
  }, [fetchCampaign, fetchTeam]);

  // Fetch combat state when switching to combat tab
  useEffect(() => {
    if (activeTab === "combat" && userRole === "gm" && !individualGrunts) {
      fetchTeam(true);
    }
  }, [activeTab, userRole, individualGrunts, fetchTeam]);

  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to delete this grunt team? This action cannot be undone.")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/grunt-teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete grunt team");
      }

      router.push(`/campaigns/${campaignId}/grunt-teams`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete grunt team");
    }
  };

  const handleApplyDamage = async (
    gruntId: ID,
    damage: number,
    damageType: "physical" | "stun"
  ) => {
    try {
      const response = await fetch(`/api/grunt-teams/${teamId}/grunts/${gruntId}/damage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ damage, damageType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to apply damage");
      }

      // Refresh team data
      await fetchTeam(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to apply damage");
    }
  };

  const handleSpendEdge = async (amount: number) => {
    try {
      const response = await fetch(`/api/grunt-teams/${teamId}/spend-edge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to spend Edge");
      }

      // Refresh team data
      await fetchTeam(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to spend Edge");
    }
  };

  const handleRollInitiative = async (type: "group" | "individual") => {
    try {
      const response = await fetch(`/api/grunt-teams/${teamId}/initiative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to roll initiative");
      }

      // Refresh team data
      await fetchTeam(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to roll initiative");
    }
  };

  const handleRefresh = () => {
    fetchTeam(true);
  };

  const isGM = userRole === "gm";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error || "Grunt team not found"}</p>
          <button
            onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams`)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Grunt Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Grunt Teams
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{team.name}</h1>
              <ProfessionalRatingBadge rating={team.professionalRating} />
            </div>
            {campaign && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{campaign.title}</p>
            )}
            {team.description && (
              <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">{team.description}</p>
            )}
          </div>

          {isGM && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/campaigns/${campaignId}/grunt-teams/${teamId}/edit`)}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => {
            // Hide settings tab from players
            if (tab.id === "settings" && !isGM) return null;

            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "stats" && <GruntTeamStatsTab team={team} userRole={userRole || "player"} />}
        {activeTab === "combat" && (
          <GruntTeamCombatTrackerTab
            team={team}
            individualGrunts={individualGrunts}
            userRole={userRole || "player"}
            onApplyDamage={isGM ? handleApplyDamage : undefined}
            onSpendEdge={isGM ? handleSpendEdge : undefined}
            onRollInitiative={isGM ? handleRollInitiative : undefined}
            onRefresh={isGM ? handleRefresh : undefined}
          />
        )}
        {activeTab === "settings" && isGM && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Team Settings
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Settings configuration will be available here. Use the Edit button to modify team
              configuration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
