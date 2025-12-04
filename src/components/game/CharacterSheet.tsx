"use client";

import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@/lib/supabase/schema";

// Shadowrun character data structure
interface ShadowrunCharacterData {
  metatype: string;
  archetype: string;
  description: string;
  backstory: string;
  attributes: {
    body: number;
    agility: number;
    reaction: number;
    strength: number;
    willpower: number;
    logic: number;
    intuition: number;
    charisma: number;
    edge: number;
    magic: number;
    resonance: number;
  };
  derived: {
    initiative: number;
    composure: number;
    judgeIntentions: number;
    memory: number;
    liftCarry: number;
  };
  skills: {
    combat: Record<string, number>;
    physical: Record<string, number>;
    social: Record<string, number>;
    technical: Record<string, number>;
    magical: Record<string, number>;
    resonance: Record<string, number>;
  };
  qualities: {
    positive: Array<{ name: string; rating?: number }>;
    negative: Array<{ name: string; rating?: number }>;
  };
  gear: Array<{ name: string; category: string; rating?: number; quantity?: number }>;
  augmentations: Array<{ name: string; type: string; grade: string; essence: number }>;
  karma: { total: number; spent: number; available: number };
  nuyen: number;
  notes: string;
}

const defaultCharacterData: ShadowrunCharacterData = {
  metatype: "",
  archetype: "",
  description: "",
  backstory: "",
  attributes: {
    body: 1, agility: 1, reaction: 1, strength: 1,
    willpower: 1, logic: 1, intuition: 1, charisma: 1,
    edge: 1, magic: 0, resonance: 0,
  },
  derived: {
    initiative: 2, composure: 2, judgeIntentions: 2, memory: 2, liftCarry: 2,
  },
  skills: {
    combat: {}, physical: {}, social: {}, technical: {}, magical: {}, resonance: {},
  },
  qualities: { positive: [], negative: [] },
  gear: [],
  augmentations: [],
  karma: { total: 0, spent: 0, available: 0 },
  nuyen: 0,
  notes: "",
};

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

  // Parse character_data with defaults
  const data: ShadowrunCharacterData = {
    ...defaultCharacterData,
    ...(character.character_data as ShadowrunCharacterData),
  };

  const attributes = data.attributes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>
          {data.metatype && `${data.metatype} `}
          {data.archetype && data.archetype}
          {!data.metatype && !data.archetype && "Shadowrunner"}
          {character.player?.username && ` • Player: ${character.player.username}`}
          {character.campaign?.name && ` • ${character.campaign.name}`}
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
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "body", label: "BOD" },
                  { key: "agility", label: "AGI" },
                  { key: "reaction", label: "REA" },
                  { key: "strength", label: "STR" },
                  { key: "willpower", label: "WIL" },
                  { key: "logic", label: "LOG" },
                  { key: "intuition", label: "INT" },
                  { key: "charisma", label: "CHA" },
                ].map(({ key, label }) => (
                  <div key={key} className="text-center p-2 rounded bg-bg-muted">
                    <div className="text-xs text-muted-fg">{label}</div>
                    <div className="text-lg font-bold text-fg">
                      {attributes[key as keyof typeof attributes]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources */}
              <div className="flex gap-4 pt-2">
                <div>
                  <span className="text-sm text-muted-fg">Karma: </span>
                  <span className="font-medium text-fg">
                    {data.karma.available}/{data.karma.total}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-fg">Nuyen: </span>
                  <span className="font-medium text-fg">¥{data.nuyen.toLocaleString()}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Description</h3>
                <p className="text-sm text-muted-fg">
                  {data.description || "No description available."}
                </p>
              </div>

              {/* Created */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Created</h3>
                <p className="text-sm text-muted-fg">
                  {new Date(character.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="attributes">
            <div className="mt-4 space-y-6">
              {/* Physical */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-3">Physical</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "body", label: "Body" },
                    { key: "agility", label: "Agility" },
                    { key: "reaction", label: "Reaction" },
                    { key: "strength", label: "Strength" },
                  ].map(({ key, label }) => (
                    <div key={key} className="text-center p-3 rounded-lg border border-border bg-bg-muted">
                      <div className="text-2xl font-bold text-primary">
                        {attributes[key as keyof typeof attributes]}
                      </div>
                      <div className="text-xs text-muted-fg">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mental */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-3">Mental</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "willpower", label: "Willpower" },
                    { key: "logic", label: "Logic" },
                    { key: "intuition", label: "Intuition" },
                    { key: "charisma", label: "Charisma" },
                  ].map(({ key, label }) => (
                    <div key={key} className="text-center p-3 rounded-lg border border-border bg-bg-muted">
                      <div className="text-2xl font-bold text-secondary">
                        {attributes[key as keyof typeof attributes]}
                      </div>
                      <div className="text-xs text-muted-fg">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-3">Special</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "edge", label: "Edge" },
                    { key: "magic", label: "Magic" },
                    { key: "resonance", label: "Resonance" },
                  ].map(({ key, label }) => (
                    <div key={key} className="text-center p-3 rounded-lg border border-border bg-bg-muted">
                      <div className="text-2xl font-bold text-warning">
                        {attributes[key as keyof typeof attributes]}
                      </div>
                      <div className="text-xs text-muted-fg">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="skills">
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.entries({
                combat: "Combat",
                physical: "Physical",
                social: "Social",
                technical: "Technical",
                magical: "Magical",
                resonance: "Resonance",
              }).map(([category, label]) => {
                const skills = data.skills[category as keyof typeof data.skills];
                const skillEntries = Object.entries(skills);
                
                return (
                  <div key={category} className="rounded-lg border border-border p-3">
                    <h4 className="text-sm font-semibold text-fg mb-2">{label}</h4>
                    {skillEntries.length === 0 ? (
                      <p className="text-xs text-muted-fg">No skills</p>
                    ) : (
                      <ul className="space-y-1">
                        {skillEntries.map(([name, rating]) => (
                          <li key={name} className="flex justify-between text-sm">
                            <span className="text-fg">{name}</span>
                            <span className="font-mono text-fg">{rating}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </TabPanel>

          <TabPanel id="equipment">
            <div className="mt-4 space-y-4">
              {/* Gear */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Gear</h3>
                {data.gear.length === 0 ? (
                  <p className="text-sm text-muted-fg">No gear</p>
                ) : (
                  <ul className="space-y-1">
                    {data.gear.map((item, i) => (
                      <li key={i} className="text-sm text-fg">
                        {item.name}
                        {item.rating && ` (R${item.rating})`}
                        {item.quantity && item.quantity > 1 && ` x${item.quantity}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Augmentations */}
              <div>
                <h3 className="text-sm font-semibold text-fg mb-2">Augmentations</h3>
                {data.augmentations.length === 0 ? (
                  <p className="text-sm text-muted-fg">No augmentations</p>
                ) : (
                  <ul className="space-y-1">
                    {data.augmentations.map((aug, i) => (
                      <li key={i} className="text-sm text-fg">
                        {aug.name} ({aug.type}, {aug.grade}) - {aug.essence} Essence
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Qualities */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-2">Positive Qualities</h3>
                  {data.qualities.positive.length === 0 ? (
                    <p className="text-sm text-muted-fg">None</p>
                  ) : (
                    <ul className="space-y-1">
                      {data.qualities.positive.map((q, i) => (
                        <li key={i} className="text-sm text-fg">
                          {q.name}{q.rating && ` (${q.rating})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-danger mb-2">Negative Qualities</h3>
                  {data.qualities.negative.length === 0 ? (
                    <p className="text-sm text-muted-fg">None</p>
                  ) : (
                    <ul className="space-y-1">
                      {data.qualities.negative.map((q, i) => (
                        <li key={i} className="text-sm text-fg">
                          {q.name}{q.rating && ` (${q.rating})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="notes">
            <div className="mt-4">
              {data.notes ? (
                <p className="text-sm text-fg whitespace-pre-wrap">{data.notes}</p>
              ) : (
                <p className="text-sm text-muted-fg">No notes.</p>
              )}
              {data.backstory && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-fg mb-2">Backstory</h3>
                  <p className="text-sm text-muted-fg whitespace-pre-wrap">{data.backstory}</p>
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  );
}
