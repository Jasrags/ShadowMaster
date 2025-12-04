"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Form, Input as InputPrimitive, TextArea } from "react-aria-components";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldGroup } from "@/components/ui/field";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import {
  updateCharacterAction,
  updateCharacterData,
} from "../../../actions";
import type { Character } from "@/lib/supabase/schema";
import {
  defaultShadowrunCharacterData,
  type ShadowrunCharacterData,
} from "../../../types";

interface EditCharacterFormProps {
  character: Character;
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

const SKILL_CATEGORIES = {
  combat: ["Firearms", "Close Combat", "Throwing Weapons", "Archery"],
  physical: ["Athletics", "Stealth", "Perception", "Survival", "Piloting"],
  social: ["Con", "Influence", "Etiquette", "Intimidation", "Negotiation"],
  technical: ["Biotech", "Electronics", "Engineering", "Cracking", "Tasking"],
  magical: ["Astral", "Conjuring", "Enchanting", "Sorcery"],
  resonance: ["Compiling", "Decompiling", "Registering", "Software"],
};

export function EditCharacterForm({ character }: EditCharacterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form data
  const initialData: ShadowrunCharacterData = {
    ...defaultShadowrunCharacterData,
    ...(character.character_data as ShadowrunCharacterData),
  };

  const [formData, setFormData] = useState({
    name: character.name,
    characterData: initialData,
  });

  // Auto-save timeout ref
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-save function
  const autoSave = useCallback(
    async (data: Partial<ShadowrunCharacterData>) => {
      setSaveStatus("saving");
      const result = await updateCharacterData(character.id, data);
      if (result.success) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("unsaved");
        setError(result.error);
      }
    },
    [character.id]
  );

  // Debounced auto-save
  const debouncedAutoSave = useCallback(
    (data: Partial<ShadowrunCharacterData>) => {
      setSaveStatus("unsaved");
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      autoSaveTimeout.current = setTimeout(() => {
        autoSave(data);
      }, 1500);
    },
    [autoSave]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  const updateField = (
    updates: Partial<ShadowrunCharacterData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      characterData: { ...prev.characterData, ...updates },
    }));
    debouncedAutoSave(updates);
  };

  const updateAttribute = (attr: string, value: number) => {
    const newAttributes = {
      ...formData.characterData.attributes,
      [attr]: Math.max(attr === "magic" || attr === "resonance" ? 0 : 1, Math.min(6, value)),
    };
    setFormData((prev) => ({
      ...prev,
      characterData: {
        ...prev.characterData,
        attributes: newAttributes,
      },
    }));
    debouncedAutoSave({ attributes: newAttributes });
  };

  const updateSkill = (category: string, skill: string, value: number) => {
    const newSkills = {
      ...formData.characterData.skills,
      [category]: {
        ...formData.characterData.skills[category as keyof typeof formData.characterData.skills],
        [skill]: Math.max(0, Math.min(6, value)),
      },
    };
    setFormData((prev) => ({
      ...prev,
      characterData: {
        ...prev.characterData,
        skills: newSkills,
      },
    }));
    debouncedAutoSave({ skills: newSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Character name is required");
      return;
    }

    const submitData = new FormData();
    submitData.set("name", formData.name.trim());
    submitData.set("character_data", JSON.stringify(formData.characterData));

    startTransition(async () => {
      const result = await updateCharacterAction(character.id, submitData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/characters/${character.id}`);
    });
  };

  const inputClass =
    "w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20";

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {/* Save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              saveStatus === "saved"
                ? "bg-primary"
                : saveStatus === "saving"
                ? "bg-warning animate-pulse"
                : "bg-danger"
            }`}
          />
          <span className="text-sm text-muted-fg">
            {saveStatus === "saved"
              ? "All changes saved"
              : saveStatus === "saving"
              ? "Saving..."
              : "Unsaved changes"}
          </span>
        </div>
      </div>

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
          <Tab id="karma">Karma</Tab>
        </TabList>

        {/* Basic Info Tab */}
        <TabPanel id="basic">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            <FieldGroup>
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
              </TextField>

              <div className="space-y-2">
                <Label htmlFor="metatype">Metatype</Label>
                <select
                  id="metatype"
                  value={formData.characterData.metatype}
                  onChange={(e) => updateField({ metatype: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select metatype...</option>
                  {METATYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="archetype">Archetype</Label>
                <select
                  id="archetype"
                  value={formData.characterData.archetype}
                  onChange={(e) => updateField({ archetype: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select archetype...</option>
                  {ARCHETYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <TextField
                name="description"
                value={formData.characterData.description}
                onChange={(value) => updateField({ description: value })}
              >
                <Label>Description</Label>
                <TextArea className={`${inputClass} min-h-[100px]`} />
              </TextField>

              <TextField
                name="backstory"
                value={formData.characterData.backstory}
                onChange={(value) => updateField({ backstory: value })}
              >
                <Label>Backstory</Label>
                <TextArea className={`${inputClass} min-h-[150px]`} />
              </TextField>

              <TextField
                name="notes"
                value={formData.characterData.notes}
                onChange={(value) => updateField({ notes: value })}
              >
                <Label>Notes</Label>
                <TextArea className={`${inputClass} min-h-[100px]`} />
                <Description>Personal notes, session logs, etc.</Description>
              </TextField>
            </FieldGroup>
          </div>
        </TabPanel>

        {/* Attributes Tab */}
        <TabPanel id="attributes">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-fg mb-4">Physical Attributes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["body", "agility", "reaction", "strength"].map((attr) => (
                  <div key={attr} className="space-y-2">
                    <Label className="text-sm capitalize">{attr}</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-mono text-lg text-fg">
                        {
                          formData.characterData.attributes[
                            attr as keyof typeof formData.characterData.attributes
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-4">Mental Attributes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["willpower", "logic", "intuition", "charisma"].map((attr) => (
                  <div key={attr} className="space-y-2">
                    <Label className="text-sm capitalize">{attr}</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-mono text-lg text-fg">
                        {
                          formData.characterData.attributes[
                            attr as keyof typeof formData.characterData.attributes
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-4">Special Attributes</h3>
              <div className="grid grid-cols-3 gap-4">
                {["edge", "magic", "resonance"].map((attr) => (
                  <div key={attr} className="space-y-2">
                    <Label className="text-sm capitalize">{attr}</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-mono text-lg text-fg">
                        {
                          formData.characterData.attributes[
                            attr as keyof typeof formData.characterData.attributes
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        intent="outline"
                        size="xs"
                        onPress={() =>
                          updateAttribute(
                            attr,
                            formData.characterData.attributes[
                              attr as keyof typeof formData.characterData.attributes
                            ] + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel id="skills">
          <div className="mt-6 space-y-6">
            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
              <div
                key={category}
                className="rounded-lg border border-border bg-bg p-4"
              >
                <h3 className="font-semibold text-fg mb-4 capitalize">
                  {category} Skills
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skills.map((skill) => {
                    const currentValue =
                      formData.characterData.skills[
                        category as keyof typeof formData.characterData.skills
                      ]?.[skill] || 0;
                    return (
                      <div key={skill} className="space-y-1">
                        <Label className="text-sm">{skill}</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            intent="outline"
                            size="xs"
                            onPress={() =>
                              updateSkill(category, skill, currentValue - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-6 text-center font-mono text-fg">
                            {currentValue}
                          </span>
                          <Button
                            type="button"
                            intent="outline"
                            size="xs"
                            onPress={() =>
                              updateSkill(category, skill, currentValue + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Extras Tab */}
        <TabPanel id="extras">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nuyen">Nuyen</Label>
              <InputPrimitive
                id="nuyen"
                type="number"
                min="0"
                value={formData.characterData.nuyen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField({ nuyen: parseInt(e.target.value) || 0 })
                }
                className={inputClass}
              />
            </div>

            <p className="text-muted-fg">
              Qualities, gear, and augmentations editing coming soon.
              Currently they can be viewed on the character sheet.
            </p>
          </div>
        </TabPanel>

        {/* Karma Tab */}
        <TabPanel id="karma">
          <div className="mt-6 rounded-lg border border-border bg-bg p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="karmaTotal">Total Karma</Label>
                <InputPrimitive
                  id="karmaTotal"
                  type="number"
                  min="0"
                  value={formData.characterData.karma.total}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const total = parseInt(e.target.value) || 0;
                    updateField({
                      karma: {
                        ...formData.characterData.karma,
                        total,
                        available: total - formData.characterData.karma.spent,
                      },
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="karmaSpent">Spent Karma</Label>
                <InputPrimitive
                  id="karmaSpent"
                  type="number"
                  min="0"
                  value={formData.characterData.karma.spent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const spent = parseInt(e.target.value) || 0;
                    updateField({
                      karma: {
                        ...formData.characterData.karma,
                        spent,
                        available: formData.characterData.karma.total - spent,
                      },
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>Available Karma</Label>
                <div className="h-10 flex items-center px-3 rounded-lg border border-input-border bg-bg-muted text-fg font-medium">
                  {formData.characterData.karma.available}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-fg">
              Track your character&apos;s karma progression here. Karma is used
              to improve attributes, skills, and purchase new abilities.
            </p>
          </div>
        </TabPanel>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          intent="outline"
          onPress={() => router.push(`/characters/${character.id}`)}
          isDisabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" intent="primary" isDisabled={isPending}>
          {isPending ? "Saving..." : "Save & Close"}
        </Button>
      </div>
    </Form>
  );
}

