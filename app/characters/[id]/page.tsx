"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { Link, Button, Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import type {
  Character,
  Weapon,
  ArmorItem,
  AdeptPower,
  CyberwareItem,
  BiowareItem,
  Vehicle,
  CharacterDrone,
  CharacterRCC,
} from "@/lib/types";

import { DiceRoller } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AdminActionsPanel from "../components/AdminActionsPanel";
import {
  RulesetProvider,
  useRuleset,
  useMergedRuleset,
  useRulesetStatus,
  useSpells,
  useMetatypes,
  useSkills,
  type SkillData,
  type SpellData,
  type SpellsCatalogData,
} from "@/lib/rules";
import {
  calculateLimit,
  calculateWoundModifier,
} from "@/lib/rules/qualities";
import { DownloadIcon, X } from "lucide-react";
import { THEMES, DEFAULT_THEME, type Theme, type ThemeId } from "@/lib/themes";
import { QualitiesSection } from "./components/QualitiesSection";
import { Section } from "./components/Section";
import { InteractiveConditionMonitor } from "./components/InteractiveConditionMonitor";
import { CombatQuickReference } from "./components/CombatQuickReference";
import { ActionPanel } from "./components/ActionPanel";
import { QuickCombatControls } from "./components/QuickCombatControls";
import { QuickNPCPanel } from "./components/QuickNPCPanel";
import { useCharacterSheetPreferences } from "./hooks/useCharacterSheetPreferences";
import { CombatSessionProvider } from "@/lib/combat";
import { StabilityShield } from "@/components/sync";

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

function PrinterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

/**
 * Calculate total bonus for an attribute from all sources (Cyberware, Bioware, Adept Powers)
 */
function getAttributeBonus(character: Character, attrId: string): Array<{ source: string, value: number }> {
  const bonuses: Array<{ source: string, value: number }> = [];

  // Check Cyberware
  character.cyberware?.forEach(item => {
    if (item.attributeBonuses?.[attrId]) {
      bonuses.push({ source: item.name, value: item.attributeBonuses[attrId] });
    }
  });

  // Check Bioware
  character.bioware?.forEach(item => {
    if (item.attributeBonuses?.[attrId]) {
      bonuses.push({ source: item.name, value: item.attributeBonuses[attrId] });
    }
  });

  // Check Adept Powers
  character.adeptPowers?.forEach(power => {
    if (power.name.toLowerCase().includes("improved physical attribute") &&
      power.specification?.toLowerCase() === attrId.toLowerCase() &&
      power.rating) {
      bonuses.push({ source: power.name, value: power.rating });
    }
  });

  return bonuses;
}



// =============================================================================
// NOTE: ConditionMonitor component has been replaced by InteractiveConditionMonitor
// located in ./components/InteractiveConditionMonitor.tsx
// =============================================================================

// =============================================================================
// ATTRIBUTE BLOCK COMPONENT
// =============================================================================

// =============================================================================
// ATTRIBUTES TABLE COMPONENT
// =============================================================================

interface AttributesTableProps {
  character: Character;
  onSelect?: (id: string, value: number) => void;
  theme?: Theme;
}

function AttributesTable({ character, onSelect, theme }: AttributesTableProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const metatypes = useMetatypes();

  // Find current metatype data for limits
  const metatypeData = metatypes.find(m => m.name.toLowerCase() === character.metatype.toLowerCase());

  // Calculate attribute bonuses from all sources
  const getAugmentations = (attrId: string) => getAttributeBonus(character, attrId);

  const attributes = [
    { id: 'body', label: 'Body' },
    { id: 'agility', label: 'Agility' },
    { id: 'reaction', label: 'Reaction' },
    { id: 'strength', label: 'Strength' },
    { id: 'willpower', label: 'Willpower' },
    { id: 'logic', label: 'Logic' },
    { id: 'intuition', label: 'Intuition' },
    { id: 'charisma', label: 'Charisma' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left border-collapse ${t.fonts.mono} text-xs`}>
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase">Attribute</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-center">Base</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-center">Aug</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-center">Min/Max</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase">Notes</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map(({ id, label }) => {
            const base = character.attributes[id] || 0;
            const bonuses = getAugmentations(id);
            const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
            const display = ATTRIBUTE_DISPLAY[id];

            // Get metatype limits
            const limit = metatypeData?.attributes[id];
            const minMaxStr = limit && 'min' in limit && 'max' in limit
              ? `(${limit.min}/${limit.max})`
              : '(1/6)';

            return (
              <tr
                key={id}
                onClick={() => onSelect?.(id, base + augTotal)}
                className="group border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="py-2 px-1">
                  <span className={`font-bold ${display?.color || 'text-foreground'}`}>{label}</span>
                </td>
                <td className="py-2 px-1 text-center font-bold">
                  [{base}]
                </td>
                <td className="py-2 px-1 text-center font-bold text-emerald-500">
                  {augTotal > 0 ? `[+${augTotal}]` : '[  ]'}
                </td>
                <td className="py-2 px-1 text-center text-muted-foreground">
                  {minMaxStr}
                </td>
                <td className="py-2 px-1 text-[10px] text-muted-foreground italic truncate max-w-[120px]" title={bonuses.map(b => `${b.source} (+${b.value})`).join(", ")}>
                  {bonuses.length > 0 ? bonuses.map(b => b.source).join(", ") : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={`mt-4 pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 ${t.fonts.mono} text-xs`}>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground uppercase">Edge</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">[{character.specialAttributes.edge}]</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold">[{character.specialAttributes.edge}]</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground uppercase">Essence</span>
          <span className="font-bold text-blue-400">[{character.specialAttributes.essence.toFixed(2)}]</span>
        </div>
        {(character.specialAttributes.magic !== undefined || character.specialAttributes.resonance !== undefined) && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground uppercase">
              {character.specialAttributes.magic !== undefined ? "Magic" : "Resonance"}
            </span>
            <span className={`font-bold ${character.specialAttributes.magic !== undefined ? "text-violet-400" : "text-cyan-400"}`}>
              [{character.specialAttributes.magic ?? character.specialAttributes.resonance}]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

// Section component removed and moved to ./components/Section.tsx

// =============================================================================
// SKILL LIST COMPONENT
// =============================================================================

interface SkillListProps {
  character: Character;
  onSelect?: (skillId: string, rating: number, attrAbbr?: string) => void;
  theme?: Theme;
}

function SkillList({ character, onSelect, theme }: SkillListProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const { activeSkills } = useSkills();
  const skills = character.skills || {};
  const specializations = character.skillSpecializations || {};
  const sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);

  if (sortedSkills.length === 0) {
    return <p className="text-sm text-zinc-500 italic px-1">No skills assigned</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left border-collapse ${t.fonts.mono} text-xs`}>
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px]">Skill</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Attr</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Rtg</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px]">Spec</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-right">Dice Pool</th>
          </tr>
        </thead>
        <tbody>
          {sortedSkills.map(([skillId, rating]) => {
            const skillData = activeSkills.find((s: SkillData) => s.id === skillId);
            const attrId = skillData?.linkedAttribute.toLowerCase();
            const attrDisplay = attrId ? ATTRIBUTE_DISPLAY[attrId] : null;

            // Calculate Dice Pool: Augmented Attribute + Rating
            let dicePool = rating;
            if (attrId) {
              const baseAttr = character.attributes[attrId] || 0;
              const bonuses = getAttributeBonus(character, attrId);
              const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
              dicePool += (baseAttr + augTotal);
            }

            const rawSpecs = specializations[skillId];
            // Handle both string and array formats for specializations
            const specs = rawSpecs ? (Array.isArray(rawSpecs) ? rawSpecs : [rawSpecs]) : [];
            const specDisplay = specs.length > 0 ? specs.join(", ") : "__________";

            return (
              <tr
                key={skillId}
                onClick={() => onSelect?.(skillId, dicePool, attrDisplay?.abbr)}
                className="group border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="py-2 px-1 max-w-[100px] truncate">
                  <span className={`capitalize ${t.id === 'modern-card' ? 'font-medium text-foreground' : 'text-foreground/90'}`}>
                    {skillId.replace(/-/g, " ")}
                  </span>
                </td>
                <td className="py-2 px-1 text-center">
                  {attrDisplay && (
                    <span className={`text-[10px] ${attrDisplay.color}`}>
                      {attrDisplay.abbr}
                    </span>
                  )}
                </td>
                <td className="py-2 px-1 text-center font-bold">
                  [{rating}]
                </td>
                <td className="py-2 px-1 max-w-[120px] truncate">
                  <span className="text-muted-foreground italic text-[10px]">
                    {specDisplay}
                  </span>
                </td>
                <td className="py-2 px-1 text-right font-bold tabular-nums">
                  <span className={t.id === 'modern-card' ? 'text-indigo-500' : 'text-emerald-500'}>
                    {dicePool}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// KNOWLEDGE & LANGUAGES COMPONENT
// =============================================================================

interface KnowledgeAndLanguagesProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
  theme?: Theme;
}

function KnowledgeAndLanguages({ character, onSelect, theme }: KnowledgeAndLanguagesProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const knowledgeSkills = character.knowledgeSkills || [];
  const languages = character.languages || [];

  if (knowledgeSkills.length === 0 && languages.length === 0) {
    return <p className="text-sm text-zinc-500 italic px-1">No knowledge skills or languages</p>;
  }

  return (
    <div className="space-y-6">
      {knowledgeSkills.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className={`w-full text-left border-collapse ${t.fonts.mono} text-xs`}>
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px]">Knowledge Skill</th>
                <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Type</th>
                <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {knowledgeSkills.map((skill, index) => (
                <tr
                  key={index}
                  onClick={() => onSelect?.(skill.rating, skill.name)}
                  className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="py-2 px-1 text-foreground/90 group-hover:text-foreground">{skill.name}</td>
                  <td className="py-2 px-1 text-center text-muted-foreground capitalize text-[10px]">{skill.category}</td>
                  <td className="py-2 px-1 text-right font-bold tabular-nums">[{skill.rating}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {languages.length > 0 && (
        <div className="pt-2 border-t border-border/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold text-muted-foreground uppercase ${t.fonts.mono}`}>Languages:</span>
            {languages.map((lang, index) => (
              <span
                key={index}
                onClick={() => !lang.isNative && onSelect?.(lang.rating, lang.name)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors ${lang.isNative
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground cursor-pointer"
                  }`}
              >
                {lang.name} {lang.isNative ? "(N)" : `(${lang.rating})`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
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
  theme?: Theme;
}

function GearItem({ item, theme }: GearItemProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  // Use a neutral but tech-y color for gear, maybe blue/indigo to distinguish from weapons
  const borderColor = t.id === 'modern-card' ? 'border-indigo-400/50' : 'border-indigo-500/40';
  const ratingColor = t.id === 'modern-card' ? 'text-indigo-600 bg-indigo-50' : 'text-indigo-400 bg-indigo-500/10';

  return (
    <div className={`flex items-center justify-between py-2 px-3 bg-muted/30 rounded border-l-2 transition-all ${borderColor} hover:bg-muted/50 group`}>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
            {item.name}
          </span>
          {item.rating && (
            <span className={`text-[9px] font-mono font-bold px-1.5 py-px rounded-sm ${ratingColor}`}>
              R{item.rating}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{item.category}</span>
      </div>
      {item.quantity > 1 && (
        <span className={`text-xs ${t.fonts.mono} font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded`}>
          ×{item.quantity}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// WEAPON HELPERS
// =============================================================================

function isMeleeWeapon(w: Weapon): boolean {
  const hasReach = typeof w.reach === 'number';
  const cat = w.category.toLowerCase();
  const subcat = (w.subcategory || "").toLowerCase();
  const dmg = w.damage.toLowerCase();
  const mode = w.mode || [];

  return hasReach ||
    cat.includes('melee') || subcat.includes('melee') ||
    cat.includes('blade') || subcat.includes('blade') ||
    cat.includes('club') || subcat.includes('club') ||
    cat.includes('unarmed') || subcat.includes('unarmed') ||
    dmg.includes('str') ||
    mode.length === 0;
}

// =============================================================================
// WEAPON CARD COMPONENT
// =============================================================================

interface WeaponTableProps {
  weapons: Weapon[];
  character: Character;
  type: "ranged" | "melee";
  onSelect?: (pool: number, label: string) => void;
  theme?: Theme;
}

function WeaponTable({ weapons, character, type, onSelect, theme }: WeaponTableProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const skills = character.skills || {};

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left border-collapse ${t.fonts.mono} text-xs`}>
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px]">Name</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Dmg</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">AP</th>
            {type === "ranged" ? (
              <>
                <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Acc</th>
                <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Mode</th>
              </>
            ) : (
              <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Reach</th>
            )}
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-right">Pool</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w, idx) => {
            const isMelee = isMeleeWeapon(w);

            let basePool = 0;
            let poolLabel = w.name;

            if (isMelee) {
              basePool = character.attributes?.strength || 3;
              poolLabel = `STR + ${w.name}`;
            } else {
              basePool = character.attributes?.agility || 3;
              poolLabel = `AGI + ${w.name}`;
            }

            const commonCombatSkills = ['pistols', 'automatics', 'longarms', 'unarmed-combat', 'blades', 'clubs', 'archery', 'throwing-weapons'];
            const foundSkill = commonCombatSkills.find(s => w.category.toLowerCase().includes(s.replace(/-/g, ' ')));

            if (foundSkill && skills[foundSkill]) {
              basePool += skills[foundSkill];
              poolLabel = `${isMelee ? 'STR' : 'AGI'} + ${foundSkill.replace(/-/g, ' ')}`;
            }

            return (
              <tr
                key={`${w.name}-${idx}`}
                onClick={() => onSelect?.(basePool, poolLabel)}
                className="group border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="py-2 px-1">
                  <div className="flex flex-col">
                    <span className={`font-bold ${t.id === 'modern-card' ? 'text-foreground' : 'text-foreground/90'}`}>
                      {w.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase opacity-70">
                      {w.subcategory}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-1 text-center">
                  <span className={t.id === 'modern-card' ? 'text-emerald-600' : 'text-emerald-500'}>
                    {w.damage}
                  </span>
                </td>
                <td className="py-2 px-1 text-center text-amber-500">
                  {w.ap}
                </td>
                {type === "ranged" ? (
                  <>
                    <td className="py-2 px-1 text-center text-cyan-500">
                      {w.accuracy || '-'}
                    </td>
                    <td className="py-2 px-1 text-center text-[9px] text-muted-foreground">
                      {w.mode?.join('/') || '-'}
                    </td>
                  </>
                ) : (
                  <td className="py-2 px-1 text-center text-purple-500">
                    {(w.reach != null && Number(w.reach) !== 0) ? w.reach : '-'}
                  </td>
                )}
                <td className="py-2 px-1 text-right font-bold tabular-nums">
                  <span className={t.id === 'modern-card' ? 'text-indigo-500' : 'text-emerald-500'}>
                    {basePool}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// ARMOR TABLE COMPONENT
// =============================================================================

interface ArmorTableProps {
  armor: ArmorItem[];
  theme?: Theme;
}

function ArmorTable({ armor, theme }: ArmorTableProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left border-collapse ${t.fonts.mono} text-xs`}>
        <thead>
          <tr className="border-b border-border/50">
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px]">Name</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-center">Rating</th>
            <th className="py-2 px-1 font-bold text-muted-foreground uppercase text-[10px] text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {armor.map((a, idx) => (
            <tr key={`${a.name}-${idx}`} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
              <td className="py-2 px-1">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground/90">{a.name}</span>
                </div>
              </td>
              <td className="py-2 px-1 text-center">
                <span className="text-blue-400 font-bold">{a.armorRating}</span>
              </td>
              <td className="py-2 px-1 text-right">
                {a.equipped ? (
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.5 rounded uppercase font-bold">
                    Equipped
                  </span>
                ) : (
                  <span className="text-[9px] text-muted-foreground/40 uppercase">Stored</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// SPELL CARD COMPONENT
// =============================================================================

interface SpellCardProps {
  spellId: string;
  spellsCatalog: SpellsCatalogData | null;
  onSelect?: (pool: number, label: string) => void;
  theme?: Theme;
}

function SpellCard({ spellId, spellsCatalog, onSelect, theme }: SpellCardProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const spell = useMemo(() => {
    if (!spellsCatalog) return null;
    for (const cat in spellsCatalog) {
      const categorySpells = spellsCatalog[cat as keyof typeof spellsCatalog] as SpellData[];
      const found = categorySpells.find((s) => s.id === spellId);
      if (found) return found;
    }
    return null;
  }, [spellId, spellsCatalog]);

  if (!spell) return null;

  return (
    <div
      onClick={() => onSelect?.(6, spell.name)}
      className={`p-3 rounded transition-all cursor-pointer group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : 'border-violet-500/50'}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold text-foreground transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground' : 'group-hover:text-violet-400'}`}>
              {spell.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter px-1.5 py-0.5 border border-border rounded">
              {spell.category}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{spell.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono mt-1">
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">TYPE</span>
              <span className="text-blue-400 uppercase">{spell.type}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">RANGE</span>
              <span className="text-emerald-400 uppercase">{spell.range}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">DUR</span>
              <span className="text-amber-400 uppercase">{spell.duration}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">Drain</div>
          <div className="text-sm font-mono text-violet-400 font-bold leading-none">{spell.drain}</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ADEPT POWER CARD COMPONENT
// =============================================================================

interface AdeptPowerCardProps {
  power: AdeptPower;
  theme?: Theme;
}

function AdeptPowerCard({ power, theme }: AdeptPowerCardProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  return (
    <div className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : 'border-amber-500/50'}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold text-foreground transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground' : 'group-hover:text-amber-400'}`}>
              {power.name}
            </span>
            {power.rating && (
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-tighter px-1.5 py-0.5 border border-amber-500/30 rounded bg-amber-500/5">
                Level {power.rating}
              </span>
            )}
          </div>
          {power.specification && (
            <p className="text-[11px] text-muted-foreground font-mono italic">
              Spec: {power.specification}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">Cost</div>
          <div className="text-sm font-mono text-amber-500 dark:text-amber-400 font-bold leading-none">{power.powerPointCost} PP</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// AUGMENTATION CARD COMPONENT
// =============================================================================

function AugmentationCard({ item, theme }: { item: CyberwareItem | BiowareItem, theme?: Theme }) {
  const isCyber = 'grade' in item && (item as CyberwareItem).grade !== undefined;
  const grade = isCyber ? (item as CyberwareItem).grade : (item as BiowareItem).grade;
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : (isCyber ? 'border-cyan-500/50' : 'border-emerald-500/50')}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold text-foreground transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground' : (isCyber ? 'group-hover:text-cyan-400' : 'group-hover:text-emerald-400')}`}>
              {item.name}
            </span>
            <span className={`text-[9px] font-mono uppercase tracking-tighter px-1.5 py-0.5 border rounded ${isCyber ? 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
              }`}>
              {grade}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono uppercase text-muted-foreground opacity-70">
            <span>{item.category}</span>
            {item.rating && <span>Rating: {item.rating}</span>}
          </div>
          {item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                <span key={attr} className="px-1.5 py-0.5 text-[10px] font-mono bg-muted text-emerald-400 rounded">
                  {attr.toUpperCase()} +{bonus}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">Essence</div>
          <div className="text-sm font-mono text-foreground/80 font-bold leading-none">{(item.essenceCost ?? 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// VEHICLE CARD COMPONENT
// =============================================================================

function VehicleCard({ vehicle, theme }: { vehicle: Vehicle | CharacterDrone | CharacterRCC, theme?: Theme }) {
  const isRCC = 'deviceRating' in vehicle;
  const isDrone = 'size' in vehicle;
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : (isRCC ? 'border-orange-500/50' : 'border-border/50')}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className={`font-bold text-foreground transition-colors ${t.id === 'modern-card' ? '' : 'group-hover:text-amber-400'}`}>{vehicle.name}</div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">
            {isRCC ? 'RCC' : isDrone ? `${(vehicle as CharacterDrone).size} Drone` : 'Vehicle'}
          </div>
        </div>
        {isRCC && (
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Rating</div>
            <div className="text-lg font-bold font-mono text-orange-400">{(vehicle as CharacterRCC).deviceRating}</div>
          </div>
        )}
      </div>

      {!isRCC && (
        <div className="grid grid-cols-4 gap-2 text-center border-t border-border/50 pt-2">
          {/* ... keeping simplified stats for brevity but reusing structure ... */}
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Hand</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).handling}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Spd</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).speed}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Body</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).body}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Armor</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).armor}</div>
          </div>
        </div>
      )}

      {isRCC && (
        <div className="grid grid-cols-2 gap-4 text-center border-t border-border/50 pt-2">
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Data Proc</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as CharacterRCC).dataProcessing}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">Firewall</div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as CharacterRCC).firewall}</div>
          </div>
        </div>
      )}
    </div>
  );
}


// =============================================================================
// THEME SELECTOR
// =============================================================================

function ThemeSelector({ currentTheme, onSelect }: { currentTheme: ThemeId, onSelect: (id: ThemeId) => void }) {
  return (
    <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-lg border border-border/50">
      {Object.values(THEMES).map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-all
            ${currentTheme === theme.id
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
          `}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN CHARACTER SHEET PAGE
// =============================================================================

function CharacterSheet({
  character,
  setCharacter,
  showDiceRoller,
  setShowDiceRoller,
  targetPool,
  setTargetPool,
  poolContext,
  setPoolContext,
  isAdmin,
  onRefresh,
}: {
  character: Character;
  showDiceRoller: boolean;
  setShowDiceRoller: (show: boolean) => void;
  targetPool: number;
  setTargetPool: (pool: number) => void;
  poolContext: string | undefined;
  setPoolContext: (context: string | undefined) => void;
  setCharacter: (character: Character) => void;
  isAdmin: boolean;
  onRefresh: () => void;
}) {
  const { loadRuleset } = useRuleset();
  const { ready, loading: rulesetLoading } = useRulesetStatus();
  const spellsCatalog = useSpells();
  
  // Get ruleset for quality effect calculations (must be called before any early returns)
  const ruleset = useMergedRuleset();

  // Theme State - use preferences hook for persistence
  const {
    preferences: sheetPrefs,
    updatePreference: updateSheetPref,
    isLoading: prefsLoading,
  } = useCharacterSheetPreferences(character.id);

  const currentThemeId = sheetPrefs.theme;
  const theme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME];

  // ActionPanel state
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

  // Persist theme choice
  const handleThemeChange = (id: ThemeId) => {
    updateSheetPref("theme", id);
  };

  // Handler for dice roller toggle that persists preference
  const handleToggleDiceRoller = useCallback(() => {
    const newValue = !showDiceRoller;
    setShowDiceRoller(newValue);
    updateSheetPref("diceRollerVisible", newValue);
  }, [showDiceRoller, setShowDiceRoller, updateSheetPref]);

  // Calculate derived values with quality effects (must be called before any early returns)
  const physicalMonitorMax = Math.ceil((character.attributes?.body || 1) / 2) + 8;
  const stunMonitorMax = Math.ceil((character.attributes?.willpower || 1) / 2) + 8;
  
  // Calculate wound modifier (tracks both physical and stun damage)
  const woundModifier = useMemo(() => {
    if (ruleset) {
      const physicalMod = calculateWoundModifier(character, ruleset, "physical");
      const stunMod = calculateWoundModifier(character, ruleset, "stun");
      return physicalMod + stunMod;
    }
    // Fallback to base calculation: -1 per 3 boxes on either track
    const physicalDamage = character.condition?.physicalDamage || 0;
    const stunDamage = character.condition?.stunDamage || 0;
    return -Math.floor(physicalDamage / 3) - Math.floor(stunDamage / 3);
  }, [character, ruleset]);

  // Handler for when damage is applied via interactive monitors
  const handleDamageApplied = useCallback((type: "physical" | "stun" | "overflow", newValue: number) => {
    // Update local character state to reflect new damage
    setCharacter({
      ...character,
      condition: {
        ...character.condition,
        [type === "physical" ? "physicalDamage" : type === "stun" ? "stunDamage" : "overflowDamage"]: newValue,
      },
    });
  }, [character, setCharacter]);

  
  // Calculate limits with quality modifiers if ruleset is available
  const physicalLimit = useMemo(() => {
    if (ruleset) {
      return calculateLimit(character, ruleset, "physical");
    }
    // Fallback to base calculation
    return Math.ceil(
      (((character.attributes?.strength || 1) * 2) +
        (character.attributes?.body || 1) +
        (character.attributes?.reaction || 1)) / 3
    );
  }, [character, ruleset]);

  const mentalLimit = useMemo(() => {
    if (ruleset) {
      return calculateLimit(character, ruleset, "mental");
    }
    // Fallback to base calculation
    return Math.ceil(
      (((character.attributes?.logic || 1) * 2) +
        (character.attributes?.intuition || 1) +
        (character.attributes?.willpower || 1)) / 3
    );
  }, [character, ruleset]);

  const socialLimit = useMemo(() => {
    if (ruleset) {
      return calculateLimit(character, ruleset, "social");
    }
    // Fallback to base calculation
    return Math.ceil(
      (((character.attributes?.charisma || 1) * 2) +
        (character.attributes?.willpower || 1) +
        Math.ceil(character.specialAttributes?.essence || 6)) / 3
    );
  }, [character, ruleset]);

  if (!ready || rulesetLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Synchronizing Ruleset Data...
          </span>
        </div>
      </div>
    );
  }

  const initiative = (character.attributes?.reaction || 1) + (character.attributes?.intuition || 1);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${character.name || 'character'}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={`character-sheet min-h-screen transition-colors duration-300 ${theme.colors.background} p-4 sm:p-6 lg:p-8`}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between print-hidden">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors back-button"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Characters
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded border border-border transition-colors"
              title="Export Character JSON"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {character.editionCode}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-2 mb-4 print-hidden">
          <ThemeSelector currentTheme={currentThemeId} onSelect={handleThemeChange} />
          <Button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onPress={() => window.print()}
            aria-label="Print character sheet"
          >
            <PrinterIcon className="w-5 h-5" />
          </Button>
          <Button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onPress={handleToggleDiceRoller}
          >
            <DiceIcon className={`w-6 h-6 ${showDiceRoller ? theme.colors.accent : ""}`} />
          </Button>
          {character.status === "active" && (
            <>
              <Link
                href={`/characters/${character.id}/contacts`}
                className="p-2 text-muted-foreground hover:text-emerald-400 transition-colors"
                aria-label="Contact Network"
              >
                <UsersIcon className="w-5 h-5" />
              </Link>
              <Link
                href={`/characters/${character.id}/advancement`}
                className="p-2 text-muted-foreground hover:text-emerald-400 transition-colors"
                aria-label="Character Advancement"
              >
                <TrendingUpIcon className="w-5 h-5" />
              </Link>
            </>
          )}
          {(character.status === "draft") && (
            <Link
              href={`/characters/${character.id}/edit`}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <EditIcon className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Admin Actions Panel - only visible to admins */}
        {isAdmin && (
          <AdminActionsPanel
            character={character}
            isAdmin={isAdmin}
            theme={theme}
            onStatusChange={onRefresh}
          />
        )}

        {/* Character Header Card */}
        <div className={`character-header relative overflow-hidden ${theme.components.section.wrapper} p-6`}>
          {/* Background Elements - Theme dependent */}
          {theme.id === 'neon-rain' ? (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none print-hidden" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none print-hidden" />
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] print-hidden" />
            </>
          ) : (
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-200/20 dark:bg-stone-800/20 blur-3xl rounded-full pointer-events-none print-hidden" />
          )}

          <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className={`character-name text-3xl md:text-4xl ${theme.fonts.heading} ${theme.colors.heading}`}>
                  {character.name}
                </h1>
                <StabilityShield characterId={character.id} size="md" showTooltip />
                <span className={`px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded border ${character.status === "active" ? theme.components.badge.positive :
                  character.status === "draft" ? theme.components.badge.neutral :
                    theme.components.badge.neutral
                  }`}>
                  {character.status}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${theme.fonts.mono} ${theme.colors.muted}`}>
                <span>{character.metatype}</span>
                <span>•</span>
                <span className="capitalize">{(character.magicalPath || "mundane").replace("-", " ")}</span>
                {character.editionCode && (
                  <>
                    <span>•</span>
                    <span>{character.editionCode}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${theme.fonts.mono}`}>
              <Link
                href={`/characters/${character.id}/advancement`}
                className={`p-3 rounded border ${theme.colors.card} ${theme.colors.border} flex flex-col items-center min-w-[80px] cursor-pointer hover:border-emerald-500/50 transition-colors group`}
              >
                <span className="text-xs text-muted-foreground uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Karma</span>
                <span className={`text-xl font-bold ${theme.colors.accent}`}>{character.karmaCurrent}</span>
                <span className="text-[10px] text-muted-foreground">of {character.karmaTotal} earned</span>
              </Link>
              <div className={`p-3 rounded border ${theme.colors.card} ${theme.colors.border} flex flex-col items-center min-w-[80px]`}>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Nuyen</span>
                <span className={`text-xl font-bold ${theme.colors.heading}`}>¥{character.nuyen.toLocaleString()}</span>
              </div>
              <div className={`p-3 rounded border ${theme.colors.card} ${theme.colors.border} flex flex-col items-center min-w-[80px]`}>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Essence</span>
                <span className={`text-xl font-bold ${theme.colors.heading}`}>
                  {character.specialAttributes?.essence?.toFixed(2) || "6.00"}
                </span>
              </div>
              <div className={`p-3 rounded border ${theme.colors.card} ${theme.colors.border} flex flex-col items-center min-w-[80px]`}>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Edge</span>
                <span className={`text-xl font-bold ${theme.colors.accent}`}>
                  {character.specialAttributes?.edge}/{character.specialAttributes?.edge}
                </span>
              </div>
            </div>
          </div>

          {/* Dice Roller Modal */}
          <ModalOverlay
            isOpen={showDiceRoller}
            onOpenChange={setShowDiceRoller}
            isDismissable
            className={({ isEntering, isExiting }) => `
              fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
              ${isEntering ? 'animate-in fade-in duration-300' : ''}
              ${isExiting ? 'animate-out fade-out duration-200' : ''}
            `}
          >
            <Modal
              className={({ isEntering, isExiting }) => `
                w-full max-w-lg overflow-hidden rounded-xl border ${theme.colors.border} ${theme.colors.card} shadow-2xl
                ${isEntering ? 'animate-in zoom-in-95 duration-300' : ''}
                ${isExiting ? 'animate-out zoom-out-95 duration-200' : ''}
              `}
            >
              <Dialog className="outline-none">
                {({ close }) => (
                  <div className="flex flex-col">
                    <div className={`flex items-center justify-between p-4 border-b ${theme.colors.border}`}>
                      <Heading slot="title" className={`text-lg font-bold ${theme.colors.heading}`}>
                        Dice Roller
                      </Heading>
                      <Button
                        onPress={close}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                      <DiceRoller
                        initialPool={targetPool}
                        contextLabel={poolContext || "Quick Roll"}
                        compact={false}
                        showHistory={true}
                        characterId={character.id}
                        persistRolls={true}
                      />
                    </div>
                  </div>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </div>

        {/* Main Content Grid */}
        <div className="character-sheet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column - Attributes & Condition */}
          <div className="space-y-6">
            {/* Attributes */}
            <Section title="Attributes" theme={theme}>
              <AttributesTable
                character={character}
                theme={theme}
                onSelect={(attrId, val) => {
                  setTargetPool(val);
                  setPoolContext(ATTRIBUTE_DISPLAY[attrId]?.abbr);
                  setShowDiceRoller(true);
                }}
              />
            </Section>

            {/* Derived Stats */}
            <Section theme={theme} title="Derived Stats">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded">
                  <span className="block text-xs font-mono text-muted-foreground uppercase">Physical</span>
                  <span className="text-xl font-bold text-red-500">{physicalLimit}</span>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <span className="block text-xs font-mono text-muted-foreground uppercase">Mental</span>
                  <span className="text-xl font-bold text-blue-400">{mentalLimit}</span>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <span className="block text-xs font-mono text-muted-foreground uppercase">Social</span>
                  <span className="text-xl font-bold text-pink-400">{socialLimit}</span>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <span className="block text-xs font-mono text-muted-foreground uppercase">Initiative</span>
                  <span className="text-xl font-bold text-emerald-400">{initiative}+1d6</span>
                </div>
              </div>
            </Section>

            {/* Condition Monitors */}
            <Section theme={theme} title="Condition">
              <div className="space-y-6">
                {/* Wound Modifier Banner */}
                {woundModifier !== 0 && (
                  <div className={`p-2 rounded text-center ${
                    theme.id === 'modern-card' 
                      ? 'bg-amber-50 border border-amber-200 text-amber-700' 
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    <span className="text-xs font-mono uppercase">Total Wound Modifier: </span>
                    <span className="font-bold">{woundModifier}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <InteractiveConditionMonitor
                    characterId={character.id}
                    type="physical"
                    current={character.condition?.physicalDamage ?? 0}
                    max={physicalMonitorMax}
                    theme={theme}
                    readonly={character.status !== "draft" && character.status !== "active"}
                    onDamageApplied={(newValue) => handleDamageApplied("physical", newValue)}
                  />
                  <InteractiveConditionMonitor
                    characterId={character.id}
                    type="stun"
                    current={character.condition?.stunDamage ?? 0}
                    max={stunMonitorMax}
                    theme={theme}
                    readonly={character.status !== "draft" && character.status !== "active"}
                    onDamageApplied={(newValue) => handleDamageApplied("stun", newValue)}
                  />
                </div>
                <InteractiveConditionMonitor
                  characterId={character.id}
                  type="overflow"
                  current={character.condition?.overflowDamage ?? 0}
                  max={character.attributes?.body || 3}
                  theme={theme}
                  readonly={character.status !== "draft" && character.status !== "active"}
                  onDamageApplied={(newValue) => handleDamageApplied("overflow", newValue)}
                />
              </div>
            </Section>

            {/* Combat Quick Reference */}
            <Section theme={theme} title="Combat">
              <CombatQuickReference
                character={character}
                woundModifier={woundModifier}
                physicalLimit={physicalLimit}
                theme={theme}
                onPoolSelect={(pool, context) => {
                  setTargetPool(pool);
                  setPoolContext(context);
                  setShowDiceRoller(true);
                }}
              />
            </Section>

            {/* Action Panel - Edge and Quick Rolls */}
            <ActionPanel
              character={character}
              woundModifier={woundModifier}
              physicalLimit={physicalLimit}
              mentalLimit={mentalLimit}
              socialLimit={socialLimit}
              isExpanded={actionPanelExpanded}
              onToggleExpand={() => setActionPanelExpanded(!actionPanelExpanded)}
              onOpenDiceRoller={(pool, context) => {
                setTargetPool(pool);
                setPoolContext(context);
                setShowDiceRoller(true);
              }}
              theme={theme}
            />

            {/* Quick Combat Controls */}
            <QuickCombatControls
              character={character}
              editionCode={character.editionCode}
              theme={theme}
            />

            {/* Quick NPC Panel - Add opponents for testing */}
            <QuickNPCPanel
              theme={theme}
            />
          </div>

          {/* Middle Column - Skills & Powers */}
          <div className="space-y-6">
            <Section theme={theme} title="Skills">
              <SkillList
                theme={theme}
                character={character}
                onSelect={(skillId, pool, attrAbbr) => {
                  const skillName = skillId.replace(/-/g, " ");
                  const context = attrAbbr ? `${attrAbbr} + ${skillName}` : skillName;
                  setTargetPool(pool);
                  setPoolContext(context);
                  setShowDiceRoller(true);
                }}
              />
            </Section>

            {/* Spells & Adept Powers */}
            {(character.spells?.length || 0) > 0 || (character.adeptPowers?.length || 0) > 0 ? (
              <Section theme={theme} title="Magic & Resonance">
                <div className="space-y-4">
                  {character.spells && character.spells.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-violet-500 uppercase mb-2 block">Spells</span>
                      <div className="space-y-3">
                        {character.spells.map((spellEntry, idx) => {
                          // Handle both string IDs and legacy object format
                          const spellId = typeof spellEntry === 'string' ? spellEntry : (spellEntry as { id: string }).id;
                          return (
                          <SpellCard
                            theme={theme}
                            key={spellId || idx}
                            spellId={spellId}
                            spellsCatalog={spellsCatalog}
                            onSelect={(pool, label) => {
                              setTargetPool(pool);
                              setPoolContext(label);
                              setShowDiceRoller(true);
                            }}
                          />
                        )})}
                      </div>
                    </div>
                  )}
                  {character.adeptPowers && character.adeptPowers.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-amber-500 uppercase mb-2 block">Adept Powers</span>
                      <div className="space-y-3">
                        {character.adeptPowers.map((power, idx) => (
                          <AdeptPowerCard theme={theme} key={idx} power={power} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            ) : null}

            {/* Knowledge Skills & Languages */}
            <Section theme={theme} title="Knowledge & Languages">
              <KnowledgeAndLanguages
                character={character}
                theme={theme}
                onSelect={(pool, label) => {
                  setTargetPool(pool);
                  setPoolContext(label);
                  setShowDiceRoller(true);
                }}
              />
            </Section>
          </div>

          {/* Right Column - Gear & Assets */}
          <div className="space-y-6">
            {/* Combat Gear */}
            {(character.weapons?.length || character.armor?.length) ? (
              <Section theme={theme} title="Combat Gear">
                <div className="space-y-6">
                  {/* Ranged Weapons */}
                  {(() => {
                    const ranged = character.weapons?.filter(w => !isMeleeWeapon(w)) || [];
                    if (ranged.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block ml-1">Ranged Weapons</span>
                        <WeaponTable
                          theme={theme}
                          type="ranged"
                          character={character}
                          weapons={ranged}
                          onSelect={(pool, label) => {
                            setTargetPool(pool);
                            setPoolContext(label);
                            setShowDiceRoller(true);
                          }}
                        />
                      </div>
                    );
                  })()}

                  {/* Melee Weapons */}
                  {(() => {
                    const melee = character.weapons?.filter(w => isMeleeWeapon(w)) || [];
                    if (melee.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block ml-1">Melee Weapons</span>
                        <WeaponTable
                          theme={theme}
                          type="melee"
                          character={character}
                          weapons={melee}
                          onSelect={(pool, label) => {
                            setTargetPool(pool);
                            setPoolContext(label);
                            setShowDiceRoller(true);
                          }}
                        />
                      </div>
                    );
                  })()}

                  {/* Armor & Clothing */}
                  {character.armor && character.armor.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block ml-1">Armor & Clothing</span>
                      <ArmorTable
                        theme={theme}
                        armor={character.armor}
                      />
                    </div>
                  )}
                </div>
              </Section>
            ) : null}

            {/* Augmentations */}
            {(character.cyberware?.length || character.bioware?.length) ? (
              <Section theme={theme} title="Augmentations">
                <div className="space-y-4">
                  {character.cyberware && character.cyberware.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-cyan-500 uppercase mb-2 block">Cyberware</span>
                      <div className="space-y-3">
                        {character.cyberware.map((item, idx) => (
                          <AugmentationCard theme={theme} key={`cyber-${idx}`} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                  {character.bioware && character.bioware.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-emerald-500 uppercase mb-2 block">Bioware</span>
                      <div className="space-y-3">
                        {character.bioware.map((item, idx) => (
                          <AugmentationCard theme={theme} key={`bio-${idx}`} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            ) : null}

            {/* Vehicles & Assets */}
            {(character.vehicles?.length || character.drones?.length || character.rccs?.length) ? (
              <Section theme={theme} title="Gear & Assets">
                <div className="space-y-3">
                  {character.rccs && character.rccs.map((rcc, idx) => <VehicleCard theme={theme} key={`rcc-${idx}`} vehicle={rcc} />)}
                  {character.vehicles && character.vehicles.map((v, idx) => <VehicleCard theme={theme} key={`veh-${idx}`} vehicle={v} />)}
                  {character.drones && character.drones.map((d, idx) => <VehicleCard theme={theme} key={`drone-${idx}`} vehicle={d} />)}
                </div>
              </Section>
            ) : null}

            {/* Qualities */}
            <QualitiesSection 
              character={character} 
              theme={theme} 
              onUpdate={(updated) => setCharacter(updated)}
            />

            {/* General Gear */}
            <Section theme={theme} title="General Gear">
              {!character.gear || character.gear.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No gear acquired</p>
              ) : (
                <div className="space-y-2">
                  {character.gear.map((item, index) => (
                    <GearItem key={`gear-${index}`} item={item} theme={theme} />
                  ))}
                </div>
              )}
            </Section>

            {/* Contacts */}
            <Section theme={theme} title="Contacts">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {character.contacts?.length || 0} contacts in network
                </span>
                <Link
                  href={`/characters/${character.id}/contacts`}
                  className={`text-xs ${theme.colors.accent} hover:underline`}
                >
                  Manage Contacts →
                </Link>
              </div>
              {!character.contacts || character.contacts.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No contacts established</p>
              ) : (
                <div className="space-y-2">
                  {character.contacts.slice(0, 5).map((contact, index) => (
                    <div
                      key={`contact-${index}`}
                      className="p-3 bg-muted/50 rounded border-l-2 border-primary/40 hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{contact.name}</span>
                        {contact.type && (
                          <span className="text-xs text-muted-foreground">{contact.type}</span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          Connection: <span className="text-amber-500 dark:text-amber-400 font-mono">{contact.connection}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Loyalty: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{contact.loyalty}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                  {character.contacts.length > 5 && (
                    <Link
                      href={`/characters/${character.id}/contacts`}
                      className="block text-center text-xs text-muted-foreground hover:text-foreground py-2"
                    >
                      +{character.contacts.length - 5} more contacts...
                    </Link>
                  )}
                </div>
              )}
            </Section>

            {/* Lifestyles */}
            {character.lifestyles && character.lifestyles.length > 0 && (
              <Section theme={theme} title="Lifestyles">
                <div className="space-y-3">
                  {character.lifestyles.map((lifestyle, index) => {
                    const isPrimary = character.primaryLifestyleId === lifestyle.id;
                    return (
                      <div
                        key={`lifestyle-${index}`}
                        className={`p-3 rounded border-l-2 transition-colors ${isPrimary
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-muted/30 border-border"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground/90 capitalize">
                              {lifestyle.type}
                            </span>
                            {isPrimary && (
                              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-mono tracking-tighter">
                                Primary
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-emerald-400">
                            ¥{lifestyle.monthlyCost.toLocaleString()}/mo
                          </span>
                        </div>
                        {lifestyle.location && (
                          <p className="text-xs text-muted-foreground mt-1">{lifestyle.location}</p>
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
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          <span className="font-mono">ID: {character.id}</span>
          <span className="font-mono">
            Created: {new Date(character.createdAt).toLocaleDateString()}
            {character.updatedAt && ` • Updated: ${new Date(character.updatedAt).toLocaleDateString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [targetPool, setTargetPool] = useState(6);
  const [poolContext, setPoolContext] = useState<string | undefined>(undefined);

  // Check if user is admin
  const isAdmin = user?.role?.includes("administrator") ?? false;

  const fetchCharacter = useCallback(async () => {
    try {
      const response = await fetch(`/api/characters/${resolvedParams.id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load character");
      }

      setCharacter(data.character);
      return data.character;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  // Handle status change - redirect to edit page if reverted to draft
  const handleStatusChange = useCallback(async () => {
    const updatedCharacter = await fetchCharacter();
    if (updatedCharacter?.status === "draft") {
      // Redirect to edit page for draft characters
      window.location.href = `/characters/${resolvedParams.id}/edit`;
    }
  }, [fetchCharacter, resolvedParams.id]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Loading Runner Data...
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
          className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          ← Return to characters
        </Link>
      </div>
    );
  }

  return (
    <RulesetProvider>
      <CombatSessionProvider characterId={character.id} pollInterval={5000}>
        <CharacterSheet
          character={character}
          setCharacter={setCharacter}
          showDiceRoller={showDiceRoller}
          setShowDiceRoller={setShowDiceRoller}
          targetPool={targetPool}
          setTargetPool={setTargetPool}
          poolContext={poolContext}
          setPoolContext={setPoolContext}
          isAdmin={isAdmin}
          onRefresh={handleStatusChange}
        />
      </CombatSessionProvider>
    </RulesetProvider>
  );
}

