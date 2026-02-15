"use client";

import { useState } from "react";
import type { Character, Weapon, InstalledWeaponMod } from "@/lib/types";
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
// Helpers
// ---------------------------------------------------------------------------

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

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
      onClick={() => setIsExpanded(!isExpanded)}
      className="group cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name ... Pool pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {weapon.name}
        </span>
        {weapon.subcategory && (
          <span
            data-testid="weapon-type"
            className="truncate text-[10px] text-zinc-400 dark:text-zinc-500"
          >
            ({weapon.subcategory})
          </span>
        )}
        <button
          data-testid="dice-pool-pill"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(pool, label);
          }}
          className="ml-auto shrink-0 cursor-pointer rounded border border-emerald-500/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
        >
          {pool}
        </button>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-damage">
              Damage{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {weapon.damage}
              </span>
            </span>
            <span data-testid="stat-ap">
              AP{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {weapon.ap}
              </span>
            </span>
            {!isMelee && (
              <span data-testid="stat-accuracy">
                Accuracy{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {weapon.accuracy || "-"}
                </span>
              </span>
            )}
            {isMelee && weapon.reach != null && Number(weapon.reach) !== 0 && (
              <span data-testid="stat-reach">
                Reach{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {weapon.reach}
                </span>
              </span>
            )}
            {!isMelee && modeStr && (
              <span data-testid="stat-mode">
                Mode{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {modeStr}
                </span>
              </span>
            )}
            {!isMelee && weapon.recoil != null && weapon.recoil > 0 && (
              <span data-testid="stat-rc">
                RC{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {weapon.recoil}
                </span>
              </span>
            )}
          </div>

          {/* Stats row */}
          {weapon.availability != null && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span data-testid="stat-availability">
                Avail{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {weapon.availability}
                  {weapon.legality ? formatLegality(weapon.legality) : ""}
                </span>
              </span>
            </div>
          )}

          {/* Ammo state */}
          {weapon.ammoState && (
            <div data-testid="ammo-section">
              <div className="flex items-baseline gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="text-[10px] font-semibold uppercase tracking-wider">Ammo</span>
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {weapon.ammoState.currentRounds}/{weapon.ammoState.magazineCapacity}
                </span>
                {weapon.ammoState.loadedAmmoTypeId && (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {weapon.ammoState.loadedAmmoTypeId.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Modifications */}
          {weapon.modifications && weapon.modifications.length > 0 && (
            <div data-testid="modifications-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Modifications
              </div>
              <div className="space-y-0.5">
                {weapon.modifications.map((mod: InstalledWeaponMod, idx: number) => (
                  <div
                    key={`${mod.catalogId}-${idx}`}
                    data-testid="mod-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    {mod.mount && (
                      <span className="text-[10px] uppercase text-zinc-400 dark:text-zinc-500">
                        {mod.mount}
                      </span>
                    )}
                    {mod.rating != null && (
                      <span className="font-mono text-zinc-500">R{mod.rating}</span>
                    )}
                  </div>
                ))}
              </div>
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
