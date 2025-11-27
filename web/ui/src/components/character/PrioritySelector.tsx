import type { PrioritySelection, CharacterCreationData } from '../../lib/types';

interface PrioritySelectorProps {
  priorities: PrioritySelection;
  onChange: (priorities: PrioritySelection) => void;
  creationData: CharacterCreationData;
  gameplayLevel?: string;
  onGameplayLevelChange?: (level: string) => void;
}

interface CategoryInfo {
  key: keyof PrioritySelection;
  label: string;
  description: string;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'metatype_priority', label: 'Metatype', description: 'Determines available metatypes and special attribute points' },
  { key: 'attributes_priority', label: 'Attributes', description: 'Determines attribute point pool' },
  { key: 'magic_priority', label: 'Magic/Resonance', description: 'Determines magic/resonance rating and type' },
  { key: 'skills_priority', label: 'Skills', description: 'Determines skill and skill group points' },
  { key: 'resources_priority', label: 'Resources', description: 'Determines starting nuyen' },
];

const PRIORITY_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function PrioritySelector({ priorities, onChange, creationData, gameplayLevel, onGameplayLevelChange }: PrioritySelectorProps) {
  // Debug: Check if we have the required data
  if (!creationData) {
    return (
      <div className="p-4 bg-sr-danger/10 border border-sr-danger rounded-md">
        <p className="text-sm text-sr-danger">Error: Creation data is missing</p>
      </div>
    );
  }

  if (!creationData.priorities) {
    return (
      <div className="p-4 bg-sr-danger/10 border border-sr-danger rounded-md">
        <p className="text-sm text-sr-danger">Error: Priority data is missing from creation data</p>
      </div>
    );
  }

  const handlePriorityClick = (categoryKey: keyof PrioritySelection, priority: string) => {
    // Check if this priority is already assigned to another category
    const currentCategory = Object.entries(priorities).find(
      ([key, value]) => key !== categoryKey && value === priority
    );

    const updatedPriorities: PrioritySelection = { ...priorities };

    if (currentCategory) {
      // Move priority from old category to new category
      updatedPriorities[currentCategory[0] as keyof PrioritySelection] = ''; // Remove from old category
    }
    
    updatedPriorities[categoryKey] = priority; // Assign to new category
    
    // If changing magic priority, clear magic_type selection (will be set in Step 3)
    if (categoryKey === 'magic_priority') {
      updatedPriorities.magic_type = undefined;
    }

    onChange(updatedPriorities);
  };

  const getPriorityBenefit = (category: string, priority: string): string => {
    if (!priority) return '';
    
    if (!creationData?.priorities) {
      console.warn('PrioritySelector: creationData.priorities is missing');
      return '';
    }
    
    const option = creationData.priorities[category]?.[priority];
    if (!option) return '';
    
    return option.label || '';
  };

  const getUsedPriorities = (): Set<string> => {
    const used = new Set<string>();
    Object.values(priorities).forEach(priority => {
      if (priority && priority !== 'none') {
        used.add(priority);
      }
    });
    return used;
  };

  const usedPriorities = getUsedPriorities();
  const allAssigned = usedPriorities.size === 5;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-4 bg-sr-light-gray/20 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-300 mb-2">
          <strong className="text-gray-100">Click a priority letter (A-E) to assign it to each category.</strong>
        </p>
        <p className="text-xs text-gray-400">
          Each priority level can only be used once. Higher priorities (A, B) grant better benefits. All categories must have a priority assigned.
        </p>
      </div>

      {/* Category Priority Selectors */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const currentPriority = priorities[category.key];
          const categoryName = category.key.replace('_priority', '');

          return (
            <div
              key={category.key}
              className={`
                p-4 rounded-md border-2 transition-all
                ${currentPriority 
                  ? 'border-sr-accent/50 bg-sr-accent/10' 
                  : 'border-sr-light-gray bg-sr-gray/30'
                }
              `}
            >
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-200">{category.label}</h4>
                  {currentPriority && (
                    <span className="px-2 py-0.5 bg-sr-accent/20 text-sr-accent text-xs font-bold rounded">
                      Priority {currentPriority}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{category.description}</p>
              </div>
              
              {/* Priority Letter Buttons */}
              <div className="flex gap-2 flex-wrap">
                {PRIORITY_LETTERS.map((priority) => {
                  const isSelected = currentPriority === priority;
                  const isUsedElsewhere = !isSelected && usedPriorities.has(priority);
                  
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handlePriorityClick(category.key, priority)}
                      className={`
                        w-12 h-12 flex items-center justify-center rounded-md border-2 font-bold text-lg
                        transition-all
                        ${isSelected
                          ? 'bg-sr-accent border-sr-accent text-gray-100 shadow-lg scale-105'
                          : isUsedElsewhere
                          ? 'bg-sr-gray/50 border-sr-light-gray/50 text-gray-500 opacity-50 cursor-not-allowed'
                          : 'bg-sr-gray border-sr-light-gray text-gray-100 hover:bg-sr-light-gray hover:border-sr-accent hover:scale-105 cursor-pointer'
                        }
                      `}
                      disabled={isUsedElsewhere}
                      title={
                        isSelected 
                          ? `Priority ${priority} is assigned to ${category.label}`
                          : isUsedElsewhere
                          ? `Priority ${priority} is already assigned to another category - click to move it here`
                          : `Assign Priority ${priority} to ${category.label}`
                      }
                    >
                      {priority}
                    </button>
                  );
                })}
              </div>

              {/* Show benefit for current priority */}
              {currentPriority && (
                <div className="mt-3 space-y-2">
                  {(() => {
                    const option = creationData.priorities?.[categoryName]?.[currentPriority];
                    const label = option?.label || getPriorityBenefit(categoryName, currentPriority);
                    const summary = option?.summary;
                    const description = option?.description;
                    
                    return (
                      <div className="p-2 bg-sr-light-gray/30 rounded border border-sr-light-gray">
                        <p className="text-xs text-gray-300">
                          <strong className="text-gray-100">Priority {currentPriority}:</strong>{' '}
                          {label}
                        </p>
                        {summary && (
                          <p className="text-xs text-gray-400 mt-1">{summary}</p>
                        )}
                        {description && (
                          <p className="text-xs text-gray-500 mt-1 italic">{description}</p>
                        )}
                        {category.key === 'magic_priority' && (
                          (() => {
                            const magicOption = creationData.priorities?.magic?.[currentPriority];
                            const availableTypes = magicOption?.available_types || [];
                            if (availableTypes.length > 0) {
                              return (
                                <p className="text-xs text-gray-400 mt-1">
                                  Available types: {availableTypes.join(', ')}. Select on Magic/Resonance screen.
                                </p>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validation Summary */}
      {allAssigned && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
          <p className="text-sm text-green-400">
            ✓ All priorities assigned! You can proceed to the next step.
          </p>
        </div>
      )}
    </div>
  );
}
