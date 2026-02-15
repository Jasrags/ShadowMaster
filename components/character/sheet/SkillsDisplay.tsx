"use client";

import { useState } from "react";
import type { Character } from "@/lib/types";
import { useSkills, type SkillData } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ATTRIBUTE_DISPLAY, getAttributeBonus } from "./constants";
import { Tooltip } from "@/components/ui";
import { Button as AriaButton } from "react-aria-components";
import { Crosshair, ChevronDown, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillsDisplayProps {
  character: Character;
  onSelect?: (skillId: string, rating: number, attrAbbr?: string) => void;
}

interface PoolBreakdown {
  attrName: string;
  attrBase: number;
  skillRating: number;
  augBonuses: Array<{ source: string; value: number }>;
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
  linkedAttribute?: string;
  description?: string;
  canDefault: boolean;
  specs: string[];
  poolBreakdown?: PoolBreakdown;
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const SKILL_SECTIONS = [
  { key: "combat", label: "Combat" },
  { key: "physical", label: "Physical" },
  { key: "social", label: "Social" },
  { key: "technical", label: "Technical" },
  { key: "vehicle", label: "Vehicle" },
  { key: "magical", label: "Magical" },
  { key: "resonance", label: "Resonance" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkillRow({ skill, onClick }: { skill: EnrichedSkill; onClick?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-testid="skill-row"
      onClick={onClick}
      className="group cursor-pointer rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Rating ... Dice Pool */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            data-testid="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {skill.name}
          </span>
          <span
            data-testid="rating-pill"
            className="font-mono text-xs text-zinc-500 dark:text-zinc-500"
          >
            {skill.rating}
          </span>
          {skill.specs.length > 0 && (
            <span className="truncate text-[11px] text-zinc-400 dark:text-zinc-500">
              ({skill.specs.join(", ")})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {skill.poolBreakdown ? (
            <span onClick={(e) => e.stopPropagation()}>
              <Tooltip
                content={<PoolTooltipContent breakdown={skill.poolBreakdown} />}
                delay={200}
                showArrow={false}
              >
                <AriaButton
                  data-testid="dice-pool-pill"
                  aria-label={`${skill.name} dice pool breakdown`}
                  className="flex h-7 w-10 items-center justify-center rounded-md font-mono text-sm font-bold border border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {skill.dicePool}
                </AriaButton>
              </Tooltip>
            </span>
          ) : (
            <div
              data-testid="dice-pool-pill"
              className="flex h-7 w-10 items-center justify-center rounded-md font-mono text-sm font-bold border border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
            >
              {skill.dicePool}
            </div>
          )}
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Attribute + Defaultable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              {skill.attrAbbr && (
                <span className={`font-bold ${skill.attrColor || ""}`}>{skill.attrAbbr}</span>
              )}
              {skill.linkedAttribute && (
                <span className="text-zinc-500 dark:text-zinc-400">{skill.linkedAttribute}</span>
              )}
            </div>
            <span
              data-testid="default-badge"
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                skill.canDefault
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {skill.canDefault ? "Can Default" : "No Default"}
            </span>
          </div>

          {/* Group */}
          {skill.group && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Group:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {skill.group.replace(/-/g, " ")}
              </span>
            </div>
          )}

          {/* Description */}
          {skill.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{skill.description}</p>
          )}

          {/* Specializations */}
          {skill.specs.length > 0 && (
            <div className="flex flex-wrap gap-1">
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
      )}
    </div>
  );
}

function PoolTooltipContent({ breakdown }: { breakdown: PoolBreakdown }) {
  const total =
    breakdown.attrBase +
    breakdown.skillRating +
    breakdown.augBonuses.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
        <span className="text-zinc-400">{breakdown.attrName}</span>
        <span className="font-mono font-semibold text-zinc-200">{breakdown.attrBase}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-zinc-400">Skill</span>
        <span className="font-mono font-semibold text-zinc-200">{breakdown.skillRating}</span>
      </div>
      {breakdown.augBonuses.map((b, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{b.source}</span>
          <span className="font-mono font-semibold text-emerald-400">+{b.value}</span>
        </div>
      ))}
      <div className="border-t border-zinc-600" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
          Total
        </span>
        <span className="font-mono font-bold text-emerald-300">{total}</span>
      </div>
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

    const baseAttr = attrId ? character.attributes[attrId] || 0 : 0;
    const augBonuses = attrId ? getAttributeBonus(character, attrId) : [];
    const augTotal = augBonuses.reduce((sum, b) => sum + b.value, 0);
    const dicePool = rating + (attrId ? baseAttr + augTotal : 0);

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
      linkedAttribute: skillData?.linkedAttribute,
      description: skillData?.description,
      canDefault: skillData?.canDefault ?? true,
      specs,
      poolBreakdown: attrId
        ? {
            attrName: (skillData?.linkedAttribute || attrId).replace(/^\w/, (c) => c.toUpperCase()),
            attrBase: baseAttr,
            skillRating: rating,
            augBonuses,
          }
        : undefined,
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
            const sectionSkills = grouped.get(section.key)!;
            return (
              <div key={section.key}>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
