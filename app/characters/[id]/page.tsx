"use client";

import { useEffect, useState, use, useMemo } from "react";
import { Link, Button } from "react-aria-components";
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
import {
  RulesetProvider,
  useRuleset,
  useRulesetStatus,
  useSpells,
  type SpellData,
  type SpellsCatalogData
} from "@/lib/rules";
import { DownloadIcon } from "lucide-react";
import { THEMES, DEFAULT_THEME, type Theme, type ThemeId } from "@/lib/themes";

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



// =============================================================================
// CONDITION MONITOR COMPONENT
// =============================================================================

interface ConditionMonitorProps {
  label: string;
  maxBoxes: number;
  filledBoxes: number;
  color: "physical" | "stun";
  theme?: Theme;
}

function ConditionMonitor({ label, maxBoxes, filledBoxes, color, theme }: ConditionMonitorProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  const colorClasses = {
    physical: {
      filled: "bg-red-500 border-red-400 shadow-red-500/50",
      empty: t.id === 'modern-card' ? "border-red-200 bg-red-50" : "border-red-900/50 bg-red-950/30",
      text: "text-red-500 dark:text-red-400",
    },
    stun: {
      filled: "bg-amber-500 border-amber-400 shadow-amber-500/50",
      empty: t.id === 'modern-card' ? "border-amber-200 bg-amber-50" : "border-amber-900/50 bg-amber-950/30",
      text: "text-amber-600 dark:text-amber-400",
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
                } ${t.id === 'modern-card' ? 'rounded-sm' : ''}`}
              style={t.id === 'neon-rain' ? { clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" } : undefined}
            />
          );
        })}
        {/* Wound modifier marker */}
        <span className="ml-1 text-xs text-muted-foreground tabular-nums">
          {Math.floor((i + 3) / 3) > 0 ? `-${Math.floor((i + 3) / 3)}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs ${t.fonts.mono} uppercase tracking-wider ${colors.text}`}>
          {label}
        </span>
        <span className={`text-xs ${t.fonts.mono} text-muted-foreground`}>
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
  onSelect?: (id: string, value: number) => void;
  theme?: Theme;
}

function AttributeBlock({ id, value, max, onSelect, theme }: AttributeBlockProps) {
  const display = ATTRIBUTE_DISPLAY[id];
  const t = theme || THEMES[DEFAULT_THEME];
  if (!display) return null;

  const percentage = max ? (value / max) * 100 : (value / 6) * 100;

  return (
    <button
      onClick={() => onSelect?.(id, value)}
      className="group relative w-full text-left transition-transform active:scale-[0.98]"
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-muted/50 to-transparent rounded transition-colors ${t.id === 'modern-card' ? 'group-hover:bg-muted' : 'group-hover:from-emerald-500/10'}`} />
      <div className="relative flex items-center gap-3 p-3">
        <span className={`${t.fonts.mono} text-sm font-bold ${display.color}`}>
          {display.abbr}
        </span>
        <div className="flex-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${t.id === 'modern-card'
                ? `${display.color.replace('text-', 'bg-')} bg-opacity-80`
                : 'bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 group-hover:from-emerald-500 group-hover:to-emerald-400'
                }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <span className={`${t.fonts.mono} text-lg font-bold text-foreground tabular-nums w-6 text-right`}>
          {value}
        </span>
      </div>
    </button>
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
  theme?: Theme;
}

function Section({ title, icon, children, className = "", theme }: SectionProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div className={`relative ${className}`}>
      {/* Corner accents */}
      {t.components.section.cornerAccent && (
        <>
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-emerald-500/50" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-emerald-500/50" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-emerald-500/50" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-emerald-500/50" />
        </>
      )}

      <div className={t.components.section.wrapper}>
        <div className={`flex items-center gap-2 px-4 py-2 ${t.components.section.header}`}>
          {icon}
          <h3 className={t.components.section.title}>
            {title}
          </h3>
          <div className={`flex-1 h-px ml-2 ${t.id === 'modern-card' ? 'bg-stone-200 dark:bg-stone-800' : 'bg-gradient-to-r from-emerald-500/20 to-transparent'}`} />
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
  onSelect?: (skillId: string, rating: number, attrAbbr?: string) => void;
  theme?: Theme;
}

function SkillList({ skills, linkedAttributes = {}, onSelect, theme }: SkillListProps) {
  const t = theme || THEMES[DEFAULT_THEME];
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
          <button
            key={skillId}
            onClick={() => onSelect?.(skillId, rating, attrDisplay?.abbr)}
            className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted transition-all group text-left w-full active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm text-foreground/80 capitalize transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground font-medium' : 'group-hover:text-emerald-400'}`}>
                {skillId.replace(/-/g, " ")}
              </span>
              {attrDisplay && (
                <span className={`text-xs ${t.fonts.mono} ${attrDisplay.color} opacity-50 group-hover:opacity-100`}>
                  [{attrDisplay.abbr}]
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-sm ${t.id === 'modern-card' ? 'bg-indigo-500 group-hover:bg-indigo-600' : 'bg-emerald-500 group-hover:bg-emerald-400'}`}
                />
              ))}
              {Array.from({ length: Math.max(0, 6 - rating) }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-muted rounded-sm"
                />
              ))}
              <span className={`ml-2 text-sm ${t.fonts.mono} text-muted-foreground tabular-nums w-4 text-right`}>
                {rating}
              </span>
            </div>
          </button>
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
  theme?: Theme;
}

function QualityBadge({ name, type, theme }: QualityBadgeProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const isPositive = type === "positive";
  const badgeStyle = isPositive ? t.components.badge.positive : t.components.badge.negative;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${badgeStyle}`}
    >
      <span className={`mr-1 ${isPositive ? (t.id === 'modern-card' ? "text-green-600 dark:text-green-400" : "text-emerald-500") : (t.id === 'modern-card' ? "text-red-600 dark:text-red-400" : "text-red-500")}`}>
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
  theme?: Theme;
}

function GearItem({ item, theme }: GearItemProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  return (
    <div className={`flex items-center justify-between py-2 px-3 bg-muted/50 rounded border-l-2 group hover:bg-muted/80 transition-colors ${t.id === 'modern-card' ? 'border-primary/20 hover:border-primary' : 'border-primary/40'
      }`}>
      <div>
        <span className={`text-sm text-foreground transition-colors ${t.id === 'modern-card' ? '' : 'group-hover:text-emerald-400'}`}>{item.name}</span>
        {item.rating && (
          <span className="ml-2 text-xs text-muted-foreground">R{item.rating}</span>
        )}
        <span className="ml-2 text-xs text-muted-foreground">{item.category}</span>
      </div>
      {item.quantity > 1 && (
        <span className={`text-xs ${t.fonts.mono} text-muted-foreground`}>×{item.quantity}</span>
      )}
    </div>
  );
}

// =============================================================================
// WEAPON CARD COMPONENT
// =============================================================================

interface WeaponCardProps {
  weapon: Weapon;
  onSelect?: (weapon: Weapon) => void;
  theme?: Theme;
}

function WeaponCard({ weapon, onSelect, theme }: WeaponCardProps) {
  const isMelee = !!weapon.reach || !weapon.ammoCapacity;
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div
      onClick={() => onSelect?.(weapon)}
      className={`p-3 rounded transition-all cursor-pointer group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : 'border-emerald-500/50'}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold text-foreground transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground' : 'group-hover:text-emerald-400'}`}>
              {weapon.name}
            </span>
            <span className={`text-[10px] ${t.fonts.mono} text-muted-foreground uppercase tracking-tighter px-1.5 py-0.5 border border-border rounded`}>
              {weapon.category}
            </span>
          </div>

          <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[11px] ${t.fonts.mono}`}>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground">DMG</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{weapon.damage}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground">AP</span>
              <span className="text-amber-500">{weapon.ap}</span>
            </div>
            {isMelee ? (
              weapon.reach !== undefined && (
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground">REACH</span>
                  <span className="text-purple-500 dark:text-purple-400">{weapon.reach}</span>
                </div>
              )
            ) : (
              <>
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground">ACC</span>
                  <span className="text-cyan-600 dark:text-cyan-400">{weapon.accuracy}</span>
                </div>
                {weapon.mode && weapon.mode.length > 0 && (
                  <div className="flex gap-1.5">
                    <span className="text-muted-foreground">MODE</span>
                    <span className="text-orange-500 dark:text-orange-400">{weapon.mode.join(", ")}</span>
                  </div>
                )}
                {weapon.recoil !== undefined && weapon.recoil > 0 && (
                  <div className="flex gap-1.5">
                    <span className="text-muted-foreground">RC</span>
                    <span className="text-rose-500 dark:text-rose-400">{weapon.recoil}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!isMelee && weapon.ammoCapacity && (
          <div className="text-right">
            <div className={`text-[10px] text-muted-foreground uppercase ${t.fonts.mono}`}>Ammo</div>
            <div className={`text-sm ${t.fonts.mono} text-foreground/80`}>
              {weapon.currentAmmo ?? weapon.ammoCapacity}/{weapon.ammoCapacity}
              <span className="text-[10px] text-muted-foreground ml-1">({weapon.ammoType})</span>
            </div>
          </div>
        )}
      </div>

      {/* Modifications */}
      {weapon.modifications && weapon.modifications.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-1.5">
          {weapon.modifications.map((mod, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 bg-muted/50 text-[10px] text-muted-foreground rounded border border-border flex items-center gap-1"
              title={mod.mount ? `Mount: ${mod.mount}` : undefined}
            >
              {mod.isBuiltIn && <span className="w-1 h-1 rounded-full bg-emerald-500/50" />}
              {mod.name}
              {mod.rating && <span className="text-[9px] text-muted-foreground opacity-70">R{mod.rating}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ARMOR CARD COMPONENT
// =============================================================================

interface ArmorCardProps {
  armor: ArmorItem;
  theme?: Theme;
}

function ArmorCard({ armor, theme }: ArmorCardProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  return (
    <div className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === 'modern-card' ? t.components.card.border : 'border-blue-500/50'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold text-foreground transition-colors ${t.id === 'modern-card' ? 'group-hover:text-foreground' : 'group-hover:text-blue-400'}`}>
              {armor.name}
            </span>
            {armor.equipped && (
              <span className="text-[10px] bg-blue-500 text-white font-mono uppercase tracking-tighter px-1.5 py-0.5 rounded">
                Equipped
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">{armor.category}</p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">Armor</div>
          <div className="text-xl font-bold font-mono text-blue-400 leading-none">
            {armor.armorRating}
          </div>
        </div>
      </div>

      {/* Modifications & Capacity */}
      {(armor.capacity !== undefined || (armor.modifications && armor.modifications.length > 0)) && (
        <div className="mt-2 pt-2 border-t border-border/50 space-y-2">
          {armor.capacity !== undefined && (
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground uppercase">Capacity</span>
              <span className="text-foreground/80">
                {armor.capacityUsed ?? 0}/{armor.capacity}
              </span>
            </div>
          )}
          {armor.modifications && armor.modifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {armor.modifications.map((mod, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-muted/50 text-[10px] text-muted-foreground rounded border border-border"
                >
                  {mod.name}
                  {mod.rating && <span className="text-[9px] text-muted-foreground opacity-70 ml-1">R{mod.rating}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
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
        <div className="text-right flex-shrink-0">
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
        <div className="text-right flex-shrink-0">
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
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">Essence</div>
          <div className="text-sm font-mono text-foreground/80 font-bold leading-none">{item.essenceCost.toFixed(2)}</div>
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
  showDiceRoller,
  setShowDiceRoller,
  targetPool,
  setTargetPool,
  poolContext,
  setPoolContext,
}: {
  character: Character;
  showDiceRoller: boolean;
  setShowDiceRoller: (show: boolean) => void;
  targetPool: number;
  setTargetPool: (pool: number) => void;
  poolContext: string | undefined;
  setPoolContext: (context: string | undefined) => void;
}) {
  const { loadRuleset } = useRuleset();
  const { ready, loading: rulesetLoading } = useRulesetStatus();
  const spellsCatalog = useSpells();

  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(
    (character.uiPreferences?.theme as ThemeId) || DEFAULT_THEME
  );

  const theme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME];

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

  // Persist theme choice (mock persistence for now, ideally would partial update character)
  const handleThemeChange = (id: ThemeId) => {
    setCurrentThemeId(id);
    // In a real app we would save this to the server
    // For now we rely on the parent updating the character or local state
    // We can use localStorage as a fallback if we want client-side persistence only
    localStorage.setItem(`character-theme-${character.id}`, id);
  };

  // Load from local storage on mount if not in character
  useEffect(() => {
    if (!character.uiPreferences?.theme) {
      const saved = localStorage.getItem(`character-theme-${character.id}`);
      if (saved && THEMES[saved as ThemeId] && saved !== currentThemeId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentThemeId(saved as ThemeId);
      }
    }
  }, [character.id, character.uiPreferences, currentThemeId]);

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
    <div className={`min-h-screen transition-colors duration-300 ${theme.colors.background} p-4 sm:p-6 lg:p-8`}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
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
        <div className="flex items-center justify-end gap-2 mb-4">
          <ThemeSelector currentTheme={currentThemeId} onSelect={handleThemeChange} />
          <Button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onPress={() => setShowDiceRoller(!showDiceRoller)}
          >
            <DiceIcon className={`w-6 h-6 ${showDiceRoller ? theme.colors.accent : ""}`} />
          </Button>
          {(character.status === "draft") && (
            <Link
              href={`/characters/${character.id}/edit`}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <EditIcon className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Character Header Card */}
        <div className={`relative overflow-hidden ${theme.components.section.wrapper} p-6`}>
          {/* Background Elements - Theme dependent */}
          {theme.id === 'neon-rain' ? (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
            </>
          ) : (
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-200/20 dark:bg-stone-800/20 blur-3xl rounded-full pointer-events-none" />
          )}

          <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className={`text-3xl md:text-4xl ${theme.fonts.heading} ${theme.colors.heading}`}>
                  {character.name}
                </h1>
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
                <span className="capitalize">{character.magicalPath.replace("-", " ")}</span>
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
              <div className={`p-3 rounded border ${theme.colors.card} ${theme.colors.border} flex flex-col items-center min-w-[80px]`}>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Karma</span>
                <span className={`text-xl font-bold ${theme.colors.accent}`}>{character.karmaCurrent}</span>
              </div>
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

          {/* Dice Roller Collapsible Section */}
          {showDiceRoller && (
            <div className="mt-6 pt-6 border-t border-border animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="max-w-xl">
                <DiceRoller
                  initialPool={targetPool}
                  contextLabel={poolContext || "Quick Roll"}
                  compact={false}
                  showHistory={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Attributes & Condition */}
          <div className="space-y-6">
            {/* Attributes */}
            <Section title="Attributes" theme={theme}>
              <div className="space-y-1">
                {Object.entries(character.attributes || {}).map(([id, value]) => (
                  <AttributeBlock
                    theme={theme}
                    key={id}
                    id={id}
                    value={value as number}
                    onSelect={(attrId, val) => {
                      setTargetPool(val);
                      setPoolContext(ATTRIBUTE_DISPLAY[attrId]?.abbr);
                      setShowDiceRoller(true);
                    }}
                  />
                ))}
              </div>

              {/* Magic/Resonance if applicable */}
              {character.specialAttributes?.magic !== undefined && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-violet-400">MAG</span>
                    <span className="font-mono text-lg font-bold text-foreground">
                      {character.specialAttributes.magic}
                    </span>
                  </div>
                </div>
              )}
              {character.specialAttributes?.resonance !== undefined && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-cyan-400">RES</span>
                    <span className="font-mono text-lg font-bold text-foreground">
                      {character.specialAttributes.resonance}
                    </span>
                  </div>
                </div>
              )}
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
                <ConditionMonitor
                  theme={theme}
                  label="Physical"
                  maxBoxes={physicalMonitorMax}
                  filledBoxes={character.condition?.physicalDamage ?? 0}
                  color="physical"
                />
                <ConditionMonitor
                  theme={theme}
                  label="Stun"
                  maxBoxes={stunMonitorMax}
                  filledBoxes={character.condition?.stunDamage ?? 0}
                  color="stun"
                />
              </div>
            </Section>
          </div>

          {/* Middle Column - Skills & Powers */}
          <div className="space-y-6">
            <Section theme={theme} title="Skills">
              <SkillList
                theme={theme}
                skills={character.skills || {}}
                onSelect={(skillId, rating, attrAbbr) => {
                  const skillName = skillId.replace(/-/g, " ");
                  const context = attrAbbr ? `${attrAbbr} + ${skillName}` : skillName;
                  setTargetPool(rating);
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
                        {character.spells.map((spellId) => (
                          <SpellCard
                            theme={theme}
                            key={spellId}
                            spellId={spellId}
                            spellsCatalog={spellsCatalog}
                            onSelect={(pool, label) => {
                              setTargetPool(pool);
                              setPoolContext(label);
                              setShowDiceRoller(true);
                            }}
                          />
                        ))}
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

            {/* Knowledge Skills */}
            {character.knowledgeSkills && character.knowledgeSkills.length > 0 && (
              <Section theme={theme} title="Knowledge">
                <div className="space-y-1">
                  {character.knowledgeSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground/80">{skill.name}</span>
                        <span className="text-xs text-muted-foreground opacity-60 capitalize">({skill.category})</span>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">{skill.rating}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Languages */}
            {character.languages && character.languages.length > 0 && (
              <Section theme={theme} title="Languages">
                <div className="flex flex-wrap gap-2">
                  {character.languages.map((lang, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded border ${lang.isNative
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                      {lang.name} {lang.isNative ? "(N)" : `(${lang.rating})`}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Right Column - Gear & Assets */}
          <div className="space-y-6">
            {/* Combat Gear */}
            {(character.weapons?.length || character.armor?.length) ? (
              <Section theme={theme} title="Combat Gear">
                <div className="space-y-3">
                  {character.weapons && character.weapons.map((weapon, index) => (
                    <WeaponCard
                      theme={theme}
                      key={`weapon-${index}`}
                      weapon={weapon}
                      onSelect={(w) => {
                        const isMelee = !!w.reach || !w.ammoCapacity;
                        let basePool = 0;
                        let label = w.name;

                        if (isMelee) {
                          basePool = character.attributes?.strength || 3;
                          label = `STR + ${w.name}`;
                        } else {
                          basePool = character.attributes?.agility || 3;
                          label = `AGI + ${w.name}`;
                        }

                        const skills = character.skills || {};
                        const commonCombatSkills = ['pistols', 'automatics', 'longarms', 'unarmed-combat', 'blades', 'clubs'];
                        const foundSkill = commonCombatSkills.find(s => w.category.toLowerCase().includes(s.replace(/-/g, ' ')));

                        if (foundSkill && skills[foundSkill]) {
                          basePool += skills[foundSkill];
                          label = `${isMelee ? 'STR' : 'AGI'} + ${foundSkill.replace(/-/g, ' ')}`;
                        }

                        setTargetPool(basePool);
                        setPoolContext(label);
                        setShowDiceRoller(true);
                      }}
                    />
                  ))}
                  {character.armor && character.armor.map((armor, index) => (
                    <ArmorCard theme={theme} key={`armor-${index}`} armor={armor} />
                  ))}
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
            <Section theme={theme} title="Qualities">
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
                          <QualityBadge theme={theme} key={quality} name={quality} type="positive" />
                        ))}
                      </div>
                    </div>
                  )}
                  {character.negativeQualities && character.negativeQualities.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-red-500 uppercase mb-2 block">Negative</span>
                      <div className="flex flex-wrap gap-2">
                        {character.negativeQualities.map((quality) => (
                          <QualityBadge theme={theme} key={quality} name={quality} type="negative" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Section>

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
              {!character.contacts || character.contacts.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No contacts established</p>
              ) : (
                <div className="space-y-2">
                  {character.contacts.map((contact, index) => (
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
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [targetPool, setTargetPool] = useState(6);
  const [poolContext, setPoolContext] = useState<string | undefined>(undefined);

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
      <CharacterSheet
        character={character}
        showDiceRoller={showDiceRoller}
        setShowDiceRoller={setShowDiceRoller}
        targetPool={targetPool}
        setTargetPool={setTargetPool}
        poolContext={poolContext}
        setPoolContext={setPoolContext}
      />
    </RulesetProvider>
  );
}

