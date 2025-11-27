import { Select, Button, Popover, ListBox, ListBoxItem, SelectValue } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, Tradition } from '../../../lib/types';
import { MagicTypeSelector } from '../MagicTypeSelector';
import { traditionApi } from '../../../lib/api';
import { useState, useEffect } from 'react';

interface Step3MagicResonanceProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step3MagicResonance({ formData, setFormData, creationData, errors, touched }: Step3MagicResonanceProps) {
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [isLoadingTraditions, setIsLoadingTraditions] = useState(false);

  // Get magic priority from form data
  const magicPriority = formData.creationMethod === 'priority' && formData.priorities
    ? formData.priorities.magic_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen
    ? formData.sumToTen.magic_priority
    : '';

  const hasMagic = magicPriority && magicPriority !== 'none';

  // Get available magic types for the selected priority
  const getAvailableMagicTypes = (): string[] => {
    if (!hasMagic) {
      return [];
    }
    if (!creationData.priorities?.magic?.[magicPriority]) {
      return [];
    }
    const magicOption = creationData.priorities.magic[magicPriority];
    return magicOption.available_types || [];
  };

  const availableTypes = getAvailableMagicTypes();

  // Map priority data types to MagicTypeSelector format
  const typeMapping: Record<string, string> = {
    'Magician': 'magician',
    'Adept': 'adept',
    'Aspected Magician': 'aspected_magician',
    'Mystic Adept': 'mystic_adept',
    'Technomancer': 'technomancer',
  };

  const reverseTypeMapping: Record<string, string> = {
    'magician': 'Magician',
    'adept': 'Adept',
    'aspected_magician': 'Aspected Magician',
    'mystic_adept': 'Mystic Adept',
    'technomancer': 'Technomancer',
  };

  // Convert available types from priority data format to MagicTypeSelector format
  const availableTypeIds = availableTypes
    .map(type => typeMapping[type])
    .filter(Boolean) as string[];


  // Load traditions when magic type is selected
  useEffect(() => {
    const magicTypeId = formData.magicType;
    if (magicTypeId && (magicTypeId === 'magician' || magicTypeId === 'mystic_adept')) {
      loadTraditions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.magicType]);

  const loadTraditions = async () => {
    try {
      setIsLoadingTraditions(true);
      const data = await traditionApi.getTraditions();
      setTraditions(data);
    } catch (err) {
      console.error('Failed to load traditions:', err);
    } finally {
      setIsLoadingTraditions(false);
    }
  };

  const handleMagicTypeSelect = (typeId: string) => {
    // Convert from MagicTypeSelector format to priority data format
    const typeName = reverseTypeMapping[typeId] || typeId;
    
    setFormData({ ...formData, magicType: typeId });
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, magic_type: typeName },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, magic_type: typeName },
      }));
    }
    // Clear tradition if not needed
    if (typeId !== 'magician' && typeId !== 'mystic_adept') {
      setFormData(prev => ({ ...prev, tradition: undefined }));
    }
  };

  const handleTraditionChange = (tradition: string) => {
    setFormData({ ...formData, tradition });
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, tradition },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, tradition },
      }));
    }
  };

  // Get magic rating from priority data
  const getMagicRating = () => {
    if (!hasMagic) return 0;
    const priorityData = creationData.priorities?.magic?.[magicPriority];
    // Magic rating comes from priority data (A=6, B=4, C=3, D=2, E=0 for mundane)
    // Note: The actual rating is stored in the backend priority_data.go
    // For now, use the standard mapping
    const ratingMap: Record<string, number> = { A: 6, B: 4, C: 3, D: 2, E: 0 };
    return ratingMap[magicPriority] || 0;
  };

  const magicRating = getMagicRating();

  // Get free benefits based on magic type
  const getFreeBenefits = () => {
    if (!formData.magicType) return null;

    // Get free benefits from priority data
    const magicOption = creationData.priorities?.magic?.[magicPriority];
    if (!magicOption) return null;

    switch (formData.magicType) {
      case 'magician':
      case 'mystic_adept':
        // Free spells come from priority data
        return {
          title: 'Free Spells',
          description: `You receive free spells at character creation based on your priority.`,
        };
      case 'adept':
        return {
          title: 'Power Points',
          description: `You receive ${magicRating} free Power Points (equal to your Magic rating).`,
        };
      case 'technomancer':
        return {
          title: 'Complex Forms',
          description: `You receive free Complex Forms at character creation based on your priority.`,
        };
      default:
        return null;
    }
  };

  const freeBenefits = getFreeBenefits();

  if (!hasMagic) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Magic or Resonance</h3>
          <p className="text-sm text-gray-400 mb-6">
            Your character is mundane (no magic or resonance abilities).
          </p>
        </div>
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <p className="text-sm text-gray-400">
            You selected Priority E for magic/resonance in Step 2, which means your character is mundane. If you want magical abilities, go back and select a different magic priority (A-D).
          </p>
        </div>
      </div>
    );
  }

  // If available_types is not in the response, show all types (fallback)
  // This can happen if the API hasn't been updated yet
  const shouldShowAllTypes = hasMagic && availableTypes.length === 0 && magicPriority !== 'E';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Magic or Resonance</h3>
        <p className="text-sm text-gray-400 mb-6">
          Select your character's magical or resonance type and tradition (if applicable).
        </p>
      </div>

      {/* Magic Rating Display */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            {formData.magicType === 'Technomancer' ? 'Resonance' : 'Magic'} Rating
          </span>
          <span className="text-lg font-bold text-gray-100">{magicRating}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Based on {magicPriority} priority
        </p>
      </div>

      {/* Magic Type Selector */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-200">Select Magic Type</h4>
        {availableTypes.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-400">
              Available types for Priority {magicPriority}: {availableTypes.join(', ')}
            </p>
          </div>
        )}
        {shouldShowAllTypes && (
          <div className="mb-2 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
            <p className="text-xs text-yellow-400">
              Note: Available types data not found. Showing all magic types. Please select based on Priority {magicPriority} rules.
            </p>
          </div>
        )}
        <MagicTypeSelector
          selectedType={formData.magicType}
          onSelect={handleMagicTypeSelect}
          availableTypes={availableTypeIds.length > 0 ? availableTypeIds : undefined}
        />
        {errors.magicType && touched.magicType && (
          <p className="text-sm text-sr-danger">{errors.magicType}</p>
        )}
      </div>

      {/* Tradition Selector (for Magicians and Mystic Adepts) */}
      {formData.magicType && (formData.magicType === 'Magician' || formData.magicType === 'Mystic Adept') && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Tradition</h4>
          {isLoadingTraditions ? (
            <div className="text-sm text-gray-400">Loading traditions...</div>
          ) : (
            <Select
              selectedKey={formData.tradition}
              onSelectionChange={(key) => handleTraditionChange(key as string)}
              className="flex flex-col gap-1"
            >
              <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
                <SelectValue placeholder="Select a tradition..." />
              </Button>
              <Popover
                placement="bottom start"
                className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
              >
                <ListBox className="p-1">
                  {traditions.map((tradition) => (
                    <ListBoxItem
                      key={tradition.name}
                      id={tradition.name}
                      textValue={tradition.name || ''}
                      className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                    >
                      <div>
                        <div className="font-medium">{tradition.name}</div>
                        {tradition.description && (
                          <div className="text-xs text-gray-400 mt-0.5">{tradition.description}</div>
                        )}
                      </div>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          )}
          {errors.tradition && touched.tradition && (
            <p className="text-sm text-sr-danger">{errors.tradition}</p>
          )}
        </div>
      )}

      {/* Free Benefits Display */}
      {freeBenefits && (
        <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-md">
          <h4 className="text-md font-semibold text-green-400 mb-2">{freeBenefits.title}</h4>
          <p className="text-sm text-gray-300">{freeBenefits.description}</p>
        </div>
      )}
    </div>
  );
}

