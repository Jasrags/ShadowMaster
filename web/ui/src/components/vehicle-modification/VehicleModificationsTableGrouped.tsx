import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { VehicleModification } from '../../lib/types';
import { VehicleModificationViewModal } from './VehicleModificationViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface VehicleModificationsTableGroupedProps {
  modifications: VehicleModification[];
}


export const VehicleModificationsTableGrouped = memo(function VehicleModificationsTableGrouped({ modifications }: VehicleModificationsTableGroupedProps) {
  const [selectedModification, setSelectedModification] = useState<VehicleModification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const filteredModifications = useMemo(() => {
    let filtered = modifications;

    if (selectedSources.length > 0) {
      filtered = filtered.filter(mod => {
        const source = mod.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'type', 'description']);
    }

    return filtered;
  }, [modifications, selectedSources, searchTerm]);

  const groupedModifications = useMemo(() => {
    const typeMap = new Map<string, VehicleModification[]>();

    filteredModifications.forEach(mod => {
      const type = mod.type || 'base_mods';
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(mod);
    });

    return Array.from(typeMap.entries())
      .map(([type, modifications]) => ({
        type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        modifications: modifications.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedTypes.has(type),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [filteredModifications, expandedTypes]);

  const toggleType = useCallback((type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  }, [expandedTypes]);

  const handleNameClick = useCallback((modification: VehicleModification) => {
    setSelectedModification(modification);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={modifications}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search vehicle modifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedModifications.map((group) => (
          <div key={group.type} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleType(group.type.toLowerCase().replace(' ', '_'))}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.type}</span>
                <span className="text-sm text-gray-400">({group.modifications.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.modifications.map((modification) => (
                    <div
                      key={modification.name}
                      className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
                      onClick={() => handleNameClick(modification)}
                    >
                      <div className="flex-1">
                        <div className="text-gray-100 font-medium">{modification.name}</div>
                        {modification.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">{modification.description}</div>
                        )}
                      </div>
                      {modification.source?.source && (
                        <div className="text-xs text-gray-500 ml-4">{modification.source.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <VehicleModificationViewModal
        modification={selectedModification}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

