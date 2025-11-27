import { useEffect, useMemo, useRef } from 'react';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, PrioritySelection, SumToTenSelection } from '../../../lib/types';
import { SumToTenSelector } from '../SumToTenSelector';
import { MetatypeSelector } from '../MetatypeSelector';
import { AttributeAllocator } from '../AttributeAllocator';

const PRIORITY_LETTERS = ['A', 'B', 'C', 'D', 'E'];

interface Step2MetatypeAttributesProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step2MetatypeAttributes({ formData, setFormData, creationData, errors, touched }: Step2MetatypeAttributesProps) {
  // Initialize priorities if they don't exist and priority method is selected
  useEffect(() => {
    if (formData.creationMethod === 'priority' && !formData.priorities) {
      const basePriorities: PrioritySelection = {
        metatype_priority: '',
        attributes_priority: '',
        magic_priority: '',
        skills_priority: '',
        resources_priority: '',
        gameplay_level: formData.gameplayLevel || 'experienced',
      };
      setFormData(prev => ({ ...prev, priorities: basePriorities }));
    }
  }, [formData.creationMethod, formData.gameplayLevel]);

  const priorities = formData.priorities || {
    metatype_priority: '',
    attributes_priority: '',
    magic_priority: '',
    skills_priority: '',
    resources_priority: '',
    gameplay_level: formData.gameplayLevel || 'experienced',
  };

  // Get used priorities and their categories
  const getUsedPriorities = (): Map<string, string> => {
    const used = new Map<string, string>();
    const categoryNames: Record<string, string> = {
      metatype_priority: 'Metatype',
      attributes_priority: 'Attributes',
      magic_priority: 'Magic/Resonance',
      skills_priority: 'Skills',
      resources_priority: 'Resources',
    };
    
    Object.entries(priorities).forEach(([key, value]) => {
      if (key.endsWith('_priority') && value && value !== 'none' && value !== '') {
        const categoryName = categoryNames[key] || key.replace('_priority', '').replace(/_/g, ' ');
        used.set(value, categoryName);
      }
    });
    return used;
  };

  const usedPriorities = getUsedPriorities();

  // Refs for scrolling to next sections
  const metatypeSelectionRef = useRef<HTMLDivElement>(null);
  const attributesPriorityRef = useRef<HTMLDivElement>(null);
  const attributeAllocationRef = useRef<HTMLDivElement>(null);

  // Handle metatype priority selection
  const handleMetatypePriorityChange = (priority: string) => {
    // Check if this priority is already assigned to another category
    const currentCategory = Object.entries(priorities).find(
      ([key, value]) => key !== 'metatype_priority' && key.endsWith('_priority') && value === priority
    );

    const updatedPriorities: PrioritySelection = { ...priorities };

    if (currentCategory) {
      // Remove from old category
      updatedPriorities[currentCategory[0] as keyof PrioritySelection] = '';
    }
    
    updatedPriorities.metatype_priority = priority;
    setFormData({ ...formData, priorities: updatedPriorities });
    
    // Scroll to metatype selection after a brief delay to allow DOM update
    setTimeout(() => {
      metatypeSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle attributes priority selection
  const handleAttributesPriorityChange = (priority: string) => {
    // Check if this priority is already assigned to another category
    const currentCategory = Object.entries(priorities).find(
      ([key, value]) => key !== 'attributes_priority' && key.endsWith('_priority') && value === priority
    );

    const updatedPriorities: PrioritySelection = { ...priorities };

    if (currentCategory) {
      // Remove from old category
      updatedPriorities[currentCategory[0] as keyof PrioritySelection] = '';
    }
    
    updatedPriorities.attributes_priority = priority;
    setFormData({ ...formData, priorities: updatedPriorities });
    
    // Scroll to attribute allocation after a brief delay to allow DOM update
    setTimeout(() => {
      attributeAllocationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSumToTenChange = (sumToTen: SumToTenSelection) => {
    setFormData({ ...formData, sumToTen });
  };

  const handleMetatypeSelect = (metatypeId: string) => {
    // Get the selected metatype to initialize attribute allocations with min values
    const selectedMetatypeData = creationData.metatypes.find(m => m.id === metatypeId);
    const initialAttributes: Record<string, number> = {};
    
    if (selectedMetatypeData?.attribute_ranges) {
      // Initialize attributes with metatype's minimum values
      Object.entries(selectedMetatypeData.attribute_ranges).forEach(([attr, range]) => {
        if (range && range.min !== undefined) {
          initialAttributes[attr] = range.min;
        }
      });
    }
    
    setFormData({ 
      ...formData, 
      selectedMetatype: metatypeId,
      attributeAllocations: initialAttributes,
    });
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, selected_metatype: metatypeId },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, selected_metatype: metatypeId },
      }));
    }
    
    // Scroll to attributes priority selection after a brief delay to allow DOM update
    setTimeout(() => {
      attributesPriorityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Get priority tier for filtering metatypes
  const metatypePriority = formData.creationMethod === 'priority' && formData.priorities?.metatype_priority
    ? formData.priorities.metatype_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen?.metatype_priority
    ? formData.sumToTen.metatype_priority
    : undefined;

  // Get attributes priority
  const attributesPriority = formData.creationMethod === 'priority' && formData.priorities?.attributes_priority
    ? formData.priorities.attributes_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen?.attributes_priority
    ? formData.sumToTen.attributes_priority
    : undefined;

  // Calculate available attribute points based on priority
  const ATTRIBUTE_POINTS: Record<string, number> = {
    A: 24,
    B: 20,
    C: 16,
    D: 14,
    E: 12,
  };
  const availableAttributePoints = attributesPriority ? ATTRIBUTE_POINTS[attributesPriority] || 12 : 0;

  // Get selected metatype data and extract min/max values
  const selectedMetatypeData = useMemo(() => {
    if (!formData.selectedMetatype) return null;
    return creationData.metatypes.find(m => m.id === formData.selectedMetatype) || null;
  }, [formData.selectedMetatype, creationData.metatypes]);

  const attributeMinMax = useMemo(() => {
    const minValues: Record<string, number> = {};
    const maxValues: Record<string, number> = {};
    
    if (selectedMetatypeData?.attribute_ranges) {
      Object.entries(selectedMetatypeData.attribute_ranges).forEach(([attr, range]) => {
        if (range && range.min !== undefined) {
          minValues[attr] = range.min;
        }
        if (range && range.max !== undefined) {
          maxValues[attr] = range.max;
        }
      });
    }
    
    return { minValues, maxValues };
  }, [selectedMetatypeData]);

  // Initialize attributes with metatype min values when metatype is selected
  useEffect(() => {
    if (selectedMetatypeData && Object.keys(attributeMinMax.minValues).length > 0) {
      setFormData(prev => {
        const currentAttributes = prev.attributeAllocations || {};
        const needsInitialization = Object.keys(currentAttributes).length === 0;
        
        if (needsInitialization) {
          const initializedAttributes: Record<string, number> = {};
          Object.entries(attributeMinMax.minValues).forEach(([attr, min]) => {
            initializedAttributes[attr] = min;
          });
          return { ...prev, attributeAllocations: initializedAttributes };
        } else {
          // Ensure all attributes are at least at their minimum
          const updatedAttributes: Record<string, number> = { ...currentAttributes };
          let needsUpdate = false;
          
          Object.entries(attributeMinMax.minValues).forEach(([attr, min]) => {
            if (updatedAttributes[attr] === undefined || updatedAttributes[attr] < min) {
              updatedAttributes[attr] = min;
              needsUpdate = true;
            }
          });
          
          if (needsUpdate) {
            return { ...prev, attributeAllocations: updatedAttributes };
          }
        }
        return prev;
      });
    }
  }, [selectedMetatypeData, attributeMinMax.minValues, setFormData]);

  // Check if there are any selections to clear
  const hasSelections = metatypePriority || formData.selectedMetatype || attributesPriority || 
    (formData.attributeAllocations && Object.keys(formData.attributeAllocations).length > 0);

  // Handle clear selections
  const handleClearSelections = () => {
    if (formData.creationMethod === 'priority' && formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: {
          ...prev.priorities!,
          metatype_priority: '',
          attributes_priority: '',
        },
        selectedMetatype: undefined,
        attributeAllocations: {},
      }));
    } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: {
          ...prev.sumToTen!,
          metatype_priority: '',
          attributes_priority: '',
        },
        selectedMetatype: undefined,
        attributeAllocations: {},
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedMetatype: undefined,
        attributeAllocations: {},
      }));
    }
  };

  // Get priority benefit description
  const getPriorityBenefit = (category: string, priority: string): string => {
    if (!priority || !creationData?.priorities) return '';
    const option = creationData.priorities[category]?.[priority];
    return option?.label || '';
  };

  // Get available metatypes for a priority tier
  const getMetatypesForPriority = (priority: string) => {
    if (!creationData?.metatypes) return [];
    return creationData.metatypes.filter(m => m.priority_tiers.includes(priority));
  };

  // Render Priority Selector for a single category
  const renderPrioritySelector = (
    category: 'metatype' | 'attributes',
    currentPriority: string | undefined,
    onPriorityChange: (priority: string) => void,
    label: string,
    description: string
  ) => {
    // For metatype priority, show what each priority offers
    const showMetatypeDetails = category === 'metatype';

    return (
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="mb-3">
          <h4 className="text-md font-semibold text-gray-200 mb-1">{label}</h4>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        
        {/* Priority Letter Buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          {PRIORITY_LETTERS.map((priority) => {
            const isSelected = currentPriority === priority;
            const isUsedElsewhere = !isSelected && usedPriorities.has(priority);
            
            return (
              <button
                key={priority}
                type="button"
                onClick={() => onPriorityChange(priority)}
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
                    ? `Priority ${priority} is assigned to ${label}`
                    : isUsedElsewhere
                    ? `Priority ${priority} is already assigned to another category`
                    : `Assign Priority ${priority} to ${label}`
                }
              >
                {priority}
              </button>
            );
          })}
        </div>

        {/* Show available options for each priority (metatype only) */}
        {showMetatypeDetails && (
          <div className="space-y-2 mt-4">
            <h5 className="text-sm font-semibold text-gray-200">Available Options by Priority:</h5>
            <div className="space-y-2">
              {PRIORITY_LETTERS.map((priority) => {
                const metatypesForPriority = getMetatypesForPriority(priority);
                if (metatypesForPriority.length === 0) return null;
                
                const isSelected = currentPriority === priority;
                const isUsedElsewhere = !isSelected && usedPriorities.has(priority);

                // Get special attribute points for each metatype at this priority tier
                const metatypeList = metatypesForPriority.map((metatype) => {
                  const specialPoints = metatype.special_attribute_points || {};
                  // special_attribute_points is a map: { "A": 9, "B": 7, ... }
                  const points = specialPoints[priority] || 0;
                  return `${metatype.name} (${points})`;
                }).join(', ');

                return (
                  <div
                    key={priority}
                    className={`p-2 rounded-md border text-sm ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/10'
                        : isUsedElsewhere
                        ? 'border-sr-light-gray/50 bg-sr-gray/30 opacity-60'
                        : 'border-sr-light-gray bg-sr-gray/50'
                    }`}
                  >
                    <span className={`font-semibold ${
                      isSelected ? 'text-sr-accent' : isUsedElsewhere ? 'text-gray-500' : 'text-gray-300'
                    }`}>
                      Priority {priority}:{' '}
                    </span>
                    {isUsedElsewhere ? (
                      <span className="text-gray-500 italic">(Assigned to {usedPriorities.get(priority)})</span>
                    ) : (
                      <span className="text-gray-200">{metatypeList}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Show benefit for current priority */}
        {currentPriority && !showMetatypeDetails && (
          <div className="mt-3 p-2 bg-sr-light-gray/30 rounded border border-sr-light-gray">
            <p className="text-xs text-gray-300">
              <strong className="text-gray-100">Priority {currentPriority}:</strong>{' '}
              {getPriorityBenefit(category, currentPriority) || `Priority ${currentPriority} benefits`}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Metatype & Attributes</h3>
          <p className="text-sm text-gray-400 mb-6">
            {formData.creationMethod === 'priority' && 'Select your Metatype Priority, then choose your Metatype. Next, select your Attributes Priority, then allocate attribute points.'}
            {formData.creationMethod === 'sum_to_ten' && 'Select your metatype priority and allocate 10 points across priority columns (A=4, B=3, C=2, D=1, E=0). Then allocate attribute points and special attribute points.'}
            {formData.creationMethod === 'karma' && 'Configure your character using the Karma Point-Buy system.'}
          </p>
        </div>
        {hasSelections && (
          <button
            onClick={handleClearSelections}
            className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
          >
            Clear Selections
          </button>
        )}
      </div>

      {/* Sum-to-Ten Selector */}
      {formData.creationMethod === 'sum_to_ten' && formData.sumToTen && (
        <SumToTenSelector
          selection={formData.sumToTen}
          onChange={handleSumToTenChange}
          creationData={creationData}
          gameplayLevel={formData.gameplayLevel}
        />
      )}

      {formData.creationMethod === 'karma' && (
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <p className="text-sm text-gray-400">
            Karma Point-Buy method will be implemented in a future update.
          </p>
        </div>
      )}

      {/* Priority Method Flow */}
      {formData.creationMethod === 'priority' && (
        <>
          {/* Step 1: Metatype Priority Selection */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-200">1. Select Metatype Priority</h4>
            {renderPrioritySelector(
              'metatype',
              metatypePriority,
              handleMetatypePriorityChange,
              'Metatype Priority',
              'Determines available metatypes and special attribute points'
            )}
          </div>

          {/* Step 2: Metatype Selection */}
          {metatypePriority && (
            <div ref={metatypeSelectionRef} className="space-y-3">
              <h4 className="text-md font-semibold text-gray-200">2. Select Metatype</h4>
              {errors.metatype && touched.metatype && (
                <p className="text-sm text-sr-danger">{errors.metatype}</p>
              )}
              <MetatypeSelector
                metatypes={creationData.metatypes}
                selectedMetatype={formData.selectedMetatype}
                onSelect={handleMetatypeSelect}
                priorityTier={metatypePriority}
              />
            </div>
          )}

          {/* Step 3: Attributes Priority Selection */}
          {formData.selectedMetatype && (
            <div ref={attributesPriorityRef} className="space-y-3">
              <h4 className="text-md font-semibold text-gray-200">3. Select Attributes Priority</h4>
              {renderPrioritySelector(
                'attributes',
                attributesPriority,
                handleAttributesPriorityChange,
                'Attributes Priority',
                'Determines attribute point pool'
              )}
            </div>
          )}

          {/* Step 4: Attribute Allocation */}
          {attributesPriority && formData.selectedMetatype && (
            <div ref={attributeAllocationRef} className="space-y-3">
              <h4 className="text-md font-semibold text-gray-200">4. Allocate Attributes</h4>
              <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md mb-3">
                <p className="text-sm text-gray-300">
                  Available Attribute Points: <strong className="text-gray-100">{availableAttributePoints}</strong>
                </p>
              </div>
              <AttributeAllocator
                attributes={formData.attributeAllocations || {}}
                onChange={(attrs) => setFormData({ ...formData, attributeAllocations: attrs })}
                availablePoints={availableAttributePoints}
                minValues={attributeMinMax.minValues}
                maxValues={attributeMinMax.maxValues}
                errors={errors}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
