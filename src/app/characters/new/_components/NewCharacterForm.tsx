"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Form, Input as InputPrimitive, TextArea } from "react-aria-components";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldError, FieldGroup } from "@/components/ui/field";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { createCharacter } from "../../actions";
import {
  defaultShadowrunCharacterData,
  type ShadowrunCharacterData,
} from "../../types";

interface NewCharacterFormProps {
  campaigns: Array<{ id: string; name: string }>;
  preselectedCampaignId?: string;
}

const METATYPES = ["Human", "Elf", "Dwarf", "Ork", "Troll"];
const ARCHETYPES = [
  "Street Samurai",
  "Decker",
  "Rigger",
  "Mage",
  "Shaman",
  "Adept",
  "Technomancer",
  "Face",
  "Infiltrator",
  "Combat Medic",
];

export function NewCharacterForm({
  campaigns,
  preselectedCampaignId,
}: NewCharacterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    name: "",
    campaignId: preselectedCampaignId || "",
    characterData: { ...defaultShadowrunCharacterData },
  });

  const updateCharacterData = (
    updates: Partial<ShadowrunCharacterData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      characterData: { ...prev.characterData, ...updates },
    }));
  };

  const updateAttribute = (attr: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      characterData: {
        ...prev.characterData,
        attributes: {
          ...prev.characterData.attributes,
          [attr]: Math.max(1, Math.min(6, value)),
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Character name is required");
      return;
    }

    if (!formData.campaignId) {
      setError("Please select a campaign");
      return;
    }

    const submitData = new FormData();
    submitData.set("name", formData.name.trim());
    submitData.set("campaign_id", formData.campaignId);
    submitData.set("character_data", JSON.stringify(formData.characterData));

    startTransition(async () => {
      const result = await createCharacter(submitData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/characters/${result.data.id}`);
    });
  };

  const inputClass =
    "w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20";

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-danger/50 bg-danger/10 p-4">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        orientation="horizontal"
      >
        <TabList>
          <Tab id="basic">Basic Info</Tab>
          <Tab id="attributes">Attributes</Tab>
          <Tab id="skills">Skills</Tab>
          <Tab id="extras">Qualities & Gear</Tab>
        </TabList>

        {/* Basic Info Tab */}
        <TabPanel id="basic">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            <FieldGroup>
              {/* Campaign Selection */}
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <select
                  id="campaign"
                  value={formData.campaignId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, campaignId: e.target.value }))
                  }
                  className={inputClass}
                  required
                >
                  <option value="">Select a campaign...</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
                <Description>Choose the campaign for this character</Description>
              </div>

              {/* Character Name */}
              <TextField
                name="name"
                isRequired
                value={formData.name}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
              >
                <Label>Character Name</Label>
                <InputPrimitive className={inputClass} />
                <Description>Your character&apos;s street name or alias</Description>
                <FieldError />
              </TextField>

              {/* Metatype */}
              <div className="space-y-2">
                <Label htmlFor="metatype">Metatype</Label>
                <select
                  id="metatype"
                  value={formData.characterData.metatype}
                  onChange={(e) => updateCharacterData({ metatype: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select metatype...</option>
                  {METATYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <Description>Your character&apos;s species</Description>
              </div>

              {/* Archetype */}
              <div className="space-y-2">
                <Label htmlFor="archetype">Archetype</Label>
                <select
                  id="archetype"
                  value={formData.characterData.archetype}
                  onChange={(e) => updateCharacterData({ archetype: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select archetype...</option>
                  {ARCHETYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <Description>Your character&apos;s primary role</Description>
              </div>

              {/* Description */}
              <TextField
                name="description"
                value={formData.characterData.description}
                onChange={(value) => updateCharacterData({ description: value })}
              >
                <Label>Description</Label>
                <TextArea
                  className={`${inputClass} min-h-[100px]`}
                  placeholder="Physical appearance, personality, etc."
                />
                <Description>A brief description of your character</Description>
              </TextField>

              {/* Backstory */}
              <TextField
                name="backstory"
                value={formData.characterData.backstory}
                onChange={(value) => updateCharacterData({ backstory: value })}
              >
                <Label>Backstory</Label>
                <TextArea
                  className={`${inputClass} min-h-[150px]`}
                  placeholder="Your character's history and motivations..."
                />
                <Description>Your character&apos;s background story</Description>
              </TextField>
            </FieldGroup>
          </div>
        </TabPanel>

        {/* Attributes Tab */}
        <TabPanel id="attributes">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6">
            <h3 className="font-semibold text-fg mb-4">Physical Attributes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { key: "body", label: "Body", desc: "Physical resilience" },
                { key: "agility", label: "Agility", desc: "Physical dexterity" },
                { key: "reaction", label: "Reaction", desc: "Quick responses" },
                { key: "strength", label: "Strength", desc: "Physical power" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm">{label}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          formData.characterData.attributes[
                            key as keyof typeof formData.characterData.attributes
                          ] - 1
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-mono text-lg text-fg">
                      {
                        formData.characterData.attributes[
                          key as keyof typeof formData.characterData.attributes
                        ]
                      }
                    </span>
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          formData.characterData.attributes[
                            key as keyof typeof formData.characterData.attributes
                          ] + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-muted-fg">{desc}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-fg mb-4">Mental Attributes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { key: "willpower", label: "Willpower", desc: "Mental fortitude" },
                { key: "logic", label: "Logic", desc: "Reasoning ability" },
                { key: "intuition", label: "Intuition", desc: "Gut instinct" },
                { key: "charisma", label: "Charisma", desc: "Social influence" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm">{label}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          formData.characterData.attributes[
                            key as keyof typeof formData.characterData.attributes
                          ] - 1
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-mono text-lg text-fg">
                      {
                        formData.characterData.attributes[
                          key as keyof typeof formData.characterData.attributes
                        ]
                      }
                    </span>
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          formData.characterData.attributes[
                            key as keyof typeof formData.characterData.attributes
                          ] + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-muted-fg">{desc}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-fg mb-4">Special Attributes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "edge", label: "Edge", desc: "Luck and karma" },
                { key: "magic", label: "Magic", desc: "Magical ability (0 if mundane)" },
                { key: "resonance", label: "Resonance", desc: "Technomancer ability (0 if not)" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm">{label}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          Math.max(
                            0,
                            formData.characterData.attributes[
                              key as keyof typeof formData.characterData.attributes
                            ] - 1
                          )
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-mono text-lg text-fg">
                      {
                        formData.characterData.attributes[
                          key as keyof typeof formData.characterData.attributes
                        ]
                      }
                    </span>
                    <Button
                      type="button"
                      intent="outline"
                      size="xs"
                      onPress={() =>
                        updateAttribute(
                          key,
                          formData.characterData.attributes[
                            key as keyof typeof formData.characterData.attributes
                          ] + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-muted-fg">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel id="skills">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6">
            <p className="text-muted-fg">
              Skills can be configured after character creation. Focus on the basics first!
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.entries({
                combat: "Combat Skills",
                physical: "Physical Skills",
                social: "Social Skills",
                technical: "Technical Skills",
                magical: "Magical Skills",
                resonance: "Resonance Skills",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-bg-muted p-4"
                >
                  <h4 className="font-medium text-fg">{label}</h4>
                  <p className="text-sm text-muted-fg mt-1">
                    Configure in character edit page
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* Qualities & Gear Tab */}
        <TabPanel id="extras">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            {/* Nuyen */}
            <div className="space-y-2">
              <Label htmlFor="nuyen">Starting Nuyen</Label>
              <InputPrimitive
                id="nuyen"
                type="number"
                min="0"
                value={formData.characterData.nuyen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCharacterData({ nuyen: parseInt(e.target.value) || 0 })
                }
                className={inputClass}
              />
              <Description>Your character&apos;s starting funds</Description>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-muted-fg">
                Qualities, gear, cyberware, and other equipment can be added after
                character creation through the edit page.
              </p>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          intent="outline"
          onPress={() => router.push("/characters")}
          isDisabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" intent="primary" isDisabled={isPending}>
          {isPending ? "Creating..." : "Create Character"}
        </Button>
      </div>
    </Form>
  );
}

