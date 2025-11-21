import { useEffect, useState, useCallback } from 'react';
import { lifestyleApi } from '../lib/api';
import type { Lifestyle } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { LifestylesTable } from '../components/lifestyle/LifestylesTable';

export function LifestylesPage() {
  const { showError } = useToast();
  const [lifestyles, setLifestyles] = useState<Lifestyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLifestyles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await lifestyleApi.getLifestyles();
      setLifestyles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lifestyles';
      showError('Failed to load lifestyles', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadLifestyles();
  }, [loadLifestyles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading lifestyles...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Lifestyles Database</h2>
          <p className="text-gray-400">
            View and search all available lifestyles from Shadowrun 5th Edition ({lifestyles.length} lifestyles)
          </p>
        </div>
      </div>
      <LifestylesTable lifestyles={lifestyles} />
    </div>
  );
}

