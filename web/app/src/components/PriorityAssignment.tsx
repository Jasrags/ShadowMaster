import { DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useEdition } from '../hooks/useEdition';
import {
  createEmptyAssignments,
  getAvailablePriorities,
  getCategoryLabel,
  getPriorityOptions,
  getPrioritySummary,
  isAssignmentsComplete,
  PRIORITY_CATEGORIES,
  PriorityAssignments,
} from '../utils/priorities';
import { PriorityCode } from '../types/editions';

interface DragState {
  source: 'pool' | 'dropzone';
  category?: keyof PriorityAssignments;
  priority: PriorityCode;
}

function normalizeAssignments(assignments: PriorityAssignments): Record<string, PriorityCode | null> {
  return Object.fromEntries(
    Object.entries(assignments).map(([key, value]) => [key, value ? (value as PriorityCode) : null]),
  );
}

function getInitialAssignments(): PriorityAssignments {
  const base = createEmptyAssignments();
  if (typeof window === 'undefined') {
    return base;
  }

  const existing = window.ShadowmasterLegacyApp?.getPriorities?.();
  if (!existing) {
    return base;
  }

  const result = { ...base };
  for (const category of PRIORITY_CATEGORIES) {
    const value = existing[category];
    if (typeof value === 'string' && value.length === 1) {
      result[category] = value as PriorityCode;
    }
  }
  return result;
}

export function PriorityAssignment() {
  const { characterCreationData, activeEdition, isLoading, error } = useEdition();
  const [assignments, setAssignments] = useState<PriorityAssignments>(() => getInitialAssignments());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dropzoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    document.body.classList.add('react-priority-enabled');
    return () => {
      document.body.classList.remove('react-priority-enabled');
    };
  }, []);

  useEffect(() => {
    const legacyHandler = window.ShadowmasterLegacyApp?.setPriorities;
    if (legacyHandler) {
      legacyHandler(normalizeAssignments(assignments));
    }
  }, [assignments]);

  const missingPriorities = useMemo(() => getAvailablePriorities(assignments), [assignments]);
  const allAssigned = isAssignmentsComplete(assignments);

  function releasePriority(priority: PriorityCode) {
    setAssignments((prev) => {
      const next = { ...prev };
      for (const category of PRIORITY_CATEGORIES) {
        if (next[category] === priority) {
          next[category] = '';
        }
      }
      return next;
    });
  }

  function handleChipDragStart(priority: PriorityCode, event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.effectAllowed = 'move';
    setDragState({ source: 'pool', priority });
    event.dataTransfer.setData('text/plain', priority);
  }

  function handleDropzoneDragStart(category: keyof PriorityAssignments, priority: PriorityCode, event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.effectAllowed = 'move';
    setDragState({ source: 'dropzone', category, priority });
    event.dataTransfer.setData('text/plain', priority);
  }

  function clearDragState() {
    setDragState(null);
  }

  function handleDrop(category: keyof PriorityAssignments, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const priority = (event.dataTransfer.getData('text/plain') || dragState?.priority || '') as PriorityCode;
    if (!priority) {
      clearDragState();
      return;
    }

    setAssignments((prev) => {
      const next: PriorityAssignments = { ...prev };

      // Ensure uniqueness by clearing any existing reference to the priority
      for (const otherCategory of PRIORITY_CATEGORIES) {
        if (next[otherCategory] === priority) {
          next[otherCategory] = '';
        }
      }

      next[category] = priority;
      return next;
    });

    clearDragState();
  }

  function handleDragOver(category: keyof PriorityAssignments, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const zone = dropzoneRefs.current[category];
    if (zone) {
      zone.classList.add('active');
    }
  }

  function handleDragLeave(category: keyof PriorityAssignments) {
    const zone = dropzoneRefs.current[category];
    if (zone) {
      zone.classList.remove('active');
    }
  }

  function handleDropEnd(category: keyof PriorityAssignments) {
    const zone = dropzoneRefs.current[category];
    if (zone) {
      zone.classList.remove('active');
    }
  }

  function handleChipClick(priority: PriorityCode) {
    const nextTarget = missingPriorities[0];
    if (!nextTarget) {
      // All categories are assigned; clicking frees the chip
      releasePriority(priority);
      return;
    }

    setAssignments((prev) => {
      const next = { ...prev };
      // Remove from any current position
      for (const category of PRIORITY_CATEGORIES) {
        if (next[category] === priority) {
          next[category] = '';
        }
      }
      next[nextTarget as keyof PriorityAssignments] = priority;
      return next;
    });
  }

  return (
    <div className="react-priority-wrapper">
      <div className="react-priority-header">
        <span>
          Priority Assignment — <strong>{activeEdition.label}</strong>
        </span>
        <span>{isLoading ? 'Loading priority data…' : error ? `Error: ${error}` : 'Drag letters into categories'}</span>
      </div>

      <div className="react-priority-layout">
        <aside className="react-priority-pool">
          <h4>Available Priorities</h4>
          <div
            className="react-priority-dropzone"
            onDragOver={(event) => {
              event.preventDefault();
              setDragState((prev) => (prev ? { ...prev, category: undefined } : prev));
            }}
            onDrop={(event) => {
              event.preventDefault();
              const priority = (event.dataTransfer.getData('text/plain') || dragState?.priority || '') as PriorityCode;
              if (priority) {
                releasePriority(priority);
              }
              clearDragState();
            }}
          >
            <div className="react-priority-chips">
              {['A', 'B', 'C', 'D', 'E'].map((code) => {
                const assigned = getAvailablePriorities(assignments).includes(code as PriorityCode) === false;
                const isBeingDragged = dragState?.priority === code && dragState.source === 'pool';

                return (
                  <div
                    key={code}
                    className={`react-priority-chip ${assigned ? 'used' : ''} ${isBeingDragged ? 'dragging' : ''}`}
                    draggable={!assigned}
                    onDragStart={(event) => !assigned && handleChipDragStart(code as PriorityCode, event)}
                    onDragEnd={clearDragState}
                    onClick={() => handleChipClick(code as PriorityCode)}
                    role="button"
                    tabIndex={assigned ? -1 : 0}
                    onKeyDown={(event) => {
                      if (!assigned && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        handleChipClick(code as PriorityCode);
                      }
                    }}
                  >
                    {code}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="react-priority-dropzones">
          {PRIORITY_CATEGORIES.map((category) => {
            const label = getCategoryLabel(category);
            const options = getPriorityOptions(characterCreationData, category);
            const assignedPriority = assignments[category];
            const option = options.find((opt) => opt.code === assignedPriority);
            const isActive = dragState?.source === 'dropzone' && dragState.category === category;

            return (
              <div
                key={category}
                ref={(node) => {
                  dropzoneRefs.current[category] = node;
                }}
                className={`react-priority-dropzone ${assignedPriority ? 'filled' : ''}`}
                onDragOver={(event) => handleDragOver(category, event)}
                onDragLeave={() => handleDragLeave(category)}
                onDrop={(event) => {
                  handleDrop(category, event);
                  handleDropEnd(category);
                }}
              >
                <div className="react-priority-category">
                  <span>{label}</span>
                  {assignedPriority && (
                    <span>
                      {assignedPriority} — {option?.option.label ?? 'Unknown'}
                    </span>
                  )}
                </div>
                <div className="react-priority-description">{getPrioritySummary(option?.option)}</div>

                {assignedPriority ? (
                  <div
                    className={`react-priority-chip ${isActive ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(event) => handleDropzoneDragStart(category, assignedPriority as PriorityCode, event)}
                    onDragEnd={clearDragState}
                    onDoubleClick={() => releasePriority(assignedPriority as PriorityCode)}
                  >
                    {assignedPriority}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#6b8599' }}>Drop priority here</div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      <div
        className={`react-priority-status ${allAssigned ? 'success' : ''}`}
        role="status"
        aria-live="polite"
      >
        {allAssigned
          ? '✓ All priorities assigned. You can proceed to metatype selection.'
          : `Missing priorities: ${missingPriorities.join(', ')}`}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ShadowmasterLegacyApp?: {
      setPriorities?: (assignments: Record<string, PriorityCode | null>) => void;
      getPriorities?: () => Record<string, PriorityCode | null>;
    };
  }
}
