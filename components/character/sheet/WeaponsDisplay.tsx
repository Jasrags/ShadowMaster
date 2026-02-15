"use client";

import { useState } from "react";
import type { Character, Weapon } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { isMeleeWeapon } from "./constants";
import { ChevronDown, ChevronRight, Swords } from "lucide-react";

// ---------------------------------------------------------------------------
// Pool calculation helper
// ---------------------------------------------------------------------------

function calculateWeaponPool(
  weapon: Weapon,
  character: Character
): { pool: number; label: string } {
  const skills = character.skills || {};
  const isMelee = isMeleeWeapon(weapon);

  let basePool = 0;
  let poolLabel = weapon.name;

  if (isMelee) {
    basePool = character.attributes?.strength || 3;
    poolLabel = `STR + ${weapon.name}`;
  } else {
    basePool = character.attributes?.agility || 3;
    poolLabel = `AGI + ${weapon.name}`;
  }

  const commonCombatSkills = [
    "pistols",
    "automatics",
    "longarms",
    "unarmed-combat",
    "blades",
    "clubs",
    "archery",
    "throwing-weapons",
  ];
  const foundSkill = commonCombatSkills.find((s) =>
    weapon.category.toLowerCase().includes(s.replace(/-/g, " "))
  );

  if (foundSkill && skills[foundSkill]) {
    basePool += skills[foundSkill];
    poolLabel = `${isMelee ? "STR" : "AGI"} + ${foundSkill.replace(/-/g, " ")}`;
  }

  return { pool: basePool, label: poolLabel };
}

// ---------------------------------------------------------------------------
// Stat pill color configs
// ---------------------------------------------------------------------------

const STAT_COLORS = {
  damage: "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  ap: "border-amber-500/20 bg-amber-500/12 text-amber-600 dark:text-amber-300",
  accuracy: "border-cyan-500/20 bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
  reach: "border-purple-500/20 bg-purple-500/12 text-purple-600 dark:text-purple-300",
  mode: "border-zinc-300/40 bg-zinc-100/60 text-zinc-600 dark:border-zinc-600/30 dark:bg-zinc-700/30 dark:text-zinc-300",
};

// ---------------------------------------------------------------------------
// WeaponRow
// ---------------------------------------------------------------------------

function WeaponRow({
  weapon,
  character,
  onSelect,
}: {
  weapon: Weapon;
  character: Character;
  onSelect?: (pool: number, label: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pool, label } = calculateWeaponPool(weapon, character);
  const isMelee = isMeleeWeapon(weapon);
  const modeStr = weapon.mode?.join("/") || "";

  return (
    <div
      data-testid="weapon-row"
      onClick={() => onSelect?.(pool, label)}
      className={`px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50 ${onSelect ? "cursor-pointer" : ""}`}
    >
      {/* Collapsed row: Chevron + Name ... Pool pill */}
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
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {weapon.name}
        </span>
        <span className="flex-1" />
        <span
          data-testid="pool-pill"
          className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/12 px-1.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300"
        >
          {pool}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stat pills */}
          <div className="flex flex-wrap gap-1.5">
            <span
              data-testid="damage-pill"
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${STAT_COLORS.damage}`}
            >
              DMG {weapon.damage}
            </span>
            <span
              data-testid="ap-pill"
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${STAT_COLORS.ap}`}
            >
              AP {weapon.ap}
            </span>
            {!isMelee && (
              <span
                data-testid="accuracy-pill"
                className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${STAT_COLORS.accuracy}`}
              >
                ACC {weapon.accuracy || "-"}
              </span>
            )}
            {isMelee && weapon.reach != null && Number(weapon.reach) !== 0 && (
              <span
                data-testid="reach-pill"
                className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${STAT_COLORS.reach}`}
              >
                RCH {weapon.reach}
              </span>
            )}
            {!isMelee && modeStr && (
              <span
                data-testid="mode-pill"
                className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${STAT_COLORS.mode}`}
              >
                MODE {modeStr}
              </span>
            )}
          </div>

          {/* Subcategory */}
          {weapon.subcategory && (
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              {weapon.subcategory}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section configuration
// ---------------------------------------------------------------------------

const WEAPON_SECTIONS = [
  { key: "ranged" as const, label: "Ranged Weapons" },
  { key: "melee" as const, label: "Melee Weapons" },
];

// ---------------------------------------------------------------------------
// WeaponsDisplay
// ---------------------------------------------------------------------------

interface WeaponsDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
}

export function WeaponsDisplay({ character, onSelect }: WeaponsDisplayProps) {
  const ranged = character.weapons?.filter((w) => !isMeleeWeapon(w)) || [];
  const melee = character.weapons?.filter((w) => isMeleeWeapon(w)) || [];

  if (ranged.length === 0 && melee.length === 0) return null;

  const items: Record<"ranged" | "melee", Weapon[]> = { ranged, melee };

  return (
    <DisplayCard title="Weapons" icon={<Swords className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {WEAPON_SECTIONS.map(({ key, label }) => {
          if (items[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {items[key].map((weapon, idx) => (
                  <WeaponRow
                    key={`${key}-${idx}`}
                    weapon={weapon}
                    character={character}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
