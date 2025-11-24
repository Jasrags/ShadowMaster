import { useEffect, useState, useCallback } from 'react';
import { skillApi } from '../lib/api';
import type { Skill } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { SkillsTable } from '../components/skill/SkillsTable';
import { SkillsTableGrouped } from '../components/skill/SkillsTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function SkillsPage() {
  const { showError } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await skillApi.getSkills();
      setSkills(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load skills';
      showError('Failed to load skills', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return (
    <DatabasePageLayout
      title="Skills Database"
      description="View and search all available skills from Shadowrun 5th Edition"
      itemCount={skills.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <SkillsTableGrouped skills={skills} />
      ) : (
        <SkillsTable skills={skills} />
      )}
    </DatabasePageLayout>
  );
}

