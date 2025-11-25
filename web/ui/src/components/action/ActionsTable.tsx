import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Action } from '../../lib/types';
import { ActionViewModal } from './ActionViewModal';
import { ActionTypeFilter } from './ActionTypeFilter';
import { SourceFilter } from '../common/SourceFilter';

interface ActionsTableProps {
  actions: Action[];
}

export const ActionsTable = memo(function ActionsTable({ actions }: ActionsTableProps) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

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

  const columns: ColumnDefinition<Action>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Action) => (
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
      accessor: (row: Action) => {
        if (!row.type) return '-';
        return row.type.charAt(0).toUpperCase() + row.type.slice(1);
      },
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Action) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

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
      <DataTable
        data={filteredActions}
        columns={columns}
        searchFields={['name', 'type', 'description']}
        searchPlaceholder="Search actions by name, type, or description..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No actions available"
        emptySearchMessage="No actions found matching your search criteria."
        ariaLabel="Actions data table"
      />
      <ActionViewModal
        action={selectedAction}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

