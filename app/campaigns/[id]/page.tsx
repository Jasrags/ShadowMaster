"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { Campaign, Book, CreationMethod } from "@/lib/types";
import {
  ArrowLeft,
  Loader2,
  Crown,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import CampaignTabs, { type CampaignTabId } from "./components/CampaignTabs";
import CampaignOverviewTab, {
  type CampaignOverviewTabProps,
} from "./components/CampaignOverviewTab";
import CampaignCharactersTab from "./components/CampaignCharactersTab";
import CampaignNotesTab from "./components/CampaignNotesTab";
import CampaignRosterTab from "./components/CampaignRosterTab";
import CampaignPostsTab from "./components/CampaignPostsTab";
import CampaignCalendarTab from "./components/CampaignCalendarTab";
import CampaignLocationsTab from "./components/CampaignLocationsTab";
import CampaignAdvancementsTab from "./components/CampaignAdvancementsTab";

interface CampaignDetailProps {
  params: Promise<{ id: string }>;
}

const gameplayLevelLabels = {
  street: "Street Level",
  experienced: "Experienced",
  "prime-runner": "Prime Runner",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  archived: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function CampaignDetailPage({ params }: CampaignDetailProps) {
  const router = useRouter();
  const { id } = use(params);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [userRole, setUserRole] = useState<"gm" | "player" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [creationMethods, setCreationMethods] = useState<CreationMethod[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<CampaignTabId>("overview");
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        const data = await res.json();

        if (data.success) {
          setCampaign(data.campaign);
          setUserRole(data.userRole);

          // Fetch edition details for books and creation methods
          const editionRes = await fetch(`/api/editions/${data.campaign.editionCode}`);
          const editionData = await editionRes.json();
          if (editionData.success) {
            // Filter to only enabled items
            setBooks(
              editionData.books?.filter((b: Book) => data.campaign.enabledBookIds.includes(b.id)) ||
                []
            );
            setCreationMethods(
              editionData.creationMethods?.filter((m: CreationMethod) =>
                data.campaign.enabledCreationMethodIds.includes(m.id)
              ) || []
            );
          }
        } else {
          setError(data.error || "Failed to load campaign");
        }
      } catch {
        setError("An error occurred while loading the campaign");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaign();
  }, [id]);

  // Fetch pending approvals count for GMs
  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const res = await fetch(`/api/campaigns/${id}/advancements/pending`);
        const data = await res.json();
        if (data.success) {
          setPendingApprovalsCount(data.count || 0);
        }
      } catch (error) {
        // Badge will show 0 but error is logged
        console.error("Failed to fetch pending approvals count:", error);
      }
    }

    if (userRole === "gm") {
      fetchPendingCount();
    }
  }, [userRole, id]);

  // Callback for when an approval is processed
  const handleApprovalProcessed = () => {
    setPendingApprovalsCount((prev) => Math.max(0, prev - 1));
  };

  const handleLeaveCampaign = async () => {
    if (!confirm("Are you sure you want to leave this campaign?")) return;

    try {
      const res = await fetch(`/api/campaigns/${id}/leave`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        router.push("/campaigns");
      } else {
        setError(data.error || "Failed to leave campaign");
      }
    } catch {
      setError("An error occurred");
    }
  };

  const handleCopyInviteCode = () => {
    if (campaign?.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCampaignUpdate = (updatedCampaign: Campaign) => {
    setCampaign(updatedCampaign);
  };

  const handleJoinCampaign = async () => {
    setJoining(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (data.success) {
        setCampaign(data.campaign);
        setUserRole(data.userRole);
      } else {
        setError(data.error || "Failed to join campaign");
      }
    } catch {
      setError("An error occurred while joining");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error || "Campaign not found"}</p>
          <button
            onClick={() => router.push("/campaigns")}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/campaigns")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </button>

      {/* Campaign Header */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {campaign.title}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[campaign.status]}`}
              >
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              {userRole === "gm" && (
                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                  <Crown className="h-4 w-4" />
                  You are the GM
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {campaign.editionCode.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-mono">{campaign.playerIds.length}</span> players
              </span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                {gameplayLevelLabels[campaign.gameplayLevel]}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {userRole === "gm" && campaign.inviteCode && (
              <button
                onClick={handleCopyInviteCode}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {campaign.inviteCode}
                  </>
                )}
              </button>
            )}
            {userRole === "gm" && (
              <button
                onClick={() => router.push(`/campaigns/${id}/settings`)}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            )}
            {userRole === "player" && (
              <button
                onClick={handleLeaveCampaign}
                className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <LogOut className="h-4 w-4" />
                Leave
              </button>
            )}
            {userRole === null && campaign.visibility === "public" && (
              <button
                onClick={handleJoinCampaign}
                disabled={joining}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {joining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                Join Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CampaignTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <CampaignOverviewTab
            campaign={campaign}
            books={books}
            creationMethods={creationMethods}
            isGM={userRole === "gm"}
          />
        )}
        {activeTab === "posts" && (
          <CampaignPostsTab campaign={campaign} userRole={userRole || "player"} />
        )}
        {activeTab === "calendar" && (
          <CampaignCalendarTab campaign={campaign} userRole={userRole || "player"} />
        )}
        {activeTab === "characters" && (
          <CampaignCharactersTab campaign={campaign} isGM={userRole === "gm"} />
        )}
        {activeTab === "notes" && <CampaignNotesTab campaign={campaign} isGM={userRole === "gm"} />}
        {activeTab === "locations" && (
          <CampaignLocationsTab campaign={campaign} userRole={userRole || "player"} />
        )}
        {activeTab === "roster" && userRole === "gm" && (
          <CampaignRosterTab campaign={campaign} onCampaignUpdate={handleCampaignUpdate} />
        )}
        {activeTab === "approvals" && userRole === "gm" && (
          <CampaignAdvancementsTab
            campaign={campaign}
            onApprovalProcessed={handleApprovalProcessed}
          />
        )}
      </div>
    </div>
  );
}
