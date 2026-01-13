"use client";

/**
 * CyberdeckConfig - Configure cyberdeck ASDF attributes
 *
 * Allows users to assign attribute array values to Attack, Sleaze,
 * Data Processing, and Firewall. Validates configurations in real-time.
 */

import { useState, useCallback } from "react";
import type { CharacterCyberdeck, CyberdeckAttributeConfig } from "@/lib/types/matrix";
import { validateCyberdeckConfig, swapAttributes } from "@/lib/rules/matrix/cyberdeck-validator";

interface CyberdeckConfigProps {
  deck: CharacterCyberdeck;
  onConfigChange?: (config: CyberdeckAttributeConfig) => void;
  readOnly?: boolean;
  className?: string;
}

type AttributeKey = "attack" | "sleaze" | "dataProcessing" | "firewall";

const ATTRIBUTE_LABELS: Record<AttributeKey, { short: string; full: string }> = {
  attack: { short: "A", full: "Attack" },
  sleaze: { short: "S", full: "Sleaze" },
  dataProcessing: { short: "D", full: "Data Processing" },
  firewall: { short: "F", full: "Firewall" },
};

const ATTRIBUTE_ORDER: AttributeKey[] = ["attack", "sleaze", "dataProcessing", "firewall"];

export function CyberdeckConfig({
  deck,
  onConfigChange,
  readOnly = false,
  className = "",
}: CyberdeckConfigProps) {
  const [config, setConfig] = useState<CyberdeckAttributeConfig>(deck.currentConfig);
  const [selectedAttr, setSelectedAttr] = useState<AttributeKey | null>(null);

  // Validate current configuration
  const validation = validateCyberdeckConfig(config, deck.attributeArray);

  // Handle attribute swap
  const handleAttrClick = useCallback(
    (attr: AttributeKey) => {
      if (readOnly) return;

      if (selectedAttr === null) {
        // First click - select this attribute
        setSelectedAttr(attr);
      } else if (selectedAttr === attr) {
        // Same attribute - deselect
        setSelectedAttr(null);
      } else {
        // Different attribute - swap them
        const newConfig = swapAttributes(config, selectedAttr, attr);
        setConfig(newConfig);
        onConfigChange?.(newConfig);
        setSelectedAttr(null);
      }
    },
    [config, selectedAttr, readOnly, onConfigChange]
  );

  // Quick swap presets
  const applyPreset = useCallback(
    (preset: "balanced" | "offensive" | "stealthy" | "defensive") => {
      if (readOnly) return;

      const sorted = [...deck.attributeArray].sort((a, b) => b - a);
      let newConfig: CyberdeckAttributeConfig;

      switch (preset) {
        case "offensive":
          // High Attack, High Sleaze
          newConfig = {
            attack: sorted[0],
            sleaze: sorted[1],
            dataProcessing: sorted[2],
            firewall: sorted[3],
          };
          break;
        case "stealthy":
          // High Sleaze, High Data Processing
          newConfig = {
            attack: sorted[3],
            sleaze: sorted[0],
            dataProcessing: sorted[1],
            firewall: sorted[2],
          };
          break;
        case "defensive":
          // High Firewall, High Data Processing
          newConfig = {
            attack: sorted[3],
            sleaze: sorted[2],
            dataProcessing: sorted[1],
            firewall: sorted[0],
          };
          break;
        case "balanced":
        default:
          // Balanced distribution
          newConfig = {
            attack: sorted[1],
            sleaze: sorted[2],
            dataProcessing: sorted[0],
            firewall: sorted[3],
          };
          break;
      }

      setConfig(newConfig);
      onConfigChange?.(newConfig);
      setSelectedAttr(null);
    },
    [deck.attributeArray, readOnly, onConfigChange]
  );

  return (
    <div className={`deck-config ${className}`}>
      <div className="deck-config__header">
        <h4 className="deck-config__title">{deck.customName ?? deck.name}</h4>
        <span className="deck-config__rating">DR {deck.deviceRating}</span>
      </div>

      {/* Attribute Array Display */}
      <div className="deck-config__array">
        <span className="deck-config__array-label">Array:</span>
        <span className="deck-config__array-values">[{deck.attributeArray.join(", ")}]</span>
      </div>

      {/* ASDF Configuration Grid */}
      <div className="deck-config__grid">
        {ATTRIBUTE_ORDER.map((attr) => {
          const isSelected = selectedAttr === attr;
          const value = config[attr];
          const labels = ATTRIBUTE_LABELS[attr];

          return (
            <button
              key={attr}
              type="button"
              className={`deck-config__attr ${isSelected ? "deck-config__attr--selected" : ""}`}
              onClick={() => handleAttrClick(attr)}
              disabled={readOnly}
              title={`${labels.full}: ${value}${!readOnly ? " (click to swap)" : ""}`}
            >
              <span className="deck-config__attr-label">{labels.short}</span>
              <span className="deck-config__attr-value">{value}</span>
              <span className="deck-config__attr-name">{labels.full}</span>
            </button>
          );
        })}
      </div>

      {/* Swap Instructions */}
      {!readOnly && (
        <p className="deck-config__instructions">
          {selectedAttr
            ? `Click another attribute to swap with ${ATTRIBUTE_LABELS[selectedAttr].full}`
            : "Click an attribute to begin swapping"}
        </p>
      )}

      {/* Quick Presets */}
      {!readOnly && (
        <div className="deck-config__presets">
          <span className="deck-config__presets-label">Presets:</span>
          <button
            type="button"
            className="deck-config__preset-btn"
            onClick={() => applyPreset("offensive")}
          >
            Offensive
          </button>
          <button
            type="button"
            className="deck-config__preset-btn"
            onClick={() => applyPreset("stealthy")}
          >
            Stealthy
          </button>
          <button
            type="button"
            className="deck-config__preset-btn"
            onClick={() => applyPreset("defensive")}
          >
            Defensive
          </button>
          <button
            type="button"
            className="deck-config__preset-btn"
            onClick={() => applyPreset("balanced")}
          >
            Balanced
          </button>
        </div>
      )}

      {/* Validation Feedback */}
      {!validation.valid && (
        <div className="deck-config__errors">
          {validation.errors.map((error, idx) => (
            <p key={idx} className="deck-config__error">
              {error.message}
            </p>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="deck-config__warnings">
          {validation.warnings.map((warning, idx) => (
            <p key={idx} className="deck-config__warning">
              {warning.message}
            </p>
          ))}
        </div>
      )}

      {/* Program Slots */}
      <div className="deck-config__slots">
        <span className="deck-config__slots-label">Program Slots:</span>
        <span className="deck-config__slots-value">
          {deck.loadedPrograms.length} / {deck.programSlots}
        </span>
      </div>
    </div>
  );
}
