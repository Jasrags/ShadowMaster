import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Bioware } from '../../lib/types';
import { BiowareViewModal } from './BiowareViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface BiowareTableProps {
  bioware: Bioware[];
}

export const BiowareTable = memo(function BiowareTable({ bioware }: BiowareTableProps) {
  const [selectedBioware, setSelectedBioware] = useState<Bioware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredBioware = useMemo(() => {
    if (selectedSources.length === 0) return bioware;
    return bioware.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [bioware, selectedSources]);

  const handleNameClick = useCallback((item: Bioware) => {
    setSelectedBioware(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Bioware>[] = useMemo(() => [
    {
      id: 'device',
      header: 'Device',
      accessor: 'device',
      sortable: true,
      render: (value: unknown, row: Bioware) => (
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
      accessor: 'type',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'essence',
      header: 'Essence',
      accessor: (row: Bioware) => row.essence || row.essence_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Bioware) => row.cost || row.cost_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'availability',
      header: 'Availability',
      accessor: (row: Bioware) => row.availability || row.availability_formula?.formula || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Bioware) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={bioware}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredBioware}
        columns={columns}
        searchFields={['device', 'type', 'essence', 'cost', 'availability']}
        searchPlaceholder="Search bioware by device, type, or cost..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="device"
        defaultSortDirection="asc"
        emptyMessage="No bioware available"
        emptySearchMessage="No bioware found matching your search criteria."
        ariaLabel="Bioware data table"
      />
      <BiowareViewModal
        bioware={selectedBioware}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

