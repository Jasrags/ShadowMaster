import { useState, useMemo, useEffect, Fragment } from 'react';
import { Button } from 'react-aria-components';
import type { Skill } from '../../lib/types';
import { SkillViewModal } from './SkillViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface SkillsTableGroupedProps {
  skills: Skill[];
}

interface CategoryGroup {
  category: string;
  skills: Skill[];
  isExpanded: boolean;
}

interface TypeGroup {
  type: string;
  categories: CategoryGroup[];
  isExpanded: boolean;
}

// Helper to format category name for display
const formatCategoryName = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format type name for display
const formatTypeName = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to format attribute name to Title Case
const formatAttributeName = (attribute: string): string => {
  if (!attribute || attribute === '-') return '-';
  return attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase();
};

export function SkillsTableGrouped({ skills }: SkillsTableGroupedProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Filter skills by selected sources and search term
  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const skillSource = item.source?.source || 'Unknown';
        return selectedSources.includes(skillSource);
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'linked_attribute', 'description']);
    }

    return filtered;
  }, [skills, selectedSources, searchTerm]);

  // Group skills by Type → Category
  const groupedSkills = useMemo(() => {
    const typeMap = new Map<string, Map<string, Skill[]>>();
    
    filteredSkills.forEach(skill => {
      const type = skill.type || 'unknown';
      const category = skill.category || 'unknown';
      
      if (!typeMap.has(type)) {
        typeMap.set(type, new Map());
      }
      
      const categoryMap = typeMap.get(type)!;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      
      categoryMap.get(category)!.push(skill);
    });

    // Convert to nested structure
    const result: TypeGroup[] = [];
    const typeOrder = ['active', 'knowledge', 'language'];
    
    typeOrder.forEach(type => {
      const categoryMap = typeMap.get(type);
      if (!categoryMap || categoryMap.size === 0) return;
      
      const categories: CategoryGroup[] = Array.from(categoryMap.entries())
        .map(([category, skills]) => ({
          category,
          skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
          isExpanded: expandedCategories.has(`${type}-${category}`),
        }))
        .sort((a, b) => a.category.localeCompare(b.category));
      
      result.push({
        type,
        categories,
        isExpanded: expandedTypes.has(type),
      });
    });

    return result;
  }, [filteredSkills, expandedTypes, expandedCategories]);

  // Auto-expand when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const typesWithMatches = new Set<string>();
      const categoriesWithMatches = new Set<string>();
      
      filteredSkills.forEach(skill => {
        const type = skill.type || 'unknown';
        const category = skill.category || 'unknown';
        typesWithMatches.add(type);
        // Only track categories for types that have multiple categories
        const typeGroup = groupedSkills.find(tg => tg.type === type);
        if (typeGroup && typeGroup.categories.length > 1) {
          categoriesWithMatches.add(`${type}-${category}`);
        }
      });
      
      setExpandedTypes(typesWithMatches);
      setExpandedCategories(categoriesWithMatches);
    }
  }, [searchTerm, filteredSkills, groupedSkills]);

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  const toggleCategory = (type: string, category: string) => {
    const key = `${type}-${category}`;
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allTypes = new Set(groupedSkills.map(g => g.type));
    setExpandedTypes(allTypes);
    
    const allCategories = new Set<string>();
    groupedSkills.forEach(typeGroup => {
      // Only expand categories for types that have multiple categories
      if (typeGroup.categories.length > 1) {
        typeGroup.categories.forEach(catGroup => {
          allCategories.add(`${typeGroup.type}-${catGroup.category}`);
        });
      }
    });
    setExpandedCategories(allCategories);
  };

  const collapseAll = () => {
    setExpandedTypes(new Set());
    setExpandedCategories(new Set());
  };

  const handleNameClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const totalSkills = filteredSkills.length;
  const totalTypes = groupedSkills.length;
  // Only count categories for types that have multiple categories (skip single-category types)
  const totalCategories = groupedSkills.reduce((sum, typeGroup) => {
    return sum + (typeGroup.categories.length > 1 ? typeGroup.categories.length : 0);
  }, 0);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={skills}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(s) => s.source?.source || 'Unknown'}
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills by name, category, attribute, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Attribute</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Default</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Skill Group</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Page</th>
              </tr>
            </thead>
            <tbody>
              {groupedSkills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No skills found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedSkills.map((typeGroup) => (
                  <Fragment key={typeGroup.type}>
                    {/* Type Header Row */}
                    <tr
                      className="bg-sr-darker/50 border-b-2 border-sr-light-gray cursor-pointer hover:bg-sr-darker transition-colors"
                      onClick={() => toggleType(typeGroup.type)}
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                          aria-label={typeGroup.isExpanded ? `Collapse ${formatTypeName(typeGroup.type)}` : `Expand ${formatTypeName(typeGroup.type)}`}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${typeGroup.isExpanded ? 'rotate-90' : ''}`}
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
                          <span className="font-bold text-lg text-gray-100">{formatTypeName(typeGroup.type)} Skills</span>
                          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                            {typeGroup.categories.reduce((sum, cat) => sum + cat.skills.length, 0)} skills
                          </span>
                        </div>
                      </td>
                      <td colSpan={5} className="px-4 py-3 text-sm text-gray-400">
                        Click to {typeGroup.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Skills Rows (only show if type is expanded) */}
                    {typeGroup.isExpanded && (
                      // If only one category, show skills directly (skip category level)
                      typeGroup.categories.length === 1 ? (
                        typeGroup.categories[0].skills.map((skill, index) => (
                          <tr
                            key={`${typeGroup.type}-${skill.name}-${index}`}
                            className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                          >
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleNameClick(skill)}
                                className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                              >
                                {skill.name}
                              </button>
                            </td>
                            <td className="px-4 py-2 text-gray-300">{formatAttributeName(skill.linked_attribute || '-')}</td>
                            <td className="px-4 py-2 text-gray-300">{skill.can_default ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-2 text-gray-300">{skill.skill_group || '-'}</td>
                            <td className="px-4 py-2 text-gray-300">{skill.source?.source || '-'}</td>
                            <td className="px-4 py-2 text-gray-300">{skill.source?.page || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        // Multiple categories: show category grouping
                        typeGroup.categories.map((categoryGroup) => (
                          <Fragment key={`${typeGroup.type}-${categoryGroup.category}`}>
                            {/* Category Header Row */}
                            <tr
                              className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
                              onClick={() => toggleCategory(typeGroup.type, categoryGroup.category)}
                            >
                              <td className="px-4 py-2"></td>
                              <td className="px-4 py-2">
                                <button
                                  className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                                  aria-label={categoryGroup.isExpanded ? `Collapse ${formatCategoryName(categoryGroup.category)}` : `Expand ${formatCategoryName(categoryGroup.category)}`}
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform ${categoryGroup.isExpanded ? 'rotate-90' : ''}`}
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
                                  <span className="font-semibold text-gray-200">{formatCategoryName(categoryGroup.category)}</span>
                                  <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                                    {categoryGroup.skills.length} {categoryGroup.skills.length === 1 ? 'skill' : 'skills'}
                                  </span>
                                </div>
                              </td>
                              <td colSpan={5} className="px-4 py-2 text-sm text-gray-400">
                                Click to {categoryGroup.isExpanded ? 'collapse' : 'expand'}
                              </td>
                            </tr>

                            {/* Skills Rows (only show if category is expanded) */}
                            {categoryGroup.isExpanded && categoryGroup.skills.map((skill, index) => (
                              <tr
                                key={`${typeGroup.type}-${categoryGroup.category}-${skill.name}-${index}`}
                                className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                              >
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => handleNameClick(skill)}
                                    className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-8"
                                  >
                                    {skill.name}
                                  </button>
                                </td>
                                <td className="px-4 py-2 text-gray-300">{formatAttributeName(skill.linked_attribute || '-')}</td>
                                <td className="px-4 py-2 text-gray-300">{skill.can_default ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 text-gray-300">{skill.skill_group || '-'}</td>
                                <td className="px-4 py-2 text-gray-300">{skill.source?.source || '-'}</td>
                                <td className="px-4 py-2 text-gray-300">{skill.source?.page || '-'}</td>
                              </tr>
                            ))}
                          </Fragment>
                        ))
                      )
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalSkills} {totalSkills === 1 ? 'skill' : 'skills'} in {totalCategories} {totalCategories === 1 ? 'category' : 'categories'} across {totalTypes} {totalTypes === 1 ? 'type' : 'types'}
        </div>
      </div>

      <SkillViewModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
