import { useEffect, useState, useCallback } from 'react';
import { qualityApi } from '../lib/api';
import type { Quality } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { QualitiesTable } from '../components/quality/QualitiesTable';
import { QualitiesTableGrouped } from '../components/quality/QualitiesTableGrouped';

export function QualitiesPage() {
  const { showError } = useToast();
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadQualities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await qualityApi.getQualities();
      setQualities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load qualities';
      showError('Failed to load qualities', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadQualities();
  }, [loadQualities]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading qualities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Qualities Database</h2>
            <p className="text-gray-400">
              View and search all available qualities from Shadowrun 5th Edition ({qualities.length} items)
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
        <QualitiesTableGrouped qualities={qualities} />
      ) : (
        <QualitiesTable qualities={qualities} />
      )}
    </div>
  );
}

