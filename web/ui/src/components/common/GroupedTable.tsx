import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { filterData } from '../../lib/tableUtils';

export interface GroupedTableColumn<T> {
  header: string;
  accessor: (item: T) => ReactNode;
  className?: string;
}

export interface GroupedTableProps<T> {
  items: T[];
  getGroupKey: (item: T) => string;
  getGroupLabel: (groupKey: string) => string;
  columns: GroupedTableColumn<T>[];
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  onItemClick?: (item: T) => void;
  renderGroupHeader?: (groupKey: string, itemCount: number, isExpanded: boolean) => ReactNode;
  renderItemRow?: (item: T, index: number) => ReactNode;
  autoExpandOnSearch?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function GroupedTable<T extends object>({
  items,
  getGroupKey,
  getGroupLabel,
  columns,
  searchFields = [],
  searchPlaceholder = 'Search...',
  onItemClick,
  renderGroupHeader,
  renderItemRow,
  autoExpandOnSearch = true,
  defaultExpanded = false,
  className = '',
}: GroupedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    defaultExpanded ? new Set() : new Set()
  );

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

  const defaultRenderGroupHeader = (groupKey: string, itemCount: number, isExpanded: boolean) => (
    <tr
      className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
      onClick={() => toggleGroup(groupKey)}
    >
      <td className="px-4 py-3">
        <button
          className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
          aria-label={isExpanded ? `Collapse ${getGroupLabel(groupKey)}` : `Expand ${getGroupLabel(groupKey)}`}
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
          <span className="font-semibold text-gray-200">{getGroupLabel(groupKey)}</span>
          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </td>
      <td colSpan={columns.length - 1} className="px-4 py-3 text-sm text-gray-400">
        Click to {isExpanded ? 'collapse' : 'expand'}
      </td>
    </tr>
  );

  const defaultRenderItemRow = (item: T, index: number) => (
    <tr
      key={index}
      className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
      onClick={() => onItemClick?.(item)}
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
  );

  return (
    <div className={className}>
      {/* Search and Controls */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            />
          </div>
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

      {/* Grouped Table */}
      <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sr-darker border-b border-sr-light-gray">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12"></th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-sm font-semibold text-gray-300 ${column.className || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                    No items found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedItems.map((group) => (
                  <React.Fragment key={group.groupKey}>
                    {renderGroupHeader
                      ? renderGroupHeader(group.groupKey, group.items.length, group.isExpanded)
                      : defaultRenderGroupHeader(group.groupKey, group.items.length, group.isExpanded)}
                    {group.isExpanded && group.items.map((item, index) =>
                      renderItemRow
                        ? renderItemRow(item, index)
                        : defaultRenderItemRow(item, index)
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in {groupedItems.length} {groupedItems.length === 1 ? 'group' : 'groups'}
        </div>
      </div>
    </div>
  );
}
