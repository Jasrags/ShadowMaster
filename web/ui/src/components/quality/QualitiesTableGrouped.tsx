import { useState, useMemo } from 'react';
import type { Quality } from '../../lib/types';
import { QualityViewModal } from './QualityViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface QualitiesTableGroupedProps {
  qualities: Quality[];
}

// Helper to get category from type
const getCategory = (quality: Quality): string => {
  return quality.type === 'positive' ? 'Positive' : 'Negative';
};

// Helper to get source string
const getSource = (quality: Quality): string => {
  return quality.source?.source || 'Unknown';
};

// Helper to format karma cost
const formatKarma = (quality: Quality): string => {
  const cost = quality.cost;
  if (cost.per_rating) {
    if (cost.max_rating > 0) {
      return `${cost.base_cost} per rating (max ${cost.max_rating})`;
    }
    return `${cost.base_cost} per rating`;
  }
  return `${cost.base_cost}`;
};

export function QualitiesTableGrouped({ qualities }: QualitiesTableGroupedProps) {
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter qualities by selected sources
  const filteredQualities = useMemo(() => {
    if (selectedSources.length === 0) return qualities;
    return qualities.filter(item => {
      const source = getSource(item);
      return selectedSources.includes(source);
    });
  }, [qualities, selectedSources]);

  const handleNameClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setIsModalOpen(true);
  };

  const columns: GroupedTableColumn<Quality>[] = [
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
      header: 'Karma',
      accessor: (item) => (
        <span className={`font-semibold ${
          item.cost.base_cost < 0 ? 'text-red-400' : 'text-green-400'
        }`}>
          {formatKarma(item)}
        </span>
      ),
    },
    {
      header: 'Source',
      accessor: (item) => getSource(item),
    },
    {
      header: 'Page',
      accessor: (item) => item.source?.page || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={qualities}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(q) => (typeof q.source === 'string' ? q.source : q.source?.source) || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredQualities}
        getGroupKey={(item) => getCategory(item)}
        getGroupLabel={(category) => category}
        columns={columns}
        searchFields={['name']}
        searchPlaceholder="Search qualities by name..."
        renderGroupHeader={(groupKey, itemCount, isExpanded, toggleGroup) => (
          <tr
            className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
            onClick={() => toggleGroup(groupKey)}
          >
            <td className="px-4 py-3">
              <button
                className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                aria-label={isExpanded ? `Collapse ${groupKey}` : `Expand ${groupKey}`}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`font-semibold px-2 py-1 rounded text-sm ${
                  groupKey === 'Positive' 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-red-900/30 text-red-300'
                }`}>
                  {groupKey}
                </span>
                <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                  {itemCount} {itemCount === 1 ? 'quality' : 'qualities'}
                </span>
              </div>
            </td>
            <td colSpan={3} className="px-4 py-3 text-sm text-gray-400">
              Click to {isExpanded ? 'collapse' : 'expand'}
            </td>
          </tr>
        )}
        renderItemRow={(item, index) => (
          <tr
            key={`${getCategory(item)}-${item.name}-${index}`}
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

      <QualityViewModal
        quality={selectedQuality}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

