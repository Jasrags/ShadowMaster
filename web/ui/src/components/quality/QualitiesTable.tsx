import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Quality } from '../../lib/types';
import { QualityViewModal } from './QualityViewModal';
import { QualityCategoryFilter } from './QualityCategoryFilter';
import { QualitySourceFilter } from './QualitySourceFilter';

interface QualitiesTableProps {
  qualities: Quality[];
}

export function QualitiesTable({ qualities }: QualitiesTableProps) {
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter qualities by selected categories and sources
  const filteredQualities = useMemo(() => {
    let filtered = qualities;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    return filtered;
  }, [qualities, selectedCategories, selectedSources]);

  const handleNameClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Quality>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Quality) => (
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
      accessor: 'category',
      sortable: true,
    },
    {
      id: 'karma',
      header: 'Karma',
      accessor: 'karma',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
    },
    {
      id: 'page',
      header: 'Page',
      accessor: 'page',
      sortable: true,
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <QualityCategoryFilter
            qualities={qualities}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <QualitySourceFilter
            qualities={qualities}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredQualities}
        columns={columns}
        searchFields={['name', 'category', 'source']}
        searchPlaceholder="Search qualities by name, category, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No qualities available"
        emptySearchMessage="No qualities found matching your search criteria."
        ariaLabel="Qualities data table"
      />
      <QualityViewModal
        quality={selectedQuality}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

