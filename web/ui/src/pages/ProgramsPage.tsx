import { useEffect, useState, useCallback } from 'react';
import { programApi } from '../lib/api';
import type { Program } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { ProgramsTable } from '../components/program/ProgramsTable';
import { ProgramsTableGrouped } from '../components/program/ProgramsTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function ProgramsPage() {
  const { showError } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await programApi.getPrograms();
      setPrograms(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load programs';
      showError('Failed to load programs', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  return (
    <DatabasePageLayout
      title="Programs Database"
      description="View and search all available Matrix programs from Shadowrun 5th Edition"
      itemCount={programs.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <ProgramsTableGrouped programs={programs} />
      ) : (
        <ProgramsTable programs={programs} />
      )}
    </DatabasePageLayout>
  );
}

