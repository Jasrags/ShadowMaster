"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, Search, Filter, LayoutGrid, List, Users } from "lucide-react";
import { GruntTeamCard } from "./components/GruntTeamCard";
import type { GruntTeam, ProfessionalRating, Campaign } from "@/lib/types";

const PROFESSIONAL_RATINGS: { value: ProfessionalRating | "all"; label: string }[] = [
  { value: "all", label: "All Ratings" },
  { value: 0, label: "PR 0 - Untrained" },
  { value: 1, label: "PR 1 - Green" },
  { value: 2, label: "PR 2 - Regular" },
  { value: 3, label: "PR 3 - Seasoned" },
  { value: 4, label: "PR 4 - Veteran" },
  { value: 5, label: "PR 5 - Elite" },
  { value: 6, label: "PR 6 - Prime" },
];

export default function GruntTeamsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [teams, setTeams] = useState<GruntTeam[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [userRole, setUserRole] = useState<"gm" | "player" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [prFilter, setPrFilter] = useState<ProfessionalRating | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const queryParams = new URLSearchParams();
      if (prFilter !== "all") {
        queryParams.set("professionalRating", prFilter.toString());
      }
      if (searchQuery) {
        queryParams.set("search", searchQuery);
      }

      const queryString = queryParams.toString();
      const url = `/api/campaigns/${campaignId}/grunt-teams${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch grunt teams");
      }

      setTeams(data.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [campaignId, prFilter, searchQuery]);

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
  }, [fetchCampaign]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleDelete = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this grunt team?")) {
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

      // Refresh teams
      fetchTeams();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete grunt team");
    }
  };

  const handleEdit = (teamId: string) => {
    router.push(`/campaigns/${campaignId}/grunt-teams/${teamId}/edit`);
  };

  const isGM = userRole === "gm";

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => router.push(`/campaigns/${campaignId}`)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/campaigns/${campaignId}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaign
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Grunt Teams</h1>
          {campaign && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{campaign.title}</p>
          )}
        </div>
        {isGM && (
          <Link
            href={`/campaigns/${campaignId}/grunt-teams/create`}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Create Grunt Team
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search grunt teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-2">
          {/* PR Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={prFilter}
              onChange={(e) =>
                setPrFilter(
                  e.target.value === "all"
                    ? "all"
                    : (parseInt(e.target.value, 10) as ProfessionalRating)
                )
              }
              className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-8 text-sm text-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {PROFESSIONAL_RATINGS.map((pr) => (
                <option key={pr.value} value={pr.value}>
                  {pr.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 ${
                viewMode === "grid"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 ${
                viewMode === "list"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <Users className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            No grunt teams found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {searchQuery || prFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating a new grunt team"}
          </p>
          {isGM && (
            <div className="mt-6">
              <Link
                href={`/campaigns/${campaignId}/grunt-teams/create`}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Create Grunt Team
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div
          className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}
        >
          {teams.map((team) => (
            <GruntTeamCard
              key={team.id}
              team={team}
              campaignId={campaignId}
              userRole={userRole || "player"}
              onEdit={isGM ? handleEdit : undefined}
              onDelete={isGM ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {teams.length > 0 && (
        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Showing {teams.length} grunt team{teams.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
