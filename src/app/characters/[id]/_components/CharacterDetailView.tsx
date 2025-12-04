"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@/lib/supabase/schema";
import {
  defaultShadowrunCharacterData,
  type ShadowrunCharacterData,
} from "../../types";

interface CharacterDetailViewProps {
  character: Character & {
    player?: { id: string; username: string; avatar_url: string | null } | null;
    campaign?: { id: string; name: string } | null;
  };
  canEdit: boolean;
}

export function CharacterDetailView({
  character,
  canEdit,
}: CharacterDetailViewProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  // Parse character data with defaults
  const data: ShadowrunCharacterData = {
    ...defaultShadowrunCharacterData,
    ...(character.character_data as ShadowrunCharacterData),
  };

  const attributes = data.attributes;

  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as string)}
      orientation="horizontal"
    >
      <TabList className="print:hidden">
        <Tab id="overview">Overview</Tab>
        <Tab id="attributes">Attributes</Tab>
        <Tab id="skills">Skills</Tab>
        <Tab id="gear">Gear</Tab>
        <Tab id="magic">Magic/Resonance</Tab>
        <Tab id="notes">Notes</Tab>
      </TabList>

      {/* Overview Tab */}
      <TabPanel id="overview">
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-fg">Metatype</dt>
                  <dd className="text-fg font-medium">
                    {data.metatype || "Not specified"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-fg">Archetype</dt>
                  <dd className="text-fg font-medium">
                    {data.archetype || "Not specified"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-fg">Nuyen</dt>
                  <dd className="text-fg font-medium">
                    ¥{data.nuyen.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-fg">Karma</dt>
                  <dd className="text-fg font-medium">
                    {data.karma.available} / {data.karma.total}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Quick Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Core Attributes</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <div
                    key={key}
                    className="text-center p-2 rounded bg-bg-muted"
                  >
                    <div className="text-xs text-muted-fg">{label}</div>
                    <div className="text-lg font-bold text-fg">
                      {attributes[key as keyof typeof attributes]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fg whitespace-pre-wrap">
                {data.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Backstory */}
          {data.backstory && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Backstory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fg whitespace-pre-wrap">{data.backstory}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabPanel>

      {/* Attributes Tab */}
      <TabPanel id="attributes">
        <div className="mt-6 space-y-6">
          {/* Physical Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "body", label: "Body", desc: "Physical resilience and health" },
                  { key: "agility", label: "Agility", desc: "Coordination and dexterity" },
                  { key: "reaction", label: "Reaction", desc: "Speed and reflexes" },
                  { key: "strength", label: "Strength", desc: "Raw physical power" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-border bg-bg-muted text-center"
                  >
                    <div className="text-3xl font-bold text-primary">
                      {attributes[key as keyof typeof attributes]}
                    </div>
                    <div className="font-medium text-fg mt-1">{label}</div>
                    <div className="text-xs text-muted-fg mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mental Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Mental Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "willpower", label: "Willpower", desc: "Mental fortitude" },
                  { key: "logic", label: "Logic", desc: "Analytical reasoning" },
                  { key: "intuition", label: "Intuition", desc: "Gut instincts" },
                  { key: "charisma", label: "Charisma", desc: "Social influence" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-border bg-bg-muted text-center"
                  >
                    <div className="text-3xl font-bold text-secondary">
                      {attributes[key as keyof typeof attributes]}
                    </div>
                    <div className="font-medium text-fg mt-1">{label}</div>
                    <div className="text-xs text-muted-fg mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Special Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "edge", label: "Edge", desc: "Luck and fate" },
                  { key: "magic", label: "Magic", desc: "Magical ability" },
                  { key: "resonance", label: "Resonance", desc: "Technomancer ability" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-border bg-bg-muted text-center"
                  >
                    <div className="text-3xl font-bold text-warning">
                      {attributes[key as keyof typeof attributes]}
                    </div>
                    <div className="font-medium text-fg mt-1">{label}</div>
                    <div className="text-xs text-muted-fg mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Derived Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Derived Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { key: "initiative", label: "Initiative", formula: "REA + INT" },
                  { key: "composure", label: "Composure", formula: "WIL + CHA" },
                  { key: "judgeIntentions", label: "Judge Intentions", formula: "INT + CHA" },
                  { key: "memory", label: "Memory", formula: "LOG + WIL" },
                  { key: "liftCarry", label: "Lift/Carry", formula: "BOD + STR" },
                ].map(({ key, label, formula }) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-border bg-bg text-center"
                  >
                    <div className="text-2xl font-bold text-fg">
                      {data.derived[key as keyof typeof data.derived]}
                    </div>
                    <div className="text-sm font-medium text-fg">{label}</div>
                    <div className="text-xs text-muted-fg">{formula}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabPanel>

      {/* Skills Tab */}
      <TabPanel id="skills">
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries({
            combat: { title: "Combat Skills", color: "text-danger" },
            physical: { title: "Physical Skills", color: "text-primary" },
            social: { title: "Social Skills", color: "text-secondary" },
            technical: { title: "Technical Skills", color: "text-warning" },
            magical: { title: "Magical Skills", color: "text-primary" },
            resonance: { title: "Resonance Skills", color: "text-secondary" },
          }).map(([category, { title, color }]) => {
            const skills = data.skills[category as keyof typeof data.skills];
            const skillEntries = Object.entries(skills);

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className={color}>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {skillEntries.length === 0 ? (
                    <p className="text-sm text-muted-fg">No skills configured</p>
                  ) : (
                    <ul className="space-y-2">
                      {skillEntries.map(([name, rating]) => (
                        <li
                          key={name}
                          className="flex justify-between items-center"
                        >
                          <span className="text-fg">{name}</span>
                          <span className="font-mono font-bold text-fg">
                            {rating}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {canEdit && (
          <div className="mt-6 text-center">
            <Link
              href={`/characters/${character.id}/edit`}
              className="text-primary hover:underline"
            >
              Edit skills in character editor
            </Link>
          </div>
        )}
      </TabPanel>

      {/* Gear Tab */}
      <TabPanel id="gear">
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Gear</CardTitle>
            </CardHeader>
            <CardContent>
              {data.gear.length === 0 ? (
                <p className="text-muted-fg">No gear configured</p>
              ) : (
                <ul className="space-y-2">
                  {data.gear.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 rounded bg-bg-muted"
                    >
                      <div>
                        <span className="text-fg font-medium">{item.name}</span>
                        {item.rating && (
                          <span className="text-muted-fg ml-2">
                            Rating {item.rating}
                          </span>
                        )}
                      </div>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-muted-fg">x{item.quantity}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Augmentations */}
          <Card>
            <CardHeader>
              <CardTitle>Cyberware & Bioware</CardTitle>
            </CardHeader>
            <CardContent>
              {data.augmentations.length === 0 ? (
                <p className="text-muted-fg">No augmentations installed</p>
              ) : (
                <ul className="space-y-2">
                  {data.augmentations.map((aug, index) => (
                    <li
                      key={index}
                      className="p-2 rounded bg-bg-muted"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-fg font-medium">{aug.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            aug.type === "cyberware"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {aug.type}
                        </span>
                      </div>
                      <div className="text-sm text-muted-fg mt-1">
                        {aug.grade} • Essence: {aug.essence}
                        {aug.rating && ` • Rating ${aug.rating}`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Qualities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Positive Qualities</CardTitle>
            </CardHeader>
            <CardContent>
              {data.qualities.positive.length === 0 ? (
                <p className="text-muted-fg">No positive qualities</p>
              ) : (
                <ul className="space-y-1">
                  {data.qualities.positive.map((q, index) => (
                    <li key={index} className="text-fg">
                      {q.name}
                      {q.rating && ` (${q.rating})`}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-danger">Negative Qualities</CardTitle>
            </CardHeader>
            <CardContent>
              {data.qualities.negative.length === 0 ? (
                <p className="text-muted-fg">No negative qualities</p>
              ) : (
                <ul className="space-y-1">
                  {data.qualities.negative.map((q, index) => (
                    <li key={index} className="text-fg">
                      {q.name}
                      {q.rating && ` (${q.rating})`}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </TabPanel>

      {/* Magic/Resonance Tab */}
      <TabPanel id="magic">
        <div className="mt-6">
          {attributes.magic === 0 && attributes.resonance === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-fg">
                  This character has no magical or technomancer abilities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {attributes.magic > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Magical Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary">
                        {attributes.magic}
                      </div>
                      <div className="text-muted-fg">Magic Rating</div>
                    </div>
                    <p className="text-sm text-muted-fg">
                      Spells, spirits, and magical abilities can be configured in
                      the character editor.
                    </p>
                  </CardContent>
                </Card>
              )}
              {attributes.resonance > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technomancer Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-secondary">
                        {attributes.resonance}
                      </div>
                      <div className="text-muted-fg">Resonance Rating</div>
                    </div>
                    <p className="text-sm text-muted-fg">
                      Complex forms and sprites can be configured in the character
                      editor.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </TabPanel>

      {/* Notes Tab */}
      <TabPanel id="notes">
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Character Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {data.notes ? (
                <p className="text-fg whitespace-pre-wrap">{data.notes}</p>
              ) : (
                <p className="text-muted-fg">No notes yet.</p>
              )}
              {canEdit && (
                <Link
                  href={`/characters/${character.id}/edit`}
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  Edit notes
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </TabPanel>
    </Tabs>
  );
}

