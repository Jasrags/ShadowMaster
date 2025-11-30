import { useState, memo, useCallback } from 'react';
import type { Vehicle } from '../../lib/types';
import { VehicleViewModal } from './VehicleViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedCardList } from '../common/GroupedCardList';

interface VehiclesTableGroupedProps {
  vehicles: Vehicle[];
}

export const VehiclesTableGrouped = memo(function VehiclesTableGrouped({ vehicles }: VehiclesTableGroupedProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter vehicles by selected sources
  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedSources.length === 0) return true;
    const source = vehicle.source?.source;
    return source && selectedSources.includes(source);
  });

  const handleNameClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key
  const getGroupKey = (item: Vehicle): string => {
    return item.type || 'groundcraft';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={vehicles}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedCardList
        items={filteredVehicles}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        searchFields={['name', 'type', 'subtype']}
        searchPlaceholder="Search vehicles..."
        renderItem={(vehicle, index) => (
          <div
            key={vehicle.name || index}
            className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
            onClick={() => handleNameClick(vehicle)}
          >
            <div className="flex-1">
              <div className="text-gray-100 font-medium">{vehicle.name}</div>
              {vehicle.subtype && (
                <div className="text-sm text-gray-400 mt-1">{vehicle.subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              )}
            </div>
            {vehicle.source?.source && (
              <div className="text-xs text-gray-500 ml-4">{vehicle.source.source}</div>
            )}
          </div>
        )}
      />

      <VehicleViewModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

