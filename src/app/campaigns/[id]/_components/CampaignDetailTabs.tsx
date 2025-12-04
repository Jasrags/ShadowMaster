"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Campaign, Character, Session as GameSession, Map, CampaignPlayer, UserProfile } from "@/lib/supabase/schema";

interface CampaignDetailTabsProps {
  campaign: Campaign & {
    gm_user: UserProfile | null;
    campaign_players: (CampaignPlayer & { user: UserProfile | null })[];
    characters: Character[];
    sessions: GameSession[];
    maps: Map[];
  };
  isGM: boolean;
}

export function CampaignDetailTabs({ campaign, isGM }: CampaignDetailTabsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const characters = campaign.characters || [];
  const sessions = campaign.sessions || [];
  const maps = campaign.maps || [];
  const players = campaign.campaign_players || [];

  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as string)}
      orientation="horizontal"
    >
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="characters">Characters ({characters.length})</Tab>
        <Tab id="sessions">Sessions ({sessions.length})</Tab>
        <Tab id="maps">Maps ({maps.length})</Tab>
        {isGM && <Tab id="settings">Settings</Tab>}
      </TabList>

      <TabPanel id="overview">
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Campaign Info */}
          <div className="rounded-lg border border-border bg-bg p-4">
            <h3 className="font-semibold text-fg mb-3">Campaign Info</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-fg">Status</dt>
                <dd className="text-fg">
                  {campaign.is_active ? "Active" : "Inactive"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-fg">Setting</dt>
                <dd className="text-fg">{campaign.setting || "Not specified"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-fg">Created</dt>
                <dd className="text-fg">
                  {new Date(campaign.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-fg">Last Updated</dt>
                <dd className="text-fg">
                  {new Date(campaign.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Players */}
          <div className="rounded-lg border border-border bg-bg p-4">
            <h3 className="font-semibold text-fg mb-3">
              Players ({players.length})
            </h3>
            {players.length === 0 ? (
              <p className="text-sm text-muted-fg">No players yet</p>
            ) : (
              <ul className="space-y-2">
                {players.map((player) => (
                  <li
                    key={player.user_id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-fg">
                      {player.user?.username || "Unknown"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        player.role === "gamemaster"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {player.role === "gamemaster" ? "GM" : "Player"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Characters */}
          <div className="rounded-lg border border-border bg-bg p-4">
            <h3 className="font-semibold text-fg mb-3">Recent Characters</h3>
            {characters.length === 0 ? (
              <p className="text-sm text-muted-fg">No characters yet</p>
            ) : (
              <ul className="space-y-2">
                {characters.slice(0, 5).map((character) => (
                  <li key={character.id}>
                    <Link
                      href={`/characters/${character.id}`}
                      className="text-fg hover:text-primary transition-colors"
                    >
                      {character.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {characters.length > 5 && (
              <p className="text-sm text-muted-fg mt-2">
                +{characters.length - 5} more
              </p>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="rounded-lg border border-border bg-bg p-4">
            <h3 className="font-semibold text-fg mb-3">Recent Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-fg">No sessions yet</p>
            ) : (
              <ul className="space-y-2">
                {sessions.slice(0, 5).map((session) => (
                  <li
                    key={session.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-fg">
                      {session.name || `Session ${session.id.slice(0, 8)}`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        session.status === "active"
                          ? "bg-primary/20 text-primary"
                          : session.status === "completed"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {session.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </TabPanel>

      <TabPanel id="characters">
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-fg">Campaign Characters</h3>
            <Link href={`/characters/new?campaign=${campaign.id}`}>
              <Button intent="primary" size="sm">
                Create Character
              </Button>
            </Link>
          </div>

          {characters.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg-muted p-8 text-center">
              <p className="text-muted-fg">No characters in this campaign yet.</p>
              <Link href={`/characters/new?campaign=${campaign.id}`}>
                <Button intent="primary" className="mt-4">
                  Create Your Character
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <Link
                  key={character.id}
                  href={`/characters/${character.id}`}
                  className="rounded-lg border border-border bg-bg p-4 hover:border-primary/50 transition-colors"
                >
                  <h4 className="font-medium text-fg">{character.name}</h4>
                  <p className="text-sm text-muted-fg mt-1">
                    {(character.character_data as any)?.archetype || "No archetype"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </TabPanel>

      <TabPanel id="sessions">
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-fg">Game Sessions</h3>
            {isGM && (
              <Button intent="primary" size="sm">
                Schedule Session
              </Button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg-muted p-8 text-center">
              <p className="text-muted-fg">No sessions scheduled yet.</p>
              {isGM && (
                <Button intent="primary" className="mt-4">
                  Schedule First Session
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-border bg-bg p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-fg">
                      {session.name || `Session ${session.id.slice(0, 8)}`}
                    </h4>
                    {session.scheduled_date && (
                      <p className="text-sm text-muted-fg">
                        {new Date(session.scheduled_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      session.status === "active"
                        ? "bg-primary/20 text-primary"
                        : session.status === "completed"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabPanel>

      <TabPanel id="maps">
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-fg">Campaign Maps</h3>
            {isGM && (
              <Button intent="primary" size="sm">
                Upload Map
              </Button>
            )}
          </div>

          {maps.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg-muted p-8 text-center">
              <p className="text-muted-fg">No maps added yet.</p>
              {isGM && (
                <Button intent="primary" className="mt-4">
                  Upload First Map
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {maps.map((map) => (
                <div
                  key={map.id}
                  className="rounded-lg border border-border bg-bg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-fg">{map.name}</h4>
                  {map.width && map.height && (
                    <p className="text-sm text-muted-fg mt-1">
                      {map.width}x{map.height}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </TabPanel>

      {isGM && (
        <TabPanel id="settings">
          <div className="mt-6 space-y-6">
            {/* Campaign Settings */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <h3 className="font-semibold text-fg mb-4">Campaign Settings</h3>
              <div className="space-y-4">
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Button intent="outline" className="w-full justify-start">
                    Edit Campaign Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Player Management */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <h3 className="font-semibold text-fg mb-4">Player Management</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-fg">
                  Manage your campaign players and invite new ones.
                </p>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Button intent="primary">Manage Players</Button>
                </Link>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-danger/50 bg-danger/5 p-4">
              <h3 className="font-semibold text-danger mb-4">Danger Zone</h3>
              <p className="text-sm text-muted-fg mb-4">
                Deleting a campaign is permanent and cannot be undone.
              </p>
              <Button intent="danger">Delete Campaign</Button>
            </div>
          </div>
        </TabPanel>
      )}
    </Tabs>
  );
}

