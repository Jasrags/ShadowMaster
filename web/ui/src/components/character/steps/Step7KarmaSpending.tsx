import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData } from '../../../lib/types';

interface Step7KarmaSpendingProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step7KarmaSpending({ formData, setFormData, creationData, errors, touched }: Step7KarmaSpendingProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Karma Spending</h3>
        <p className="text-sm text-gray-400 mb-6">
          Spend remaining karma on additional spells, contacts, and improvements.
        </p>
      </div>

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400">
          Karma spending interface will be implemented here.
        </p>
      </div>
    </div>
  );
}

