import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Mentor } from '../../lib/types';
import { MentorViewModal } from './MentorViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface MentorsTableProps {
  mentors: Mentor[];
}

export const MentorsTable = memo(function MentorsTable({ mentors }: MentorsTableProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredMentors = useMemo(() => {
    if (selectedSources.length === 0) return mentors;
    return mentors.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [mentors, selectedSources]);

  const handleNameClick = useCallback((item: Mentor) => {
    setSelectedMentor(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Mentor>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Mentor) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'similar_archetypes',
      header: 'Similar Archetypes',
      accessor: (row: Mentor) => row.similar_archetypes?.join(', ') || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Mentor) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={mentors}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredMentors}
        columns={columns}
        searchFields={['name', 'similar_archetypes', 'description']}
        searchPlaceholder="Search mentors by name or archetypes..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No mentors available"
        emptySearchMessage="No mentors found matching your search criteria."
        ariaLabel="Mentors data table"
      />
      <MentorViewModal
        mentor={selectedMentor}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

