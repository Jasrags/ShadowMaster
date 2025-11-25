import { useEffect, useState, useCallback } from 'react';
import { powerApi } from '../lib/api';
import type { Power } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { PowersTable } from '../components/power/PowersTable';
import { PowersTableGrouped } from '../components/power/PowersTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function PowersPage() {
  const { showError } = useToast();
  const [powers, setPowers] = useState<Power[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadPowers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await powerApi.getPowers();
      setPowers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load powers';
      showError('Failed to load powers', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadPowers();
  }, [loadPowers]);

  return (
    <DatabasePageLayout
      title="Powers Database"
      description="View and search all available powers from Shadowrun 5th Edition"
      itemCount={powers.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <PowersTableGrouped powers={powers} />
      ) : (
        <PowersTable powers={powers} />
      )}
    </DatabasePageLayout>
  );
}

