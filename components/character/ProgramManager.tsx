'use client';

/**
 * ProgramManager - Manage loaded programs on a cyberdeck
 *
 * Shows owned programs and allows loading/unloading from the active deck.
 * Tracks slot usage and displays program effects.
 */

import { useState, useCallback } from 'react';
import type { CharacterCyberdeck } from '@/lib/types/matrix';
import type { CharacterProgram, ProgramCategory } from '@/lib/types/programs';

interface ProgramManagerProps {
  deck: CharacterCyberdeck;
  ownedPrograms: CharacterProgram[];
  onLoadProgram?: (programId: string) => void;
  onUnloadProgram?: (programId: string) => void;
  readOnly?: boolean;
  className?: string;
}

const CATEGORY_LABELS: Record<ProgramCategory, string> = {
  common: 'Common',
  hacking: 'Hacking',
  agent: 'Agent',
};

const CATEGORY_ORDER: ProgramCategory[] = ['common', 'hacking', 'agent'];

export function ProgramManager({
  deck,
  ownedPrograms,
  onLoadProgram,
  onUnloadProgram,
  readOnly = false,
  className = ''
}: ProgramManagerProps) {
  const [filter, setFilter] = useState<ProgramCategory | 'all' | 'loaded'>('all');

  const loadedProgramIds = new Set(deck.loadedPrograms);
  const slotsUsed = loadedProgramIds.size;
  const slotsAvailable = deck.programSlots - slotsUsed;

  // Group programs by category
  const programsByCategory = ownedPrograms.reduce<Record<string, CharacterProgram[]>>(
    (acc, program) => {
      const category = program.category || 'common';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(program);
      return acc;
    },
    {}
  );

  // Filter programs
  const getFilteredPrograms = useCallback(() => {
    if (filter === 'loaded') {
      return ownedPrograms.filter(p => loadedProgramIds.has(p.catalogId));
    }
    if (filter === 'all') {
      return ownedPrograms;
    }
    return programsByCategory[filter] ?? [];
  }, [filter, ownedPrograms, loadedProgramIds, programsByCategory]);

  const filteredPrograms = getFilteredPrograms();

  // Handle load/unload
  const handleToggleProgram = useCallback((programId: string) => {
    if (readOnly) return;

    if (loadedProgramIds.has(programId)) {
      onUnloadProgram?.(programId);
    } else {
      if (slotsAvailable > 0) {
        onLoadProgram?.(programId);
      }
    }
  }, [readOnly, loadedProgramIds, slotsAvailable, onLoadProgram, onUnloadProgram]);

  return (
    <div className={`program-manager ${className}`}>
      <div className="program-manager__header">
        <h4 className="program-manager__title">Programs</h4>
        <span className={`program-manager__slots ${slotsAvailable === 0 ? 'program-manager__slots--full' : ''}`}>
          {slotsUsed} / {deck.programSlots} slots
        </span>
      </div>

      {/* Slot Progress Bar */}
      <div className="program-manager__slot-bar">
        <div
          className="program-manager__slot-fill"
          style={{ width: `${(slotsUsed / deck.programSlots) * 100}%` }}
        />
      </div>

      {/* Category Filter */}
      <div className="program-manager__filters">
        <button
          type="button"
          className={`program-manager__filter ${filter === 'all' ? 'program-manager__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({ownedPrograms.length})
        </button>
        <button
          type="button"
          className={`program-manager__filter ${filter === 'loaded' ? 'program-manager__filter--active' : ''}`}
          onClick={() => setFilter('loaded')}
        >
          Loaded ({loadedProgramIds.size})
        </button>
        {CATEGORY_ORDER.map((category) => {
          const count = programsByCategory[category]?.length ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={category}
              type="button"
              className={`program-manager__filter ${filter === category ? 'program-manager__filter--active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {CATEGORY_LABELS[category]} ({count})
            </button>
          );
        })}
      </div>

      {/* Program List */}
      <div className="program-manager__list">
        {filteredPrograms.length === 0 ? (
          <p className="program-manager__empty">
            {filter === 'loaded' ? 'No programs loaded' : 'No programs owned'}
          </p>
        ) : (
          filteredPrograms.map((program) => {
            const isLoaded = loadedProgramIds.has(program.catalogId);
            const canLoad = !isLoaded && slotsAvailable > 0;

            return (
              <div
                key={program.catalogId}
                className={`program-manager__item ${isLoaded ? 'program-manager__item--loaded' : ''}`}
              >
                <div className="program-manager__item-info">
                  <span className="program-manager__item-name">
                    {program.name}
                  </span>
                  <span className="program-manager__item-category">
                    {CATEGORY_LABELS[program.category] ?? program.category}
                  </span>
                  {program.rating && (
                    <span className="program-manager__item-rating">
                      Rating {program.rating}
                    </span>
                  )}
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    className={`program-manager__toggle ${isLoaded ? 'program-manager__toggle--unload' : 'program-manager__toggle--load'}`}
                    onClick={() => handleToggleProgram(program.catalogId)}
                    disabled={!isLoaded && !canLoad}
                    title={
                      isLoaded
                        ? 'Unload program'
                        : canLoad
                        ? 'Load program'
                        : 'No slots available'
                    }
                  >
                    {isLoaded ? 'Unload' : 'Load'}
                  </button>
                )}

                {readOnly && isLoaded && (
                  <span className="program-manager__loaded-badge">Loaded</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Slots Warning */}
      {slotsAvailable === 0 && !readOnly && (
        <p className="program-manager__warning">
          All program slots are in use. Unload a program to load another.
        </p>
      )}
    </div>
  );
}
