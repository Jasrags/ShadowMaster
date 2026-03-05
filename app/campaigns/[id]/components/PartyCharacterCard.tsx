"use client";

import type { Character } from "@/lib/types";
import { User, Shield, Swords, Zap, Gem } from "lucide-react";
import { CompactConditionMonitor } from "@/components/combat/ConditionMonitor";
import {
  calculatePhysicalMax,
  calculateStunMax,
} from "@/lib/rules/action-resolution/combat/damage-handler";
import { getAttributeValue } from "@/lib/rules/action-resolution/pool-builder";

interface PartyCharacterCardProps {
  character: Character;
  onClick: () => void;
}

/** Get highest non-accessory armor rating from character's armor array */
function getHighestArmor(character: Character): number {
  if (!character.armor || character.armor.length === 0) return 0;
  const nonAccessory = character.armor.filter((a) => !a.armorModifier);
  if (nonAccessory.length === 0) return 0;
  return Math.max(...nonAccessory.map((a) => a.armorRating));
}

/** Compute defense pool: REA + INT */
function getDefensePool(character: Character): number {
  return getAttributeValue(character, "rea") + getAttributeValue(character, "int");
}

/** Compute soak pool: BOD + highest armor */
function getSoakPool(character: Character): number {
  return getAttributeValue(character, "bod") + getHighestArmor(character);
}

/** Compute initiative string: REA+INT+Xd6 */
function getInitiativeDisplay(character: Character): string {
  const base =
    character.derivedStats?.["initiative"] ??
    getAttributeValue(character, "rea") + getAttributeValue(character, "int");
  const dice = character.derivedStats?.["initiativeDice"] ?? 1;
  return `${base}+${dice}d6`;
}

/** Get current/max edge */
function getEdge(character: Character): { current: number; max: number } {
  const max = character.specialAttributes?.edge ?? 0;
  const current = character.condition?.edgeCurrent ?? max;
  return { current, max };
}

/** Get condition monitor values */
function getCondition(character: Character) {
  const bod = getAttributeValue(character, "bod");
  const wil = getAttributeValue(character, "wil");
  const physicalMax = calculatePhysicalMax(bod);
  const stunMax = calculateStunMax(wil);
  const physicalDamage = character.condition?.physicalDamage ?? 0;
  const stunDamage = character.condition?.stunDamage ?? 0;
  const overflowDamage = character.condition?.overflowDamage ?? 0;
  return { physicalMax, stunMax, physicalDamage, stunDamage, overflowDamage };
}

/** Status badge for character */
function getStatusBadge(character: Character): {
  label: string;
  className: string;
} | null {
  if (character.status === "draft") {
    return { label: "Draft", className: "bg-zinc-600 text-zinc-200" };
  }
  if (character.status === "deceased") {
    return { label: "Deceased", className: "bg-red-700 text-red-100" };
  }
  if (character.status === "retired") {
    return { label: "Retired", className: "bg-amber-700 text-amber-100" };
  }

  const condition = getCondition(character);
  if (condition.physicalDamage >= condition.physicalMax) {
    return { label: "Incapacitated", className: "bg-rose-700 text-rose-100" };
  }
  if (condition.stunDamage >= condition.stunMax) {
    return { label: "Unconscious", className: "bg-violet-700 text-violet-100" };
  }
  return null;
}

export default function PartyCharacterCard({ character, onClick }: PartyCharacterCardProps) {
  const condition = getCondition(character);
  const edge = getEdge(character);
  const armor = getHighestArmor(character);
  const defense = getDefensePool(character);
  const soak = getSoakPool(character);
  const initiative = getInitiativeDisplay(character);
  const essence = character.specialAttributes?.essence ?? 6;
  const badge = getStatusBadge(character);
  const isDraft = character.status === "draft";

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-lg border border-zinc-800 bg-black p-3 transition-all hover:border-zinc-600 hover:shadow-lg ${
        isDraft ? "opacity-60" : ""
      }`}
    >
      {/* Header: name, metatype, badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium text-zinc-50 group-hover:text-indigo-400">
              {character.name || "Unnamed Character"}
            </h4>
            <p className="truncate text-xs text-zinc-500">
              {character.metatype}
              {character.magicalPath &&
                character.magicalPath !== "mundane" &&
                ` - ${character.magicalPath}`}
            </p>
          </div>
        </div>
        {badge && (
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Combat stats row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-800 pt-2 text-xs text-zinc-400">
        <span className="flex items-center gap-1" title="Initiative">
          <Zap className="h-3 w-3 text-amber-400" />
          {initiative}
        </span>
        <span className="flex items-center gap-1" title="Armor">
          <Shield className="h-3 w-3 text-blue-400" />
          {armor}
        </span>
        <span className="flex items-center gap-1" title="Defense Pool">
          <Swords className="h-3 w-3 text-emerald-400" />
          {defense}
        </span>
        <span title="Soak Pool">Soak: {soak}</span>
      </div>

      {/* Condition monitors */}
      <div className="mt-2 border-t border-zinc-800 pt-2">
        <CompactConditionMonitor
          physicalMax={condition.physicalMax}
          stunMax={condition.stunMax}
          physicalDamage={condition.physicalDamage}
          stunDamage={condition.stunDamage}
          overflowDamage={condition.overflowDamage}
        />
      </div>

      {/* Edge & Essence */}
      <div className="mt-2 flex items-center gap-3 border-t border-zinc-800 pt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Edge:</span>
          <div className="flex gap-0.5">
            {Array.from({ length: edge.max }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-sm ${
                  i < edge.current ? "bg-amber-400" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-zinc-400">
            {edge.current}/{edge.max}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Gem className="h-3 w-3 text-cyan-400" />
          <span className="font-mono text-zinc-400">{essence.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// Export helpers for testing
export {
  getHighestArmor,
  getDefensePool,
  getSoakPool,
  getInitiativeDisplay,
  getEdge,
  getCondition,
  getStatusBadge,
};
