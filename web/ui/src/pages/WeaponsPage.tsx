import { useEffect, useState, useCallback } from 'react';
import { weaponApi } from '../lib/api';
import type { Weapon } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { WeaponTable } from '../components/weapon/WeaponTable';
import { WeaponTableGrouped } from '../components/weapon/WeaponTableGrouped';

export function WeaponsPage() {
  const { showError } = useToast();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
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

  useEffect(() => {
    loadWeapons();
  }, [loadWeapons]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading weapons...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Weapons Database</h2>
            <p className="text-gray-400">
              View and search all available weapons from Shadowrun 5th Edition ({weapons.length} items)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'flat'
                  ? 'bg-sr-accent text-sr-dark'
                  : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
              }`}
            >
              Flat View
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-sr-accent text-sr-dark'
                  : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
              }`}
            >
              Grouped View
            </button>
          </div>
        </div>
      </div>
      {viewMode === 'grouped' ? (
        <WeaponTableGrouped weapons={weapons} />
      ) : (
        <WeaponTable weapons={weapons} />
      )}
    </div>
  );
}

