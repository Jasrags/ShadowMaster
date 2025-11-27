import { TextArea } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData } from '../../../lib/types';

interface Step9FinalTouchesProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step9FinalTouches({ formData, setFormData, creationData, errors, touched }: Step9FinalTouchesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Final Touches</h3>
        <p className="text-sm text-gray-400 mb-6">
          Add background information and final details for your character.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Street Name</label>
        <input
          type="text"
          value={formData.streetName || ''}
          onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="Enter street name (optional)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Background</label>
        <TextArea
          value={formData.background || ''}
          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent min-h-[150px] resize-y"
          placeholder="Enter character background and history..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Notes</label>
        <TextArea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent min-h-[100px] resize-y"
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
}

