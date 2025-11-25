import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { ComplexForm } from '../../lib/types';
import { ComplexFormViewModal } from './ComplexFormViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface ComplexFormsTableProps {
  complexForms: ComplexForm[];
}

export const ComplexFormsTable = memo(function ComplexFormsTable({ complexForms }: ComplexFormsTableProps) {
  const [selectedComplexForm, setSelectedComplexForm] = useState<ComplexForm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredComplexForms = useMemo(() => {
    if (selectedSources.length === 0) return complexForms;
    return complexForms.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [complexForms, selectedSources]);

  const handleNameClick = useCallback((item: ComplexForm) => {
    setSelectedComplexForm(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<ComplexForm>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: ComplexForm) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'target',
      header: 'Target',
      accessor: (row: ComplexForm) => row.target ? row.target.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-',
      sortable: true,
    },
    {
      id: 'duration',
      header: 'Duration',
      accessor: (row: ComplexForm) => row.duration?.description || row.duration?.type || '-',
      sortable: true,
    },
    {
      id: 'fading',
      header: 'Fading',
      accessor: (row: ComplexForm) => row.fading?.formula || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: ComplexForm) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={complexForms}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredComplexForms}
        columns={columns}
        searchFields={['name', 'target', 'duration', 'fading']}
        searchPlaceholder="Search complex forms by name, target, or duration..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No complex forms available"
        emptySearchMessage="No complex forms found matching your search criteria."
        ariaLabel="Complex Forms data table"
      />
      <ComplexFormViewModal
        complexForm={selectedComplexForm}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

