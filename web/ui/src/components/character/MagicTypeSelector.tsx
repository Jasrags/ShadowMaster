import { Button } from 'react-aria-components';

interface MagicTypeSelectorProps {
  selectedType?: string;
  onSelect: (type: string) => void;
  availableTypes?: string[];
}

const MAGIC_TYPES = [
  { id: 'magician', label: 'Magician', description: 'Full spellcaster with access to all spell categories' },
  { id: 'adept', label: 'Adept', description: 'Physical enhancement through power points' },
  { id: 'aspected_magician', label: 'Aspected Magician', description: 'Limited spellcaster with restricted spell categories' },
  { id: 'mystic_adept', label: 'Mystic Adept', description: 'Combines spellcasting and adept powers' },
  { id: 'technomancer', label: 'Technomancer', description: 'Matrix manipulation through resonance' },
];

export function MagicTypeSelector({ selectedType, onSelect, availableTypes }: MagicTypeSelectorProps) {
  const types = availableTypes
    ? MAGIC_TYPES.filter(t => availableTypes.includes(t.id))
    : MAGIC_TYPES;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {types.map((type) => {
        const isSelected = selectedType === type.id;
        return (
          <Button
            key={type.id}
            onPress={() => onSelect(type.id)}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              isSelected
                ? 'border-sr-accent bg-sr-accent/20'
                : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-100">{type.label}</h4>
              {isSelected && (
                <svg
                  className="w-5 h-5 text-sr-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-400">{type.description}</p>
          </Button>
        );
      })}
    </div>
  );
}

