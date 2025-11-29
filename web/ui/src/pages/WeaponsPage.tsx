import { useEffect, useState, useCallback, useMemo } from 'react';
import { weaponApi } from '../lib/api';
import type { Weapon, WeaponAccessoryItem } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { WeaponTable } from '../components/weapon/WeaponTable';
import { WeaponTableGrouped } from '../components/weapon/WeaponTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function WeaponsPage() {
  const { showError } = useToast();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [weaponAccessories, setWeaponAccessories] = useState<WeaponAccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadWeapons = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await weaponApi.getWeapons();
      setWeapons(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weapons';
      showError('Failed to load weapons', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const loadWeaponAccessories = useCallback(async () => {
    try {
      const data = await weaponApi.getWeaponAccessories();
      setWeaponAccessories(data);
    } catch (err) {
      // Silently fail - accessories are optional, but log for debugging
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weapon accessories';
      showError('Failed to load weapon accessories', errorMessage);
    }
  }, [showError]);

  useEffect(() => {
    loadWeapons();
    loadWeaponAccessories();
  }, [loadWeapons, loadWeaponAccessories]);

  // Create a map of accessories by name (case-insensitive)
  const accessoryMap = useMemo(() => {
    const map = new Map<string, WeaponAccessoryItem>();
    weaponAccessories.forEach(acc => {
      // Use lowercase name as key for case-insensitive lookup
      map.set(acc.name.toLowerCase(), acc);
    });
    return map;
  }, [weaponAccessories]);

  return (
    <DatabasePageLayout
      title="Weapons Database"
      description="View and search all available weapons from Shadowrun 5th Edition"
      itemCount={weapons.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <WeaponTableGrouped weapons={weapons} accessoryMap={accessoryMap} />
      ) : (
        <WeaponTable weapons={weapons} accessoryMap={accessoryMap} />
      )}
    </DatabasePageLayout>
  );
}

