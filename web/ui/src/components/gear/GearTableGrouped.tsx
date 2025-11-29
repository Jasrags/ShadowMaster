import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'react-aria-components';
import type { Gear } from '../../lib/types';
import { GearViewModal } from './GearViewModal';
import { SourceFilter } from './SourceFilter';
import { filterData } from '../../lib/tableUtils';
import { getCategoryDisplayName } from './categoryUtils';
import { formatCost } from '../../lib/formatUtils';

interface GearTableGroupedProps {
  gear: Gear[];
}

interface SubcategoryGroup {
  subcategory: string;
  gear: Gear[];
  isExpanded: boolean;
}

// CategoryGroup interface removed - unused

export function GearTableGrouped({ gear }: GearTableGroupedProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Filter gear by selected sources and search term
  const filteredGear = useMemo(() => {
    let filtered = gear;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const source = typeof item.source === 'string' ? item.source : item.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(
        filtered,
        searchTerm,
        {},
        ['name', 'category', 'subcategory', 'description']
      );
    }

    return filtered;
  }, [gear, selectedSources, searchTerm]);

  // Group gear by Category → Subcategory
  const groupedGear = useMemo(() => {
    const categoryMap = new Map<string, Map<string, Gear[]>>();
    
    filteredGear.forEach(item => {
      const category = item.category || 'Unknown';
      const subcategory = item.subcategory || 'Uncategorized';
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Map());
      }
      
      const subcategoryMap = categoryMap.get(category)!;
      if (!subcategoryMap.has(subcategory)) {
        subcategoryMap.set(subcategory, []);
      }
      
      subcategoryMap.get(subcategory)!.push(item);
    });

    // Convert to nested structure
    return Array.from(categoryMap.entries())
      .map(([category, subcategoryMap]) => {
        const subcategories: SubcategoryGroup[] = Array.from(subcategoryMap.entries())
          .map(([subcategory, gear]) => ({
            subcategory,
            gear: gear.sort((a, b) => a.name.localeCompare(b.name)),
            isExpanded: expandedSubcategories.has(`${category}-${subcategory}`),
          }))
          .sort((a, b) => a.subcategory.localeCompare(b.subcategory));
        
        return {
          category,
          subcategories,
          isExpanded: expandedCategories.has(category),
        };
      })
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredGear, expandedCategories, expandedSubcategories]);

  // Auto-expand when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const categoriesWithMatches = new Set<string>();
      const subcategoriesWithMatches = new Set<string>();
      
      // Build a map to check if categories have multiple subcategories
      const categorySubcategoryMap = new Map<string, Set<string>>();
      filteredGear.forEach(item => {
        const category = item.category || 'Unknown';
        const subcategory = item.subcategory || 'Uncategorized';
        
        if (!categorySubcategoryMap.has(category)) {
          categorySubcategoryMap.set(category, new Set());
        }
        categorySubcategoryMap.get(category)!.add(subcategory);
        categoriesWithMatches.add(category);
      });
      
      // Only track subcategories for categories that have multiple subcategories
      filteredGear.forEach(item => {
        const category = item.category || 'Unknown';
        const subcategory = item.subcategory || 'Uncategorized';
        const subcategories = categorySubcategoryMap.get(category);
        if (subcategories && subcategories.size > 1) {
          subcategoriesWithMatches.add(`${category}-${subcategory}`);
        }
      });
      
      setExpandedCategories(categoriesWithMatches);
      setExpandedSubcategories(subcategoriesWithMatches);
    }
  }, [searchTerm, filteredGear]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (category: string, subcategory: string) => {
    const key = `${category}-${subcategory}`;
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubcategories(newExpanded);
  };

  const expandAll = () => {
    const allCategories = new Set(groupedGear.map(g => g.category));
    setExpandedCategories(allCategories);
    
    const allSubcategories = new Set<string>();
    groupedGear.forEach(categoryGroup => {
      // Only expand subcategories for categories that have multiple subcategories
      if (categoryGroup.subcategories.length > 1) {
        categoryGroup.subcategories.forEach(subcatGroup => {
          allSubcategories.add(`${categoryGroup.category}-${subcatGroup.subcategory}`);
        });
      }
    });
    setExpandedSubcategories(allSubcategories);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubcategories(new Set());
  };

  const handleNameClick = (gearItem: Gear) => {
    setSelectedGear(gearItem);
    setIsModalOpen(true);
  };

  const totalGear = filteredGear.length;
  const totalCategories = groupedGear.length;
  // Only count subcategories for categories that have multiple subcategories (skip single-subcategory categories)
  const totalSubcategories = groupedGear.reduce((sum, categoryGroup) => {
    return sum + (categoryGroup.subcategories.length > 1 ? categoryGroup.subcategories.length : 0);
  }, 0);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            gear={gear}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear by name, category, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost For</th>
              </tr>
            </thead>
            <tbody>
              {groupedGear.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No gear found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedGear.map((categoryGroup) => (
                  <React.Fragment key={categoryGroup.category}>
                    {/* Category Header Row */}
                    <tr
                      className="bg-sr-darker/50 border-b-2 border-sr-light-gray cursor-pointer hover:bg-sr-darker transition-colors"
                      onClick={() => toggleCategory(categoryGroup.category)}
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                          aria-label={categoryGroup.isExpanded ? `Collapse ${getCategoryDisplayName(categoryGroup.category)}` : `Expand ${getCategoryDisplayName(categoryGroup.category)}`}
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
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-100">{getCategoryDisplayName(categoryGroup.category)}</span>
                          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                            {categoryGroup.subcategories.reduce((sum, subcat) => sum + subcat.gear.length, 0)} items
                          </span>
                        </div>
                      </td>
                      <td colSpan={6} className="px-4 py-3 text-sm text-gray-400">
                        Click to {categoryGroup.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Subcategory and Gear Rows (only show if category is expanded) */}
                    {categoryGroup.isExpanded && (
                      // If only one subcategory, show gear directly (skip subcategory level)
                      categoryGroup.subcategories.length === 1 ? (
                        categoryGroup.subcategories[0].gear.map((item, index) => (
                          <tr
                            key={`${categoryGroup.category}-${item.name}-${index}`}
                            className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                          >
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleNameClick(item)}
                                className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                              >
                                {item.name}
                              </button>
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {typeof item.source === 'string' ? item.source : item.source?.source || '-'}
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {item.page || (typeof item.source === 'object' ? item.source?.page : '-') || '-'}
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {item.rating !== undefined ? String(item.rating) : (item.rating as string | undefined) || '-'}
                            </td>
                            <td className="px-4 py-2 text-gray-300">{item.availability || item.avail || '-'}</td>
                            <td className="px-4 py-2 text-gray-300">
                              {item.cost !== undefined
                                ? item.cost_per_rating
                                  ? `${formatCost(String(item.cost))} per rating`
                                  : formatCost(String(item.cost))
                                : formatCost(item.cost as string | undefined)}
                            </td>
                            <td className="px-4 py-2 text-gray-300">{item.costfor || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        // Multiple subcategories: show subcategory grouping
                        categoryGroup.subcategories.map((subcategoryGroup) => (
                          <React.Fragment key={`${categoryGroup.category}-${subcategoryGroup.subcategory}`}>
                            {/* Subcategory Header Row */}
                            <tr
                              className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
                              onClick={() => toggleSubcategory(categoryGroup.category, subcategoryGroup.subcategory)}
                            >
                              <td className="px-4 py-2"></td>
                              <td className="px-4 py-2">
                                <button
                                  className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                                  aria-label={subcategoryGroup.isExpanded ? `Collapse ${subcategoryGroup.subcategory}` : `Expand ${subcategoryGroup.subcategory}`}
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform ${subcategoryGroup.isExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2 pl-4">
                                  <span className="font-semibold text-gray-200">{subcategoryGroup.subcategory}</span>
                                  <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                                    {subcategoryGroup.gear.length} {subcategoryGroup.gear.length === 1 ? 'item' : 'items'}
                                  </span>
                                </div>
                              </td>
                              <td colSpan={6} className="px-4 py-2 text-sm text-gray-400">
                                Click to {subcategoryGroup.isExpanded ? 'collapse' : 'expand'}
                              </td>
                            </tr>

                            {/* Gear Rows (only show if subcategory is expanded) */}
                            {subcategoryGroup.isExpanded && subcategoryGroup.gear.map((item, index) => (
                              <tr
                                key={`${categoryGroup.category}-${subcategoryGroup.subcategory}-${item.name}-${index}`}
                                className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                              >
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => handleNameClick(item)}
                                    className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-8"
                                  >
                                    {item.name}
                                  </button>
                                </td>
                                <td className="px-4 py-2 text-gray-300">
                                  {typeof item.source === 'string' ? item.source : item.source?.source || '-'}
                                </td>
                                <td className="px-4 py-2 text-gray-300">
                                  {item.page || (typeof item.source === 'object' ? item.source?.page : '-') || '-'}
                                </td>
                                <td className="px-4 py-2 text-gray-300">
                                  {item.rating !== undefined ? String(item.rating) : (item.rating as string | undefined) || '-'}
                                </td>
                                <td className="px-4 py-2 text-gray-300">{item.availability || item.avail || '-'}</td>
                                <td className="px-4 py-2 text-gray-300">
                                  {item.cost !== undefined
                                    ? item.cost_per_rating
                                      ? `${formatCost(String(item.cost))} per rating`
                                      : formatCost(String(item.cost))
                                    : formatCost(item.cost as string | undefined)}
                                </td>
                                <td className="px-4 py-2 text-gray-300">{item.costfor || '-'}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      )
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalGear} {totalGear === 1 ? 'item' : 'items'} in {totalSubcategories} {totalSubcategories === 1 ? 'subcategory' : 'subcategories'} across {totalCategories} {totalCategories === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <GearViewModal
        gear={selectedGear}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

