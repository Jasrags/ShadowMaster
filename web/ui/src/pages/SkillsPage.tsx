import { useEffect, useState, useCallback } from 'react';
import { skillApi } from '../lib/api';
import type { Skill } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { SkillsTable } from '../components/skill/SkillsTable';
import { SkillsTableGrouped } from '../components/skill/SkillsTableGrouped';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading skills...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Skills Database</h2>
            <p className="text-gray-400">
              View and search all available skills from Shadowrun 5th Edition ({skills.length} items)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'flat'
                  ? 'bg-sr-accent text-sr-dark'
                  : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
              }`}
            >
              Flat View
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-sr-accent text-sr-dark'
                  : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
              }`}
            >
              Grouped View
            </button>
          </div>
        </div>
      </div>
      {viewMode === 'grouped' ? (
        <SkillsTableGrouped skills={skills} />
      ) : (
        <SkillsTable skills={skills} />
      )}
    </div>
  );
}

