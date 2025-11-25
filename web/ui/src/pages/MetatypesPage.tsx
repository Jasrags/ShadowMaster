import { useEffect, useState, useCallback } from 'react';
import { metatypeApi } from '../lib/api';
import type { Metatype } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { MetatypesTable } from '../components/metatype/MetatypesTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function MetatypesPage() {
  const { showError } = useToast();
  const [metatypes, setMetatypes] = useState<Metatype[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMetatypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await metatypeApi.getMetatypes();
      setMetatypes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load metatypes';
      showError('Failed to load metatypes', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadMetatypes();
  }, [loadMetatypes]);

  return (
    <DatabasePageLayout
      title="Metatypes Database"
      description="View and search all available metatypes from Shadowrun 5th Edition"
      itemCount={metatypes.length}
      isLoading={isLoading}
    >
      <MetatypesTable metatypes={metatypes} />
    </DatabasePageLayout>
  );
}

