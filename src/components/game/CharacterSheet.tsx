"use client";

import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@/lib/supabase/schema";

interface CharacterSheetProps {
  character: Character & {
    player?: {
      id: string;
      username: string;
      avatar_url: string | null;
    };
    campaign?: {
      id: string;
      name: string;
    };
  };
  isLoading?: boolean;
  error?: string | null;
}

export function CharacterSheet({ character, isLoading = false, error = null }: CharacterSheetProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
            <p className="text-danger font-medium">Error loading character</p>
            <p className="text-sm text-muted-fg mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-1/3 bg-bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-bg-muted rounded mt-2 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full bg-bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const metadata = character.metadata as Record<string, any> | null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>
          {character.player?.username && `Player: ${character.player.username}`}
          {character.campaign?.name && ` • Campaign: ${character.campaign.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          orientation="horizontal"
        >
          <TabList>
            <Tab id="overview">Overview</Tab>
            <Tab id="attributes">Attributes</Tab>
            <Tab id="skills">Skills</Tab>
            <Tab id="equipment">Equipment</Tab>
            <Tab id="notes">Notes</Tab>
          </TabList>

          <TabPanel id="overview">
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Character Type</h3>
                <p className="text-sm text-muted-fg">
                  {metadata?.type || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Description</h3>
                <p className="text-sm text-muted-fg">
                  {metadata?.description || "No description available."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Created</h3>
                <p className="text-sm text-muted-fg">
                  {new Date(character.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="attributes">
            <div className="mt-4">
              <p className="text-sm text-muted-fg">
                Attributes will be displayed here. Character data structure to be implemented.
              </p>
            </div>
          </TabPanel>

          <TabPanel id="skills">
            <div className="mt-4">
              <p className="text-sm text-muted-fg">
                Skills will be displayed here. Character data structure to be implemented.
              </p>
            </div>
          </TabPanel>

          <TabPanel id="equipment">
            <div className="mt-4">
              <p className="text-sm text-muted-fg">
                Equipment will be displayed here. Character data structure to be implemented.
              </p>
            </div>
          </TabPanel>

          <TabPanel id="notes">
            <div className="mt-4">
              <p className="text-sm text-muted-fg">
                Notes will be displayed here. Character data structure to be implemented.
              </p>
            </div>
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  );
}

