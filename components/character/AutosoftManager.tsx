"use client";

/**
 * AutosoftManager - Manage autosofts loaded on RCC and drones
 *
 * Lists owned autosofts, shows load status, and assignment.
 */

import type { CharacterAutosoft } from "@/lib/types/character";
import type { SharedAutosoft } from "@/lib/types/rigging";

interface AutosoftManagerProps {
  ownedAutosofts: CharacterAutosoft[];
  loadedAutosofts: SharedAutosoft[];
  maxLoadedSlots?: number;
  onLoadAutosoft?: (autosoftId: string) => void;
  onUnloadAutosoft?: (autosoftId: string) => void;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  combat: "Combat",
  perception: "Perception",
  defense: "Defense",
  movement: "Movement",
  "electronic-warfare": "Electronic Warfare",
  stealth: "Stealth",
};

export function AutosoftManager({
  ownedAutosofts,
  loadedAutosofts,
  maxLoadedSlots = 0,
  onLoadAutosoft,
  onUnloadAutosoft,
  className = "",
}: AutosoftManagerProps) {
  const loadedIds = new Set(loadedAutosofts.map((a) => a.autosoftId));
  const canLoadMore = maxLoadedSlots === 0 || loadedAutosofts.length < maxLoadedSlots;

  if (ownedAutosofts.length === 0) {
    return (
      <div className={`autosoft-manager autosoft-manager--empty ${className}`}>
        <h3 className="autosoft-manager__title">Autosofts</h3>
        <p className="autosoft-manager__empty">No autosofts owned</p>
      </div>
    );
  }

  return (
    <div className={`autosoft-manager ${className}`}>
      <h3 className="autosoft-manager__title">Autosofts</h3>

      {maxLoadedSlots > 0 && (
        <div className="autosoft-manager__capacity">
          <span>
            {loadedAutosofts.length} / {maxLoadedSlots} loaded on RCC
          </span>
        </div>
      )}

      <ul className="autosoft-manager__list">
        {ownedAutosofts.map((autosoft) => {
          const isLoaded = loadedIds.has(autosoft.id ?? autosoft.catalogId);

          return (
            <li
              key={autosoft.id ?? autosoft.catalogId}
              className={`autosoft-manager__item ${isLoaded ? "autosoft-manager__item--loaded" : ""}`}
            >
              <div className="autosoft-manager__item-info">
                <span className="autosoft-manager__item-name">{autosoft.name}</span>
                <span className="autosoft-manager__item-rating">R{autosoft.rating}</span>
              </div>

              <div className="autosoft-manager__item-meta">
                <span className="autosoft-manager__category">
                  {CATEGORY_LABELS[autosoft.category] ?? autosoft.category}
                </span>
                {autosoft.target && (
                  <span className="autosoft-manager__target">({autosoft.target})</span>
                )}
              </div>

              {isLoaded && (
                <span className="autosoft-manager__shared-badge">Shared to network</span>
              )}

              <div className="autosoft-manager__actions">
                {isLoaded ? (
                  <button
                    className="autosoft-manager__btn autosoft-manager__btn--unload"
                    onClick={() => onUnloadAutosoft?.(autosoft.id ?? autosoft.catalogId)}
                  >
                    Unload
                  </button>
                ) : (
                  <button
                    className="autosoft-manager__btn autosoft-manager__btn--load"
                    onClick={() => onLoadAutosoft?.(autosoft.id ?? autosoft.catalogId)}
                    disabled={!canLoadMore}
                  >
                    Load
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
