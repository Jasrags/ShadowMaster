import { useEffect, useState, useCallback } from 'react';
import { vehicleApi } from '../lib/api';
import type { Vehicle } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { VehiclesTable } from '../components/vehicle/VehiclesTable';
import { VehiclesTableGrouped } from '../components/vehicle/VehiclesTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function VehiclesPage() {
  const { showError } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await vehicleApi.getVehicles();
      setVehicles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicles';
      showError('Failed to load vehicles', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return (
    <DatabasePageLayout
      title="Vehicles Database"
      description="View and search all available vehicles and drones from Shadowrun 5th Edition"
      itemCount={vehicles.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <VehiclesTableGrouped vehicles={vehicles} />
      ) : (
        <VehiclesTable vehicles={vehicles} />
      )}
    </DatabasePageLayout>
  );
}

