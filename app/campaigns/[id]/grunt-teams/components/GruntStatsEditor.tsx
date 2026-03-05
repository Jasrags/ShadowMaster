"use client";

import { useState } from "react";
import {
  Shield,
  Target,
  Zap,
  Heart,
  Brain,
  Users,
  Star,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { GruntStats, GruntAttributes, Weapon, ArmorItem } from "@/lib/types";

interface GruntStatsEditorProps {
  stats: GruntStats;
  onChange: (stats: GruntStats) => void;
  templateStats?: GruntStats;
  readonly?: boolean;
}

const ATTRIBUTE_CONFIG: {
  key: keyof GruntAttributes;
  label: string;
  abbr: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "body", label: "Body", abbr: "BOD", icon: Shield },
  { key: "agility", label: "Agility", abbr: "AGI", icon: Target },
  { key: "reaction", label: "Reaction", abbr: "REA", icon: Zap },
  { key: "strength", label: "Strength", abbr: "STR", icon: Heart },
  { key: "willpower", label: "Willpower", abbr: "WIL", icon: Brain },
  { key: "logic", label: "Logic", abbr: "LOG", icon: Brain },
  { key: "intuition", label: "Intuition", abbr: "INT", icon: Brain },
  { key: "charisma", label: "Charisma", abbr: "CHA", icon: Users },
];

function calculateConditionMonitor(body: number): number {
  return 8 + Math.ceil(body / 2);
}

export function GruntStatsEditor({
  stats,
  onChange,
  templateStats,
  readonly = false,
}: GruntStatsEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    attributes: true,
    skills: true,
    weapons: false,
    armor: false,
    gear: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateAttribute = (key: keyof GruntAttributes, value: number) => {
    const clampedValue = Math.max(0, Math.min(15, value));
    const newAttributes = { ...stats.attributes, [key]: clampedValue };
    const newConditionMonitor = calculateConditionMonitor(newAttributes.body);
    onChange({
      ...stats,
      attributes: newAttributes,
      conditionMonitorSize: newConditionMonitor,
    });
  };

  const updateEssence = (value: number) => {
    onChange({ ...stats, essence: Math.max(0, Math.min(6, value)) });
  };

  const updateMagic = (value: number | undefined) => {
    onChange({
      ...stats,
      magic: value !== undefined ? Math.max(0, Math.min(15, value)) : undefined,
    });
  };

  const updateResonance = (value: number | undefined) => {
    onChange({
      ...stats,
      resonance: value !== undefined ? Math.max(0, Math.min(15, value)) : undefined,
    });
  };

  const updateSkill = (name: string, rating: number) => {
    const newSkills = { ...stats.skills, [name]: Math.max(0, Math.min(15, rating)) };
    onChange({ ...stats, skills: newSkills });
  };

  const removeSkill = (name: string) => {
    const { [name]: _removed, ...rest } = stats.skills;
    onChange({ ...stats, skills: rest });
  };

  const addSkill = () => {
    onChange({ ...stats, skills: { ...stats.skills, "": 1 } });
  };

  const renameSkill = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    const entries = Object.entries(stats.skills);
    const newSkills: Record<string, number> = {};
    for (const [key, value] of entries) {
      newSkills[key === oldName ? newName : key] = value;
    }
    onChange({ ...stats, skills: newSkills });
  };

  const updateWeapon = (index: number, field: "name" | "damage", value: string) => {
    const newWeapons = [...(stats.weapons || [])];
    newWeapons[index] = { ...newWeapons[index], [field]: value };
    onChange({ ...stats, weapons: newWeapons });
  };

  const addWeapon = () => {
    const newWeapon: Weapon = {
      id: `weapon-${Date.now()}`,
      name: "",
      damage: "",
      ap: 0,
      mode: [],
      subcategory: "other",
      category: "weapons",
      quantity: 1,
      cost: 0,
    };
    onChange({
      ...stats,
      weapons: [...(stats.weapons || []), newWeapon],
    });
  };

  const removeWeapon = (index: number) => {
    onChange({ ...stats, weapons: (stats.weapons || []).filter((_, i) => i !== index) });
  };

  const updateArmor = (index: number, field: "name" | "rating", value: string | number) => {
    const newArmor = [...(stats.armor || [])];
    newArmor[index] = { ...newArmor[index], [field]: value };
    onChange({ ...stats, armor: newArmor });
  };

  const addArmor = () => {
    const newArmor: ArmorItem = {
      id: `armor-${Date.now()}`,
      name: "",
      armorRating: 0,
      equipped: true,
      category: "armor",
      quantity: 1,
      cost: 0,
    };
    onChange({
      ...stats,
      armor: [...(stats.armor || []), newArmor],
    });
  };

  const removeArmor = (index: number) => {
    onChange({ ...stats, armor: (stats.armor || []).filter((_, i) => i !== index) });
  };

  const handleResetToTemplate = () => {
    if (templateStats) {
      onChange({ ...templateStats });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";
  const numberInputClass =
    "w-16 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-center font-mono text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string;
    section: string;
    count?: number;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full text-left"
    >
      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {title}
        {count !== undefined && (
          <span className="ml-1 text-zinc-400 dark:text-zinc-500">({count})</span>
        )}
      </h4>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-zinc-400" />
      ) : (
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Reset to Template */}
      {templateStats && !readonly && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleResetToTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to Template
          </button>
        </div>
      )}

      {/* Attributes */}
      <div>
        <SectionHeader title="Attributes" section="attributes" />
        {expandedSections.attributes && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ATTRIBUTE_CONFIG.map(({ key, abbr, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
              >
                <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{abbr}</span>
                {readonly ? (
                  <span className="ml-auto font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {stats.attributes[key]}
                  </span>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={stats.attributes[key]}
                    onChange={(e) => updateAttribute(key, parseInt(e.target.value, 10) || 0)}
                    className="ml-auto w-14 rounded border border-zinc-200 bg-white px-1 py-0.5 text-center text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                )}
              </div>
            ))}
            {/* Special attributes */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <Heart className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">ESS</span>
              {readonly ? (
                <span className="ml-auto font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {stats.essence}
                </span>
              ) : (
                <input
                  type="number"
                  min={0}
                  max={6}
                  step={0.1}
                  value={stats.essence}
                  onChange={(e) => updateEssence(parseFloat(e.target.value) || 0)}
                  className="ml-auto w-14 rounded border border-zinc-200 bg-white px-1 py-0.5 text-center text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              )}
            </div>
            {(stats.magic !== undefined || !readonly) && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <Star className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">MAG</span>
                {readonly ? (
                  <span className="ml-auto font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {stats.magic ?? "-"}
                  </span>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={stats.magic ?? ""}
                    placeholder="-"
                    onChange={(e) =>
                      updateMagic(e.target.value === "" ? undefined : parseInt(e.target.value, 10))
                    }
                    className="ml-auto w-14 rounded border border-zinc-200 bg-white px-1 py-0.5 text-center text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                )}
              </div>
            )}
            {(stats.resonance !== undefined || !readonly) && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <Star className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">RES</span>
                {readonly ? (
                  <span className="ml-auto font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {stats.resonance ?? "-"}
                  </span>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={stats.resonance ?? ""}
                    placeholder="-"
                    onChange={(e) =>
                      updateResonance(
                        e.target.value === "" ? undefined : parseInt(e.target.value, 10)
                      )
                    }
                    className="ml-auto w-14 rounded border border-zinc-200 bg-white px-1 py-0.5 text-center text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Condition Monitor (auto-calculated, read-only display) */}
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <Shield className="h-4 w-4" />
        <span>Condition Monitor: {stats.conditionMonitorSize} boxes</span>
      </div>

      {/* Skills */}
      <div>
        <SectionHeader title="Skills" section="skills" count={Object.keys(stats.skills).length} />
        {expandedSections.skills && (
          <div className="mt-2 space-y-2">
            {Object.entries(stats.skills).map(([name, rating]) => (
              <div key={name} className="flex items-center gap-2">
                {readonly ? (
                  <>
                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {rating}
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => renameSkill(name, e.target.value)}
                      placeholder="Skill name"
                      className={`flex-1 ${inputClass}`}
                    />
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={rating}
                      onChange={(e) => updateSkill(name, parseInt(e.target.value, 10) || 0)}
                      className={numberInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(name)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readonly && (
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
              >
                <Plus className="h-3 w-3" />
                Add Skill
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weapons */}
      <div>
        <SectionHeader title="Weapons" section="weapons" count={(stats.weapons || []).length} />
        {expandedSections.weapons && (
          <div className="mt-2 space-y-2">
            {(stats.weapons || []).map((weapon, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {readonly ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{weapon.name}</span>
                    {weapon.damage && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
                        {weapon.damage}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={weapon.name}
                      onChange={(e) => updateWeapon(idx, "name", e.target.value)}
                      placeholder="Weapon name"
                      className={`flex-1 ${inputClass}`}
                    />
                    <input
                      type="text"
                      value={weapon.damage || ""}
                      onChange={(e) => updateWeapon(idx, "damage", e.target.value)}
                      placeholder="Damage"
                      className={`w-24 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeWeapon(idx)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readonly && (
              <button
                type="button"
                onClick={addWeapon}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
              >
                <Plus className="h-3 w-3" />
                Add Weapon
              </button>
            )}
          </div>
        )}
      </div>

      {/* Armor */}
      <div>
        <SectionHeader title="Armor" section="armor" count={(stats.armor || []).length} />
        {expandedSections.armor && (
          <div className="mt-2 space-y-2">
            {(stats.armor || []).map((armor, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {readonly ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{armor.name}</span>
                    {armor.rating !== undefined && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        {armor.rating}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={armor.name}
                      onChange={(e) => updateArmor(idx, "name", e.target.value)}
                      placeholder="Armor name"
                      className={`flex-1 ${inputClass}`}
                    />
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={armor.rating ?? 0}
                      onChange={(e) =>
                        updateArmor(idx, "rating", parseInt(e.target.value, 10) || 0)
                      }
                      className={numberInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeArmor(idx)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {!readonly && (
              <button
                type="button"
                onClick={addArmor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
              >
                <Plus className="h-3 w-3" />
                Add Armor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
