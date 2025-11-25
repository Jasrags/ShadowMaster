import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { Action } from '../../lib/types';
import { ActionViewModal } from './ActionViewModal';
import { ActionTypeFilter } from './ActionTypeFilter';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface ActionsTableGroupedProps {
  actions: Action[];
}


export const ActionsTableGrouped = memo(function ActionsTableGrouped({ actions }: ActionsTableGroupedProps) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

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

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'type', 'description']);
    }

    return filtered;
  }, [actions, selectedTypes, selectedSources, searchTerm]);

  const groupedActions = useMemo(() => {
    const typeMap = new Map<string, Action[]>();

    filteredActions.forEach(action => {
      const type = action.type || 'unclassified';
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(action);
    });

    return Array.from(typeMap.entries())
      .map(([type, actions]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        actions: actions.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedTypes.has(type),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [filteredActions, expandedTypes]);

  const toggleType = useCallback((type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  }, [expandedTypes]);

  const handleNameClick = useCallback((action: Action) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  }, []);

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
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedActions.map((group) => (
          <div key={group.type} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleType(group.type.toLowerCase())}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.type}</span>
                <span className="text-sm text-gray-400">({group.actions.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.actions.map((action) => (
                    <div
                      key={action.name}
                      className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
                      onClick={() => handleNameClick(action)}
                    >
                      <div className="flex-1">
                        <div className="text-gray-100 font-medium">{action.name}</div>
                        {action.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">{action.description}</div>
                        )}
                      </div>
                      {action.source?.source && (
                        <div className="text-xs text-gray-500 ml-4">{action.source.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ActionViewModal
        action={selectedAction}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

