import { useEffect, useState, useCallback } from 'react';
import { qualityApi } from '../lib/api';
import type { Quality } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { QualitiesTable } from '../components/quality/QualitiesTable';
import { QualitiesTableGrouped } from '../components/quality/QualitiesTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function QualitiesPage() {
  const { showError } = useToast();
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadQualities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await qualityApi.getQualities();
      setQualities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load qualities';
      showError('Failed to load qualities', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadQualities();
  }, [loadQualities]);

  return (
    <DatabasePageLayout
      title="Qualities Database"
      description="View and search all available qualities from Shadowrun 5th Edition"
      itemCount={qualities.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <QualitiesTableGrouped qualities={qualities} />
      ) : (
        <QualitiesTable qualities={qualities} />
      )}
    </DatabasePageLayout>
  );
}

