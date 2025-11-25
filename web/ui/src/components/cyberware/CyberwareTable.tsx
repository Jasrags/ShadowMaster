import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Cyberware } from '../../lib/types';
import { CyberwareViewModal } from './CyberwareViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface CyberwareTableProps {
  cyberware: Cyberware[];
}

export const CyberwareTable = memo(function CyberwareTable({ cyberware }: CyberwareTableProps) {
  const [selectedCyberware, setSelectedCyberware] = useState<Cyberware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredCyberware = useMemo(() => {
    if (selectedSources.length === 0) return cyberware;
    return cyberware.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [cyberware, selectedSources]);

  const handleNameClick = useCallback((item: Cyberware) => {
    setSelectedCyberware(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Cyberware>[] = useMemo(() => [
    {
      id: 'device',
      header: 'Device',
      accessor: 'device',
      sortable: true,
      render: (value: unknown, row: Cyberware) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'part',
      header: 'Part',
      accessor: 'part',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'essence',
      header: 'Essence',
      accessor: (row: Cyberware) => row.essence || row.essence_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'capacity',
      header: 'Capacity',
      accessor: (row: Cyberware) => row.capacity || row.capacity_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Cyberware) => row.cost || row.cost_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'availability',
      header: 'Availability',
      accessor: (row: Cyberware) => row.availability || row.availability_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Cyberware) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={cyberware}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredCyberware}
        columns={columns}
        searchFields={['device', 'part', 'essence', 'cost', 'availability']}
        searchPlaceholder="Search cyberware by device, part, or cost..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="device"
        defaultSortDirection="asc"
        emptyMessage="No cyberware available"
        emptySearchMessage="No cyberware found matching your search criteria."
        ariaLabel="Cyberware data table"
      />
      <CyberwareViewModal
        cyberware={selectedCyberware}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

