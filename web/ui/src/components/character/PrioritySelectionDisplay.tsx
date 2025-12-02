import { useState, useEffect } from 'react';
import { Button } from 'react-aria-components';
import type { CharacterSR5, CharacterCreationData } from '../../lib/types';
import { characterApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { MetatypeSelectionModal } from './MetatypeSelectionModal';
import { MagicResonanceSelectionModal } from './MagicResonanceSelectionModal';

interface CategoryInfo {
  key: 'metatype' | 'attributes' | 'magic' | 'skills' | 'resources';
  label: string;
  description: string;
  hasSelection: boolean;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'metatype', label: 'Metatype', description: 'Determines available metatypes and special attribute points', hasSelection: true },
  { key: 'attributes', label: 'Attributes', description: 'Determines attribute point pool', hasSelection: false },
  { key: 'magic', label: 'Magic or Resonance', description: 'Determines magic/resonance rating and type', hasSelection: true },
  { key: 'skills', label: 'Skills', description: 'Determines skill and skill group points', hasSelection: false },
  { key: 'resources', label: 'Resources', description: 'Determines starting nuyen', hasSelection: false },
];

const PRIORITY_LETTERS = ['A', 'B', 'C', 'D', 'E'];

interface PrioritySelectionDisplayProps {
  characterId: string;
  editionData: CharacterSR5;
  onPrioritiesChange?: (priorities: Record<string, string>) => void;
}

const getStorageKey = (characterId: string) => `character_creation_${characterId}`;

interface StoredCreationData {
  priorities: Record<string, string>;
  metatype?: string;
  magicType?: string;
  attributeRanges?: Record<string, { min: number; max: number }>;
  attributes?: Record<string, number>;
  timestamp: number;
}

export function PrioritySelectionDisplay({ characterId, editionData, onPrioritiesChange }: PrioritySelectionDisplayProps) {
  const { showError } = useToast();
  const [creationData, setCreationData] = useState<CharacterCreationData | null>(null);
  const [priorities, setPriorities] = useState<Record<string, string>>(() => {
    // Try to load from localStorage first, then fall back to editionData
    const storageKey = getStorageKey(characterId);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed: StoredCreationData = JSON.parse(stored);
        // Merge with editionData, prioritizing stored data
        return {
          metatype: parsed.priorities.metatype || editionData?.metatype_priority || '',
          attributes: parsed.priorities.attributes || editionData?.attributes_priority || '',
          magic: parsed.priorities.magic || editionData?.magic_priority || '',
          skills: parsed.priorities.skills || editionData?.skills_priority || '',
          resources: parsed.priorities.resources || editionData?.resources_priority || '',
        };
      } catch (e) {
        console.error('Failed to parse stored creation data:', e);
      }
    }
    // Fall back to editionData
    return {
      metatype: editionData?.metatype_priority || '',
      attributes: editionData?.attributes_priority || '',
      magic: editionData?.magic_priority || '',
      skills: editionData?.skills_priority || '',
      resources: editionData?.resources_priority || '',
    };
  });
  const [showMetatypeModal, setShowMetatypeModal] = useState(false);
  const [showMagicModal, setShowMagicModal] = useState(false);

  useEffect(() => {
    loadCreationData();
  }, []);

  // Save to localStorage whenever priorities change
  useEffect(() => {
    const storageKey = getStorageKey(characterId);
    const stored: StoredCreationData = {
      priorities,
      metatype: editionData?.metatype,
      magicType: editionData?.magic_type,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(stored));
  }, [priorities, characterId, editionData?.metatype, editionData?.magic_type]);

  const loadCreationData = async () => {
    try {
      const data = await characterApi.getCharacterCreationData('sr5');
      setCreationData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load creation data';
      showError('Failed to load creation data', errorMessage);
    }
  };

  const handlePriorityClick = (categoryKey: string, priority: string) => {
    const currentPriority = priorities[categoryKey];
    
    // If clicking the already selected priority, unselect it
    if (currentPriority === priority) {
      const updatedPriorities: Record<string, string> = { ...priorities };
      updatedPriorities[categoryKey] = '';
      setPriorities(updatedPriorities);
      onPrioritiesChange?.(updatedPriorities);
      return;
    }
    
    // Check if this priority is already assigned to another category
    const currentCategory = Object.entries(priorities).find(
      ([key, value]) => key !== categoryKey && value === priority
    );

    const updatedPriorities: Record<string, string> = { ...priorities };

    if (currentCategory) {
      // Move priority from old category to new category
      updatedPriorities[currentCategory[0]] = ''; // Remove from old category
    }
    
    updatedPriorities[categoryKey] = priority; // Assign to new category
    
    setPriorities(updatedPriorities);
    onPrioritiesChange?.(updatedPriorities);
  };

  const getPriorityValue = (category: string, priority: string): string => {
    if (!creationData?.priorities || !priority) return '';
    
    const categoryData = creationData.priorities[category as keyof typeof creationData.priorities];
    if (!categoryData) return '';
    
    const option = categoryData[priority];
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

  const getCurrentValue = (category: CategoryInfo): string => {
    const priority = priorities[category.key];
    
    // Try to get stored value from localStorage
    const storageKey = getStorageKey(characterId);
    const stored = localStorage.getItem(storageKey);
    let storedMetatype: string | undefined;
    let storedMagicType: string | undefined;
    
    if (stored) {
      try {
        const parsed: StoredCreationData = JSON.parse(stored);
        storedMetatype = parsed.metatype;
        storedMagicType = parsed.magicType;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    if (category.key === 'metatype') {
      return storedMetatype || editionData?.metatype || 'Any metatype';
    }
    
    if (category.key === 'magic') {
      return storedMagicType || editionData?.magic_type || getPriorityValue('magic', priority || '');
    }
    
    return getPriorityValue(category.key, priority || '');
  };

  if (!creationData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Loading priority data...</div>
      </div>
    );
  }

  const usedPriorities = getUsedPriorities();
  const allAssigned = usedPriorities.size === 5;

  return (
    <>
      <div className="space-y-4">
        {/* Instructions */}
        <div className="p-3 bg-sr-light-gray/20 border border-sr-light-gray rounded-md">
          <p className="text-sm text-gray-300 mb-1">
            <strong className="text-gray-100">Click a priority letter (A-E) to assign it to each category.</strong>
          </p>
          <p className="text-xs text-gray-400">
            Each priority level can only be used once. Higher priorities (A, B) grant better benefits.
          </p>
        </div>

        {/* Category Priority Selectors */}
        {CATEGORIES.map((category) => {
          const currentPriority = priorities[category.key];
          const categoryName = category.key.replace('_priority', '');
          const currentValue = getCurrentValue(category);

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
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-200">{category.label}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{category.description}</p>
                </div>
                
                {category.hasSelection && (
                  <Button
                    onPress={() => {
                      if (category.key === 'metatype') {
                        setShowMetatypeModal(true);
                      } else if (category.key === 'magic') {
                        setShowMagicModal(true);
                      }
                    }}
                    className="px-3 py-1 bg-sr-darker border border-sr-light-gray rounded text-sr-accent hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors text-sm"
                  >
                    Select {category.label}
                  </Button>
                )}
              </div>
              
              {/* Priority Letter Buttons */}
              <div className="flex gap-2 flex-wrap mb-3">
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

              {/* Show available priorities when none selected, or selected priority value when chosen */}
              <div className="mt-3 space-y-2">
                {currentPriority ? (
                  // Show selected priority value
                  (() => {
                    const option = (creationData.priorities as Record<string, Record<string, { label?: string; summary?: string; description?: string }>>)?.[categoryName]?.[currentPriority];
                    const label = option?.label || getPriorityValue(categoryName, currentPriority);
                    const summary = option?.summary;
                    const description = option?.description;
                    
                    // For metatype priority, format with special attribute points
                    let formattedLabel = label;
                    if (category.key === 'metatype' && creationData.metatypes) {
                      // Get metatypes available for this priority tier
                      const metatypesForPriority = creationData.metatypes.filter(m => 
                        m.priority_tiers.includes(currentPriority)
                      );
                      
                      if (metatypesForPriority.length > 0) {
                        // Format as "Metatype (points), Metatype (points), ..."
                        const metatypeList = metatypesForPriority
                          .map((metatype) => {
                            const specialPoints = metatype.special_attribute_points || {};
                            const points = specialPoints[currentPriority] || 0;
                            return `${metatype.name} (${points})`;
                          })
                          .join(', ');
                        formattedLabel = metatypeList;
                      }
                    }
                    
                    return (
                      <div className="p-2 bg-sr-light-gray/30 rounded border border-sr-light-gray">
                        <p className="text-xs text-gray-300">
                          <strong className="text-gray-100">Priority {currentPriority}:</strong>{' '}
                          {formattedLabel}
                        </p>
                        {currentValue && currentValue !== formattedLabel && category.key === 'metatype' && (
                          <p className="text-xs text-gray-400 mt-1">
                            <strong>Current:</strong> {currentValue}
                          </p>
                        )}
                        {summary && (
                          <p className="text-xs text-gray-400 mt-1">{summary}</p>
                        )}
                        {description && (
                          <p className="text-xs text-gray-500 mt-1 italic">{description}</p>
                        )}
                        {category.key === 'magic' && (
                          (() => {
                            const magicOption = creationData.priorities?.magic?.[currentPriority];
                            const availableTypes = magicOption?.available_types || [];
                            if (availableTypes.length > 0) {
                              return (
                                <p className="text-xs text-gray-400 mt-1">
                                  Available types: {availableTypes.join(', ')}. Select above to choose.
                                </p>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>
                    );
                  })()
                ) : (
                  // Show all available priorities and their values
                  <div className="p-2 bg-sr-light-gray/30 rounded border border-sr-light-gray">
                    <p className="text-xs font-semibold text-gray-200 mb-2">Available Priorities:</p>
                    <div className="space-y-1">
                      {PRIORITY_LETTERS.map((priority) => {
                        const option = (creationData.priorities as Record<string, Record<string, { label?: string }>>)?.[categoryName]?.[priority];
                        const label = option?.label || getPriorityValue(categoryName, priority);
                        
                        // For metatype, format with special attribute points
                        let formattedLabel = label;
                        if (category.key === 'metatype' && creationData.metatypes && label) {
                          const metatypesForPriority = creationData.metatypes.filter(m => 
                            m.priority_tiers.includes(priority)
                          );
                          
                          if (metatypesForPriority.length > 0) {
                            const metatypeList = metatypesForPriority
                              .map((metatype) => {
                                const specialPoints = metatype.special_attribute_points || {};
                                const points = specialPoints[priority] || 0;
                                return `${metatype.name} (${points})`;
                              })
                              .join(', ');
                            formattedLabel = metatypeList;
                          }
                        }
                        
                        const isUsedElsewhere = usedPriorities.has(priority);
                        
                        return (
                          <p 
                            key={priority} 
                            className={`text-xs ${isUsedElsewhere ? 'text-gray-500 line-through' : 'text-gray-300'}`}
                          >
                            <strong className="text-gray-100">Priority {priority}:</strong>{' '}
                            {formattedLabel || 'N/A'}
                            {isUsedElsewhere && (
                              <span className="text-gray-500 ml-1">(assigned to another category)</span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Validation Summary */}
        {allAssigned && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
            <p className="text-sm text-green-400">
              ✓ All priorities assigned!
            </p>
          </div>
        )}
      </div>

      <MetatypeSelectionModal
        isOpen={showMetatypeModal}
        onOpenChange={setShowMetatypeModal}
        metatypes={creationData.metatypes}
        currentMetatype={editionData?.metatype}
        priority={priorities.metatype}
        onSelect={(metatype) => {
          // Handle metatype selection - will wire up to API later
          // For now, save to localStorage
          const storageKey = getStorageKey(characterId);
          const stored = localStorage.getItem(storageKey);
          
          // Extract attribute ranges from metatype
          const attributeRanges: Record<string, { min: number; max: number }> = {};
          if (metatype.attribute_ranges) {
            Object.entries(metatype.attribute_ranges).forEach(([attr, range]: [string, any]) => {
              attributeRanges[attr] = {
                min: range.min ?? range.Min ?? 1,
                max: range.max ?? range.Max ?? 6,
              };
            });
          }
          
          // Set current attribute values to minimums (except essence which uses max)
          const attributes: Record<string, number> = {
            body: attributeRanges.body?.min || 1,
            agility: attributeRanges.agility?.min || 1,
            reaction: attributeRanges.reaction?.min || 1,
            strength: attributeRanges.strength?.min || 1,
            willpower: attributeRanges.willpower?.min || 1,
            logic: attributeRanges.logic?.min || 1,
            intuition: attributeRanges.intuition?.min || 1,
            charisma: attributeRanges.charisma?.min || 1,
            edge: attributeRanges.edge?.min || 1,
            essence: attributeRanges.essence?.max || 6,
          };
          
          if (stored) {
            try {
              const parsed: StoredCreationData = JSON.parse(stored);
              parsed.metatype = metatype.id;
              parsed.attributeRanges = attributeRanges;
              parsed.attributes = attributes;
              localStorage.setItem(storageKey, JSON.stringify(parsed));
              // Trigger custom event for same-tab updates
              window.dispatchEvent(new Event('localStorageChange'));
            } catch (e) {
              console.error('Failed to update stored metatype:', e);
            }
          } else {
            // Create new storage entry if it doesn't exist
            const newStored: StoredCreationData = {
              priorities,
              metatype: metatype.id,
              attributeRanges,
              attributes,
              timestamp: Date.now(),
            };
            localStorage.setItem(storageKey, JSON.stringify(newStored));
            // Trigger custom event for same-tab updates
            window.dispatchEvent(new Event('localStorageChange'));
          }
          console.log('Metatype selected:', metatype);
          setShowMetatypeModal(false);
        }}
      />

      <MagicResonanceSelectionModal
        isOpen={showMagicModal}
        onOpenChange={setShowMagicModal}
        magicPriorities={creationData.priorities.magic}
        currentMagicType={editionData?.magic_type}
        currentPriority={priorities.magic}
        onSelect={(magicType) => {
          // Handle magic/resonance selection - will wire up to API later
          // For now, save to localStorage
          const storageKey = getStorageKey(characterId);
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            try {
              const parsed: StoredCreationData = JSON.parse(stored);
              parsed.magicType = magicType;
              localStorage.setItem(storageKey, JSON.stringify(parsed));
            } catch (e) {
              console.error('Failed to update stored magic type:', e);
            }
          }
          console.log('Magic/Resonance selected:', magicType);
          setShowMagicModal(false);
        }}
      />
    </>
  );
}
