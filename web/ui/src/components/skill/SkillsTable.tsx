import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Skill } from '../../lib/types';
import { SkillViewModal } from './SkillViewModal';
import { SkillCategoryFilter } from './SkillCategoryFilter';
import { SkillSourceFilter } from './SkillSourceFilter';

interface SkillsTableProps {
  skills: Skill[];
}

// Helper to format attribute name to Title Case
const formatAttributeName = (attribute: string): string => {
  if (!attribute || attribute === '-') return '-';
  return attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase();
};

export const SkillsTable = memo(function SkillsTable({ skills }: SkillsTableProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter skills by selected categories and sources
  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const skillSource = item.source?.source || 'Unknown';
        return selectedSources.includes(skillSource);
      });
    }

    return filtered;
  }, [skills, selectedCategories, selectedSources]);

  const handleNameClick = useCallback((skillItem: Skill) => {
    setSelectedSkill(skillItem);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Skill>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Skill) => (
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
      accessor: 'type',
      sortable: true,
      render: (value: unknown) => (
        <span className="capitalize">{String(value || '-')}</span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      sortable: true,
      render: (value: unknown) => {
        const category = String(value || '');
        return category ? category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-';
      },
    },
    {
      id: 'linked_attribute',
      header: 'Attribute',
      accessor: 'linked_attribute',
      sortable: true,
      render: (value: unknown) => (
        <span>{formatAttributeName(String(value || '-'))}</span>
      ),
    },
    {
      id: 'can_default',
      header: 'Default',
      accessor: 'can_default',
      sortable: true,
      render: (value: unknown) => (value ? 'Yes' : 'No'),
    },
    {
      id: 'skill_group',
      header: 'Skill Group',
      accessor: 'skill_group',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
      render: (value: unknown) => {
        const source = value as { source?: string } | undefined;
        return source?.source || '-';
      },
    },
    {
      id: 'page',
      header: 'Page',
      accessor: 'source',
      sortable: true,
      render: (value: unknown) => {
        const source = value as { page?: string } | undefined;
        return source?.page || '-';
      },
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SkillCategoryFilter
            skills={skills}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <SkillSourceFilter
            skills={skills}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredSkills}
        columns={columns}
        searchFields={['name', 'category', 'linked_attribute', 'description']}
        searchPlaceholder="Search skills by name, category, attribute, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No skills available"
        emptySearchMessage="No skills found matching your search criteria."
        ariaLabel="Skills data table"
      />
      <SkillViewModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

