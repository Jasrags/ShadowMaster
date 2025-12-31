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
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/30";
    default:
      return "text-zinc-400";
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
        <div className="absolute z-50 right-0 top-full mt-1 w-28 p-1 rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg">
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
                  ? "bg-zinc-800 text-zinc-500"
                  : "hover:bg-zinc-800 text-zinc-300"
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
  const hasAmmo = (weapon.ammoCapacity ?? 0) > 0;

  return (
    <div className="border border-zinc-800 rounded-lg">
      {/* Main row */}
      <div
        className={`flex items-center gap-3 p-3 ${hasAmmo ? "cursor-pointer hover:bg-zinc-800/50" : ""}`}
        onClick={() => hasAmmo && setExpanded(!expanded)}
      >
        <Sword className="w-4 h-4 text-amber-500 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-zinc-200 truncate">{weapon.name}</div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
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
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
          )}
        </div>
      </div>

      {/* Expanded ammo section */}
      {expanded && hasAmmo && (
        <div className="px-3 pb-3 pt-0 border-t border-zinc-800">
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
    <div className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg">
      <Shield className="w-4 h-4 text-blue-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-zinc-200 truncate">{armor.name}</div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
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
    <div className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg">
      <Package className="w-4 h-4 text-zinc-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-zinc-200 truncate">{gear.name}</div>
        <div className="text-xs text-zinc-500">
          {gear.quantity && gear.quantity > 1 ? `×${gear.quantity}` : ""}
        </div>
      </div>

      <div className="text-xs text-zinc-500">
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
    <div className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg">
      <Crosshair className="w-4 h-4 text-amber-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-zinc-200 truncate">{ammo.name}</div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
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

      <div className="text-sm font-mono text-zinc-300">
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

  // Reload handler (stub - would call API)
  const handleReload = useCallback(
    (weaponId: string, ammoItemId: string) => {
      console.log("Reload weapon", weaponId, "with ammo", ammoItemId);
      // Would call POST /api/characters/{id}/weapons/{weaponId}/ammo
    },
    []
  );

  const handleUnload = useCallback(
    (weaponId: string) => {
      console.log("Unload weapon", weaponId);
      // Would call DELETE /api/characters/{id}/weapons/{weaponId}/ammo
    },
    []
  );

  const handleSwapMagazine = useCallback(
    (weaponId: string, magazineId: string) => {
      console.log("Swap magazine", weaponId, magazineId);
      // Would call PATCH /api/characters/{id}/weapons/{weaponId}/ammo
    },
    []
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
        <EncumbranceBar encumbrance={encumbrance} showDetails />

        {/* Global wireless toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            {globalWireless ? (
              <Wifi className="w-4 h-4 text-cyan-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-zinc-500" />
            )}
            <span className={`text-sm ${globalWireless ? "text-cyan-400" : "text-zinc-500"}`}>
              Global Wireless
            </span>
            <span className="text-xs text-zinc-600">
              ({equipmentSummary.wirelessEnabled} enabled, {equipmentSummary.wirelessDisabled} disabled)
            </span>
          </div>
          {showActions && (
            <button
              onClick={handleGlobalWirelessToggle}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                globalWireless ? "bg-cyan-500" : "bg-zinc-700"
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
        <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto">
          {(["weapons", "armor", "gear", "ammo"] as InventoryTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-400"
              }`}
            >
              {tab === "weapons" && <Sword className="w-4 h-4" />}
              {tab === "armor" && <Shield className="w-4 h-4" />}
              {tab === "gear" && <Package className="w-4 h-4" />}
              {tab === "ammo" && <Crosshair className="w-4 h-4" />}
              <span className="capitalize">{tab}</span>
              <span className="text-xs text-zinc-600">({tabCounts[tab]})</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-2">
          {activeTab === "weapons" && (
            weapons.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No weapons</p>
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
              <p className="text-sm text-zinc-500 text-center py-4">No armor</p>
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
              <p className="text-sm text-zinc-500 text-center py-4">No gear</p>
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
              <p className="text-sm text-zinc-500 text-center py-4">No ammunition</p>
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
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>
              <span className="text-amber-400">{weapons.length}</span> weapons
            </span>
            <span>
              <span className="text-blue-400">{armor.length}</span> armor
            </span>
            <span>
              <span className="text-zinc-400">{gear.length}</span> gear
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
