"use client";

import { useEffect, useState, use } from "react";
import { Link, Button } from "react-aria-components";
import type { Character } from "@/lib/types";
import { DiceRoller } from "@/components";

// =============================================================================
// ICONS
// =============================================================================

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// =============================================================================
// ATTRIBUTE HELPERS
// =============================================================================

const ATTRIBUTE_DISPLAY: Record<string, { abbr: string; color: string }> = {
  body: { abbr: "BOD", color: "text-red-400" },
  agility: { abbr: "AGI", color: "text-amber-400" },
  reaction: { abbr: "REA", color: "text-orange-400" },
  strength: { abbr: "STR", color: "text-rose-400" },
  willpower: { abbr: "WIL", color: "text-purple-400" },
  logic: { abbr: "LOG", color: "text-blue-400" },
  intuition: { abbr: "INT", color: "text-cyan-400" },
  charisma: { abbr: "CHA", color: "text-pink-400" },
};

const SKILL_CATEGORIES: Record<string, { name: string; color: string }> = {
  combat: { name: "Combat", color: "border-red-500/50" },
  physical: { name: "Physical", color: "border-amber-500/50" },
  social: { name: "Social", color: "border-pink-500/50" },
  technical: { name: "Technical", color: "border-blue-500/50" },
  magical: { name: "Magical", color: "border-purple-500/50" },
  resonance: { name: "Resonance", color: "border-cyan-500/50" },
  vehicle: { name: "Vehicle", color: "border-orange-500/50" },
};

// =============================================================================
// CONDITION MONITOR COMPONENT
// =============================================================================

interface ConditionMonitorProps {
  label: string;
  maxBoxes: number;
  filledBoxes: number;
  color: "physical" | "stun";
}

function ConditionMonitor({ label, maxBoxes, filledBoxes, color }: ConditionMonitorProps) {
  const colorClasses = {
    physical: {
      filled: "bg-red-500 border-red-400 shadow-red-500/50",
      empty: "border-red-900/50 bg-red-950/30",
      text: "text-red-400",
    },
    stun: {
      filled: "bg-amber-500 border-amber-400 shadow-amber-500/50",
      empty: "border-amber-900/50 bg-amber-950/30",
      text: "text-amber-400",
    },
  };
  const colors = colorClasses[color];

  // Group boxes in rows of 3 (Shadowrun style)
  const rows = [];
  for (let i = 0; i < maxBoxes; i += 3) {
    rows.push(
      <div key={i} className="flex gap-1">
        {[0, 1, 2].map((offset) => {
          const boxIndex = i + offset;
          if (boxIndex >= maxBoxes) return null;
          const isFilled = boxIndex < filledBoxes;
          return (
            <div
              key={boxIndex}
              className={`h-5 w-5 border-2 transition-all ${isFilled ? `${colors.filled} shadow-sm` : colors.empty
                }`}
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
            />
          );
        })}
        {/* Wound modifier marker */}
        <span className="ml-1 text-xs text-zinc-600 tabular-nums">
          {Math.floor((i + 3) / 3) > 0 ? `-${Math.floor((i + 3) / 3)}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono uppercase tracking-wider ${colors.text}`}>
          {label}
        </span>
        <span className="text-xs font-mono text-zinc-500">
          {filledBoxes}/{maxBoxes}
        </span>
      </div>
      <div className="space-y-1">{rows}</div>
    </div>
  );
}

// =============================================================================
// ATTRIBUTE BLOCK COMPONENT
// =============================================================================

interface AttributeBlockProps {
  id: string;
  value: number;
  max?: number;
}

function AttributeBlock({ id, value, max }: AttributeBlockProps) {
  const display = ATTRIBUTE_DISPLAY[id];
  if (!display) return null;

  const percentage = max ? (value / max) * 100 : (value / 6) * 100;

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 to-transparent rounded" />
      <div className="relative flex items-center gap-3 p-3">
        <span className={`font-mono text-sm font-bold ${display.color}`}>
          {display.abbr}
        </span>
        <div className="flex-1">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-zinc-500 to-zinc-400 transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <span className="font-mono text-lg font-bold text-zinc-100 tabular-nums w-6 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, icon, children, className = "" }: SectionProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner accents */}
      <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-emerald-500/50" />
      <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-emerald-500/50" />
      <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-emerald-500/50" />
      <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-emerald-500/50" />

      <div className="border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 bg-zinc-900">
          {icon}
          <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            {title}
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// =============================================================================
// SKILL LIST COMPONENT
// =============================================================================

interface SkillListProps {
  skills: Record<string, number>;
  linkedAttributes?: Record<string, string>;
}

function SkillList({ skills, linkedAttributes = {} }: SkillListProps) {
  const sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);

  if (sortedSkills.length === 0) {
    return <p className="text-sm text-zinc-500 italic">No skills assigned</p>;
  }

  return (
    <div className="grid gap-1">
      {sortedSkills.map(([skillId, rating]) => {
        const linkedAttr = linkedAttributes[skillId];
        const attrDisplay = linkedAttr ? ATTRIBUTE_DISPLAY[linkedAttr] : null;

        return (
          <div
            key={skillId}
            className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-800/50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-300 capitalize">
                {skillId.replace(/-/g, " ")}
              </span>
              {attrDisplay && (
                <span className={`text-xs font-mono ${attrDisplay.color} opacity-50 group-hover:opacity-100`}>
                  [{attrDisplay.abbr}]
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-emerald-500 rounded-sm"
                />
              ))}
              {Array.from({ length: Math.max(0, 6 - rating) }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-zinc-700 rounded-sm"
                />
              ))}
              <span className="ml-2 text-sm font-mono text-zinc-400 tabular-nums w-4 text-right">
                {rating}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// QUALITY BADGE COMPONENT
// =============================================================================

interface QualityBadgeProps {
  name: string;
  type: "positive" | "negative";
}

function QualityBadge({ name, type }: QualityBadgeProps) {
  const isPositive = type === "positive";
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${isPositive
        ? "bg-emerald-950/50 text-emerald-400 border-emerald-700/50"
        : "bg-red-950/50 text-red-400 border-red-700/50"
        }`}
    >
      <span className={`mr-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
        {isPositive ? "+" : "−"}
      </span>
      {name.replace(/-/g, " ")}
    </span>
  );
}

// =============================================================================
// GEAR ITEM COMPONENT
// =============================================================================

interface GearItemProps {
  item: {
    name: string;
    category: string;
    quantity: number;
    rating?: number;
  };
}

function GearItem({ item }: GearItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-zinc-800/30 rounded border-l-2 border-zinc-600">
      <div>
        <span className="text-sm text-zinc-200">{item.name}</span>
        {item.rating && (
          <span className="ml-2 text-xs text-zinc-500">R{item.rating}</span>
        )}
        <span className="ml-2 text-xs text-zinc-600">{item.category}</span>
      </div>
      {item.quantity > 1 && (
        <span className="text-xs font-mono text-zinc-400">×{item.quantity}</span>
      )}
    </div>
  );
}

// =============================================================================
// MAIN CHARACTER SHEET PAGE
// =============================================================================

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const resolvedParams = use(params);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`/api/characters/${resolvedParams.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load character");
        }

        setCharacter(data.character);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-zinc-500 animate-pulse">
            LOADING RUNNER DATA...
          </span>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 font-mono">{error || "Character not found"}</p>
        <Link
          href="/characters"
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Return to characters
        </Link>
      </div>
    );
  }

  // Calculate derived values
  const physicalMonitorMax = Math.ceil((character.attributes?.body || 1) / 2) + 8;
  const stunMonitorMax = Math.ceil((character.attributes?.willpower || 1) / 2) + 8;
  const physicalLimit = Math.ceil(
    (((character.attributes?.strength || 1) * 2) +
      (character.attributes?.body || 1) +
      (character.attributes?.reaction || 1)) / 3
  );
  const mentalLimit = Math.ceil(
    (((character.attributes?.logic || 1) * 2) +
      (character.attributes?.intuition || 1) +
      (character.attributes?.willpower || 1)) / 3
  );
  const socialLimit = Math.ceil(
    (((character.attributes?.charisma || 1) * 2) +
      (character.attributes?.willpower || 1) +
      Math.ceil(character.specialAttributes?.essence || 6)) / 3
  );
  const initiative = (character.attributes?.reaction || 1) + (character.attributes?.intuition || 1);

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Characters
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-600 uppercase">
            {character.editionCode}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Character Header */}
      <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse" />
        </div>

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">
                  {character.name || "Unnamed Runner"}
                </h1>
                <span className={`px-2 py-0.5 text-xs font-mono uppercase rounded ${character.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : character.status === "draft"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                  }`}>
                  {character.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {character.metatype || "Unknown Metatype"}
                </span>
                {character.magicalPath && character.magicalPath !== "mundane" && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {character.magicalPath.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onPress={() => setShowDiceRoller(!showDiceRoller)}
                className={`p-2 rounded-lg border transition-colors ${showDiceRoller
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400"
                  }`}
              >
                <DiceIcon className="w-5 h-5" />
              </Button>
              {character.status === "draft" && (
                <Link
                  href={`/characters/${character.id}/edit`}
                  className="p-2 rounded-lg border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors group"
                >
                  <EditIcon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </Link>
              )}
            </div>
            {/* Resume Button for Drafts */}
            {character.status === "draft" && (
              <div className="flex items-center">
                <Link
                  href={`/characters/${character.id}/edit`}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Resume Creation
                </Link>
              </div>
            )}
          </div>

          {/* Collapsible Dice Roller */}
          {showDiceRoller && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="max-w-md mx-auto">
                <DiceRoller
                  initialPool={Math.max(
                    (character.attributes?.agility || 3) + (character.skills?.pistols || 0),
                    6
                  )}
                  compact={false}
                  label="Dice Pool"
                  showHistory={true}
                  maxHistory={3}
                />
              </div>
            </div>
          )}

          {/* Quick Stats Bar */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800 ${showDiceRoller ? 'mt-4 pt-4' : ''}`}>
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-500 uppercase">Karma</span>
              <p className="text-2xl font-bold font-mono text-amber-400">
                {character.karmaCurrent ?? 0}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-500 uppercase">Nuyen</span>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                ¥{(character.nuyen ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-500 uppercase">Essence</span>
              <p className="text-2xl font-bold font-mono text-cyan-400">
                {(character.specialAttributes?.essence ?? 6).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-500 uppercase">Edge</span>
              <p className="text-2xl font-bold font-mono text-rose-400">
                {character.specialAttributes?.edge ?? 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Attributes & Condition */}
        <div className="space-y-6">
          {/* Attributes */}
          <Section title="Attributes">
            <div className="space-y-1">
              {Object.entries(character.attributes || {}).map(([id, value]) => (
                <AttributeBlock key={id} id={id} value={value} />
              ))}
            </div>

            {/* Magic/Resonance if applicable */}
            {character.specialAttributes?.magic !== undefined && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-violet-400">MAG</span>
                  <span className="font-mono text-lg font-bold text-zinc-100">
                    {character.specialAttributes.magic}
                  </span>
                </div>
              </div>
            )}
            {character.specialAttributes?.resonance !== undefined && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-cyan-400">RES</span>
                  <span className="font-mono text-lg font-bold text-zinc-100">
                    {character.specialAttributes.resonance}
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* Derived Stats */}
          <Section title="Derived Stats">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-zinc-800/30 rounded">
                <span className="block text-xs font-mono text-zinc-500 uppercase">Physical</span>
                <span className="text-xl font-bold text-red-400">{physicalLimit}</span>
              </div>
              <div className="text-center p-3 bg-zinc-800/30 rounded">
                <span className="block text-xs font-mono text-zinc-500 uppercase">Mental</span>
                <span className="text-xl font-bold text-blue-400">{mentalLimit}</span>
              </div>
              <div className="text-center p-3 bg-zinc-800/30 rounded">
                <span className="block text-xs font-mono text-zinc-500 uppercase">Social</span>
                <span className="text-xl font-bold text-pink-400">{socialLimit}</span>
              </div>
              <div className="text-center p-3 bg-zinc-800/30 rounded">
                <span className="block text-xs font-mono text-zinc-500 uppercase">Initiative</span>
                <span className="text-xl font-bold text-emerald-400">{initiative}+1d6</span>
              </div>
            </div>
          </Section>

          {/* Condition Monitors */}
          <Section title="Condition">
            <div className="space-y-6">
              <ConditionMonitor
                label="Physical"
                maxBoxes={physicalMonitorMax}
                filledBoxes={character.condition?.physicalDamage ?? 0}
                color="physical"
              />
              <ConditionMonitor
                label="Stun"
                maxBoxes={stunMonitorMax}
                filledBoxes={character.condition?.stunDamage ?? 0}
                color="stun"
              />
            </div>
          </Section>
        </div>

        {/* Middle Column - Skills */}
        <div className="space-y-6">
          <Section title="Skills">
            <SkillList skills={character.skills || {}} />
          </Section>

          {/* Knowledge Skills */}
          {character.knowledgeSkills && character.knowledgeSkills.length > 0 && (
            <Section title="Knowledge">
              <div className="space-y-1">
                {character.knowledgeSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">{skill.name}</span>
                      <span className="text-xs text-zinc-600 capitalize">({skill.category})</span>
                    </div>
                    <span className="text-sm font-mono text-zinc-400">{skill.rating}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {character.languages && character.languages.length > 0 && (
            <Section title="Languages">
              <div className="flex flex-wrap gap-2">
                {character.languages.map((lang, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded border ${lang.isNative
                      ? "bg-emerald-950/50 text-emerald-400 border-emerald-700/50"
                      : "bg-zinc-800/50 text-zinc-300 border-zinc-700/50"
                      }`}
                  >
                    {lang.name} {lang.isNative ? "(N)" : `(${lang.rating})`}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right Column - Qualities & Gear */}
        <div className="space-y-6">
          {/* Qualities */}
          <Section title="Qualities">
            {(character.positiveQualities?.length || 0) === 0 &&
              (character.negativeQualities?.length || 0) === 0 ? (
              <p className="text-sm text-zinc-500 italic">No qualities selected</p>
            ) : (
              <div className="space-y-4">
                {character.positiveQualities && character.positiveQualities.length > 0 && (
                  <div>
                    <span className="text-xs font-mono text-emerald-500 uppercase mb-2 block">Positive</span>
                    <div className="flex flex-wrap gap-2">
                      {character.positiveQualities.map((quality) => (
                        <QualityBadge key={quality} name={quality} type="positive" />
                      ))}
                    </div>
                  </div>
                )}
                {character.negativeQualities && character.negativeQualities.length > 0 && (
                  <div>
                    <span className="text-xs font-mono text-red-500 uppercase mb-2 block">Negative</span>
                    <div className="flex flex-wrap gap-2">
                      {character.negativeQualities.map((quality) => (
                        <QualityBadge key={quality} name={quality} type="negative" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Gear */}
          <Section title="Gear">
            {!character.gear || character.gear.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No gear acquired</p>
            ) : (
              <div className="space-y-2">
                {character.gear.map((item, index) => (
                  <GearItem key={index} item={item} />
                ))}
              </div>
            )}
          </Section>

          {/* Contacts */}
          <Section title="Contacts">
            {!character.contacts || character.contacts.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No contacts established</p>
            ) : (
              <div className="space-y-2">
                {character.contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="p-3 bg-zinc-800/30 rounded border-l-2 border-zinc-600"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-200">{contact.name}</span>
                      {contact.type && (
                        <span className="text-xs text-zinc-500">{contact.type}</span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-zinc-400">
                        Connection: <span className="text-amber-400 font-mono">{contact.connection}</span>
                      </span>
                      <span className="text-zinc-400">
                        Loyalty: <span className="text-emerald-400 font-mono">{contact.loyalty}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Lifestyles */}
          {character.lifestyles && character.lifestyles.length > 0 && (
            <Section title="Lifestyles">
              <div className="space-y-2">
                {character.lifestyles.map((lifestyle) => {
                  // Calculate total monthly cost
                  let totalMonthlyCost = lifestyle.monthlyCost || 0;

                  // Apply modifications (excluding permanent lifestyle modification)
                  (lifestyle.modifications || []).forEach((mod) => {
                    // Skip permanent lifestyle modification (it's a one-time purchase, not monthly)
                    if (mod.catalogId === "permanent-lifestyle" || mod.name.toLowerCase() === "permanent lifestyle") {
                      return;
                    }

                    if (mod.modifierType === "percentage") {
                      totalMonthlyCost = totalMonthlyCost * (1 + (mod.type === "positive" ? 1 : -1) * (mod.modifier / 100));
                    } else if (mod.modifierType === "fixed") {
                      totalMonthlyCost = totalMonthlyCost + (mod.type === "positive" ? 1 : -1) * mod.modifier;
                    }
                  });

                  // Add subscription costs
                  const subscriptionCost = (lifestyle.subscriptions || []).reduce(
                    (sum, sub) => sum + (sub.monthlyCost || 0),
                    0
                  );
                  totalMonthlyCost = totalMonthlyCost + subscriptionCost;

                  // Add custom expenses/income
                  if (lifestyle.customExpenses) {
                    totalMonthlyCost = totalMonthlyCost + lifestyle.customExpenses;
                  }
                  if (lifestyle.customIncome) {
                    totalMonthlyCost = totalMonthlyCost - lifestyle.customIncome;
                  }

                  // Check if permanent
                  const isPermanent = lifestyle.modifications?.some(
                    (mod) => mod.catalogId === "permanent-lifestyle" || mod.name.toLowerCase() === "permanent lifestyle"
                  ) || false;

                  // Get lifestyle name (use type as display name)
                  const lifestyleName = lifestyle.type;

                  return (
                    <div key={lifestyle.id || lifestyle.type} className="p-3 bg-zinc-800/30 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-200">
                            {lifestyleName}
                            {character.primaryLifestyleId === lifestyle.id && (
                              <span className="ml-2 text-xs text-amber-400">(Primary)</span>
                            )}
                          </span>
                          {isPermanent && (
                            <span className="text-xs text-emerald-400">(Permanent)</span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-emerald-400">
                          {isPermanent ? "Purchased" : `¥${Math.round(totalMonthlyCost).toLocaleString()}/mo`}
                        </span>
                      </div>
                      {lifestyle.location && (
                        <p className="text-xs text-zinc-500 mt-1">{lifestyle.location}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="flex items-center justify-between text-xs text-zinc-600 border-t border-zinc-800 pt-4">
        <span className="font-mono">ID: {character.id}</span>
        <span className="font-mono">
          Created: {new Date(character.createdAt).toLocaleDateString()}
          {character.updatedAt && ` • Updated: ${new Date(character.updatedAt).toLocaleDateString()}`}
        </span>
      </div>
    </div>
  );
}

