"use client";

import type { Character } from "@/lib/types";
import { useSkills, type SkillData } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ATTRIBUTE_DISPLAY, getAttributeBonus } from "./constants";
import {
  Crosshair,
  Swords,
  Footprints,
  Heart,
  Cpu,
  Car,
  Sparkles,
  Zap,
  BookOpen,
  Users,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillsDisplayProps {
  character: Character;
  onSelect?: (skillId: string, rating: number, attrAbbr?: string) => void;
}

interface EnrichedSkill {
  id: string;
  name: string;
  category: string;
  group: string | null;
  rating: number;
  dicePool: number;
  attrAbbr?: string;
  attrColor?: string;
  specs: string[];
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const SKILL_SECTIONS = [
  { key: "combat", label: "Combat", icon: Swords, iconColor: "text-red-400" },
  { key: "physical", label: "Physical", icon: Footprints, iconColor: "text-amber-400" },
  { key: "social", label: "Social", icon: Heart, iconColor: "text-pink-400" },
  { key: "technical", label: "Technical", icon: Cpu, iconColor: "text-blue-400" },
  { key: "vehicle", label: "Vehicle", icon: Car, iconColor: "text-orange-400" },
  { key: "magical", label: "Magical", icon: Sparkles, iconColor: "text-purple-400" },
  { key: "resonance", label: "Resonance", icon: Zap, iconColor: "text-cyan-400" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkillRow({ skill, onClick }: { skill: EnrichedSkill; onClick?: () => void }) {
  const isGroup = skill.group !== null;

  return (
    <div
      data-testid="skill-row"
      onClick={onClick}
      className="group cursor-pointer rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Line 1: Icon + Name ... Rating + Dice Pool */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          {isGroup ? (
            <Users className="h-3.5 w-3.5 shrink-0 text-purple-500" />
          ) : (
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          )}
          <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            data-testid="rating-pill"
            className="flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {skill.rating}
          </div>
          <div
            data-testid="dice-pool-pill"
            className="flex h-7 w-10 items-center justify-center rounded-md font-mono text-sm font-bold border border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
          >
            {skill.dicePool}
          </div>
        </div>
      </div>

      {/* Line 2: Attribute + group name */}
      <div className="ml-5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {skill.attrAbbr && <span className={skill.attrColor || ""}>{skill.attrAbbr}</span>}
        {skill.group && (
          <span className="text-zinc-400 dark:text-zinc-500">
            {" "}
            &bull; {skill.group.replace(/-/g, " ")}
          </span>
        )}
      </div>

      {/* Line 3: Specializations */}
      {skill.specs.length > 0 && (
        <div className="ml-5 mt-1 flex flex-wrap gap-1">
          {skill.specs.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            >
              {spec}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SkillsDisplay({ character, onSelect }: SkillsDisplayProps) {
  const { activeSkills } = useSkills();
  const skills = character.skills || {};
  const specializations = character.skillSpecializations || {};

  // Enrich character skills with catalog data
  const enriched: EnrichedSkill[] = Object.entries(skills).map(([skillId, rating]) => {
    const skillData = activeSkills.find((s: SkillData) => s.id === skillId);
    const attrId = skillData?.linkedAttribute.toLowerCase();
    const attrDisplay = attrId ? ATTRIBUTE_DISPLAY[attrId] : null;

    let dicePool = rating;
    if (attrId) {
      const baseAttr = character.attributes[attrId] || 0;
      const bonuses = getAttributeBonus(character, attrId);
      const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
      dicePool += baseAttr + augTotal;
    }

    const rawSpecs = specializations[skillId];
    const specs = rawSpecs ? (Array.isArray(rawSpecs) ? rawSpecs : [rawSpecs]) : [];

    return {
      id: skillId,
      name: skillData?.name || skillId.replace(/-/g, " "),
      category: skillData?.category || "physical",
      group: skillData?.group ?? null,
      rating,
      dicePool,
      attrAbbr: attrDisplay?.abbr,
      attrColor: attrDisplay?.color,
      specs,
    };
  });

  // Group by category
  const grouped = new Map<string, EnrichedSkill[]>();
  for (const skill of enriched) {
    const list = grouped.get(skill.category) || [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  // Sort within each group by rating descending
  for (const list of grouped.values()) {
    list.sort((a, b) => b.rating - a.rating);
  }

  const hasSkills = enriched.length > 0;

  return (
    <DisplayCard title="Skills" icon={<Crosshair className="h-4 w-4 text-zinc-400" />}>
      {!hasSkills ? (
        <p className="text-sm text-zinc-500 italic px-1">No skills assigned</p>
      ) : (
        <div className="space-y-3">
          {SKILL_SECTIONS.filter((section) => grouped.has(section.key)).map((section) => {
            const Icon = section.icon;
            const sectionSkills = grouped.get(section.key)!;
            return (
              <div key={section.key}>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <Icon className={`h-3 w-3 ${section.iconColor}`} />
                  {section.label}
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
                  {sectionSkills.map((skill) => (
                    <SkillRow
                      key={skill.id}
                      skill={skill}
                      onClick={() => onSelect?.(skill.id, skill.dicePool, skill.attrAbbr)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DisplayCard>
  );
}
