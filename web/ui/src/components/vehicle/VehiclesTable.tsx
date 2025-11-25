import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Vehicle } from '../../lib/types';
import { VehicleViewModal } from './VehicleViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

export const VehiclesTable = memo(function VehiclesTable({ vehicles }: VehiclesTableProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredVehicles = useMemo(() => {
    if (selectedSources.length === 0) return vehicles;
    return vehicles.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [vehicles, selectedSources]);

  const handleNameClick = useCallback((item: Vehicle) => {
    setSelectedVehicle(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Vehicle>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Vehicle) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row: Vehicle) => row.type ? row.type.replace(/\b\w/g, l => l.toUpperCase()) : '-',
      sortable: true,
    },
    {
      id: 'subtype',
      header: 'Subtype',
      accessor: (row: Vehicle) => row.subtype ? row.subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-',
      sortable: true,
    },
    {
      id: 'handling',
      header: 'Handling',
      accessor: (row: Vehicle) => {
        if (row.handling) {
          if (row.handling.off_road !== undefined) {
            return `${row.handling.on_road}/${row.handling.off_road}`;
          }
          return String(row.handling.on_road || '-');
        }
        return '-';
      },
      sortable: true,
    },
    {
      id: 'speed',
      header: 'Speed',
      accessor: (row: Vehicle) => row.speed ? `${row.speed.value}${row.speed.movement_type || ''}` : '-',
      sortable: true,
    },
    {
      id: 'body',
      header: 'Body',
      accessor: (row: Vehicle) => row.body ? String(row.body.value || '-') : '-',
      sortable: true,
    },
    {
      id: 'armor',
      header: 'Armor',
      accessor: (row: Vehicle) => row.armor !== undefined ? String(row.armor) : '-',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Vehicle) => row.cost !== undefined ? row.cost.toLocaleString() : '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Vehicle) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

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
      <DataTable
        data={filteredVehicles}
        columns={columns}
        searchFields={['name', 'type', 'subtype']}
        searchPlaceholder="Search vehicles by name, type, or subtype..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No vehicles available"
        emptySearchMessage="No vehicles found matching your search criteria."
        ariaLabel="Vehicles data table"
      />
      <VehicleViewModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

