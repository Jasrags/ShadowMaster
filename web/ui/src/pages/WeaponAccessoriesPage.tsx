import { useEffect, useState, useCallback } from 'react';
import { weaponApi } from '../lib/api';
import type { WeaponAccessoryItem } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { WeaponAccessoryTable } from '../components/weapon/WeaponAccessoryTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function WeaponAccessoriesPage() {
  const { showError } = useToast();
  const [accessories, setAccessories] = useState<WeaponAccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccessories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await weaponApi.getWeaponAccessories();
      setAccessories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weapon accessories';
      showError('Failed to load weapon accessories', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadAccessories();
  }, [loadAccessories]);

  return (
    <DatabasePageLayout
      title="Weapon Accessories Database"
      description="View and search all available weapon accessories from Shadowrun 5th Edition"
      itemCount={accessories.length}
      isLoading={isLoading}
    >
      <WeaponAccessoryTable accessories={accessories} />
    </DatabasePageLayout>
  );
}

