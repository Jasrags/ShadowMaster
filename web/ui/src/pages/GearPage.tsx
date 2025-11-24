import { useEffect, useState, useCallback } from 'react';
import { gearApi } from '../lib/api';
import type { Gear } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { GearTable } from '../components/gear/GearTable';
import { GearTableGrouped } from '../components/gear/GearTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function GearPage() {
  const { showError } = useToast();
  const [gear, setGear] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadGear = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await gearApi.getGear();
      setGear(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load gear';
      showError('Failed to load gear', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadGear();
  }, [loadGear]);

  return (
    <DatabasePageLayout
      title="Gear Database"
      description="View and search all available gear from Shadowrun 5th Edition"
      itemCount={gear.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <GearTableGrouped gear={gear} />
      ) : (
        <GearTable gear={gear} />
      )}
    </DatabasePageLayout>
  );
}

