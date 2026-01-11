"use client";

/**
 * AdeptPowerList - Displays character's adept powers with PP tracking
 *
 * Shows power point budget, individual powers with costs,
 * and activation info.
 */

import type { AdeptPower } from "@/lib/types/character";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";

interface AdeptPowerListProps {
  powers: AdeptPower[];
  powerCatalog: AdeptPowerCatalogItem[];
  powerPointsTotal: number;
  className?: string;
  onTogglePower?: (power: AdeptPower) => void;
}

export function AdeptPowerList({
  powers,
  powerCatalog,
  powerPointsTotal,
  className = "",
  onTogglePower,
}: AdeptPowerListProps) {
  // Calculate spent power points
  const powerPointsSpent = powers.reduce((sum, power) => {
    const catalogPower = powerCatalog.find((p) => p.id === power.catalogId);
    if (!catalogPower) return sum;
    return sum + calculatePowerCost(power, catalogPower);
  }, 0);

  const powerPointsRemaining = powerPointsTotal - powerPointsSpent;

  if (powers.length === 0) {
    return (
      <div className={`adept-powers adept-powers--empty ${className}`}>
        <h3 className="adept-powers__title">Adept Powers</h3>
        <p className="adept-powers__no-powers">No adept powers acquired</p>
      </div>
    );
  }

  return (
    <div className={`adept-powers ${className}`}>
      <h3 className="adept-powers__title">Adept Powers</h3>

      {/* Power Point Budget */}
      <div className="adept-powers__budget">
        <div className="adept-powers__budget-bar">
          <div
            className="adept-powers__budget-fill"
            style={{ width: `${(powerPointsSpent / powerPointsTotal) * 100}%` }}
          />
        </div>
        <span className="adept-powers__budget-text">
          {powerPointsSpent.toFixed(2)} / {powerPointsTotal} PP
          {powerPointsRemaining > 0 && (
            <span className="adept-powers__budget-remaining">
              ({powerPointsRemaining.toFixed(2)} remaining)
            </span>
          )}
        </span>
      </div>

      {/* Power List */}
      <ul className="adept-powers__list">
        {powers.map((power, idx) => {
          const catalogPower = powerCatalog.find((p) => p.id === power.catalogId);
          return (
            <AdeptPowerCard
              key={`${power.catalogId}-${idx}`}
              power={power}
              catalogPower={catalogPower}
              onToggle={onTogglePower ? () => onTogglePower(power) : undefined}
            />
          );
        })}
      </ul>
    </div>
  );
}

interface AdeptPowerCardProps {
  power: AdeptPower;
  catalogPower?: AdeptPowerCatalogItem;
  onToggle?: () => void;
}

function AdeptPowerCard({ power, catalogPower, onToggle }: AdeptPowerCardProps) {
  const cost = catalogPower ? calculatePowerCost(power, catalogPower) : 0;
  const isLeveled = catalogPower?.maxLevel !== undefined;

  return (
    <li className="adept-power-card">
      <div className="adept-power-card__header">
        <h4 className="adept-power-card__name">
          {power.name}
          {isLeveled && power.rating && (
            <span className="adept-power-card__level"> (Level {power.rating})</span>
          )}
        </h4>
        <span className="adept-power-card__cost">{cost.toFixed(2)} PP</span>
      </div>

      {power.specification && (
        <div className="adept-power-card__spec">
          <span className="adept-power-card__label">Spec:</span>
          <span className="adept-power-card__value">{power.specification}</span>
        </div>
      )}

      {catalogPower?.activation && (
        <div className="adept-power-card__activation">
          <span className="adept-power-card__label">Activation:</span>
          <span className="adept-power-card__value">
            {formatActivation(catalogPower.activation)}
          </span>
        </div>
      )}

      {catalogPower?.description && (
        <p className="adept-power-card__description">{catalogPower.description}</p>
      )}

      {onToggle && catalogPower?.activation && (
        <button
          className="adept-power-card__toggle-btn"
          onClick={onToggle}
          aria-label={`Toggle ${power.name}`}
        >
          Toggle
        </button>
      )}
    </li>
  );
}

function calculatePowerCost(power: AdeptPower, catalogPower: AdeptPowerCatalogItem): number {
  if (catalogPower.cost === null) {
    // Variable cost - check levels table
    if (catalogPower.levels && power.rating !== undefined) {
      const level = catalogPower.levels.find((l) => l.level === power.rating);
      return level?.cost ?? 0;
    }
    return 0;
  }

  switch (catalogPower.costType) {
    case "fixed":
      return catalogPower.cost;
    case "perLevel":
      return catalogPower.cost * (power.rating ?? 1);
    case "table":
      if (catalogPower.levels && power.rating !== undefined) {
        const level = catalogPower.levels.find((l) => l.level === power.rating);
        return level?.cost ?? catalogPower.cost;
      }
      return catalogPower.cost;
    default:
      return catalogPower.cost;
  }
}

function formatActivation(activation: string): string {
  const activationMap: Record<string, string> = {
    free: "Free Action",
    simple: "Simple Action",
    complex: "Complex Action",
    interrupt: "Interrupt",
  };
  return activationMap[activation] ?? activation;
}
