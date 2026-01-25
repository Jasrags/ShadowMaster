"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@/lib/types";
import CampaignCard from "./CampaignCard";
import JoinCampaignDialog from "./JoinCampaignDialog";
import { Plus, Key, Loader2, Globe } from "lucide-react";

export default function CampaignList() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Fetch campaigns
  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (roleFilter !== "all") params.set("role", roleFilter);

        const res = await fetch(`/api/campaigns?${params}`);
        const data = await res.json();

        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          setError(data.error || "Failed to load campaigns");
        }
      } catch {
        setError("An error occurred while loading campaigns");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [statusFilter, roleFilter]);

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleCreateCampaign = () => {
    router.push("/campaigns/create");
  };

  const handleJoinSuccess = () => {
    setShowJoinDialog(false);
    // Refresh campaigns
    window.location.reload();
  };

  // Determine user role for each campaign
  const getUserRole = (campaign: Campaign): "gm" | "player" => {
    return campaign.gmId ? "gm" : "player";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="all">All Campaigns</option>
            <option value="gm">As GM</option>
            <option value="player">As Player</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinDialog(true)}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Key className="h-4 w-4" />
            Join with Code
          </button>
          <button
            onClick={() => router.push("/campaigns/discover")}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Globe className="h-4 w-4" />
            Browse Broker
          </button>
          <button
            onClick={handleCreateCampaign}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Campaign Grid */}
      {campaigns.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No campaigns yet</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create a new campaign or join one with an invite code.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowJoinDialog(true)}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <Key className="h-4 w-4" />
              Join with Code
            </button>
            <button
              onClick={handleCreateCampaign}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              userRole={getUserRole(campaign)}
              onView={handleViewCampaign}
            />
          ))}
        </div>
      )}

      {/* Join Dialog */}
      <JoinCampaignDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
}
