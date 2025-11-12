import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { TextInput } from './common/TextInput';
import { useEdition } from '../hooks/useEdition';
import type { ShadowmasterLegacyApp } from '../types/legacy';

type SkillPriority = 'A' | 'B' | 'C' | 'D' | 'E' | '';

const SKILL_POINTS: Record<Exclude<SkillPriority, ''>, number> = {
  A: 50,
  B: 40,
  C: 34,
  D: 30,
  E: 27,
};

type SkillType = 'active' | 'knowledge';

export interface SkillEntry {
  id: string;
  name: string;
  rating: number;
  type: SkillType;
}

export interface SkillsState {
  priority: SkillPriority;
  availablePoints: number;
  usedPoints: number;
  remainingPoints: number;
  activeSkills: SkillEntry[];
  knowledgeSkills: SkillEntry[];
}

interface SkillsAllocationProps {
  priority: SkillPriority;
  storedActive?: SkillEntry[];
  storedKnowledge?: SkillEntry[];
  onBack: () => void;
  onStateChange: (state: SkillsState) => void;
  onSave: (state: SkillsState) => void;
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getAvailablePoints(priority: SkillPriority): number {
  if (!priority) {
    return 0;
  }
  return SKILL_POINTS[priority] ?? 0;
}

function clampRating(value: number): number {
  if (Number.isNaN(value)) {
    return 1;
  }
  return Math.min(Math.max(value, 1), 6);
}

export function SkillsAllocation({
  priority,
  storedActive = [],
  storedKnowledge = [],
  onBack,
  onStateChange,
  onSave,
}: SkillsAllocationProps) {
  const [activeSkills, setActiveSkills] = useState<SkillEntry[]>(storedActive);
  const [knowledgeSkills, setKnowledgeSkills] = useState<SkillEntry[]>(storedKnowledge);
  const availablePoints = useMemo(() => getAvailablePoints(priority), [priority]);

  useEffect(() => {
    setActiveSkills(storedActive);
  }, [storedActive]);

  useEffect(() => {
    setKnowledgeSkills(storedKnowledge);
  }, [storedKnowledge]);

  useEffect(() => {
    if (!priority) {
      setActiveSkills([]);
      setKnowledgeSkills([]);
    }
  }, [priority]);

  const usedPoints = useMemo(() => {
    const sumRatings = (entries: SkillEntry[]) =>
      entries.reduce((total, entry) => total + (Number.isFinite(entry.rating) ? entry.rating : 0), 0);
    return sumRatings(activeSkills) + sumRatings(knowledgeSkills);
  }, [activeSkills, knowledgeSkills]);

  const remainingPoints = availablePoints - usedPoints;

  const hasEmptyNames = [...activeSkills, ...knowledgeSkills].some((entry) => entry.name.trim().length === 0);
  const allRatingsInRange = [...activeSkills, ...knowledgeSkills].every((entry) => entry.rating >= 1 && entry.rating <= 6);

  const validation = useMemo(() => {
    if (!priority) {
      return { status: 'error', message: 'Assign a skills priority before continuing.' } as const;
    }

    if (hasEmptyNames) {
      return { status: 'error', message: 'Name each skill before saving.' } as const;
    }

    if (!allRatingsInRange) {
      return { status: 'error', message: 'Skill ratings must be between 1 and 6.' } as const;
    }

    if (usedPoints > availablePoints) {
      return {
        status: 'error',
        message: `Using ${usedPoints} points, but only ${availablePoints} available. Reduce ratings to continue.`,
      } as const;
    }

    if (usedPoints < availablePoints) {
      return {
        status: 'warning',
        message: `Spend all ${availablePoints} points. ${availablePoints - usedPoints} remaining.`,
      } as const;
    }

    return { status: 'success', message: 'Skills ready. Continue to gear and resources.' } as const;
  }, [allRatingsInRange, availablePoints, hasEmptyNames, priority, usedPoints]);

  useEffect(() => {
    onStateChange({
      priority,
      availablePoints,
      usedPoints,
      remainingPoints,
      activeSkills,
      knowledgeSkills,
    });
  }, [activeSkills, knowledgeSkills, availablePoints, onStateChange, priority, remainingPoints, usedPoints]);

  const addSkill = (type: SkillType) => {
    const entry: SkillEntry = {
      id: generateId(`skill-${type}`),
      name: '',
      rating: 1,
      type,
    };
    if (type === 'active') {
      setActiveSkills((prev) => [...prev, entry]);
    } else {
      setKnowledgeSkills((prev) => [...prev, entry]);
    }
  };

  const updateSkillName = (type: SkillType, id: string, value: string) => {
    const update = (entries: SkillEntry[]) =>
      entries.map((entry) => (entry.id === id ? { ...entry, name: value } : entry));
    if (type === 'active') {
      setActiveSkills(update);
    } else {
      setKnowledgeSkills(update);
    }
  };

  const updateSkillRating = (type: SkillType, id: string, value: number) => {
    const clamped = clampRating(value);
    const update = (entries: SkillEntry[]) =>
      entries.map((entry) => (entry.id === id ? { ...entry, rating: clamped } : entry));
    if (type === 'active') {
      setActiveSkills(update);
    } else {
      setKnowledgeSkills(update);
    }
  };

  const removeSkill = (type: SkillType, id: string) => {
    const filter = (entries: SkillEntry[]) => entries.filter((entry) => entry.id !== id);
    if (type === 'active') {
      setActiveSkills(filter);
    } else {
      setKnowledgeSkills(filter);
    }
  };

  const handleSave = () => {
    if (validation.status !== 'success') {
      return;
    }
    onSave({
      priority,
      availablePoints,
      usedPoints,
      remainingPoints,
      activeSkills,
      knowledgeSkills,
    });
  };

  const renderSkillList = (type: SkillType, entries: SkillEntry[]) => (
    <div className="skills-list" aria-label={`${type === 'active' ? 'Active' : 'Knowledge'} skills`}>
      {entries.length === 0 ? (
        <p className="skills-list__empty">No {type === 'active' ? 'active' : 'knowledge'} skills yet.</p>
      ) : (
        entries.map((entry) => {
          const nameId = `${entry.id}-name`;
          const ratingId = `${entry.id}-rating`;

          return (
            <div key={entry.id} className="skills-list__row">
              <label className="skills-list__field" htmlFor={nameId}>
                <span className="skills-list__field-label">Skill name</span>
                <TextInput
                  id={nameId}
                  value={entry.name}
                  onChange={(event) => updateSkillName(type, entry.id, event.target.value)}
                  placeholder="e.g., Pistols"
                />
              </label>
              <div className="skills-list__rating">
                <label className="skills-list__rating-label" htmlFor={ratingId}>
                  Rating
                </label>
                <input
                  id={ratingId}
                  type="number"
                  min={1}
                  max={6}
                  value={entry.rating}
                  onChange={(event) =>
                    updateSkillRating(type, entry.id, Number.parseInt(event.target.value, 10))
                  }
                />
              </div>
              <button type="button" className="btn-link" onClick={() => removeSkill(type, entry.id)}>
                Remove
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  const validationClass = `skills-allocation__validation skills-allocation__validation--${validation.status}`;

  return (
    <div className="skills-allocation">
      <header className="skills-allocation__header">
        <div className="skills-allocation__summary">
          <span>
            Available: <strong>{availablePoints}</strong>
          </span>
          <span>
            Used: <strong>{Math.max(usedPoints, 0)}</strong>
          </span>
          <span>
            Remaining: <strong>{Math.max(remainingPoints, 0)}</strong>
          </span>
        </div>
        <div className={validationClass}>{validation.message}</div>
      </header>

      <section className="skills-allocation__body">
        <div className="skills-allocation__column">
          <div className="skills-allocation__column-header">
            <h4>Active Skills</h4>
            <button type="button" className="btn-secondary" onClick={() => addSkill('active')}>
              Add Active Skill
            </button>
          </div>
          {renderSkillList('active', activeSkills)}
        </div>
        <div className="skills-allocation__column">
          <div className="skills-allocation__column-header">
            <h4>Knowledge Skills</h4>
            <button type="button" className="btn-secondary" onClick={() => addSkill('knowledge')}>
              Add Knowledge Skill
            </button>
          </div>
          {renderSkillList('knowledge', knowledgeSkills)}
        </div>
      </section>

      <footer className="skills-allocation__footer">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Attributes
        </button>
        <div
          className={`skills-allocation__status ${validation.status === 'success' ? 'skills-allocation__status--ready' : ''}`}
        >
          {validation.status === 'success'
            ? `Priority ${priority || '—'} · ${activeSkills.length + knowledgeSkills.length} skills`
            : 'Spend remaining points to continue.'}
        </div>
        <button type="button" className="btn-primary" disabled={validation.status !== 'success'} onClick={handleSave}>
          Save Skills
        </button>
      </footer>
    </div>
  );
}

interface LegacySkillState {
  active?: Array<{ id?: string; name: string; rating: number }>;
  knowledge?: Array<{ id?: string; name: string; rating: number }>;
}

export function SkillsPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const { characterCreationData } = useEdition();
  const [priority, setPriority] = useState<SkillPriority>('');
  const [storedSkills, setStoredSkills] = useState<LegacySkillState>({ active: [], knowledge: [] });

  useEffect(() => {
    setContainer(document.getElementById('skills-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-skills-enabled');
    return () => {
      document.body.classList.remove('react-skills-enabled');
    };
  }, []);

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (!legacy) {
      return;
    }

    const syncState = () => {
      const priorities = legacy.getPriorities?.() ?? {};
      setPriority((priorities.skills as SkillPriority) ?? '');

      const skillState = legacy.getSkillsState?.();
      if (skillState) {
        setStoredSkills({
          active: skillState.active?.map((entry) => ({ ...entry })) ?? [],
          knowledge: skillState.knowledge?.map((entry) => ({ ...entry })) ?? [],
        });
      } else {
        setStoredSkills({ active: [], knowledge: [] });
      }
    };

    syncState();
  }, [characterCreationData]);

  if (!container) {
    return null;
  }

  const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;

  const handleStateChange = (state: SkillsState) => {
    legacy?.setSkillsState?.({
      priority: state.priority,
      active: state.activeSkills.map((skill) => ({ id: skill.id, name: skill.name, rating: skill.rating })),
      knowledge: state.knowledgeSkills.map((skill) => ({ id: skill.id, name: skill.name, rating: skill.rating })),
      available: state.availablePoints,
      used: state.usedPoints,
    });
  };

  const handleBack = () => {
    legacy?.showWizardStep?.(4);
  };

  const handleSave = (state: SkillsState) => {
    handleStateChange(state);
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(6); // Move to Equipment step
    }
  };

  return createPortal(
    <SkillsAllocation
      priority={priority}
      storedActive={storedSkills.active?.map((entry) => ({
        id: entry.id ?? generateId('skill-active'),
        name: entry.name,
        rating: clampRating(entry.rating),
        type: 'active',
      }))}
      storedKnowledge={storedSkills.knowledge?.map((entry) => ({
        id: entry.id ?? generateId('skill-knowledge'),
        name: entry.name,
        rating: clampRating(entry.rating),
        type: 'knowledge',
      }))}
      onBack={handleBack}
      onStateChange={handleStateChange}
      onSave={handleSave}
    />,
    container,
  );
}

SkillsPortal.displayName = 'SkillsPortal';

export default SkillsPortal;
