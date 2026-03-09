"use client";

import { useMemo } from "react";
import type { Character, Effect } from "@/lib/types";
import type {
  GearCatalogData,
  WeaponData,
  CyberwareCatalogItemData,
  BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { useGear } from "@/lib/rules";
import { useCyberwareCatalog, useBiowareCatalog } from "@/lib/rules/RulesetContext";
import { DisplayCard } from "./DisplayCard";
import { Wifi, WifiOff } from "lucide-react";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";
import { setAllWireless } from "@/lib/rules/inventory";

interface WirelessDisplayProps {
  character: Character;
  onCharacterUpdate?: (character: Character) => void;
  editable?: boolean;
}

// ---------------------------------------------------------------------------
// Catalog helpers
// ---------------------------------------------------------------------------

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

/** Find a gear item across all non-weapon/non-armor categories. */
function findCatalogGearItem(
  catalog: GearCatalogData | null,
  catalogId: string
): { wirelessBonus?: string } | undefined {
  if (!catalog) return undefined;
  const categories: (keyof GearCatalogData)[] = [
    "electronics",
    "tools",
    "survival",
    "medical",
    "security",
    "miscellaneous",
  ];
  for (const cat of categories) {
    const items = catalog[cat];
    if (!Array.isArray(items)) continue;
    const found = (items as Array<{ id: string; wirelessBonus?: string }>).find(
      (item) => item.id === catalogId
    );
    if (found) return found;
  }
  return undefined;
}

/** Extract wireless bonus descriptions from effects with wirelessOverride. */
function getWirelessFromEffects(effects?: Effect[]): string | undefined {
  if (!effects) return undefined;
  const descriptions: string[] = [];
  for (const effect of effects) {
    if (effect.wirelessOverride?.description) {
      descriptions.push(effect.wirelessOverride.description);
    }
  }
  return descriptions.length > 0 ? descriptions.join("; ") : undefined;
}

// ---------------------------------------------------------------------------
// Wireless counting and bonus resolution (catalog-aware)
// ---------------------------------------------------------------------------

interface WirelessCounts {
  enabled: number;
  disabled: number;
}

interface WirelessBonusRow {
  category: string;
  itemName: string;
  description: string;
}

function getWirelessInfo(
  character: Character,
  gearCatalog: GearCatalogData | null,
  cyberwareCatalog: CyberwareCatalogItemData[],
  biowareCatalog: BiowareCatalogItemData[]
): { counts: WirelessCounts; bonuses: WirelessBonusRow[] } {
  let enabled = 0;
  let disabled = 0;
  const bonuses: WirelessBonusRow[] = [];
  const globalOn = isGlobalWirelessEnabled(character);

  // --- Weapons ---
  for (const weapon of character.weapons || []) {
    const catalogWeapon = weapon.catalogId
      ? findCatalogWeapon(gearCatalog, weapon.catalogId)
      : undefined;
    const wb = weapon.wirelessBonus || catalogWeapon?.wirelessBonus;
    if (!wb) continue;
    const itemOn = weapon.state?.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
    if (globalOn && itemOn) {
      bonuses.push({ category: "Weapon", itemName: weapon.name, description: wb });
    }
  }

  // --- Armor ---
  for (const item of character.armor || []) {
    const catalogArmor = item.catalogId
      ? gearCatalog?.armor?.find((a) => a.id === item.catalogId)
      : undefined;
    const wb = item.wirelessBonus || catalogArmor?.wirelessBonus;
    if (!wb) continue;
    const itemOn = item.state?.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
    if (globalOn && itemOn) {
      bonuses.push({ category: "Armor", itemName: item.name, description: wb });
    }
  }

  // --- Gear ---
  for (const item of character.gear || []) {
    const catalogGear = item.id ? findCatalogGearItem(gearCatalog, item.id) : undefined;
    const wb = catalogGear?.wirelessBonus;
    if (!wb) continue;
    const itemOn = item.state?.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
    if (globalOn && itemOn) {
      bonuses.push({ category: "Gear", itemName: item.name, description: wb });
    }
  }

  // --- Cyberware ---
  for (const item of character.cyberware || []) {
    const catalogItem = item.catalogId
      ? cyberwareCatalog.find((c) => c.id === item.catalogId)
      : undefined;
    const wb =
      item.wirelessBonus ||
      catalogItem?.wirelessBonus ||
      getWirelessFromEffects(catalogItem?.effects);
    if (!wb) continue;
    const itemOn = item.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
    if (globalOn && itemOn) {
      bonuses.push({ category: "Cyberware", itemName: item.name, description: wb });
    }
  }

  // --- Bioware ---
  for (const item of character.bioware || []) {
    const catalogItem = item.catalogId
      ? biowareCatalog.find((b) => b.id === item.catalogId)
      : undefined;
    const wb = item.wirelessBonus || getWirelessFromEffects(catalogItem?.effects);
    if (!wb) continue;
    const itemOn = item.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
    if (globalOn && itemOn) {
      bonuses.push({ category: "Bioware", itemName: item.name, description: wb });
    }
  }

  // --- Cyberlimbs ---
  for (const limb of character.cyberlimbs || []) {
    const itemOn = limb.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
  }

  // --- Drones (always wireless-capable) ---
  for (const drone of character.drones || []) {
    const itemOn = drone.state?.wirelessEnabled !== false;
    if (itemOn) enabled++;
    else disabled++;
  }

  return { counts: { enabled, disabled }, bonuses };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WirelessDisplay({ character, onCharacterUpdate, editable }: WirelessDisplayProps) {
  const globalWireless = useMemo(() => isGlobalWirelessEnabled(character), [character]);
  const gearCatalog = useGear();
  const cyberwareCatalog = useCyberwareCatalog();
  const biowareCatalog = useBiowareCatalog();

  const { counts, bonuses } = useMemo(
    () => getWirelessInfo(character, gearCatalog, cyberwareCatalog, biowareCatalog),
    [character, gearCatalog, cyberwareCatalog, biowareCatalog]
  );

  const handleToggle = () => {
    if (!onCharacterUpdate) return;
    onCharacterUpdate(setAllWireless(character, !globalWireless));
  };

  return (
    <DisplayCard
      id="sheet-wireless"
      title="Wireless"
      icon={
        globalWireless ? (
          <Wifi className="h-4 w-4 text-cyan-400" />
        ) : (
          <WifiOff className="h-4 w-4 text-zinc-400" />
        )
      }
      collapsible
    >
      <div className="space-y-3">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {globalWireless ? (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400">
                Wireless Active
              </span>
            ) : (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                Wireless Silent
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">
              {counts.enabled} on / {counts.disabled} off
            </span>
            {editable && (
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  globalWireless ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                role="switch"
                aria-checked={globalWireless}
                aria-label="Toggle global wireless"
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                    globalWireless ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Bonus breakdown (only when wireless ON) */}
        {globalWireless && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Active Bonuses
            </div>
            {bonuses.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {bonuses.map((bonus, i) => (
                  <div
                    key={`${bonus.category}-${bonus.itemName}-${i}`}
                    className="px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                        {bonus.category}
                      </span>
                      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {bonus.itemName}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-cyan-600 dark:text-cyan-400">
                      {bonus.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No active wireless bonuses</p>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
