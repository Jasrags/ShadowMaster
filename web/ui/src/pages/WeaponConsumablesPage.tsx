import { useEffect, useState, useCallback } from 'react';
import { weaponConsumableApi } from '../lib/api';
import type { WeaponConsumable } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { WeaponConsumablesTable } from '../components/weapon-consumable/WeaponConsumablesTable';
import { WeaponConsumablesTableGrouped } from '../components/weapon-consumable/WeaponConsumablesTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function WeaponConsumablesPage() {
  const { showError } = useToast();
  const [consumables, setConsumables] = useState<WeaponConsumable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadConsumables = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await weaponConsumableApi.getWeaponConsumables();
      setConsumables(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weapon consumables';
      showError('Failed to load weapon consumables', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadConsumables();
  }, [loadConsumables]);

  return (
    <DatabasePageLayout
      title="Weapon Consumables Database"
      description="View and search all available weapon consumables (ammunition, grenades, rockets, and missiles) from Shadowrun 5th Edition"
      itemCount={consumables.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <WeaponConsumablesTableGrouped consumables={consumables} />
      ) : (
        <WeaponConsumablesTable consumables={consumables} />
      )}
    </DatabasePageLayout>
  );
}

