import { useState, memo, useCallback } from 'react';
import type { VehicleModification } from '../../lib/types';
import { VehicleModificationViewModal } from './VehicleModificationViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedCardList } from '../common/GroupedCardList';

interface VehicleModificationsTableGroupedProps {
  modifications: VehicleModification[];
}

export const VehicleModificationsTableGrouped = memo(function VehicleModificationsTableGrouped({ modifications }: VehicleModificationsTableGroupedProps) {
  const [selectedModification, setSelectedModification] = useState<VehicleModification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter modifications by selected sources
  const filteredModifications = modifications.filter(mod => {
    if (selectedSources.length === 0) return true;
    const source = mod.source?.source;
    return source && selectedSources.includes(source);
  });

  const handleNameClick = useCallback((modification: VehicleModification) => {
    setSelectedModification(modification);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key
  const getGroupKey = (item: VehicleModification): string => {
    return item.type || 'base_mods';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={modifications}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedCardList
        items={filteredModifications}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        searchFields={['name', 'type', 'description']}
        searchPlaceholder="Search vehicle modifications..."
        renderItem={(modification, index) => (
          <div
            key={modification.name || index}
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
        )}
      />

      <VehicleModificationViewModal
        modification={selectedModification}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

