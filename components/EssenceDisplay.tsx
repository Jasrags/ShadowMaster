"use client";

/**
 * EssenceDisplay - Reusable essence visualization component
 *
 * Shows:
 * - Current essence bar (0-6 scale)
 * - Essence hole indicator (for magic users)
 * - Magic/Resonance reduction display
 * - Projected essence on hover (during selection)
 */

import { useMemo } from "react";

interface EssenceDisplayProps {
  /** Current essence value (0-6) */
  currentEssence: number;
  /** Maximum essence (usually 6) */
  maxEssence?: number;
  /** Total essence lost from augmentations */
  essenceLoss?: number;
  /** Essence hole for awakened characters (peak essence loss) */
  essenceHole?: number;
  /** Current magic rating (for awakened) */
  magicRating?: number;
  /** Magic lost due to essence loss */
  magicLoss?: number;
  /** Current resonance rating (for technomancers) */
  resonanceRating?: number;
  /** Resonance lost due to essence loss */
  resonanceLoss?: number;
  /** Projected essence if installing new augmentation */
  projectedEssence?: number;
  /** Whether to show compact view */
  compact?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Format essence value to 2 decimal places
 */
function formatEssence(value: number): string {
  return value.toFixed(2);
}

/**
 * Get color class based on essence percentage
 */
function getEssenceColor(percentage: number): string {
  if (percentage >= 80) return "essence-display__bar--healthy";
  if (percentage >= 50) return "essence-display__bar--moderate";
  if (percentage >= 25) return "essence-display__bar--low";
  return "essence-display__bar--critical";
}

export function EssenceDisplay({
  currentEssence,
  maxEssence = 6,
  essenceLoss = 0,
  essenceHole,
  magicRating,
  magicLoss = 0,
  resonanceRating,
  resonanceLoss = 0,
  projectedEssence,
  compact = false,
  className = "",
}: EssenceDisplayProps) {
  // Calculate percentages for bar display
  const essencePercentage = useMemo(
    () => Math.max(0, Math.min(100, (currentEssence / maxEssence) * 100)),
    [currentEssence, maxEssence]
  );

  const projectedPercentage = useMemo(
    () =>
      projectedEssence !== undefined
        ? Math.max(0, Math.min(100, (projectedEssence / maxEssence) * 100))
        : undefined,
    [projectedEssence, maxEssence]
  );

  const essenceHolePercentage = useMemo(
    () =>
      essenceHole !== undefined
        ? Math.max(0, Math.min(100, (essenceHole / maxEssence) * 100))
        : undefined,
    [essenceHole, maxEssence]
  );

  // Determine if awakened or emerged
  const isAwakened = magicRating !== undefined && magicRating > 0;
  const isEmerged = resonanceRating !== undefined && resonanceRating > 0;
  const hasMetaphysicalLink = isAwakened || isEmerged;

  // Calculate effective magic/resonance
  const effectiveMagic = isAwakened ? Math.max(0, magicRating - magicLoss) : undefined;
  const effectiveResonance = isEmerged ? Math.max(0, resonanceRating - resonanceLoss) : undefined;

  if (compact) {
    return (
      <div className={`essence-display essence-display--compact ${className}`}>
        <div className="essence-display__header">
          <span className="essence-display__label">Essence</span>
          <span className="essence-display__value">{formatEssence(currentEssence)}</span>
        </div>
        <div className="essence-display__bar-container">
          <div
            className={`essence-display__bar ${getEssenceColor(essencePercentage)}`}
            style={{ width: `${essencePercentage}%` }}
          />
          {projectedPercentage !== undefined && projectedPercentage < essencePercentage && (
            <div
              className="essence-display__bar essence-display__bar--projected"
              style={{
                width: `${essencePercentage - projectedPercentage}%`,
                left: `${projectedPercentage}%`,
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`essence-display ${className}`}>
      {/* Header with current essence */}
      <div className="essence-display__header">
        <h4 className="essence-display__title">Essence</h4>
        <span className="essence-display__value-large">
          {formatEssence(currentEssence)}
          <span className="essence-display__max"> / {maxEssence}</span>
        </span>
      </div>

      {/* Essence bar */}
      <div className="essence-display__bar-wrapper">
        <div className="essence-display__bar-container essence-display__bar-container--full">
          {/* Essence hole marker (for awakened/emerged) */}
          {essenceHolePercentage !== undefined && essenceHolePercentage > 0 && (
            <div
              className="essence-display__essence-hole"
              style={{ width: `${essenceHolePercentage}%` }}
              title={`Essence Hole: ${formatEssence(essenceHole || 0)}`}
            />
          )}

          {/* Current essence bar */}
          <div
            className={`essence-display__bar ${getEssenceColor(essencePercentage)}`}
            style={{ width: `${essencePercentage}%` }}
          />

          {/* Projected essence change indicator */}
          {projectedPercentage !== undefined && (
            <div
              className={`essence-display__bar essence-display__bar--projected ${
                projectedPercentage < essencePercentage ? "essence-display__bar--loss" : ""
              }`}
              style={{
                width: `${Math.abs(essencePercentage - projectedPercentage)}%`,
                left: `${Math.min(essencePercentage, projectedPercentage)}%`,
              }}
              title={`Projected: ${formatEssence(projectedEssence || 0)}`}
            />
          )}

          {/* Scale markers */}
          <div className="essence-display__scale">
            {[0, 1, 2, 3, 4, 5, 6].map((mark) => (
              <div
                key={mark}
                className="essence-display__scale-mark"
                style={{ left: `${(mark / maxEssence) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Scale labels */}
        <div className="essence-display__scale-labels">
          <span>0</span>
          <span>{maxEssence}</span>
        </div>
      </div>

      {/* Essence loss breakdown */}
      {essenceLoss > 0 && (
        <div className="essence-display__breakdown">
          <div className="essence-display__row">
            <span className="essence-display__label">Essence Lost:</span>
            <span className="essence-display__value essence-display__value--negative">
              -{formatEssence(essenceLoss)}
            </span>
          </div>
        </div>
      )}

      {/* Magic/Resonance impact */}
      {hasMetaphysicalLink && (
        <div className="essence-display__metaphysical">
          {isAwakened && (
            <>
              <div className="essence-display__row">
                <span className="essence-display__label">Magic:</span>
                <span className="essence-display__value">
                  {effectiveMagic}
                  {magicLoss > 0 && <span className="essence-display__loss"> (-{magicLoss})</span>}
                </span>
              </div>
              {essenceHole !== undefined && essenceHole > 0 && (
                <div className="essence-display__row essence-display__row--warning">
                  <span className="essence-display__label">Essence Hole:</span>
                  <span className="essence-display__value">{formatEssence(essenceHole)}</span>
                </div>
              )}
            </>
          )}
          {isEmerged && (
            <div className="essence-display__row">
              <span className="essence-display__label">Resonance:</span>
              <span className="essence-display__value">
                {effectiveResonance}
                {resonanceLoss > 0 && (
                  <span className="essence-display__loss"> (-{resonanceLoss})</span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Projected change preview */}
      {projectedEssence !== undefined && projectedEssence !== currentEssence && (
        <div className="essence-display__projection">
          <div className="essence-display__row">
            <span className="essence-display__label">After Installation:</span>
            <span
              className={`essence-display__value ${
                projectedEssence < currentEssence
                  ? "essence-display__value--negative"
                  : "essence-display__value--positive"
              }`}
            >
              {formatEssence(projectedEssence)}
            </span>
          </div>
        </div>
      )}

      {/* Warning for low essence */}
      {currentEssence < 1 && (
        <div className="essence-display__warning">
          Warning: Low essence - character at risk of death if essence reaches 0
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline essence indicator for lists
 */
export function EssenceIndicator({
  essence,
  maxEssence = 6,
  className = "",
}: {
  essence: number;
  maxEssence?: number;
  className?: string;
}) {
  const percentage = Math.max(0, Math.min(100, (essence / maxEssence) * 100));

  return (
    <div className={`essence-indicator ${className}`}>
      <div
        className={`essence-indicator__bar ${getEssenceColor(percentage)}`}
        style={{ width: `${percentage}%` }}
      />
      <span className="essence-indicator__text">{formatEssence(essence)}</span>
    </div>
  );
}

/**
 * Essence cost badge for catalog items
 */
export function EssenceCostBadge({
  cost,
  grade,
  className = "",
}: {
  cost: number;
  grade?: string;
  className?: string;
}) {
  const colorClass =
    cost >= 1
      ? "essence-badge--high"
      : cost >= 0.5
        ? "essence-badge--medium"
        : "essence-badge--low";

  return (
    <span className={`essence-badge ${colorClass} ${className}`}>
      {formatEssence(cost)} ESS
      {grade && <span className="essence-badge__grade">({grade})</span>}
    </span>
  );
}
