import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useEdition } from '../hooks/useEdition';
import { useCharacterWizard } from '../context/CharacterWizardContext';
import type { Priorities } from '../context/CharacterWizardContext';
import {
  createEmptyAssignments,
  getAvailablePriorities,
  getCategoryLabel,
  getPriorityOptions,
  getPrioritySummary,
  isAssignmentsComplete,
  PRIORITY_CATEGORIES,
  PRIORITY_CODES,
  PriorityAssignments,
} from '../utils/priorities';
import {
  CharacterCreationData,
  CreationMethodDefinition,
  GameplayRules,
  PriorityCode,
} from '../types/editions';

interface DragState {
  source: 'pool' | 'dropzone';
  category?: keyof PriorityAssignments;
  priority: PriorityCode;
}

function normalizeMethodKey(method?: string | null): string {
  if (!method) {
    return '';
  }
  const normalized = method.toLowerCase().trim().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'sumtotten':
    case 'sum2ten':
    case 'sum_to10':
      return 'sum_to_ten';
    case 'point_buy':
    case 'pointbuy':
      return 'karma';
    default:
      return normalized;
  }
}

function normalizeAssignments(assignments: PriorityAssignments): Record<string, PriorityCode | null> {
  return Object.fromEntries(
    Object.entries(assignments).map(([key, value]) => [key, value ? (value as PriorityCode) : null]),
  );
}

function prioritiesToAssignments(priorities: Priorities): PriorityAssignments {
  const base = createEmptyAssignments();
  return {
    magic: priorities.magic ?? base.magic,
    metatype: priorities.metatype ?? base.metatype,
    attributes: priorities.attributes ?? base.attributes,
    skills: priorities.skills ?? base.skills,
    resources: priorities.resources ?? base.resources,
  };
}

function assignmentsToPriorities(assignments: PriorityAssignments): Priorities {
  return {
    magic: assignments.magic ? (assignments.magic as PriorityCode) : null,
    metatype: assignments.metatype ? (assignments.metatype as PriorityCode) : null,
    attributes: assignments.attributes ? (assignments.attributes as PriorityCode) : null,
    skills: assignments.skills ? (assignments.skills as PriorityCode) : null,
    resources: assignments.resources ? (assignments.resources as PriorityCode) : null,
  };
}

function getDefaultSumToTenAssignments(): PriorityAssignments {
  return {
    magic: 'A',
    metatype: 'B',
    attributes: 'C',
    skills: 'D',
    resources: 'E',
  };
}

export function PriorityAssignment() {
  const {
    characterCreationData,
    activeEdition,
    isLoading,
    error,
    campaignGameplayRules,
    campaignLoading,
    campaignError,
    campaignCreationMethod,
  } = useEdition();

  const creationMethods = useMemo(
    () => characterCreationData?.creation_methods ?? {},
    [characterCreationData?.creation_methods],
  );
  const resolvedMethod = useMemo(() => {
    const normalized = normalizeMethodKey(campaignCreationMethod);
    if (normalized && creationMethods[normalized]) {
      return normalized;
    }
    if (creationMethods.priority) {
      return 'priority';
    }
    const keys = Object.keys(creationMethods);
    if (keys.length > 0) {
      return keys[0];
    }
    return 'priority';
  }, [campaignCreationMethod, creationMethods]);

  if (resolvedMethod === 'sum_to_ten' && creationMethods['sum_to_ten']) {
    return (
      <SumToTenAssignment
        characterCreationData={characterCreationData}
        creationMethod={creationMethods['sum_to_ten']}
        activeEditionLabel={activeEdition.label}
        isLoading={isLoading}
        error={error}
        campaignGameplayRules={campaignGameplayRules}
        campaignLoading={campaignLoading}
        campaignError={campaignError}
      />
    );
  }

  if (resolvedMethod === 'karma' && creationMethods['karma']) {
    return (
      <KarmaPointBuyAssignment
        characterCreationData={characterCreationData}
        creationMethod={creationMethods['karma']}
        activeEditionLabel={activeEdition.label}
        isLoading={isLoading}
        error={error}
        campaignGameplayRules={campaignGameplayRules}
        campaignLoading={campaignLoading}
        campaignError={campaignError}
      />
    );
  }

  return (
    <ClassicPriorityAssignment
      characterCreationData={characterCreationData}
      activeEditionLabel={activeEdition.label}
      isLoading={isLoading}
      error={error}
      campaignGameplayRules={campaignGameplayRules}
      campaignLoading={campaignLoading}
      campaignError={campaignError}
    />
  );
}

interface ClassicPriorityAssignmentProps {
  characterCreationData?: CharacterCreationData;
  activeEditionLabel: string;
  isLoading: boolean;
  error?: string;
  campaignGameplayRules?: GameplayRules;
  campaignLoading: boolean;
  campaignError?: string;
}

function ClassicPriorityAssignment({
  characterCreationData,
  activeEditionLabel,
  isLoading,
  error,
  campaignGameplayRules,
  campaignLoading,
  campaignError,
}: ClassicPriorityAssignmentProps) {
  const wizard = useCharacterWizard();
  
  const [assignments, setAssignments] = useState<PriorityAssignments>(() =>
    prioritiesToAssignments(wizard.state.priorities),
  );
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dropzoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    document.body.classList.add('react-priority-enabled');
    return () => {
      document.body.classList.remove('react-priority-enabled');
    };
  }, []);

  // Use ref to track previous priorities and only update when they actually change
  const prevPrioritiesKey = useRef<string>('');
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    const normalized = normalizeAssignments(assignments);
    const prioritiesKey = JSON.stringify(normalized);
    
    // Skip initial sync if priorities are empty (to avoid loop on mount after reset)
    const isEmpty = !normalized.magic && !normalized.metatype && !normalized.attributes && 
                    !normalized.skills && !normalized.resources;
    
    if (isInitialMount.current && isEmpty) {
      isInitialMount.current = false;
      prevPrioritiesKey.current = prioritiesKey;
      return;
    }
    
    isInitialMount.current = false;
    
    // Only update if priorities actually changed
    if (prioritiesKey !== prevPrioritiesKey.current) {
      prevPrioritiesKey.current = prioritiesKey;
      
      // Sync to React context
      wizard.setPriorities(assignmentsToPriorities(assignments));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      releasePriority(priority);
      return;
    }

    setAssignments((prev) => {
      const next = { ...prev };
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
          Priority Assignment — <strong>{activeEditionLabel}</strong>
        </span>
        <span>
          {campaignError
            ? `Campaign defaults unavailable: ${campaignError}`
            : campaignLoading
            ? 'Applying campaign defaults…'
            : isLoading
            ? 'Loading priority data…'
            : error
            ? `Error: ${error}`
            : 'Drag letters into categories'}
        </span>
      </div>
      {campaignGameplayRules && (
        <div className="react-priority-campaign">
          <span className="campaign-tag">
            Campaign Defaults • {campaignGameplayRules.label}
          </span>
          {campaignGameplayRules.description && <p>{campaignGameplayRules.description}</p>}
        </div>
      )}

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
              {PRIORITY_CODES.map((code) => {
                const assigned = !getAvailablePriorities(assignments).includes(code);
                const isBeingDragged = dragState?.priority === code && dragState.source === 'pool';

                return (
                  <div
                    key={code}
                    className={`react-priority-chip ${assigned ? 'used' : ''} ${isBeingDragged ? 'dragging' : ''}`}
                    draggable={!assigned}
                    onDragStart={(event) => !assigned && handleChipDragStart(code, event)}
                    onDragEnd={clearDragState}
                    onClick={() => handleChipClick(code)}
                    role="button"
                    tabIndex={assigned ? -1 : 0}
                    onKeyDown={(event) => {
                      if (!assigned && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        handleChipClick(code);
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

const DEFAULT_SUM_TO_TEN_COSTS: Record<PriorityCode, number> = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0,
};

interface SumToTenAssignmentProps {
  characterCreationData?: CharacterCreationData;
  creationMethod: CreationMethodDefinition;
  activeEditionLabel: string;
  isLoading: boolean;
  error?: string;
  campaignGameplayRules?: GameplayRules;
  campaignLoading: boolean;
  campaignError?: string;
}

function SumToTenAssignment({
  characterCreationData,
  creationMethod,
  activeEditionLabel,
  isLoading,
  error,
  campaignGameplayRules,
  campaignLoading,
  campaignError,
}: SumToTenAssignmentProps) {
  const wizard = useCharacterWizard();
  const [assignments, setAssignments] = useState<PriorityAssignments>(() => {
    const fromContext = prioritiesToAssignments(wizard.state.priorities);
    const hasExisting = PRIORITY_CATEGORIES.some((category) => fromContext[category]);
    return hasExisting ? fromContext : getDefaultSumToTenAssignments();
  });

  useEffect(() => {
    wizard.setPriorities(assignmentsToPriorities(assignments));
  }, [assignments, wizard]);

  useEffect(() => {
    document.body.classList.add('react-priority-enabled');
    return () => {
      document.body.classList.remove('react-priority-enabled');
    };
  }, []);

  const costTable = useMemo(() => {
    const table: Record<PriorityCode, number> = { ...DEFAULT_SUM_TO_TEN_COSTS };
    PRIORITY_CODES.forEach((code) => {
      const value = creationMethod.priority_costs?.[code];
      if (typeof value === 'number') {
        table[code] = value;
      }
    });
    return table;
  }, [creationMethod.priority_costs]);

  const pointBudget = creationMethod.point_budget ?? 10;

  const totalSpent = useMemo(() => {
    return PRIORITY_CATEGORIES.reduce((sum, category) => {
      const code = assignments[category];
      return sum + (code ? costTable[code] ?? 0 : 0);
    }, 0);
  }, [assignments, costTable]);

  const remaining = pointBudget - totalSpent;
  const hasAllSelections = useMemo(
    () => PRIORITY_CATEGORIES.every((category) => !!assignments[category]),
    [assignments],
  );

  const statusClass =
    hasAllSelections && remaining === 0 ? 'success' : remaining < 0 ? 'error' : 'warning';

  const statusMessage = !hasAllSelections
    ? 'Select a priority letter for each category.'
    : remaining > 0
    ? `Spend the remaining ${remaining} point${remaining === 1 ? '' : 's'}.`
    : remaining < 0
    ? `Over budget by ${Math.abs(remaining)} point${Math.abs(remaining) === 1 ? '' : 's'}.`
    : '✓ All priorities assigned. You can proceed to metatype selection.';

  function setSelection(category: keyof PriorityAssignments, value: PriorityCode | '') {
    setAssignments((prev) => ({
      ...prev,
      [category]: value,
    }));
  }

  function handleSelect(category: keyof PriorityAssignments, event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    const normalized = value ? (value.toUpperCase() as PriorityCode) : '';
    setSelection(category, normalized);
  }

  function handleReset() {
    setAssignments(getDefaultSumToTenAssignments());
  }

  return (
    <div className="react-priority-wrapper sum-to-ten-wrapper">
      <div className="react-priority-header">
        <span>
          Sum-to-Ten Assignment — <strong>{activeEditionLabel}</strong>
        </span>
        <span>
          {campaignError
            ? `Campaign defaults unavailable: ${campaignError}`
            : campaignLoading
            ? 'Applying campaign defaults…'
            : isLoading
            ? 'Loading priority data…'
            : error
            ? `Error: ${error}`
            : 'Allocate priorities until you spend all points.'}
        </span>
      </div>
      {creationMethod.description && <p className="sum-to-ten-description">{creationMethod.description}</p>}
      {campaignGameplayRules && (
        <div className="react-priority-campaign">
          <span className="campaign-tag">
            Campaign Defaults • {campaignGameplayRules.label}
          </span>
          {campaignGameplayRules.description && <p>{campaignGameplayRules.description}</p>}
        </div>
      )}

      <div className="sum-to-ten-grid">
        {PRIORITY_CATEGORIES.map((category) => {
          const label = getCategoryLabel(category);
          const options = getPriorityOptions(characterCreationData, category);
          const assignedPriority = assignments[category];
          const option = options.find((opt) => opt.code === assignedPriority);
          const cost = assignedPriority ? costTable[assignedPriority] ?? 0 : 0;

          return (
            <div key={category} className="sum-to-ten-card">
              <div className="sum-to-ten-card__header">
                <span>{label}</span>
                {assignedPriority && <span>{assignedPriority} · {cost} pts</span>}
              </div>
              <select value={assignedPriority} onChange={(event) => handleSelect(category, event)}>
                <option value="">Select priority</option>
                {PRIORITY_CODES.map((code) => {
                  const descriptor = options.find((opt) => opt.code === code);
                  const optionCost = costTable[code] ?? 0;
                  return (
                    <option key={code} value={code}>
                      {`${code} (${optionCost} pts) — ${descriptor?.option.label ?? `Priority ${code}`}`}
                    </option>
                  );
                })}
              </select>
              <div className="sum-to-ten-card__summary">{getPrioritySummary(option?.option)}</div>
              {assignedPriority && (
                <button
                  type="button"
                  className="btn btn-link sum-to-ten-clear"
                  onClick={() => setSelection(category, '')}
                >
                  Clear selection
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`react-priority-status sum-to-ten-status ${statusClass}`}
        role="status"
        aria-live="polite"
      >
        {statusMessage}
      </div>

      <div className="sum-to-ten-footer">
        <span className="sum-to-ten-metrics">
          Spent {totalSpent} / {pointBudget} points
        </span>
        <div className="sum-to-ten-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
}

interface KarmaPointBuyAssignmentProps {
  characterCreationData?: CharacterCreationData;
  creationMethod: CreationMethodDefinition;
  activeEditionLabel: string;
  isLoading: boolean;
  error?: string;
  campaignGameplayRules?: GameplayRules;
  campaignLoading: boolean;
  campaignError?: string;
}

const KARMA_LEDGER_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'attributes', label: 'Attributes' },
  { key: 'skills', label: 'Skills' },
  { key: 'qualities', label: 'Qualities' },
  { key: 'gear', label: 'Gear & Lifestyle' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'other', label: 'Other' },
];

function KarmaPointBuyAssignment({
  characterCreationData,
  creationMethod,
  activeEditionLabel,
  isLoading,
  error,
  campaignGameplayRules,
  campaignLoading,
  campaignError,
}: KarmaPointBuyAssignmentProps) {
  const wizard = useCharacterWizard();
  const metatypeOptions = useMemo(() => {
    const list = characterCreationData?.metatypes ?? [];
    return list.map((metatype) => ({
      value: metatype.id,
      label: metatype.name,
    }));
  }, [characterCreationData?.metatypes]);

  const [metatypeId, setMetatypeId] = useState<string>(() => metatypeOptions[0]?.value ?? '');
  const [ledger, setLedger] = useState<Record<string, number>>(() =>
    KARMA_LEDGER_CATEGORIES.reduce<Record<string, number>>((acc, category) => {
      acc[category.key] = 0;
      return acc;
    }, {}),
  );

  useEffect(() => {
    wizard.setPriorities(assignmentsToPriorities(createEmptyAssignments()));
  }, [wizard]);

  useEffect(() => {
    const defaultMetatype = metatypeOptions[0]?.value ?? '';
    setMetatypeId((prev) => (prev ? prev : defaultMetatype));
  }, [metatypeOptions]);

  const budget = creationMethod.karma_budget ?? 800;
  const metatypeCost =
    creationMethod.metatype_costs?.[metatypeId?.toLowerCase?.() ?? ''] ??
    creationMethod.metatype_costs?.human ??
    0;
  const totalSpent =
    metatypeCost +
    KARMA_LEDGER_CATEGORIES.reduce((sum, category) => sum + (ledger[category.key] ?? 0), 0);
  const remaining = budget - totalSpent;

  const gearSpent = ledger.gear ?? 0;
  const gearLimit = creationMethod.gear_conversion?.max_karma_for_gear ?? null;
  const overGearLimit = gearLimit !== null && gearSpent > gearLimit;

  let statusClass = 'warning';
  if (remaining === 0) {
    statusClass = 'success';
  } else if (remaining < 0) {
    statusClass = 'error';
  }

  const statusMessage =
    remaining === 0
      ? '✓ All Karma allocated. Review the remaining steps, then proceed.'
      : remaining < 0
      ? `Over budget by ${Math.abs(remaining)} Karma. Adjust your selections.`
      : `Spend the remaining ${remaining} Karma before finalizing.`;

  function handleLedgerChange(category: string, event: ChangeEvent<HTMLInputElement>) {
    const value = Number.parseInt(event.target.value, 10);
    setLedger((prev) => ({
      ...prev,
      [category]: Number.isNaN(value) || value < 0 ? 0 : value,
    }));
  }

  function handleMetatypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setMetatypeId(event.target.value);
  }

  function handleReset() {
    setLedger(
      KARMA_LEDGER_CATEGORIES.reduce<Record<string, number>>((acc, category) => {
        acc[category.key] = 0;
        return acc;
      }, {}),
    );
    if (metatypeOptions[0]) {
      setMetatypeId(metatypeOptions[0].value);
    }
  }

  return (
    <div className="react-priority-wrapper karma-wrapper">
      <div className="react-priority-header">
        <span>
          Karma Point-Buy — <strong>{activeEditionLabel}</strong>
        </span>
        <span>
          {campaignError
            ? `Campaign defaults unavailable: ${campaignError}`
            : campaignLoading
            ? 'Applying campaign defaults…'
            : isLoading
            ? 'Loading karma data…'
            : error
            ? `Error: ${error}`
            : 'Allocate your Karma budget before moving on.'}
        </span>
      </div>

      {creationMethod.description && <p className="karma-description">{creationMethod.description}</p>}
      {creationMethod.notes && creationMethod.notes.length > 0 && (
        <ul className="karma-notes">
          {creationMethod.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      {campaignGameplayRules && (
        <div className="react-priority-campaign">
          <span className="campaign-tag">
            Campaign Defaults • {campaignGameplayRules.label}
          </span>
          {campaignGameplayRules.description && <p>{campaignGameplayRules.description}</p>}
        </div>
      )}

      <div className="karma-grid">
        <section className="karma-panel">
          <h4>Metatype</h4>
          <label className="karma-field">
            <span>Choose metatype</span>
            <select value={metatypeId} onChange={handleMetatypeChange}>
              {metatypeOptions.map((option) => {
                const cost =
                  creationMethod.metatype_costs?.[option.value.toLowerCase?.() ?? ''] ??
                  creationMethod.metatype_costs?.human ??
                  0;
                return (
                  <option key={option.value} value={option.value}>
                    {option.label} ({cost} Karma)
                  </option>
                );
              })}
            </select>
          </label>
          <p className="karma-info">Metatype cost: <strong>{metatypeCost} Karma</strong></p>
        </section>

        <section className="karma-panel">
          <h4>Karma Ledger</h4>
          <div className="karma-ledger">
            {KARMA_LEDGER_CATEGORIES.map(({ key, label }) => {
              const value = ledger[key] ?? 0;
              const limitHint =
                key === 'gear' && gearLimit !== null
                  ? ` (max ${gearLimit} Karma)`
                  : '';
              return (
                <label key={key} className="karma-field karma-ledger-row">
                  <span>
                    {label}
                    {limitHint}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={value}
                    onChange={(event) => handleLedgerChange(key, event)}
                  />
                </label>
              );
            })}
          </div>
        </section>

        <section className="karma-panel karma-summary">
          <h4>Budget Summary</h4>
          <dl>
            <div>
              <dt>Karma budget</dt>
              <dd>{budget}</dd>
            </div>
            <div>
              <dt>Metatype cost</dt>
              <dd>{metatypeCost}</dd>
            </div>
            <div>
              <dt>Ledger spend</dt>
              <dd>{totalSpent - metatypeCost}</dd>
            </div>
            <div>
              <dt>Total spent</dt>
              <dd>{totalSpent}</dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd>{remaining}</dd>
            </div>
          </dl>
          {overGearLimit && (
            <p className="karma-warning">
              Gear conversion exceeds the campaign limit of {gearLimit} Karma. Adjust your allocation.
            </p>
          )}
          <p className="karma-hint">
            Remember: Only one Physical and one Mental attribute may start at their natural maximum.
            Attribute purchases should respect metatype caps.
          </p>
        </section>
      </div>

      <div className={`react-priority-status karma-status ${statusClass}`} role="status" aria-live="polite">
        {statusMessage}
      </div>

      <div className="karma-footer">
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset allocations
        </button>
      </div>
    </div>
  );
}
