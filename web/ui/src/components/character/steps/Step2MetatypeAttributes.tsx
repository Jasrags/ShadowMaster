import { useEffect } from 'react';
import { Select, Button, Popover, ListBox, ListBoxItem, SelectValue } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, PrioritySelection, SumToTenSelection } from '../../../lib/types';
import { PrioritySelector } from '../PrioritySelector';
import { SumToTenSelector } from '../SumToTenSelector';
import { MetatypeSelector } from '../MetatypeSelector';
import { AttributeAllocator } from '../AttributeAllocator';

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

  const handlePriorityChange = (newPriorities: PrioritySelection) => {
    setFormData({ ...formData, priorities: newPriorities });
  };

  const handleSumToTenChange = (sumToTen: SumToTenSelection) => {
    setFormData({ ...formData, sumToTen });
  };


  const handleMetatypeSelect = (metatypeId: string) => {
    setFormData({ ...formData, selectedMetatype: metatypeId });
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
  };

  // Get priority tier for filtering metatypes
  const priorityTier = formData.creationMethod === 'priority' && formData.priorities?.metatype_priority
    ? formData.priorities.metatype_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen?.metatype_priority
    ? formData.sumToTen.metatype_priority
    : undefined;

  // Calculate available attribute points (simplified - would need actual priority calculation)
  const availableAttributePoints = 20; // Placeholder - would calculate from priority

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Priority Allocation</h3>
        <p className="text-sm text-gray-400 mb-6">
          {formData.creationMethod === 'priority' && 'Assign priorities (A-E) to each category. Each priority level can only be used once.'}
          {formData.creationMethod === 'sum_to_ten' && 'Allocate 10 points across priority columns (A=4, B=3, C=2, D=1, E=0).'}
          {formData.creationMethod === 'karma' && 'Configure your character using the Karma Point-Buy system.'}
        </p>
      </div>

      {/* Priority/Sum-to-Ten Selector */}
      {formData.creationMethod === 'priority' ? (
        <PrioritySelector
          priorities={priorities}
          onChange={handlePriorityChange}
          creationData={creationData}
          gameplayLevel={formData.gameplayLevel}
        />
      ) : (
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <p className="text-sm text-gray-400">
            Current creation method: {formData.creationMethod || 'not set'}. Priority selector only shows for "priority" method.
          </p>
        </div>
      )}

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

      {/* Metatype Selector */}
      {priorityTier && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Metatype</h4>
          {errors.metatype && touched.metatype && (
            <p className="text-sm text-sr-danger">{errors.metatype}</p>
          )}
          <MetatypeSelector
            metatypes={creationData.metatypes}
            selectedMetatype={formData.selectedMetatype}
            onSelect={handleMetatypeSelect}
            priorityTier={priorityTier}
          />
        </div>
      )}

      {/* Attribute Allocator */}
      {formData.selectedMetatype && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Allocate Attributes</h4>
          <AttributeAllocator
            attributes={formData.attributeAllocations || {}}
            onChange={(attrs) => setFormData({ ...formData, attributeAllocations: attrs })}
            availablePoints={availableAttributePoints}
            errors={errors}
          />
        </div>
      )}
    </div>
  );
}

