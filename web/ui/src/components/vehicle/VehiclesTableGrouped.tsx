import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { Vehicle } from '../../lib/types';
import { VehicleViewModal } from './VehicleViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface VehiclesTableGroupedProps {
  vehicles: Vehicle[];
}


export const VehiclesTableGrouped = memo(function VehiclesTableGrouped({ vehicles }: VehiclesTableGroupedProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (selectedSources.length > 0) {
      filtered = filtered.filter(vehicle => {
        const source = vehicle.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'type', 'subtype']);
    }

    return filtered;
  }, [vehicles, selectedSources, searchTerm]);

  const groupedVehicles = useMemo(() => {
    const typeMap = new Map<string, Vehicle[]>();

    filteredVehicles.forEach(vehicle => {
      const type = vehicle.type || 'groundcraft';
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(vehicle);
    });

    return Array.from(typeMap.entries())
      .map(([type, vehicles]) => ({
        type: type.replace(/\b\w/g, l => l.toUpperCase()),
        vehicles: vehicles.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedTypes.has(type),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [filteredVehicles, expandedTypes]);

  const toggleType = useCallback((type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  }, [expandedTypes]);

  const handleNameClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={vehicles}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedVehicles.map((group) => (
          <div key={group.type} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleType(group.type.toLowerCase())}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.type}</span>
                <span className="text-sm text-gray-400">({group.vehicles.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.name}
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
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <VehicleViewModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

