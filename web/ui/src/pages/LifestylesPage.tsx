import { useEffect, useState, useCallback } from 'react';
import { lifestyleApi } from '../lib/api';
import type { Lifestyle } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { LifestylesTable } from '../components/lifestyle/LifestylesTable';
import { LifestylesTableGrouped } from '../components/lifestyle/LifestylesTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function LifestylesPage() {
  const { showError } = useToast();
  const [lifestyles, setLifestyles] = useState<Lifestyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadLifestyles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await lifestyleApi.getLifestyles();
      setLifestyles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lifestyles';
      showError('Failed to load lifestyles', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadLifestyles();
  }, [loadLifestyles]);

  return (
    <DatabasePageLayout
      title="Lifestyles Database"
      description="View and search all available lifestyles and lifestyle options from Shadowrun 5th Edition"
      itemCount={lifestyles.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <LifestylesTableGrouped lifestyles={lifestyles} />
      ) : (
        <LifestylesTable lifestyles={lifestyles} />
      )}
    </DatabasePageLayout>
  );
}

