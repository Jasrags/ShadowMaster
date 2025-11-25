import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Metatype } from '../../lib/types';
import { MetatypeViewModal } from './MetatypeViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface MetatypesTableProps {
  metatypes: Metatype[];
}

export const MetatypesTable = memo(function MetatypesTable({ metatypes }: MetatypesTableProps) {
  const [selectedMetatype, setSelectedMetatype] = useState<Metatype | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredMetatypes = useMemo(() => {
    if (selectedSources.length === 0) return metatypes;
    return metatypes.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [metatypes, selectedSources]);

  const handleNameClick = useCallback((item: Metatype) => {
    setSelectedMetatype(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Metatype>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Metatype) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row: Metatype) => row.category ? row.category.charAt(0).toUpperCase() + row.category.slice(1) : '-',
      sortable: true,
    },
    {
      id: 'base_race',
      header: 'Base Race',
      accessor: 'base_race',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'essence',
      header: 'Essence',
      accessor: (row: Metatype) => row.essence !== undefined ? String(row.essence) : '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Metatype) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={metatypes}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredMetatypes}
        columns={columns}
        searchFields={['name', 'category', 'base_race', 'description']}
        searchPlaceholder="Search metatypes by name, category, or base race..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No metatypes available"
        emptySearchMessage="No metatypes found matching your search criteria."
        ariaLabel="Metatypes data table"
      />
      <MetatypeViewModal
        metatype={selectedMetatype}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

