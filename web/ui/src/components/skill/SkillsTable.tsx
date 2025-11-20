import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Skill } from '../../lib/types';
import { SkillViewModal } from './SkillViewModal';
import { SkillCategoryFilter } from './SkillCategoryFilter';
import { SkillSourceFilter } from './SkillSourceFilter';

interface SkillsTableProps {
  skills: Skill[];
}

export function SkillsTable({ skills }: SkillsTableProps) {
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
        const skillSource = item.source || 'Unknown';
        return selectedSources.includes(skillSource);
      });
    }

    return filtered;
  }, [skills, selectedCategories, selectedSources]);

  const handleNameClick = (skillItem: Skill) => {
    setSelectedSkill(skillItem);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Skill>[] = [
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
      id: 'category',
      header: 'Category',
      accessor: 'category',
      sortable: true,
    },
    {
      id: 'attribute',
      header: 'Attribute',
      accessor: 'attribute',
      sortable: true,
    },
    {
      id: 'default',
      header: 'Default',
      accessor: 'default',
      sortable: true,
    },
    {
      id: 'skillgroup',
      header: 'Skill Group',
      accessor: 'skillgroup',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
    },
    {
      id: 'page',
      header: 'Page',
      accessor: 'page',
      sortable: true,
    },
  ];

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
        searchFields={['name', 'category', 'attribute', 'source']}
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
}

