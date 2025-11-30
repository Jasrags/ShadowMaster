import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'react-aria-components';
import type { WeaponConsumable } from '../../lib/types';
import { WeaponConsumableViewModal } from './WeaponConsumableViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';
import { formatCost } from '../../lib/formatUtils';

interface WeaponConsumablesTableGroupedProps {
  consumables: WeaponConsumable[];
}

// CategoryGroup interface removed - unused

export function WeaponConsumablesTableGrouped({ consumables }: WeaponConsumablesTableGroupedProps) {
  const [selectedConsumable, setSelectedConsumable] = useState<WeaponConsumable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Filter consumables by selected sources and search term
  const filteredConsumables = useMemo(() => {
    let filtered = consumables;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const source = item.source?.source || 'Unknown';
        return selectedSources.includes(source);
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(
        filtered,
        searchTerm,
        {},
        ['name', 'category', 'description', 'cost', 'availability']
      );
    }

    return filtered;
  }, [consumables, selectedSources, searchTerm]);

  // Group consumables by Category
  const groupedConsumables = useMemo(() => {
    const categoryMap = new Map<string, WeaponConsumable[]>();
    
    filteredConsumables.forEach(item => {
      const category = item.category || 'Unknown';
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      
      categoryMap.get(category)!.push(item);
    });

    // Convert to structure with expansion state
    return Array.from(categoryMap.entries())
      .map(([category, items]) => ({
        category,
        consumables: items.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedCategories.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredConsumables, expandedCategories]);

  // Auto-expand when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const categoriesWithMatches = new Set<string>();
      filteredConsumables.forEach(item => {
        categoriesWithMatches.add(item.category || 'Unknown');
      });
      setExpandedCategories(categoriesWithMatches);
    }
  }, [searchTerm, filteredConsumables]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allCategories = new Set(groupedConsumables.map(g => g.category));
    setExpandedCategories(allCategories);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const handleNameClick = (consumable: WeaponConsumable) => {
    setSelectedConsumable(consumable);
    setIsModalOpen(true);
  };

  const totalConsumables = filteredConsumables.length;
  const totalCategories = groupedConsumables.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={consumables}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(c) => c.source?.source || 'Unknown'}
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search weapon consumables by name, category, description, or cost..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
              </tr>
            </thead>
            <tbody>
              {groupedConsumables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No weapon consumables found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedConsumables.map((categoryGroup) => (
                  <React.Fragment key={categoryGroup.category}>
                    {/* Category Header Row */}
                    <tr
                      className="bg-sr-darker/50 border-b-2 border-sr-light-gray cursor-pointer hover:bg-sr-darker transition-colors"
                      onClick={() => toggleCategory(categoryGroup.category)}
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                          aria-label={categoryGroup.isExpanded ? `Collapse ${categoryGroup.category}` : `Expand ${categoryGroup.category}`}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${categoryGroup.isExpanded ? 'rotate-90' : ''}`}
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
                          <span className="font-bold text-lg text-gray-100">{categoryGroup.category}</span>
                          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                            {categoryGroup.consumables.length} {categoryGroup.consumables.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={3} className="px-4 py-3 text-sm text-gray-400">
                        Click to {categoryGroup.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Consumable Rows (only show if category is expanded) */}
                    {categoryGroup.isExpanded && categoryGroup.consumables.map((item, index) => (
                      <tr
                        key={`${categoryGroup.category}-${item.id}-${index}`}
                        className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                      >
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleNameClick(item)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                          >
                            {item.name}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{formatCost(item.cost)}</td>
                        <td className="px-4 py-2 text-gray-300">{item.availability || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.source?.source || '-'}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalConsumables} {totalConsumables === 1 ? 'item' : 'items'} across {totalCategories} {totalCategories === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <WeaponConsumableViewModal
        consumable={selectedConsumable}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

