"use client";

import { useState, useCallback } from "react";
import type { Character, Weapon, InstalledWeaponMod } from "@/lib/types";
import type { WeaponData, GearCatalogData } from "@/lib/rules/RulesetContext";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import type { AmmunitionItem } from "@/lib/types/gear-state";
import { useGear } from "@/lib/rules";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { DisplayCard } from "./DisplayCard";
import { isMeleeWeapon } from "./constants";
import { WirelessIndicator } from "@/app/characters/[id]/components/WirelessIndicator";
import { WeaponAmmoDisplay } from "@/app/characters/[id]/components/WeaponAmmoDisplay";
import { ChevronDown, ChevronRight, Swords, Wifi, WifiOff } from "lucide-react";

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

/** Search all weapon subcategory arrays in the catalog to find a weapon by id. */
function findCatalogWeapon(
  catalog: GearCatalogData | null,
  catalogId: string
): WeaponData | undefined {
  if (!catalog?.weapons) return undefined;
  const w = catalog.weapons;
  const arrays: WeaponData[][] = [
    w.melee,
    w.pistols,
    w.smgs,
    w.rifles,
    w.shotguns,
    w.sniperRifles,
    w.throwingWeapons,
    w.grenades,
  ];
  for (const arr of arrays) {
    if (!arr) continue;
    const found = arr.find((item) => item.id === catalogId);
    if (found) return found;
  }
  return undefined;
}

function getReadinessLabel(readiness: EquipmentReadiness): string {
  switch (readiness) {
    case "readied":
      return "Readied";
    case "holstered":
      return "Holstered";
    case "worn":
      return "Worn";
    case "stored":
      return "Stored";
    default:
      return readiness;
  }
}

function getReadinessColor(readiness: EquipmentReadiness): string {
  switch (readiness) {
    case "readied":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    case "holstered":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    case "worn":
      return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    case "stored":
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/30 dark:text-zinc-500";
    default:
      return "text-zinc-400";
  }
}

function getCompactAmmoBarColor(current: number, max: number): string {
  if (max === 0) return "bg-zinc-400";
  const pct = (current / max) * 100;
  if (pct <= 0) return "bg-red-500";
  if (pct <= 25) return "bg-orange-500";
  if (pct <= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}

const WEAPON_READINESS_STATES: EquipmentReadiness[] = ["readied", "holstered", "stored"];

// ---------------------------------------------------------------------------
// Local state update handlers (matches InventoryPanel pattern)
// ---------------------------------------------------------------------------

function changeWeaponReadiness(
  character: Character,
  weaponId: string,
  newState: EquipmentReadiness,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedWeapons = character.weapons?.map((w) =>
    (w.id || w.name) === weaponId
      ? {
          ...w,
          state: {
            ...w.state,
            readiness: newState,
            wirelessEnabled: w.state?.wirelessEnabled ?? true,
          },
        }
      : w
  );

  onCharacterUpdate({ ...character, weapons: updatedWeapons });
}

function toggleWeaponWireless(
  character: Character,
  weaponId: string,
  enabled: boolean,
  onCharacterUpdate: (updated: Character) => void
) {
  const updatedWeapons = character.weapons?.map((w) =>
    (w.id || w.name) === weaponId
      ? {
          ...w,
          state: {
            ...w.state,
            readiness: w.state?.readiness ?? ("holstered" as const),
            wirelessEnabled: enabled,
          },
        }
      : w
  );

  onCharacterUpdate({ ...character, weapons: updatedWeapons });
}

// ---------------------------------------------------------------------------
// WeaponRow
// ---------------------------------------------------------------------------

function WeaponRow({
  weapon,
  character,
  catalogWeapon,
  onSelect,
  onCharacterUpdate,
  editable,
  ammunition,
}: {
  weapon: Weapon;
  character: Character;
  catalogWeapon?: WeaponData;
  onSelect?: (pool: number, label: string) => void;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
  ammunition?: AmmunitionItem[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pool, label } = calculateWeaponPool(weapon, character);
  const isMelee = isMeleeWeapon(weapon);
  const modeStr = weapon.mode?.join("/") || "";

  // Resolve stats: character weapon takes priority, catalog fills gaps
  const avail = weapon.availability ?? catalogWeapon?.availability;
  const legalityStr = weapon.legality ?? catalogWeapon?.legality;
  const cost = weapon.cost || catalogWeapon?.cost || 0;
  const weight = weapon.weight ?? catalogWeapon?.weight;

  // Readiness state
  const readiness: EquipmentReadiness = weapon.state?.readiness ?? "holstered";

  // Wireless state
  const hasWireless = !!(weapon.wirelessBonus || catalogWeapon?.wirelessBonus);
  const globalWireless = isGlobalWirelessEnabled(character);
  const wirelessEnabled = weapon.state?.wirelessEnabled ?? true;
  const isWirelessActive = hasWireless && globalWireless && wirelessEnabled;

  // Weapon identifier for API calls
  const weaponId = weapon.id || weapon.name;

  // Ammo handlers
  const handleReload = useCallback(
    async (ammoItemId: string) => {
      if (!character.id || !onCharacterUpdate) return;
      try {
        const response = await fetch(`/api/characters/${character.id}/weapons/${weaponId}/ammo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ammoItemId }),
        });
        const result = await response.json();
        if (result.success && result.weapon) {
          const updatedWeapons = character.weapons?.map((w) =>
            (w.id || w.name) === weaponId ? { ...w, ammoState: result.weapon.ammoState } : w
          );
          const updatedAmmunition = result.ammunition ?? character.ammunition;
          onCharacterUpdate({
            ...character,
            weapons: updatedWeapons,
            ammunition: updatedAmmunition,
          });
        }
      } catch (error) {
        console.error("Failed to reload weapon:", error);
      }
    },
    [character, weaponId, onCharacterUpdate]
  );

  const handleUnload = useCallback(async () => {
    if (!character.id || !onCharacterUpdate) return;
    try {
      const response = await fetch(`/api/characters/${character.id}/weapons/${weaponId}/ammo`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        const updatedWeapons = character.weapons?.map((w) =>
          (w.id || w.name) === weaponId
            ? { ...w, ammoState: { ...w.ammoState!, currentRounds: 0, loadedAmmoTypeId: null } }
            : w
        );
        const updatedAmmunition = result.ammunition ?? character.ammunition;
        onCharacterUpdate({ ...character, weapons: updatedWeapons, ammunition: updatedAmmunition });
      }
    } catch (error) {
      console.error("Failed to unload weapon:", error);
    }
  }, [character, weaponId, onCharacterUpdate]);

  const handleSwapMagazine = useCallback(
    async (magazineId: string) => {
      if (!character.id || !onCharacterUpdate) return;
      try {
        const response = await fetch(`/api/characters/${character.id}/weapons/${weaponId}/ammo`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ magazineId }),
        });
        const result = await response.json();
        if (result.success && result.weapon) {
          const updatedWeapons = character.weapons?.map((w) =>
            (w.id || w.name) === weaponId
              ? {
                  ...w,
                  ammoState: result.weapon.ammoState,
                  spareMagazines: result.weapon.spareMagazines,
                }
              : w
          );
          onCharacterUpdate({ ...character, weapons: updatedWeapons });
        }
      } catch (error) {
        console.error("Failed to swap magazine:", error);
      }
    },
    [character, weaponId, onCharacterUpdate]
  );

  return (
    <div
      data-testid="weapon-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="group cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name (subcategory) [Readiness] [Ammo] [Wifi] [Pool] */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span
          title={weapon.name}
          className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200"
        >
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

        {/* Spacer to push badges to the right */}
        <span className="ml-auto" />

        {/* Readiness badge (always visible) */}
        <span
          data-testid="readiness-badge"
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${getReadinessColor(readiness)}`}
        >
          {getReadinessLabel(readiness)}
        </span>

        {/* Compact ammo indicator */}
        {weapon.ammoState && (
          <span data-testid="compact-ammo" className="flex shrink-0 items-center gap-1">
            <span className="h-1.5 w-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <span
                className={`block h-full ${getCompactAmmoBarColor(weapon.ammoState.currentRounds, weapon.ammoState.magazineCapacity)}`}
                style={{
                  width: `${weapon.ammoState.magazineCapacity > 0 ? (weapon.ammoState.currentRounds / weapon.ammoState.magazineCapacity) * 100 : 0}%`,
                }}
              />
            </span>
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {weapon.ammoState.currentRounds}/{weapon.ammoState.magazineCapacity}
            </span>
          </span>
        )}

        {/* State-aware wifi icon */}
        {hasWireless &&
          (isWirelessActive ? (
            <Wifi
              data-testid="wireless-icon"
              className="h-3 w-3 shrink-0 text-cyan-500 dark:text-cyan-400"
            />
          ) : (
            <WifiOff
              data-testid="wireless-icon-off"
              className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            />
          ))}

        {/* Dice pool pill */}
        <button
          data-testid="dice-pool-pill"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(pool, label);
          }}
          className="shrink-0 cursor-pointer rounded border border-emerald-500/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
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
          {/* Description */}
          {catalogWeapon?.description && (
            <p
              data-testid="weapon-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {catalogWeapon.description}
            </p>
          )}

          {/* Combat stats row */}
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

          {/* Avail + Cost + Weight row */}
          {(avail != null || cost > 0 || weight != null) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              {avail != null && (
                <span data-testid="stat-availability">
                  Avail{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {avail}
                    {legalityStr ? formatLegality(legalityStr) : ""}
                  </span>
                </span>
              )}
              {cost > 0 && (
                <span data-testid="stat-cost">
                  Cost{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    ¥{cost}
                  </span>
                </span>
              )}
              {weight != null && (
                <span data-testid="stat-weight">
                  Weight{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {weight}kg
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Inventory controls section (editable only) */}
          {editable && onCharacterUpdate && (
            <div data-testid="inventory-controls" className="space-y-2">
              {/* Readiness controls */}
              <div data-testid="readiness-controls" className="flex items-center gap-1">
                <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Readiness
                </span>
                {WEAPON_READINESS_STATES.map((state) => (
                  <button
                    key={state}
                    data-testid={`readiness-${state}`}
                    disabled={state === readiness}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeWeaponReadiness(character, weaponId, state, onCharacterUpdate);
                    }}
                    className={`rounded border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      state === readiness
                        ? getReadinessColor(state)
                        : "border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-300 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-600"
                    }`}
                  >
                    {getReadinessLabel(state)}
                  </button>
                ))}
              </div>

              {/* Wireless toggle */}
              {hasWireless && (
                <div data-testid="wireless-toggle" className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Wireless
                  </span>
                  <WirelessIndicator
                    enabled={wirelessEnabled}
                    globalEnabled={globalWireless}
                    bonusDescription={weapon.wirelessBonus || catalogWeapon?.wirelessBonus}
                    onToggle={(enabled) =>
                      toggleWeaponWireless(character, weaponId, enabled, onCharacterUpdate)
                    }
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Ammo display: interactive when editable, static when read-only */}
          {weapon.ammoState && (
            <div data-testid="ammo-section">
              {editable && onCharacterUpdate ? (
                <WeaponAmmoDisplay
                  weapon={weapon}
                  availableAmmo={ammunition}
                  onReload={handleReload}
                  onUnload={handleUnload}
                  onSwapMagazine={handleSwapMagazine}
                />
              ) : (
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
              )}
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

          {/* Notes */}
          {weapon.notes && (
            <div data-testid="notes" className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {weapon.notes}
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
  onCharacterUpdate?: (updatedCharacter: Character) => void;
  editable?: boolean;
}

export function WeaponsDisplay({
  character,
  onSelect,
  onCharacterUpdate,
  editable,
}: WeaponsDisplayProps) {
  const catalog = useGear();
  const ranged = character.weapons?.filter((w) => !isMeleeWeapon(w)) || [];
  const melee = character.weapons?.filter((w) => isMeleeWeapon(w)) || [];

  if (ranged.length === 0 && melee.length === 0) return null;

  const items: Record<"ranged" | "melee", Weapon[]> = { ranged, melee };
  const ammunition = (character.ammunition || []) as AmmunitionItem[];

  return (
    <DisplayCard
      id="sheet-weapons"
      title="Weapons"
      icon={<Swords className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
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
                    catalogWeapon={
                      weapon.catalogId ? findCatalogWeapon(catalog, weapon.catalogId) : undefined
                    }
                    onSelect={onSelect}
                    onCharacterUpdate={onCharacterUpdate}
                    editable={editable}
                    ammunition={ammunition}
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
