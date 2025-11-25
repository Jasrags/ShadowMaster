import { useEffect, useState, useCallback } from 'react';
import { cyberwareApi } from '../lib/api';
import type { Cyberware } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { CyberwareTable } from '../components/cyberware/CyberwareTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function CyberwarePage() {
  const { showError } = useToast();
  const [cyberware, setCyberware] = useState<Cyberware[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCyberware = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await cyberwareApi.getCyberware();
      setCyberware(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cyberware';
      showError('Failed to load cyberware', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadCyberware();
  }, [loadCyberware]);

  return (
    <DatabasePageLayout
      title="Cyberware Database"
      description="View and search all available cyberware augmentations from Shadowrun 5th Edition"
      itemCount={cyberware.length}
      isLoading={isLoading}
    >
      <CyberwareTable cyberware={cyberware} />
    </DatabasePageLayout>
  );
}

