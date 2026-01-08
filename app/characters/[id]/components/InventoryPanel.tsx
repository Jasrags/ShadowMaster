"use client";

/**
 * InventoryPanel - Main inventory management interface
 *
 * Displays:
 * - Tab navigation: Weapons | Armor | Gear | Ammo
 * - Per-item state controls (equip/holster/store)
 * - Wireless toggle per item
 * - Encumbrance bar display
 * - Quick action buttons
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { useState, useMemo, useCallback } from "react";
import { Theme, THEMES, DEFAULT_THEME } from "@/lib/themes";
import { Section } from "./Section";
import { EncumbranceBar } from "./EncumbranceBar";
import { WirelessIndicator } from "./WirelessIndicator";
import { WeaponAmmoDisplay } from "./WeaponAmmoDisplay";
import {
  Backpack,
  Sword,
  Shield,
  Package,
  Crosshair,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Character, Weapon, ArmorItem, GearItem } from "@/lib/types";
import type { EquipmentReadiness, AmmunitionItem } from "@/lib/types/gear-state";
import { getEquipmentStateSummary } from "@/lib/rules/inventory";
import { calculateEncumbrance } from "@/lib/rules/encumbrance/calculator";
import { isGlobalWirelessEnabled } from "@/lib/rules/wireless";

// =============================================================================
// TYPES
// =============================================================================

interface InventoryPanelProps {
  character: Character;
  theme?: Theme;
  /** Callback when character is updated */
  onUpdate?: (updatedCharacter: Character) => void;
  /** Whether to show action buttons */
  showActions?: boolean;
}

type InventoryTab = "weapons" | "armor" | "gear" | "ammo";

// =============================================================================
// HELPERS
// =============================================================================

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
      return "text-muted-foreground bg-muted/30 border-border";
    default:
      return "text-muted-foreground";
  }
}

function getValidStatesForType(itemType: "weapon" | "armor" | "gear"): EquipmentReadiness[] {
  switch (itemType) {
    case "weapon":
      return ["readied", "holstered", "stored"];
    case "armor":
      return ["worn", "stored"];
    case "gear":
      return ["worn", "holstered", "stored"];
    default:
      return ["stored"];
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface ReadinessMenuProps {
  currentState: EquipmentReadiness;
  validStates: EquipmentReadiness[];
  onSelect: (state: EquipmentReadiness) => void;
  disabled?: boolean;
}

function ReadinessMenu({ currentState, validStates, onSelect, disabled }: ReadinessMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${getReadinessColor(currentState)} ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
        }`}
      >
        {getReadinessLabel(currentState)}
        {!disabled && (isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 top-full mt-1 w-28 p-1 rounded-lg bg-card border border-border shadow-lg">
          {validStates.map(state => (
            <button
              key={state}
              onClick={() => {
                onSelect(state);
                setIsOpen(false);
              }}
              disabled={state === currentState}
              className={`w-full px-2 py-1 rounded text-left text-xs transition-colors ${
                state === currentState
                  ? "bg-muted text-muted-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {getReadinessLabel(state)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface WeaponRowProps {
  weapon: Weapon;
  globalWireless: boolean;
  availableAmmo: AmmunitionItem[];
  showActions: boolean;
  onStateChange: (itemId: string, newState: EquipmentReadiness) => void;
  onWirelessToggle: (itemId: string, enabled: boolean) => void;
  onReload: (weaponId: string, ammoItemId: string) => void;
  onUnload: (weaponId: string) => void;
  onSwapMagazine: (weaponId: string, magazineId: string) => void;
}

function WeaponRow({
  weapon,
  globalWireless,
  availableAmmo,
  showActions,
  onStateChange,
  onWirelessToggle,
  onReload,
  onUnload,
  onSwapMagazine,
}: WeaponRowProps) {
  const [expanded, setExpanded] = useState(false);
  const state = weapon.state || { readiness: "holstered" as EquipmentReadiness, wirelessEnabled: true };
  // Check for ammo capacity in new ammoState format or legacy ammoCapacity field
  const hasAmmo = (weapon.ammoState?.magazineCapacity ?? weapon.ammoCapacity ?? 0) > 0;

  return (
    <div className={`border border-border rounded-lg bg-card ${expanded ? "relative z-10" : ""}`}>
      {/* Main row */}
      <div
        className={`flex items-center gap-3 p-3 ${hasAmmo ? "cursor-pointer hover:bg-muted/50" : ""}`}
        onClick={() => hasAmmo && setExpanded(!expanded)}
      >
        <Sword className="w-4 h-4 text-amber-500 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">{weapon.name}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{weapon.damage}</span>
            <span>AP {weapon.ap}</span>
            {hasAmmo && (
              <span className={weapon.currentAmmo === 0 ? "text-red-400" : ""}>
                {weapon.currentAmmo ?? 0}/{weapon.ammoCapacity}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <WirelessIndicator
            enabled={state.wirelessEnabled}
            globalEnabled={globalWireless}
            onToggle={showActions && weapon.id ? (enabled) => onWirelessToggle(weapon.id!, enabled) : undefined}
            size="sm"
            iconOnly
          />

          {showActions && weapon.id ? (
            <ReadinessMenu
              currentState={state.readiness}
              validStates={getValidStatesForType("weapon")}
              onSelect={(newState) => onStateChange(weapon.id!, newState)}
            />
          ) : (
            <span className={`px-2 py-0.5 rounded text-xs border ${getReadinessColor(state.readiness)}`}>
              {getReadinessLabel(state.readiness)}
            </span>
          )}

          {hasAmmo && (
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
          )}
        </div>
      </div>

      {/* Expanded ammo section */}
      {expanded && hasAmmo && (
        <div className="px-3 pb-3 pt-0 border-t border-border">
          <WeaponAmmoDisplay
            weapon={weapon}
            availableAmmo={availableAmmo}
            onReload={showActions && weapon.id ? (ammoId) => onReload(weapon.id!, ammoId) : undefined}
            onUnload={showActions && weapon.id ? () => onUnload(weapon.id!) : undefined}
            onSwapMagazine={showActions && weapon.id ? (magId) => onSwapMagazine(weapon.id!, magId) : undefined}
            disabled={!showActions}
          />
        </div>
      )}
    </div>
  );
}

interface ArmorRowProps {
  armor: ArmorItem;
  globalWireless: boolean;
  showActions: boolean;
  onStateChange: (itemId: string, newState: EquipmentReadiness) => void;
  onWirelessToggle: (itemId: string, enabled: boolean) => void;
}

function ArmorRow({
  armor,
  globalWireless,
  showActions,
  onStateChange,
  onWirelessToggle,
}: ArmorRowProps) {
  const state = armor.state || { readiness: armor.equipped ? "worn" as EquipmentReadiness : "stored" as EquipmentReadiness, wirelessEnabled: true };

  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
      <Shield className="w-4 h-4 text-blue-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">{armor.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rating {armor.armorRating}</span>
          {armor.capacity && armor.capacity > 0 && (
            <span>Capacity {armor.capacity}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <WirelessIndicator
          enabled={state.wirelessEnabled}
          globalEnabled={globalWireless}
          onToggle={showActions && armor.id ? (enabled) => onWirelessToggle(armor.id!, enabled) : undefined}
          size="sm"
          iconOnly
        />

        {showActions && armor.id ? (
          <ReadinessMenu
            currentState={state.readiness}
            validStates={getValidStatesForType("armor")}
            onSelect={(newState) => onStateChange(armor.id!, newState)}
          />
        ) : (
          <span className={`px-2 py-0.5 rounded text-xs border ${getReadinessColor(state.readiness)}`}>
            {getReadinessLabel(state.readiness)}
          </span>
        )}
      </div>
    </div>
  );
}

interface GearRowProps {
  gear: GearItem;
}

function GearRow({ gear }: GearRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
      <Package className="w-4 h-4 text-muted-foreground shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">{gear.name}</div>
        <div className="text-xs text-muted-foreground">
          {gear.quantity && gear.quantity > 1 ? `×${gear.quantity}` : ""}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {gear.cost ? `¥${gear.cost.toLocaleString()}` : ""}
      </div>
    </div>
  );
}

interface AmmoRowProps {
  ammo: AmmunitionItem;
}

function AmmoRow({ ammo }: AmmoRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
      <Crosshair className="w-4 h-4 text-amber-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">{ammo.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{ammo.caliber}</span>
          {ammo.damageModifier !== 0 && (
            <span className={ammo.damageModifier > 0 ? "text-emerald-400" : "text-red-400"}>
              {ammo.damageModifier > 0 ? "+" : ""}{ammo.damageModifier} DV
            </span>
          )}
          {ammo.apModifier !== 0 && (
            <span className={ammo.apModifier < 0 ? "text-emerald-400" : "text-red-400"}>
              {ammo.apModifier > 0 ? "+" : ""}{ammo.apModifier} AP
            </span>
          )}
        </div>
      </div>

      <div className="text-sm font-mono text-foreground">
        {ammo.quantity}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InventoryPanel({
  character,
  theme,
  onUpdate,
  showActions = false,
}: InventoryPanelProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [activeTab, setActiveTab] = useState<InventoryTab>("weapons");

  // Get inventory data
  const weapons = useMemo(() => character.weapons || [], [character.weapons]);
  const armor = useMemo(() => character.armor || [], [character.armor]);
  const gear = useMemo(() => character.gear || [], [character.gear]);
  const ammunition = useMemo(() => (character.ammunition || []) as AmmunitionItem[], [character.ammunition]);

  // Calculate encumbrance
  const encumbrance = useMemo(() => calculateEncumbrance(character), [character]);

  // Get equipment summary
  const equipmentSummary = useMemo(() => getEquipmentStateSummary(character), [character]);

  // Get global wireless state
  const globalWireless = isGlobalWirelessEnabled(character);

  // Handlers
  const handleStateChange = useCallback(
    async (itemId: string, itemType: "weapon" | "armor" | "gear", newState: EquipmentReadiness) => {
      if (!onUpdate) return;

      // This would call the API in a real implementation
      // For now, just update locally
      const updatedCharacter = { ...character };

      if (itemType === "weapon") {
        updatedCharacter.weapons = character.weapons?.map(w =>
          w.id === itemId ? { ...w, state: { ...w.state, readiness: newState, wirelessEnabled: w.state?.wirelessEnabled ?? true } } : w
        );
      } else if (itemType === "armor") {
        updatedCharacter.armor = character.armor?.map(a =>
          a.id === itemId ? { ...a, state: { ...a.state, readiness: newState, wirelessEnabled: a.state?.wirelessEnabled ?? true }, equipped: newState === "worn" } : a
        );
      }

      onUpdate(updatedCharacter);
    },
    [character, onUpdate]
  );

  const handleWirelessToggle = useCallback(
    async (itemId: string, itemType: "weapon" | "armor" | "cyberware", enabled: boolean) => {
      if (!onUpdate) return;

      const updatedCharacter = { ...character };

      if (itemType === "weapon") {
        updatedCharacter.weapons = character.weapons?.map(w =>
          w.id === itemId ? { ...w, state: { ...w.state, readiness: w.state?.readiness ?? "holstered", wirelessEnabled: enabled } } : w
        );
      } else if (itemType === "armor") {
        updatedCharacter.armor = character.armor?.map(a =>
          a.id === itemId ? { ...a, state: { ...a.state, readiness: a.state?.readiness ?? "worn", wirelessEnabled: enabled } } : a
        );
      }

      onUpdate(updatedCharacter);
    },
    [character, onUpdate]
  );

  const handleGlobalWirelessToggle = useCallback(() => {
    if (!onUpdate) return;
    onUpdate({
      ...character,
      wirelessBonusesEnabled: !globalWireless,
    });
  }, [character, globalWireless, onUpdate]);

  // Reload handler - calls API and updates character
  const handleReload = useCallback(
    async (weaponId: string, ammoItemId: string) => {
      if (!character.id || !onUpdate) return;

      try {
        const response = await fetch(
          `/api/characters/${character.id}/weapons/${weaponId}/ammo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ammoItemId }),
          }
        );

        const result = await response.json();

        if (result.success && result.weapon) {
          // Update the weapon in local state
          const updatedWeapons = character.weapons?.map((w) =>
            w.id === weaponId ? result.weapon : w
          );

          // Update ammunition quantities
          const updatedAmmunition = character.ammunition?.map((a) =>
            a.id === ammoItemId
              ? { ...a, quantity: result.remainingAmmo ?? a.quantity }
              : a
          ).filter((a) => a.quantity > 0);

          onUpdate({
            ...character,
            weapons: updatedWeapons,
            ammunition: updatedAmmunition,
          });
        } else {
          console.error("Failed to reload:", result.error);
        }
      } catch (error) {
        console.error("Failed to reload weapon:", error);
      }
    },
    [character, onUpdate]
  );

  // Unload handler - calls API and updates character
  const handleUnload = useCallback(
    async (weaponId: string) => {
      if (!character.id || !onUpdate) return;

      try {
        const response = await fetch(
          `/api/characters/${character.id}/weapons/${weaponId}/ammo`,
          { method: "DELETE" }
        );

        const result = await response.json();

        if (result.success) {
          // Update the weapon to show empty
          const updatedWeapons = character.weapons?.map((w) =>
            w.id === weaponId
              ? {
                  ...w,
                  ammoState: {
                    ...w.ammoState,
                    currentRounds: 0,
                    loadedAmmoTypeId: null,
                    magazineCapacity: w.ammoState?.magazineCapacity ?? w.ammoCapacity ?? 0,
                  },
                }
              : w
          );

          // Add returned ammo to inventory
          const updatedAmmunition = [...(character.ammunition || [])];
          if (result.returnedAmmo && result.roundsUnloaded > 0) {
            const existingIndex = updatedAmmunition.findIndex(
              (a) => a.catalogId === result.returnedAmmo.catalogId
            );
            if (existingIndex !== -1) {
              updatedAmmunition[existingIndex] = result.returnedAmmo;
            } else {
              updatedAmmunition.push(result.returnedAmmo);
            }
          }

          onUpdate({
            ...character,
            weapons: updatedWeapons,
            ammunition: updatedAmmunition,
          });
        } else {
          console.error("Failed to unload:", result.error);
        }
      } catch (error) {
        console.error("Failed to unload weapon:", error);
      }
    },
    [character, onUpdate]
  );

  // Swap magazine handler - calls API and updates character
  const handleSwapMagazine = useCallback(
    async (weaponId: string, magazineId: string) => {
      if (!character.id || !onUpdate) return;

      try {
        const response = await fetch(
          `/api/characters/${character.id}/weapons/${weaponId}/ammo`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ magazineId }),
          }
        );

        const result = await response.json();

        if (result.success) {
          // Refetch character data to get updated state
          // For now, just log success - a proper implementation would refetch
          console.log("Magazine swapped successfully");
          // Could trigger a refetch here via a callback prop
        } else {
          console.error("Failed to swap magazine:", result.error);
        }
      } catch (error) {
        console.error("Failed to swap magazine:", error);
      }
    },
    [character, onUpdate]
  );

  // Tab counts
  const tabCounts = {
    weapons: weapons.length,
    armor: armor.length,
    gear: gear.length,
    ammo: ammunition.length,
  };

  return (
    <Section
      theme={t}
      title="Inventory"
      icon={<Backpack className="w-4 h-4 text-amber-500" />}
    >
      <div className="space-y-4">
        {/* Encumbrance bar */}
        <EncumbranceBar encumbrance={encumbrance} showDetails theme={t} />

        {/* Global wireless toggle */}
        <div className={`flex items-center justify-between p-2 rounded-lg border ${t.colors.card} ${t.colors.border}`}>
          <div className="flex items-center gap-2">
            {globalWireless ? (
              <Wifi className="w-4 h-4 text-cyan-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={`text-sm ${globalWireless ? "text-cyan-400" : "text-muted-foreground"}`}>
              Global Wireless
            </span>
            <span className="text-xs text-muted-foreground/70">
              ({equipmentSummary.wirelessEnabled} enabled, {equipmentSummary.wirelessDisabled} disabled)
            </span>
          </div>
          {showActions && (
            <button
              onClick={handleGlobalWirelessToggle}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                globalWireless ? "bg-cyan-500" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  globalWireless ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {(["weapons", "armor", "gear", "ammo"] as InventoryTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "weapons" && <Sword className="w-4 h-4" />}
              {tab === "armor" && <Shield className="w-4 h-4" />}
              {tab === "gear" && <Package className="w-4 h-4" />}
              {tab === "ammo" && <Crosshair className="w-4 h-4" />}
              <span className="capitalize">{tab}</span>
              <span className="text-xs text-muted-foreground/70">({tabCounts[tab]})</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-2">
          {activeTab === "weapons" && (
            weapons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No weapons</p>
            ) : (
              weapons.map(weapon => (
                <WeaponRow
                  key={weapon.id || weapon.name}
                  weapon={weapon}
                  globalWireless={globalWireless}
                  availableAmmo={ammunition}
                  showActions={showActions && character.status === "active"}
                  onStateChange={(id, state) => handleStateChange(id, "weapon", state)}
                  onWirelessToggle={(id, enabled) => handleWirelessToggle(id, "weapon", enabled)}
                  onReload={handleReload}
                  onUnload={handleUnload}
                  onSwapMagazine={handleSwapMagazine}
                />
              ))
            )
          )}

          {activeTab === "armor" && (
            armor.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No armor</p>
            ) : (
              armor.map(item => (
                <ArmorRow
                  key={item.id || item.name}
                  armor={item}
                  globalWireless={globalWireless}
                  showActions={showActions && character.status === "active"}
                  onStateChange={(id, state) => handleStateChange(id, "armor", state)}
                  onWirelessToggle={(id, enabled) => handleWirelessToggle(id, "armor", enabled)}
                />
              ))
            )
          )}

          {activeTab === "gear" && (
            gear.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No gear</p>
            ) : (
              gear.map(item => (
                <GearRow
                  key={item.id || item.name}
                  gear={item}
                />
              ))
            )
          )}

          {activeTab === "ammo" && (
            ammunition.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No ammunition</p>
            ) : (
              ammunition.map(item => (
                <AmmoRow
                  key={item.id}
                  ammo={item}
                />
              ))
            )
          )}
        </div>

        {/* Summary footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <span className="text-amber-400">{weapons.length}</span> weapons
            </span>
            <span>
              <span className="text-blue-400">{armor.length}</span> armor
            </span>
            <span>
              <span className="text-muted-foreground">{gear.length}</span> gear
            </span>
          </div>
          <div>
            {equipmentSummary.readiedWeapons > 0 && (
              <span className="text-emerald-400">{equipmentSummary.readiedWeapons} readied</span>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
