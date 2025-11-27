import { useState } from 'react';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData } from '../../../lib/types';
import { EquipmentSelector } from '../EquipmentSelector';

interface Step6ResourcesProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Base nuyen by priority (experienced gameplay level)
const BASE_NUYEN: Record<string, number> = {
  A: 450000,
  B: 275000,
  C: 140000,
  D: 50000,
  E: 6000,
};

// Gameplay level multipliers
const GAMEPLAY_MULTIPLIERS: Record<string, number> = {
  street: 0.5,
  experienced: 1.0,
  prime: 1.5,
};

export function Step6Resources({ formData, setFormData, creationData, errors, touched }: Step6ResourcesProps) {
  const equipment = formData.equipment || [];

  // Get resources priority
  const resourcesPriority = formData.creationMethod === 'priority' && formData.priorities
    ? formData.priorities.resources_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen
    ? formData.sumToTen.resources_priority
    : 'E';

  const gameplayLevel = formData.gameplayLevel || 'experienced';
  const baseNuyen = BASE_NUYEN[resourcesPriority] || BASE_NUYEN.E;
  const multiplier = GAMEPLAY_MULTIPLIERS[gameplayLevel] || 1.0;
  const totalNuyen = Math.floor(baseNuyen * multiplier);

  // Calculate used nuyen (placeholder - would need to sum equipment costs)
  const usedNuyen = 0;
  const remainingNuyen = totalNuyen - usedNuyen;

  // Essence starts at 6.0, reduced by cyberware
  const essence = 6.0;

  const handleClearSelections = () => {
    setFormData({ ...formData, equipment: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Resources</h3>
        <p className="text-sm text-gray-400 mb-6">
          Purchase equipment, cyberware, and other resources with your nuyen budget.
        </p>
      </div>

      {/* Nuyen Budget Display */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Nuyen Budget</span>
          <div className="flex items-center gap-3">
            {equipment.length > 0 && (
              <button
                onClick={handleClearSelections}
                className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
              >
                Clear Selections
              </button>
            )}
            <span className={`text-lg font-bold ${remainingNuyen >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
              {remainingNuyen.toLocaleString()} / {totalNuyen.toLocaleString()}¥
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Base: {baseNuyen.toLocaleString()}¥ ({resourcesPriority} priority) × {multiplier} ({gameplayLevel}) = {totalNuyen.toLocaleString()}¥
        </p>
      </div>

      {/* Equipment Selector */}
      <EquipmentSelector
        nuyenBudget={totalNuyen}
        usedNuyen={usedNuyen}
        essence={essence}
        onSelect={(item) => {
          setFormData({ ...formData, equipment: [...equipment, item] });
        }}
      />

      {/* Equipment Tabs Placeholder */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400 mb-3">
          Equipment selection tabs will be implemented here:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500">
          <div>• Weapons</div>
          <div>• Armor</div>
          <div>• Cyberware</div>
          <div>• Bioware</div>
          <div>• Gear</div>
          <div>• Vehicles</div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Equipment selection will integrate with existing table components (WeaponsTable, ArmorTable, etc.)
        </p>
      </div>
    </div>
  );
}

