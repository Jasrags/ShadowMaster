import { Button } from 'react-aria-components';
import type { MetatypeDefinition } from '../../lib/types';

interface MetatypeSelectorProps {
  metatypes: MetatypeDefinition[];
  selectedMetatype?: string;
  onSelect: (metatypeId: string) => void;
  priorityTier?: string; // Filter by priority tier (A-E)
}

export function MetatypeSelector({ metatypes, selectedMetatype, onSelect, priorityTier }: MetatypeSelectorProps) {
  const filteredMetatypes = priorityTier
    ? metatypes.filter(m => m.priority_tiers.includes(priorityTier))
    : metatypes;

  // Get Human as baseline for comparison
  const humanMetatype = metatypes.find(m => m.id === 'human');
  const humanBaseline = humanMetatype?.attribute_ranges || {};

  // Helper to calculate attribute modifiers from attribute_ranges compared to Human baseline
  const calculateAttributeModifiers = (metatype: MetatypeDefinition): Record<string, number> => {
    const modifiers: Record<string, number> = {};
    const ranges = metatype.attribute_ranges || {};
    
    // Compare each attribute's min value to Human's min value
    Object.entries(ranges).forEach(([attr, range]) => {
      if (range && range.min !== undefined) {
        const humanMin = humanBaseline[attr]?.min ?? 1; // Default to 1 for most attributes
        const metatypeMin = range.min;
        const modifier = metatypeMin - humanMin;
        
        // Only include attributes that differ from Human baseline
        if (modifier !== 0) {
          modifiers[attr] = modifier;
        }
      }
    });
    
    return modifiers;
  };

  // Helper to format attribute modifier
  const formatAttributeModifier = (attr: string, modifier: number): string => {
    const sign = modifier >= 0 ? '+' : '';
    return `${attr} ${sign}${modifier}`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMetatypes.map((metatype) => {
          const isSelected = selectedMetatype === metatype.id;
          
          // Calculate modifiers from attribute_ranges if attribute_modifiers not present
          const explicitModifiers = metatype.attribute_modifiers || {};
          const calculatedModifiers = calculateAttributeModifiers(metatype);
          const attributeModifiers = Object.keys(explicitModifiers).length > 0 
            ? explicitModifiers 
            : calculatedModifiers;
          const hasAttributeModifiers = Object.keys(attributeModifiers).length > 0;

          return (
            <Button
              key={metatype.id}
              onPress={() => onSelect(metatype.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors flex flex-col items-start ${
                isSelected
                  ? 'border-sr-accent bg-sr-accent/20'
                  : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-100">{metatype.name}</h4>
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
              
              {metatype.notes && (
                <p className="text-xs text-gray-400 mb-2">{metatype.notes}</p>
              )}

              {hasAttributeModifiers && (
                <div className="mb-2">
                  <p className="text-xs text-gray-400 font-medium mb-1">Attribute Modifiers:</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {Object.entries(attributeModifiers).map(([attr, modifier]) => (
                      <span key={attr} className="text-xs text-gray-300">
                        {formatAttributeModifier(attr.charAt(0).toUpperCase() + attr.slice(1), modifier)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {metatype.abilities.length > 0 && (
                <div className="mt-2 pt-2 border-t border-sr-light-gray">
                  <p className="text-xs text-gray-400 font-medium mb-1">Abilities:</p>
                  <ul className="text-xs text-gray-500 space-y-0.5">
                    {metatype.abilities.slice(0, 3).map((ability, idx) => (
                      <li key={idx}>• {ability}</li>
                    ))}
                    {metatype.abilities.length > 3 && (
                      <li className="text-gray-400">+{metatype.abilities.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

