import { useState, useEffect } from 'react';
import { Button } from 'react-aria-components';
import { priorityApi } from '../../lib/api';

export type PriorityLevel = 'A' | 'B' | 'C' | 'D' | 'E';

export type PriorityCategory = 'metatype' | 'attributes' | 'magic_resonance' | 'skills' | 'resources';

export interface PriorityAssignment {
  metatype: PriorityLevel | '';
  selected_metatype?: string; // Selected metatype ID (human, elf, etc.)
  attributes: PriorityLevel | '';
  magic_resonance: PriorityLevel | '';
  skills: PriorityLevel | '';
  resources: PriorityLevel | '';
}

interface PrioritySelectionProps {
  playLevel: string; // 'street' | 'experienced' | 'prime'
  onAssignmentChange: (assignment: PriorityAssignment) => void;
  initialAssignment?: PriorityAssignment;
}

const PRIORITY_LEVELS: PriorityLevel[] = ['A', 'B', 'C', 'D', 'E'];

const CATEGORY_LABELS: Record<PriorityCategory, string> = {
  metatype: 'Metatype',
  attributes: 'Attributes',
  magic_resonance: 'Magic/Resonance',
  skills: 'Skills',
  resources: 'Resources',
};

const CATEGORY_DESCRIPTIONS: Record<PriorityCategory, string> = {
  metatype: 'Determines metatype selection and special attribute points',
  attributes: 'Attribute point pool for physical and mental attributes',
  magic_resonance: 'Magic or Resonance rating and related resources',
  skills: 'Skill points and skill groups',
  resources: 'Starting nuyen',
};

interface PriorityTables {
  metatype: Record<string, {
    human: number;
    elf: number;
    dwarf: number;
    ork: number;
    troll: number;
  }>;
  attributes: Record<string, number>;
  magic_resonance: Record<string, {
    magic_rating: number;
    resonance_rating: number;
    skill_rating: number;
    spells: number;
    complex_forms: number;
    skill_groups: number;
  }>;
  skills: Record<string, {
    individual_points: number;
    group_points: number;
  }>;
  resources: Record<string, number>;
}

export function PrioritySelection({ 
  playLevel, 
  onAssignmentChange,
  initialAssignment 
}: PrioritySelectionProps) {
  const [assignment, setAssignment] = useState<PriorityAssignment>(
    initialAssignment || {
      metatype: '',
      attributes: '',
      magic_resonance: '',
      skills: '',
      resources: '',
    }
  );
  const [validationError, setValidationError] = useState<string>('');
  const [priorityTables, setPriorityTables] = useState<PriorityTables | null>(null);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [selectedMetatype, setSelectedMetatype] = useState<string>('');

  useEffect(() => {
    if (initialAssignment) {
      setAssignment(initialAssignment);
      setSelectedMetatype(initialAssignment.selected_metatype || '');
    }
  }, [initialAssignment]);

  useEffect(() => {
    const loadPriorityTables = async () => {
      setIsLoadingTables(true);
      try {
        const data = await priorityApi.getPriorityTables(playLevel);
        setPriorityTables(data.tables);
      } catch (error) {
        console.error('Failed to load priority tables:', error);
      } finally {
        setIsLoadingTables(false);
      }
    };

    loadPriorityTables();
  }, [playLevel]);

  const handlePriorityChange = (category: PriorityCategory, level: PriorityLevel) => {
    // If clicking the same priority that's already selected, deselect it
    const currentPriority = assignment[category];
    const newPriority = currentPriority === level ? '' : level;
    const newAssignment = { ...assignment, [category]: newPriority };
    
    // If deselecting metatype priority, also clear selected metatype
    if (category === 'metatype' && newPriority === '') {
      newAssignment.selected_metatype = undefined;
      setSelectedMetatype('');
    }
    
    setAssignment(newAssignment);
    
    // Validate assignment
    const validation = validateAssignment(newAssignment);
    setValidationError(validation.error || '');
    
    // Only call onAssignmentChange if valid (all 5 priorities assigned) or if we're deselecting
    // This allows partial assignments during selection
    if (validation.valid || newPriority === '') {
      onAssignmentChange(newAssignment);
    }
  };

  const handleMetatypeSelection = (metatypeId: string) => {
    setSelectedMetatype(metatypeId);
    const newAssignment = { ...assignment, selected_metatype: metatypeId };
    setAssignment(newAssignment);
    onAssignmentChange(newAssignment);
  };

  const getAvailableMetatypes = (priority: PriorityLevel): Array<{ id: string; name: string; points: number }> => {
    if (!priorityTables || !priority) return [];
    
    const levelKey = priority.toUpperCase();
    const metatypeData = priorityTables.metatype[levelKey];
    if (!metatypeData) return [];

    const available: Array<{ id: string; name: string; points: number }> = [];
    if (metatypeData.human > 0) available.push({ id: 'human', name: 'Human', points: metatypeData.human });
    if (metatypeData.elf > 0) available.push({ id: 'elf', name: 'Elf', points: metatypeData.elf });
    if (metatypeData.dwarf > 0) available.push({ id: 'dwarf', name: 'Dwarf', points: metatypeData.dwarf });
    if (metatypeData.ork > 0) available.push({ id: 'ork', name: 'Ork', points: metatypeData.ork });
    if (metatypeData.troll > 0) available.push({ id: 'troll', name: 'Troll', points: metatypeData.troll });
    
    return available;
  };

  const validateAssignment = (assign: PriorityAssignment): { valid: boolean; error?: string } => {
    const priorities = [
      assign.metatype,
      assign.attributes,
      assign.magic_resonance,
      assign.skills,
      assign.resources,
    ].filter(p => p !== '') as PriorityLevel[];

    // Check for duplicates
    const used = new Set<PriorityLevel>();
    for (const p of priorities) {
      if (used.has(p)) {
        return { valid: false, error: `Priority ${p} is used more than once` };
      }
      used.add(p);
    }

    // Check if all priorities are assigned
    if (priorities.length < 5) {
      return { valid: false, error: 'All priorities (A-E) must be assigned' };
    }

    return { valid: true };
  };

  const getAvailablePriorities = (category: PriorityCategory): PriorityLevel[] => {
    const usedPriorities = new Set(
      Object.values(assignment).filter(p => p !== '') as PriorityLevel[]
    );
    
    // If this category already has a priority, include it in available
    const currentPriority = assignment[category];
    if (currentPriority) {
      usedPriorities.delete(currentPriority);
    }

    return PRIORITY_LEVELS.filter(p => !usedPriorities.has(p) || p === currentPriority);
  };

  const getPriorityColor = (level: PriorityLevel): string => {
    switch (level) {
      case 'A': return 'bg-sr-accent text-sr-darker';
      case 'B': return 'bg-cyan-500 text-sr-darker';
      case 'C': return 'bg-yellow-500 text-sr-darker';
      case 'D': return 'bg-orange-500 text-sr-darker';
      case 'E': return 'bg-red-500 text-sr-darker';
      default: return 'bg-sr-light-gray text-gray-400';
    }
  };

  const formatPriorityValue = (category: PriorityCategory, level: PriorityLevel): string => {
    if (!priorityTables) return '';
    
    const levelKey = level.toUpperCase();
    const data = priorityTables[category]?.[levelKey];
    if (!data) return '';

    switch (category) {
      case 'metatype': {
        const metatype = data as PriorityTables['metatype'][string];
        const metatypes: string[] = [];
        if (metatype.human > 0) metatypes.push(`Human (${metatype.human})`);
        if (metatype.elf > 0) metatypes.push(`Elf (${metatype.elf})`);
        if (metatype.dwarf > 0) metatypes.push(`Dwarf (${metatype.dwarf})`);
        if (metatype.ork > 0) metatypes.push(`Ork (${metatype.ork})`);
        if (metatype.troll > 0) metatypes.push(`Troll (${metatype.troll})`);
        return metatypes.join(', ') || '—';
      }
      case 'attributes': {
        return `${data as number} points`;
      }
      case 'skills': {
        const skills = data as PriorityTables['skills'][string];
        return `${skills.individual_points} / ${skills.group_points}`;
      }
      case 'resources': {
        const nuyen = data as number;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(nuyen).replace('$', '') + '¥';
      }
      case 'magic_resonance': {
        const magic = data as PriorityTables['magic_resonance'][string];
        if (magic.magic_rating === 0 && magic.resonance_rating === 0) return 'No magic/resonance';
        const parts: string[] = [];
        if (magic.magic_rating > 0) {
          parts.push(`Magic ${magic.magic_rating}`);
          if (magic.spells > 0) parts.push(`${magic.spells} spells`);
        }
        if (magic.resonance_rating > 0) {
          parts.push(`Resonance ${magic.resonance_rating}`);
          if (magic.complex_forms > 0) parts.push(`${magic.complex_forms} forms`);
        }
        return parts.join(', ') || '—';
      }
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Assign each priority level (A-E) to exactly one category. Each priority level can only be used once.
        </p>
        {validationError && (
          <div className="mt-2 text-sm text-red-400">{validationError}</div>
        )}
      </div>

      <div className="space-y-4">
        {(['metatype', 'attributes', 'magic_resonance', 'skills', 'resources'] as PriorityCategory[]).map((category) => (
          <div
            key={category}
            className="bg-sr-darker border border-sr-light-gray rounded p-4 space-y-3"
          >
            <div>
              <h4 className="text-sm font-medium text-gray-200 mb-1">
                {CATEGORY_LABELS[category]}
              </h4>
              <p className="text-xs text-gray-400">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {PRIORITY_LEVELS.map((level) => {
                const isSelected = assignment[category] === level;
                const isAvailable = getAvailablePriorities(category).includes(level);
                const isDisabled = !isAvailable && !isSelected;
                const valueText = formatPriorityValue(category, level);

                return (
                  <div key={level} className="flex items-center gap-3">
                    <Button
                      onPress={() => handlePriorityChange(category, level)}
                      isDisabled={isDisabled}
                      className={`
                        px-3 py-1 rounded text-sm font-medium transition-all flex-shrink-0 w-12 h-8
                        ${isSelected 
                          ? `${getPriorityColor(level)} ring-2 ring-sr-accent` 
                          : isDisabled
                          ? 'bg-sr-light-gray text-gray-600 cursor-not-allowed'
                          : 'bg-sr-light-gray text-gray-300 hover:bg-sr-accent hover:text-sr-darker'
                        }
                      `}
                    >
                      {level}
                    </Button>
                    <div
                      className={`text-xs text-gray-400 flex-1 py-1 ${
                        isSelected ? 'text-sr-accent font-medium' : ''
                      }`}
                    >
                      {!isLoadingTables && valueText ? valueText : 'Loading...'}
                    </div>
                  </div>
                );
              })}
            </div>

            {assignment[category] && (
              <div className="text-xs text-gray-400 pt-2 border-t border-sr-light-gray">
                Selected: <span className="font-medium text-gray-300">{assignment[category]}</span>
              </div>
            )}

            {/* Metatype selection for metatype category */}
            {category === 'metatype' && assignment.metatype && (
              <div className="mt-3 pt-3 border-t border-sr-light-gray">
                <label className="text-xs font-medium text-gray-300 mb-2 block">
                  Select Metatype:
                </label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableMetatypes(assignment.metatype as PriorityLevel).map((meta) => (
                    <Button
                      key={meta.id}
                      onPress={() => handleMetatypeSelection(meta.id)}
                      className={`
                        px-3 py-1.5 rounded text-xs font-medium transition-all
                        ${selectedMetatype === meta.id
                          ? 'bg-sr-accent text-sr-darker ring-2 ring-sr-accent'
                          : 'bg-sr-light-gray text-gray-300 hover:bg-sr-accent hover:text-sr-darker'
                        }
                      `}
                    >
                      {meta.name} ({meta.points} pts)
                    </Button>
                  ))}
                </div>
                {selectedMetatype && (
                  <div className="text-xs text-gray-400 mt-2">
                    Selected: <span className="font-medium text-sr-accent">
                      {getAvailableMetatypes(assignment.metatype as PriorityLevel)
                        .find(m => m.id === selectedMetatype)?.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {Object.values(assignment).every(p => p !== '') && !validationError && (
        <div className="mt-4 p-4 bg-sr-darker border border-sr-accent rounded">
          <h4 className="text-sm font-medium text-glow-cyan mb-2">Assignment Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {(Object.keys(CATEGORY_LABELS) as PriorityCategory[]).map((category) => (
              <div key={category} className="text-gray-400">
                <span className="text-gray-300">{CATEGORY_LABELS[category]}:</span>{' '}
                <span className="font-medium text-sr-accent">{assignment[category]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

