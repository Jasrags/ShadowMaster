"use client";

/**
 * MatrixSummary - Displays character's matrix equipment and status
 *
 * Shows active device, ASDF configuration, program slots, loaded programs,
 * current overwatch score, and marks on targets.
 */

import type { Character } from "@/lib/types/character";
import type { CharacterCyberdeck } from "@/lib/types/matrix";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

interface MatrixSummaryProps {
  character: Character;
  activeDeck?: CharacterCyberdeck | null;
  overwatchScore?: number;
  className?: string;
}

export function MatrixSummary({
  character,
  activeDeck,
  overwatchScore = 0,
  className = "",
}: MatrixSummaryProps) {
  const { cyberdecks = [], commlinks = [], programs = [] } = character;

  // Non-matrix characters (no decks or commlinks)
  if (cyberdecks.length === 0 && commlinks.length === 0) {
    return (
      <div className={`matrix-summary matrix-summary--no-gear ${className}`}>
        <h3 className="matrix-summary__title">Matrix</h3>
        <p className="matrix-summary__no-matrix">No matrix equipment</p>
      </div>
    );
  }

  // Determine active device
  const deck = activeDeck ?? cyberdecks[0] ?? null;
  const hasActiveDeck = deck !== null;

  // Calculate program slot usage
  const loadedPrograms = deck?.loadedPrograms ?? [];
  const programSlots = deck?.programSlots ?? 0;
  const slotsUsed = loadedPrograms.length;

  // Get overwatch warning level
  const osPercentage = overwatchScore / OVERWATCH_THRESHOLD;
  const osWarningClass =
    osPercentage >= 0.9
      ? "matrix-summary__os--critical"
      : osPercentage >= 0.75
        ? "matrix-summary__os--warning"
        : osPercentage >= 0.5
          ? "matrix-summary__os--elevated"
          : "";

  return (
    <div className={`matrix-summary ${className}`}>
      <h3 className="matrix-summary__title">Matrix</h3>

      {/* Active Device */}
      {hasActiveDeck && deck && (
        <>
          <div className="matrix-summary__row">
            <span className="matrix-summary__label">Device:</span>
            <span className="matrix-summary__value">{deck.customName ?? deck.name}</span>
          </div>

          <div className="matrix-summary__row">
            <span className="matrix-summary__label">Device Rating:</span>
            <span className="matrix-summary__value">{deck.deviceRating}</span>
          </div>

          {/* ASDF Attributes */}
          <div className="matrix-summary__section">
            <span className="matrix-summary__label">Matrix Attributes:</span>
            <div className="matrix-summary__asdf">
              <div className="matrix-summary__asdf-item">
                <span className="matrix-summary__asdf-label">A</span>
                <span className="matrix-summary__asdf-value">{deck.currentConfig.attack}</span>
              </div>
              <div className="matrix-summary__asdf-item">
                <span className="matrix-summary__asdf-label">S</span>
                <span className="matrix-summary__asdf-value">{deck.currentConfig.sleaze}</span>
              </div>
              <div className="matrix-summary__asdf-item">
                <span className="matrix-summary__asdf-label">D</span>
                <span className="matrix-summary__asdf-value">
                  {deck.currentConfig.dataProcessing}
                </span>
              </div>
              <div className="matrix-summary__asdf-item">
                <span className="matrix-summary__asdf-label">F</span>
                <span className="matrix-summary__asdf-value">{deck.currentConfig.firewall}</span>
              </div>
            </div>
          </div>

          {/* Program Slots */}
          <div className="matrix-summary__row">
            <span className="matrix-summary__label">Programs:</span>
            <span className="matrix-summary__value">
              {slotsUsed} / {programSlots} slots
            </span>
          </div>

          {/* Loaded Programs */}
          {loadedPrograms.length > 0 && (
            <div className="matrix-summary__section">
              <span className="matrix-summary__label">Running:</span>
              <ul className="matrix-summary__list">
                {loadedPrograms.map((programId) => {
                  const program = programs.find((p) => p.catalogId === programId);
                  return (
                    <li key={programId} className="matrix-summary__list-item">
                      {program?.name ?? programId}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Overwatch Score */}
          <div className={`matrix-summary__row matrix-summary__os ${osWarningClass}`}>
            <span className="matrix-summary__label">Overwatch Score:</span>
            <span className="matrix-summary__value">
              {overwatchScore} / {OVERWATCH_THRESHOLD}
            </span>
          </div>
        </>
      )}

      {/* Commlink fallback */}
      {!hasActiveDeck && commlinks.length > 0 && (
        <div className="matrix-summary__row">
          <span className="matrix-summary__label">Device:</span>
          <span className="matrix-summary__value">
            {commlinks[0].customName ?? commlinks[0].name} (Commlink)
          </span>
        </div>
      )}

      {/* Device Count Summary */}
      <div className="matrix-summary__footer">
        {cyberdecks.length > 0 && (
          <span className="matrix-summary__count">
            {cyberdecks.length} cyberdeck{cyberdecks.length > 1 ? "s" : ""}
          </span>
        )}
        {commlinks.length > 0 && (
          <span className="matrix-summary__count">
            {commlinks.length} commlink{commlinks.length > 1 ? "s" : ""}
          </span>
        )}
        {programs.length > 0 && (
          <span className="matrix-summary__count">
            {programs.length} program{programs.length > 1 ? "s" : ""} owned
          </span>
        )}
      </div>
    </div>
  );
}
