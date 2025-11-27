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

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMetatypes.map((metatype) => {
          const isSelected = selectedMetatype === metatype.id;
          const specialPoints = metatype.special_attribute_points || {};
          const edgePoints = specialPoints.edge || 0;
          const magicPoints = specialPoints.magic || 0;
          const resonancePoints = specialPoints.resonance || 0;

          return (
            <Button
              key={metatype.id}
              onPress={() => onSelect(metatype.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
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

              <div className="space-y-1 text-sm">
                {edgePoints > 0 && (
                  <div className="text-gray-300">
                    <span className="font-medium">Edge:</span> {edgePoints} points
                  </div>
                )}
                {magicPoints > 0 && (
                  <div className="text-gray-300">
                    <span className="font-medium">Magic:</span> {magicPoints} points
                  </div>
                )}
                {resonancePoints > 0 && (
                  <div className="text-gray-300">
                    <span className="font-medium">Resonance:</span> {resonancePoints} points
                  </div>
                )}
              </div>

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

              <div className="mt-2 pt-2 border-t border-sr-light-gray">
                <p className="text-xs text-gray-400">
                  Priority Tiers: {metatype.priority_tiers.join(', ')}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

