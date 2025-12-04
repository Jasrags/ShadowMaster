"use client";

import { useState, useTransition } from "react";
import { Input } from "react-aria-components";
import { Button } from "@/components/ui/button";
import {
  invitePlayerToCampaign,
  removePlayerFromCampaign,
} from "../../../actions";
import type { CampaignPlayer, UserProfile } from "@/lib/supabase/schema";

interface PlayerManagementProps {
  campaignId: string;
  players: (CampaignPlayer & { user: UserProfile | null })[];
}

export function PlayerManagement({
  campaignId,
  players,
}: PlayerManagementProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInvite = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await invitePlayerToCampaign(campaignId, username.trim());

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`Player "${username}" has been added to the campaign`);
      setUsername("");
    });
  };

  const handleRemove = (userId: string, playerUsername: string) => {
    if (!confirm(`Are you sure you want to remove ${playerUsername} from the campaign?`)) {
      return;
    }

    startTransition(async () => {
      const result = await removePlayerFromCampaign(campaignId, userId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(`Player "${playerUsername}" has been removed from the campaign`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Invite Player */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-fg">Invite Player</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInvite();
              }
            }}
          />
          <Button
            intent="primary"
            onPress={handleInvite}
            isDisabled={isPending}
          >
            {isPending ? "Adding..." : "Add Player"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="text-sm text-primary">{success}</p>
        )}
      </div>

      {/* Players List */}
      <div>
        <h3 className="text-sm font-medium text-fg mb-3">Current Players</h3>
        {players.length === 0 ? (
          <p className="text-sm text-muted-fg">No players in this campaign yet.</p>
        ) : (
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.user_id}
                className="flex items-center justify-between rounded-lg border border-border bg-bg-muted p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {player.user?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-fg font-medium">
                      {player.user?.username || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-fg">
                      Joined {new Date(player.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      player.role === "gamemaster"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary/20 text-secondary"
                    }`}
                  >
                    {player.role === "gamemaster" ? "GM" : "Player"}
                  </span>
                  {player.role !== "gamemaster" && (
                    <Button
                      intent="danger"
                      size="xs"
                      onPress={() =>
                        handleRemove(
                          player.user_id,
                          player.user?.username || "Unknown"
                        )
                      }
                      isDisabled={isPending}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

