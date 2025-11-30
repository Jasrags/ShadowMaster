import { useState, useMemo, memo, useCallback } from 'react';
import type { Vehicle } from '../../lib/types';
import { VehicleViewModal } from './VehicleViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface VehiclesTableGroupedProps {
  vehicles: Vehicle[];
}

export const VehiclesTableGrouped = memo(function VehiclesTableGrouped({ vehicles }: VehiclesTableGroupedProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter vehicles by selected sources
  const filteredVehicles = useMemo(() => {
    if (selectedSources.length === 0) return vehicles;
    return vehicles.filter(vehicle => {
      const source = vehicle.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [vehicles, selectedSources]);

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

  const columns: GroupedTableColumn<Vehicle>[] = [
    {
      header: 'Name',
      accessor: (item) => (
        <button
          onClick={() => handleNameClick(item)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
        >
          {item.name}
        </button>
      ),
    },
    {
      header: 'Subtype',
      accessor: (item) => item.subtype ? item.subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-',
    },
    {
      header: 'Handling',
      accessor: (item) => {
        if (item.handling) {
          if (item.handling.off_road !== undefined) {
            return `${item.handling.on_road}/${item.handling.off_road}`;
          }
          return String(item.handling.on_road || '-');
        }
        return '-';
      },
    },
    {
      header: 'Speed',
      accessor: (item) => item.speed ? `${item.speed.value}${item.speed.movement_type || ''}` : '-',
    },
    {
      header: 'Body',
      accessor: (item) => item.body ? String(item.body.value || '-') : '-',
    },
    {
      header: 'Armor',
      accessor: (item) => item.armor !== undefined ? String(item.armor) : '-',
    },
    {
      header: 'Cost',
      accessor: (item) => item.cost !== undefined ? item.cost.toLocaleString() : '-',
    },
    {
      header: 'Source',
      accessor: (item) => item.source?.source || '-',
    },
  ];

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

      <GroupedTable
        items={filteredVehicles}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'type', 'subtype']}
        searchPlaceholder="Search vehicles by name, type, or subtype..."
        renderItemRow={(item, index) => (
          <tr
            key={`${getGroupKey(item)}-${item.name}-${index}`}
            className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
          >
            <td className="px-4 py-2"></td>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-2 text-gray-300 ${column.className || ''}`}
              >
                {column.accessor(item)}
              </td>
            ))}
          </tr>
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

