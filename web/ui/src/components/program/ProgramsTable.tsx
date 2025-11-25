import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Program } from '../../lib/types';
import { ProgramViewModal } from './ProgramViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface ProgramsTableProps {
  programs: Program[];
}

export const ProgramsTable = memo(function ProgramsTable({ programs }: ProgramsTableProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredPrograms = useMemo(() => {
    if (selectedSources.length === 0) return programs;
    return programs.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [programs, selectedSources]);

  const handleNameClick = useCallback((item: Program) => {
    setSelectedProgram(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Program>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Program) => (
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
      accessor: (row: Program) => row.type ? row.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-',
      sortable: true,
    },
    {
      id: 'action_effect',
      header: 'Action/Effect',
      accessor: 'action_effect',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Program) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={programs}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredPrograms}
        columns={columns}
        searchFields={['name', 'type', 'action_effect', 'description']}
        searchPlaceholder="Search programs by name, type, or action/effect..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No programs available"
        emptySearchMessage="No programs found matching your search criteria."
        ariaLabel="Programs data table"
      />
      <ProgramViewModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

