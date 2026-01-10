"use client";

/**
 * Spellbook - Displays character's known spells organized by category
 *
 * Used on the character sheet to show spells with details like
 * range, duration, drain formula, and type.
 */

import { useState } from "react";
import type { SpellCategory } from "@/lib/types/magic";
import type { SpellData } from "@/lib/rules/loader-types";

interface SpellbookProps {
  spells: SpellData[];
  className?: string;
  onCastSpell?: (spell: SpellData) => void;
}

const SPELL_CATEGORIES: SpellCategory[] = [
  "combat",
  "detection",
  "health",
  "illusion",
  "manipulation",
];

export function Spellbook({ spells, className = "", onCastSpell }: SpellbookProps) {
  const [activeCategory, setActiveCategory] = useState<SpellCategory | "all">("all");

  // Group spells by category
  const spellsByCategory = SPELL_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = spells.filter((s) => s.category === category);
      return acc;
    },
    {} as Record<SpellCategory, SpellData[]>
  );

  const filteredSpells =
    activeCategory === "all" ? spells : (spellsByCategory[activeCategory] ?? []);

  if (spells.length === 0) {
    return (
      <div className={`spellbook spellbook--empty ${className}`}>
        <h3 className="spellbook__title">Spellbook</h3>
        <p className="spellbook__no-spells">No spells known</p>
      </div>
    );
  }

  return (
    <div className={`spellbook ${className}`}>
      <h3 className="spellbook__title">Spellbook ({spells.length} spells)</h3>

      {/* Category Tabs */}
      <div className="spellbook__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeCategory === "all"}
          className={`spellbook__tab ${activeCategory === "all" ? "spellbook__tab--active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All ({spells.length})
        </button>
        {SPELL_CATEGORIES.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={activeCategory === category}
            className={`spellbook__tab ${activeCategory === category ? "spellbook__tab--active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {formatCategory(category)} ({spellsByCategory[category].length})
          </button>
        ))}
      </div>

      {/* Spell List */}
      <div className="spellbook__list" role="tabpanel">
        {filteredSpells.map((spell) => (
          <SpellCard
            key={spell.id}
            spell={spell}
            onCast={onCastSpell ? () => onCastSpell(spell) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

interface SpellCardProps {
  spell: SpellData;
  onCast?: () => void;
}

function SpellCard({ spell, onCast }: SpellCardProps) {
  return (
    <div className="spell-card">
      <div className="spell-card__header">
        <h4 className="spell-card__name">{spell.name}</h4>
        <span className="spell-card__category">{formatCategory(spell.category)}</span>
      </div>

      <div className="spell-card__details">
        <div className="spell-card__detail">
          <span className="spell-card__label">Type:</span>
          <span className="spell-card__value">{spell.type}</span>
        </div>
        <div className="spell-card__detail">
          <span className="spell-card__label">Range:</span>
          <span className="spell-card__value">{spell.range}</span>
        </div>
        <div className="spell-card__detail">
          <span className="spell-card__label">Duration:</span>
          <span className="spell-card__value">{spell.duration}</span>
        </div>
        <div className="spell-card__detail">
          <span className="spell-card__label">Drain:</span>
          <span className="spell-card__value spell-card__value--drain">{spell.drain}</span>
        </div>
      </div>

      {spell.description && <p className="spell-card__description">{spell.description}</p>}

      {onCast && (
        <button className="spell-card__cast-btn" onClick={onCast} aria-label={`Cast ${spell.name}`}>
          Cast Spell
        </button>
      )}
    </div>
  );
}

function formatCategory(category: SpellCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
