import { useEffect, useState, useCallback } from 'react';
import { gearApi } from '../lib/api';
import type { Gear } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { GearTable } from '../components/gear/GearTable';

export function GearPage() {
  const { showError } = useToast();
  const [gear, setGear] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading gear...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Gear Database</h2>
        <p className="text-gray-400">
          View and search all available gear from Shadowrun 5th Edition ({gear.length} items)
        </p>
      </div>
      <GearTable gear={gear} />
    </div>
  );
}

