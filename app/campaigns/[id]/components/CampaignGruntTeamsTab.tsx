"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Users } from "lucide-react";
import { GruntTeamCard } from "../grunt-teams/components/GruntTeamCard";
import type { GruntTeam, ID } from "@/lib/types";

interface CampaignGruntTeamsTabProps {
  campaignId: string;
}

export default function CampaignGruntTeamsTab({ campaignId }: CampaignGruntTeamsTabProps) {
  const router = useRouter();
  const [teams, setTeams] = useState<GruntTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}/grunt-teams`);
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
  }, [campaignId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleEdit = (teamId: ID) => {
    router.push(`/campaigns/${campaignId}/grunt-teams/${teamId}/edit`);
  };

  const handleDelete = async (teamId: ID) => {
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

      fetchTeams();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete grunt team");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Grunt Teams</h3>
        <Link
          href={`/campaigns/${campaignId}/grunt-teams/create`}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create Grunt Team
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <Users className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            No grunt teams yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create a grunt team to manage NPCs for encounters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <GruntTeamCard
              key={team.id}
              team={team}
              campaignId={campaignId}
              userRole="gm"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {teams.length > 0 && (
        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Showing {teams.length} grunt team{teams.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
