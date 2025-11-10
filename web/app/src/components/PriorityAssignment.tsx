import { useEffect, useMemo, useState } from 'react';
import { useEdition } from '../hooks/useEdition';
import {
  createEmptyAssignments,
  getCategoryLabel,
  getPriorityOptions,
  PRIORITY_CATEGORIES,
  PriorityAssignments,
} from '../utils/priorities';
import { PriorityCode } from '../types/editions';

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

  const missingPriorities = useMemo(() => {
    const used = new Set<string>();
    PRIORITY_CATEGORIES.forEach((category) => {
      const value = assignments[category];
      if (value) {
        used.add(value);
      }
    });
    return ['A', 'B', 'C', 'D', 'E'].filter((priority) => !used.has(priority));
  }, [assignments]);

  const allAssigned = missingPriorities.length === 0;

  function handlePriorityChange(category: keyof PriorityAssignments, value: string) {
    setAssignments((prev) => {
      if (prev[category] === value) {
        return prev;
      }

      const next: PriorityAssignments = { ...prev };

      // Clear any category currently using the new value
      if (value) {
        for (const otherCategory of PRIORITY_CATEGORIES) {
          if (otherCategory !== category && next[otherCategory] === value) {
            next[otherCategory] = '';
          }
        }
      }

      next[category] = (value as PriorityCode) || '';
      return next;
    });
  }

  return (
    <div className="react-priority-wrapper">
      <div className="react-priority-header">
        <span>
          Priority Assignment — <strong>{activeEdition.label}</strong>
        </span>
        <span>{isLoading ? 'Loading priority data…' : error ? `Error: ${error}` : 'React-driven'}</span>
      </div>

      <div className="react-priority-grid">
        {PRIORITY_CATEGORIES.map((category) => {
          const label = getCategoryLabel(category);
          const options = getPriorityOptions(characterCreationData, category);
          const selected = assignments[category] ?? '';
          const selectedOption = options.find((opt) => opt.code === selected);

          return (
            <div key={category} className="react-priority-card">
              <label htmlFor={`react-priority-${category}`}>{label}</label>
              <select
                id={`react-priority-${category}`}
                className="react-priority-select"
                value={selected}
                onChange={(event) => handlePriorityChange(category, event.target.value)}
              >
                <option value="">Select priority…</option>
                {options.map(({ code, option }) => (
                  <option key={code} value={code}>
                    {code} — {option.label}
                  </option>
                ))}
              </select>

              <div className="react-priority-summary">
                {selectedOption?.option.summary || selectedOption?.option.description || 'Pick a priority to view details.'}
              </div>
            </div>
          );
        })}
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
