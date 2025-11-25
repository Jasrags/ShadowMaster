import { useEffect, useState, useCallback } from 'react';
import { complexFormApi } from '../lib/api';
import type { ComplexForm } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { ComplexFormsTable } from '../components/complexform/ComplexFormsTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function ComplexFormsPage() {
  const { showError } = useToast();
  const [complexForms, setComplexForms] = useState<ComplexForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComplexForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await complexFormApi.getComplexForms();
      setComplexForms(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load complex forms';
      showError('Failed to load complex forms', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadComplexForms();
  }, [loadComplexForms]);

  return (
    <DatabasePageLayout
      title="Complex Forms Database"
      description="View and search all available complex forms from Shadowrun 5th Edition"
      itemCount={complexForms.length}
      isLoading={isLoading}
    >
      <ComplexFormsTable complexForms={complexForms} />
    </DatabasePageLayout>
  );
}

