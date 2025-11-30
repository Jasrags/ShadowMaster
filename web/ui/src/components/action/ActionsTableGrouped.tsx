import { useState, useMemo, memo, useCallback } from 'react';
import type { Action } from '../../lib/types';
import { ActionViewModal } from './ActionViewModal';
import { ActionTypeFilter } from './ActionTypeFilter';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface ActionsTableGroupedProps {
  actions: Action[];
}

export const ActionsTableGrouped = memo(function ActionsTableGrouped({ actions }: ActionsTableGroupedProps) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter actions by selected types and sources
  const filteredActions = useMemo(() => {
    let filtered = actions;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(action => action.type && selectedTypes.includes(action.type));
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter(action => {
        const source = action.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    return filtered;
  }, [actions, selectedTypes, selectedSources]);

  const handleNameClick = useCallback((action: Action) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key
  const getGroupKey = (item: Action): string => {
    return item.type || 'unclassified';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  };

  const columns: GroupedTableColumn<Action>[] = [
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
      header: 'Source',
      accessor: (item) => item.source?.source || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <ActionTypeFilter
            actions={actions}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
          <SourceFilter
            items={actions}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(item) => (item as Action).source?.source || ''}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredActions}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'type', 'description']}
        searchPlaceholder="Search actions by name, type, or description..."
        renderItemRow={(item, index) => (
          <tr
            key={`${getGroupKey(item)}-${item.name}-${index}`}
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

      <ActionViewModal
        action={selectedAction}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

