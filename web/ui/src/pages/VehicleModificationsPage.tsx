import { useEffect, useState, useCallback } from 'react';
import { vehicleModificationApi } from '../lib/api';
import type { VehicleModification } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { VehicleModificationsTable } from '../components/vehicle-modification/VehicleModificationsTable';
import { VehicleModificationsTableGrouped } from '../components/vehicle-modification/VehicleModificationsTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function VehicleModificationsPage() {
  const { showError } = useToast();
  const [modifications, setModifications] = useState<VehicleModification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadModifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await vehicleModificationApi.getVehicleModifications();
      setModifications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle modifications';
      showError('Failed to load vehicle modifications', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadModifications();
  }, [loadModifications]);

  return (
    <DatabasePageLayout
      title="Vehicle Modifications Database"
      description="View and search all available vehicle modifications from Shadowrun 5th Edition"
      itemCount={modifications.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <VehicleModificationsTableGrouped modifications={modifications} />
      ) : (
        <VehicleModificationsTable modifications={modifications} />
      )}
    </DatabasePageLayout>
  );
}

