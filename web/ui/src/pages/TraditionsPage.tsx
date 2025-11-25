import { useEffect, useState, useCallback } from 'react';
import { traditionApi } from '../lib/api';
import type { Tradition } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { TraditionsTable } from '../components/tradition/TraditionsTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function TraditionsPage() {
  const { showError } = useToast();
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTraditions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await traditionApi.getTraditions();
      setTraditions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load traditions';
      showError('Failed to load traditions', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadTraditions();
  }, [loadTraditions]);

  return (
    <DatabasePageLayout
      title="Traditions Database"
      description="View and search all available magical traditions from Shadowrun 5th Edition"
      itemCount={traditions.length}
      isLoading={isLoading}
    >
      <TraditionsTable traditions={traditions} />
    </DatabasePageLayout>
  );
}

