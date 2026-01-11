"use client";

/**
 * MatrixActions - Display available matrix actions with dice pool preview
 *
 * Shows matrix actions by category, mark requirements, overwatch risk,
 * and calculated dice pools based on current configuration.
 */

import { useState, useMemo } from "react";
import type {
  CharacterCyberdeck,
  MatrixMark,
  MatrixAction,
  MatrixActionCategory,
} from "@/lib/types/matrix";
import {
  isIllegalAction,
  getMarkRequirement,
  isActionSupportedByDevice,
  getActionRequirementsSummary,
} from "@/lib/rules/matrix/action-validator";

interface MatrixActionsProps {
  activeDeck?: CharacterCyberdeck | null;
  matrixActions: MatrixAction[];
  marks?: MatrixMark[];
  overwatchScore?: number;
  onActionSelect?: (actionId: string) => void;
  className?: string;
}

const CATEGORY_LABELS: Record<MatrixActionCategory, string> = {
  attack: "Cybercombat",
  sleaze: "Hacking",
  device: "Device Control",
  file: "File Operations",
  persona: "Persona",
  complex_form: "Complex Forms",
};

const CATEGORY_ORDER: MatrixActionCategory[] = [
  "sleaze",
  "attack",
  "device",
  "file",
  "persona",
  "complex_form",
];

export function MatrixActions({
  activeDeck,
  matrixActions,
  marks = [],
  overwatchScore = 0,
  onActionSelect,
  className = "",
}: MatrixActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<MatrixActionCategory | "all">("all");
  const [showUnavailable, setShowUnavailable] = useState(false);

  // Group actions by category
  const actionsByCategory = useMemo(() => {
    const result: Record<MatrixActionCategory, MatrixAction[]> = {
      attack: [],
      sleaze: [],
      device: [],
      file: [],
      persona: [],
      complex_form: [],
    };

    for (const action of matrixActions) {
      const category = action.category;
      if (result[category]) {
        result[category].push(action);
      }
    }

    return result;
  }, [matrixActions]);

  // Filter actions
  const filteredActions = useMemo(() => {
    let actions =
      selectedCategory === "all" ? matrixActions : (actionsByCategory[selectedCategory] ?? []);

    if (!showUnavailable && activeDeck) {
      actions = actions.filter((action) =>
        isActionSupportedByDevice(action, activeDeck.deviceRating > 0 ? "cyberdeck" : "commlink")
      );
    }

    return actions;
  }, [selectedCategory, showUnavailable, matrixActions, actionsByCategory, activeDeck]);

  // Get action status details
  const getActionStatus = (action: MatrixAction) => {
    const illegal = isIllegalAction(action);
    const marksRequired = getMarkRequirement(action);
    const requirements = getActionRequirementsSummary(action);

    // Check if we have enough marks on a target
    const hasEnoughMarks = marksRequired === 0 || marks.some((m) => m.markCount >= marksRequired);

    // Check device support
    const deviceType = activeDeck?.deviceRating ? "cyberdeck" : "commlink";
    const supported = isActionSupportedByDevice(action, deviceType);

    return {
      illegal,
      marksRequired,
      hasEnoughMarks,
      supported,
      requirements,
    };
  };

  if (!activeDeck) {
    return (
      <div className={`matrix-actions matrix-actions--no-deck ${className}`}>
        <h4 className="matrix-actions__title">Matrix Actions</h4>
        <p className="matrix-actions__no-deck-msg">Equip a cyberdeck to access matrix actions</p>
      </div>
    );
  }

  return (
    <div className={`matrix-actions ${className}`}>
      <div className="matrix-actions__header">
        <h4 className="matrix-actions__title">Matrix Actions</h4>
        <label className="matrix-actions__toggle">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={(e) => setShowUnavailable(e.target.checked)}
          />
          Show unavailable
        </label>
      </div>

      {/* Category Tabs */}
      <div className="matrix-actions__tabs">
        <button
          type="button"
          className={`matrix-actions__tab ${selectedCategory === "all" ? "matrix-actions__tab--active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {CATEGORY_ORDER.map((category) => {
          const count = actionsByCategory[category]?.length ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={category}
              type="button"
              className={`matrix-actions__tab ${selectedCategory === category ? "matrix-actions__tab--active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>

      {/* Actions List */}
      <div className="matrix-actions__list">
        {filteredActions.length === 0 ? (
          <p className="matrix-actions__empty">No actions available</p>
        ) : (
          filteredActions.map((action) => {
            const status = getActionStatus(action);

            return (
              <div
                key={action.id}
                className={`matrix-actions__item ${!status.supported ? "matrix-actions__item--unavailable" : ""}`}
              >
                <div className="matrix-actions__item-header">
                  <span className="matrix-actions__item-name">{action.name}</span>
                  <div className="matrix-actions__item-badges">
                    {status.illegal && (
                      <span
                        className="matrix-actions__badge matrix-actions__badge--illegal"
                        title="Illegal action - increases Overwatch Score"
                      >
                        OS+
                      </span>
                    )}
                    {status.marksRequired > 0 && (
                      <span
                        className={`matrix-actions__badge ${status.hasEnoughMarks ? "matrix-actions__badge--marks-ok" : "matrix-actions__badge--marks-needed"}`}
                        title={`Requires ${status.marksRequired} mark${status.marksRequired > 1 ? "s" : ""}`}
                      >
                        {status.marksRequired}M
                      </span>
                    )}
                  </div>
                </div>

                {action.description && (
                  <p className="matrix-actions__item-desc">{action.description}</p>
                )}

                <div className="matrix-actions__item-details">
                  <span className="matrix-actions__item-type">
                    {CATEGORY_LABELS[action.category]}
                  </span>
                  <span className="matrix-actions__item-skill">{action.skill}</span>
                  {status.requirements && (
                    <span className="matrix-actions__item-reqs">{status.requirements}</span>
                  )}
                </div>

                {onActionSelect && status.supported && (
                  <button
                    type="button"
                    className="matrix-actions__item-btn"
                    onClick={() => onActionSelect(action.id)}
                    disabled={status.marksRequired > 0 && !status.hasEnoughMarks}
                  >
                    Select
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Overwatch Warning */}
      {overwatchScore > 30 && (
        <div className="matrix-actions__os-warning">
          <strong>Warning:</strong> Overwatch Score is at {overwatchScore}/40. Consider jacking out
          soon.
        </div>
      )}
    </div>
  );
}
