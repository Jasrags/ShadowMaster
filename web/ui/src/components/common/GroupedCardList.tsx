import { useState, useMemo, useEffect, ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { filterData } from '../../lib/tableUtils';

export interface GroupedCardListProps<T> {
  items: T[];
  getGroupKey: (item: T) => string;
  getGroupLabel: (groupKey: string) => string;
  renderItem: (item: T, index: number) => ReactNode;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  autoExpandOnSearch?: boolean;
  className?: string;
}

export function GroupedCardList<T extends object>({
  items,
  getGroupKey,
  getGroupLabel,
  renderItem,
  searchFields = [],
  searchPlaceholder = 'Search...',
  autoExpandOnSearch = true,
  className = '',
}: GroupedCardListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter items by search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return filterData(items, searchTerm, {}, searchFields as string[]);
  }, [items, searchTerm, searchFields]);

  // Group items
  const groupedItems = useMemo(() => {
    const groups = new Map<string, T[]>();

    filteredItems.forEach(item => {
      const groupKey = getGroupKey(item);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    return Array.from(groups.entries())
      .map(([groupKey, groupItems]) => ({
        groupKey,
        groupLabel: getGroupLabel(groupKey),
        items: groupItems,
        isExpanded: expandedGroups.has(groupKey),
      }))
      .sort((a, b) => a.groupLabel.localeCompare(b.groupLabel));
  }, [filteredItems, expandedGroups, getGroupKey, getGroupLabel]);

  // Auto-expand groups with matching items when searching
  useEffect(() => {
    if (autoExpandOnSearch && searchTerm.trim()) {
      const groupsWithMatches = new Set<string>();
      filteredItems.forEach(item => {
        groupsWithMatches.add(getGroupKey(item));
      });

      if (groupsWithMatches.size > 0) {
        setExpandedGroups(prev => {
          const newExpanded = new Set(prev);
          groupsWithMatches.forEach(key => newExpanded.add(key));
          return newExpanded;
        });
      }
    }
  }, [searchTerm, filteredItems, autoExpandOnSearch, getGroupKey]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(groupKey)) {
        newExpanded.delete(groupKey);
      } else {
        newExpanded.add(groupKey);
      }
      return newExpanded;
    });
  };

  const expandAll = () => {
    const allGroups = new Set(groupedItems.map(g => g.groupKey));
    setExpandedGroups(allGroups);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  return (
    <div className={className}>
      {/* Search and Controls */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
          <div className="flex gap-2">
            <Button
              onPress={expandAll}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-300 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent text-sm"
            >
              Expand All
            </Button>
            <Button
              onPress={collapseAll}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-300 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent text-sm"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Grouped Cards */}
      <div className="space-y-4">
        {groupedItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            No items found matching your criteria.
          </div>
        ) : (
          groupedItems.map((group) => (
            <div key={group.groupKey} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
              <Button
                onPress={() => toggleGroup(group.groupKey)}
                className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                  <span className="font-semibold text-gray-100">{group.groupLabel}</span>
                  <span className="text-sm text-gray-400">({group.items.length})</span>
                </div>
              </Button>
              {group.isExpanded && (
                <div className="p-4">
                  <div className="space-y-2">
                    {group.items.map((item, index) => renderItem(item, index))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
