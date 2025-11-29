import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData } from '../../../lib/types';
import { CharacterSummary } from '../CharacterSummary';

interface Step8FinalCalculationsProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step8FinalCalculations({ formData, setFormData: _setFormData, creationData: _creationData, errors: _errors, touched: _touched }: Step8FinalCalculationsProps) {
  // Calculate derived attributes from form data
  const attributes = formData.attributeAllocations || {};
  const body = attributes.body || 1;
  const agility = attributes.agility || 1;
  const reaction = attributes.reaction || 1;
  const strength = attributes.strength || 1;
  const willpower = attributes.willpower || 1;
  const logic = attributes.logic || 1;
  const intuition = attributes.intuition || 1;
  const charisma = attributes.charisma || 1;
  const edge = attributes.edge || 1;

  // Calculate Initiative
  const physicalInitiative = {
    base: intuition + reaction,
    augmented: intuition + reaction,
    dice: 1,
  };

  // Calculate Inherent Limits
  const mentalLimit = Math.floor(((logic * 2) + intuition + willpower) / 3);
  const physicalLimit = Math.floor(((strength * 2) + body + reaction) / 3);
  const socialLimit = Math.floor(((charisma * 2) + willpower + 6) / 3); // Essence = 6.0

  // Calculate Condition Monitors
  const physicalMonitor = Math.floor(body / 2) + 8;
  const stunMonitor = Math.floor(willpower / 2) + 8;
  const overflowMonitor = body; // Base overflow, augmented bonuses would be added

  // Build character data for summary
  const characterData = {
    body,
    agility,
    reaction,
    strength,
    willpower,
    logic,
    intuition,
    charisma,
    edge,
    magic: formData.magicType ? 6 : undefined, // Placeholder
    initiative: {
      physical: physicalInitiative,
      astral: { base: intuition * 2, augmented: intuition * 2, dice: 2 },
      matrix_ar: { base: intuition + reaction, augmented: intuition + reaction, dice: 1 },
      matrix_vr_cold: { base: logic + intuition, augmented: logic + intuition, dice: 3 },
      matrix_vr_hot: { base: logic + intuition, augmented: logic + intuition, dice: 4 },
    },
    inherent_limits: {
      mental: mentalLimit,
      physical: physicalLimit,
      social: socialLimit,
    },
    condition_monitor: {
      physical: physicalMonitor,
      stun: stunMonitor,
      overflow: overflowMonitor,
    },
    living_persona: formData.magicType === 'Technomancer' ? {
      attack: charisma,
      data_processing: logic,
      device_rating: 6, // Placeholder - would be Resonance rating
      firewall: willpower,
      sleaze: intuition,
    } : undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Final Calculations</h3>
        <p className="text-sm text-gray-400 mb-6">
          Review derived attributes, limits, and condition monitors calculated from your character's attributes.
        </p>
      </div>

      {/* Character Summary */}
      <CharacterSummary character={characterData} />

      {/* Resource Summary */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <h4 className="text-md font-semibold text-gray-200 mb-3">Resource Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-300">Karma Remaining:</span>
            <span className="text-gray-100 ml-2">TBD</span>
          </div>
          <div>
            <span className="text-gray-300">Nuyen Remaining:</span>
            <span className="text-gray-100 ml-2">TBD</span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <h4 className="text-md font-semibold text-gray-200 mb-3">Validation Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-gray-300">Character creation data complete</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">○</span>
            <span className="text-gray-400">Final validation will occur on character creation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

