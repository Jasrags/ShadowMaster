import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { VehicleModification } from '../../lib/types';
import { VehicleModificationViewModal } from './VehicleModificationViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface VehicleModificationsTableProps {
  modifications: VehicleModification[];
}

export const VehicleModificationsTable = memo(function VehicleModificationsTable({ modifications }: VehicleModificationsTableProps) {
  const [selectedModification, setSelectedModification] = useState<VehicleModification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredModifications = useMemo(() => {
    if (selectedSources.length === 0) return modifications;
    return modifications.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [modifications, selectedSources]);

  const handleNameClick = useCallback((item: VehicleModification) => {
    setSelectedModification(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<VehicleModification>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: VehicleModification) => (
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
      accessor: (row: VehicleModification) => row.type ? row.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-',
      sortable: true,
    },
    {
      id: 'slots',
      header: 'Slots',
      accessor: (row: VehicleModification) => row.slots?.description || '-',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: VehicleModification) => row.cost?.formula || '-',
      sortable: true,
    },
    {
      id: 'availability',
      header: 'Availability',
      accessor: (row: VehicleModification) => {
        if (row.availability) {
          let avail = String(row.availability.value || '');
          if (row.availability.restricted) avail += 'R';
          if (row.availability.forbidden) avail += 'F';
          return avail || row.availability.formula || '-';
        }
        return '-';
      },
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: VehicleModification) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

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
      <DataTable
        data={filteredModifications}
        columns={columns}
        searchFields={['name', 'type', 'slots', 'cost', 'availability']}
        searchPlaceholder="Search vehicle modifications by name, type, or cost..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No vehicle modifications available"
        emptySearchMessage="No vehicle modifications found matching your search criteria."
        ariaLabel="Vehicle Modifications data table"
      />
      <VehicleModificationViewModal
        modification={selectedModification}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

