import { useEffect, useState, useCallback } from 'react';
import { biowareApi } from '../lib/api';
import type { Bioware } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { BiowareTable } from '../components/bioware/BiowareTable';
import { BiowareTableGrouped } from '../components/bioware/BiowareTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function BiowarePage() {
  const { showError } = useToast();
  const [bioware, setBioware] = useState<Bioware[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadBioware = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await biowareApi.getBioware();
      setBioware(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bioware';
      showError('Failed to load bioware', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadBioware();
  }, [loadBioware]);

  return (
    <DatabasePageLayout
      title="Bioware Database"
      description="View and search all available bioware augmentations from Shadowrun 5th Edition"
      itemCount={bioware.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <BiowareTableGrouped bioware={bioware} />
      ) : (
        <BiowareTable bioware={bioware} />
      )}
    </DatabasePageLayout>
  );
}

