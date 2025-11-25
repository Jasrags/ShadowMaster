import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { Power } from '../../lib/types';
import { PowerViewModal } from './PowerViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface PowersTableGroupedProps {
  powers: Power[];
}


export const PowersTableGrouped = memo(function PowersTableGrouped({ powers }: PowersTableGroupedProps) {
  const [selectedPower, setSelectedPower] = useState<Power | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivations, setExpandedActivations] = useState<Set<string>>(new Set());

  const filteredPowers = useMemo(() => {
    let filtered = powers;

    if (selectedSources.length > 0) {
      filtered = filtered.filter(power => {
        const source = power.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'activation', 'description']);
    }

    return filtered;
  }, [powers, selectedSources, searchTerm]);

  const groupedPowers = useMemo(() => {
    const activationMap = new Map<string, Power[]>();

    filteredPowers.forEach(power => {
      const activation = power.activation || 'passive';
      if (!activationMap.has(activation)) {
        activationMap.set(activation, []);
      }
      activationMap.get(activation)!.push(power);
    });

    return Array.from(activationMap.entries())
      .map(([activation, powers]) => ({
        activation: activation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        powers: powers.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedActivations.has(activation),
      }))
      .sort((a, b) => a.activation.localeCompare(b.activation));
  }, [filteredPowers, expandedActivations]);

  const toggleActivation = useCallback((activation: string) => {
    const newExpanded = new Set(expandedActivations);
    if (newExpanded.has(activation)) {
      newExpanded.delete(activation);
    } else {
      newExpanded.add(activation);
    }
    setExpandedActivations(newExpanded);
  }, [expandedActivations]);

  const handleNameClick = useCallback((power: Power) => {
    setSelectedPower(power);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={powers}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search powers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedPowers.map((group) => (
          <div key={group.activation} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleActivation(group.activation.toLowerCase().replace(' ', '_'))}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.activation}</span>
                <span className="text-sm text-gray-400">({group.powers.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.powers.map((power) => (
                    <div
                      key={power.name}
                      className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
                      onClick={() => handleNameClick(power)}
                    >
                      <div className="flex-1">
                        <div className="text-gray-100 font-medium">{power.name}</div>
                        {power.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">{power.description}</div>
                        )}
                      </div>
                      {power.source?.source && (
                        <div className="text-xs text-gray-500 ml-4">{power.source.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <PowerViewModal
        power={selectedPower}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

