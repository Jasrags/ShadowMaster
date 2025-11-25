import { useMemo } from 'react';
import type { Action } from '../../lib/types';

interface ActionTypeFilterProps {
  actions: Action[];
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export function ActionTypeFilter({ actions, selectedTypes, onTypesChange }: ActionTypeFilterProps) {
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    actions.forEach(action => {
      if (action.type) {
        types.add(action.type);
      }
    });
    return Array.from(types).sort();
  }, [actions]);

  if (availableTypes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Action Type</label>
      <div className="flex flex-wrap gap-2">
        {availableTypes.map(type => {
          const isSelected = selectedTypes.includes(type);
          const displayName = type.charAt(0).toUpperCase() + type.slice(1);
          return (
            <button
              key={type}
              onClick={() => {
                if (isSelected) {
                  onTypesChange(selectedTypes.filter(t => t !== type));
                } else {
                  onTypesChange([...selectedTypes, type]);
                }
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                isSelected
                  ? 'bg-sr-accent text-sr-dark font-medium'
                  : 'bg-sr-light-gray text-gray-300 hover:bg-sr-accent/20'
              }`}
            >
              {displayName}
            </button>
          );
        })}
        {selectedTypes.length > 0 && (
          <button
            onClick={() => onTypesChange([])}
            className="px-3 py-1 rounded text-sm bg-sr-light-gray text-gray-300 hover:bg-sr-accent/20"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

