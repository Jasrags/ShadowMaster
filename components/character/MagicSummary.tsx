"use client";

/**
 * MagicSummary - Displays character's magical state on the character sheet
 *
 * Includes: Tradition, drain attributes, Magic rating, initiate grade,
 * power points (for adepts), sustained spells, and bound spirits.
 */

import type { Character } from "@/lib/types/character";
import type { TraditionData } from "@/lib/rules/loader-types";
import { getDrainAttributes } from "@/lib/rules/magic/tradition-validator";

interface MagicSummaryProps {
  character: Character;
  tradition?: TraditionData | null;
  className?: string;
}

export function MagicSummary({ character, tradition, className = "" }: MagicSummaryProps) {
  const {
    magicalPath,
    specialAttributes,
    initiateGrade = 0,
    sustainedSpells = [],
    spirits = [],
  } = character;

  // Non-magical characters
  if (magicalPath === "mundane") {
    return (
      <div className={`magic-summary magic-summary--mundane ${className}`}>
        <h3 className="magic-summary__title">Magic</h3>
        <p className="magic-summary__no-magic">No magical abilities</p>
      </div>
    );
  }

  // Calculate derived values
  const magicRating = specialAttributes?.magic ?? 0;
  const drainAttributes = tradition ? getDrainAttributes(tradition, character) : undefined;

  const sustainedPenalty = (sustainedSpells?.length ?? 0) * -2;
  const boundSpirits = spirits?.filter((s) => s.bound) ?? [];
  const activeSpirits = spirits?.filter((s) => !s.bound) ?? [];

  // Power points for adepts/mystic adepts
  const isAdept = magicalPath === "adept" || magicalPath === "mystic-adept";
  const powerPointsTotal = isAdept ? magicRating : 0;
  const powerPointsSpent =
    character.adeptPowers?.reduce((sum, p) => {
      // Simplified: assume rating * 0.5 PP average
      return sum + (p.rating ?? 1) * 0.5;
    }, 0) ?? 0;

  return (
    <div className={`magic-summary ${className}`}>
      <h3 className="magic-summary__title">Magic</h3>

      {/* Path and Tradition */}
      <div className="magic-summary__row">
        <span className="magic-summary__label">Path:</span>
        <span className="magic-summary__value">{formatMagicalPath(magicalPath)}</span>
      </div>

      {tradition && (
        <div className="magic-summary__row">
          <span className="magic-summary__label">Tradition:</span>
          <span className="magic-summary__value">{tradition.name}</span>
        </div>
      )}

      {/* Drain Attributes */}
      {drainAttributes && (
        <div className="magic-summary__row">
          <span className="magic-summary__label">Drain Resist:</span>
          <span className="magic-summary__value">{drainAttributes.join(" + ")}</span>
        </div>
      )}

      {/* Magic Rating */}
      <div className="magic-summary__row magic-summary__row--highlight">
        <span className="magic-summary__label">Magic:</span>
        <span className="magic-summary__value">{magicRating}</span>
      </div>

      {/* Initiate Grade */}
      {initiateGrade > 0 && (
        <div className="magic-summary__row">
          <span className="magic-summary__label">Initiate Grade:</span>
          <span className="magic-summary__value">{initiateGrade}</span>
        </div>
      )}

      {/* Power Points (Adepts) */}
      {isAdept && (
        <div className="magic-summary__row">
          <span className="magic-summary__label">Power Points:</span>
          <span className="magic-summary__value">
            {powerPointsSpent.toFixed(1)} / {powerPointsTotal}
          </span>
        </div>
      )}

      {/* Sustained Spells */}
      {sustainedSpells.length > 0 && (
        <div className="magic-summary__section">
          <span className="magic-summary__label">Sustained Spells:</span>
          <span className="magic-summary__value">
            {sustainedSpells.length} ({sustainedPenalty} dice pool)
          </span>
          <ul className="magic-summary__list">
            {sustainedSpells.map((spell, idx) => (
              <li key={idx} className="magic-summary__list-item">
                {spell.spellId} (Force {spell.force})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bound Spirits */}
      {boundSpirits.length > 0 && (
        <div className="magic-summary__section">
          <span className="magic-summary__label">Bound Spirits:</span>
          <ul className="magic-summary__list">
            {boundSpirits.map((spirit, idx) => (
              <li key={idx} className="magic-summary__list-item">
                {spirit.type} F{spirit.force} ({spirit.services} services)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Summoned Spirits */}
      {activeSpirits.length > 0 && (
        <div className="magic-summary__section">
          <span className="magic-summary__label">Active Spirits:</span>
          <ul className="magic-summary__list">
            {activeSpirits.map((spirit, idx) => (
              <li key={idx} className="magic-summary__list-item">
                {spirit.type} F{spirit.force}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatMagicalPath(path: string | undefined): string {
  if (!path) return "Unknown";
  const paths: Record<string, string> = {
    mundane: "Mundane",
    "full-mage": "Magician",
    "aspected-mage": "Aspected Magician",
    adept: "Adept",
    "mystic-adept": "Mystic Adept",
    technomancer: "Technomancer",
  };
  return paths[path] ?? path;
}
