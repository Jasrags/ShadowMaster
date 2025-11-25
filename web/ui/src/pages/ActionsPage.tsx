import { useEffect, useState, useCallback } from 'react';
import { actionApi } from '../lib/api';
import type { Action } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { ActionsTable } from '../components/action/ActionsTable';
import { ActionsTableGrouped } from '../components/action/ActionsTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function ActionsPage() {
  const { showError } = useToast();
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadActions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await actionApi.getActions();
      setActions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load actions';
      showError('Failed to load actions', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  return (
    <DatabasePageLayout
      title="Actions Database"
      description="View and search all available combat actions from Shadowrun 5th Edition"
      itemCount={actions.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <ActionsTableGrouped actions={actions} />
      ) : (
        <ActionsTable actions={actions} />
      )}
    </DatabasePageLayout>
  );
}

