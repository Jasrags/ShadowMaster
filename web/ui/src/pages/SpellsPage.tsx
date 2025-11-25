import { useEffect, useState, useCallback } from 'react';
import { spellApi } from '../lib/api';
import type { Spell } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { SpellsTable } from '../components/spell/SpellsTable';
import { SpellsTableGrouped } from '../components/spell/SpellsTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function SpellsPage() {
  const { showError } = useToast();
  const [spells, setSpells] = useState<Spell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  const loadSpells = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await spellApi.getSpells();
      setSpells(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load spells';
      showError('Failed to load spells', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadSpells();
  }, [loadSpells]);

  return (
    <DatabasePageLayout
      title="Spells Database"
      description="View and search all available spells from Shadowrun 5th Edition"
      itemCount={spells.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <SpellsTableGrouped spells={spells} />
      ) : (
        <SpellsTable spells={spells} />
      )}
    </DatabasePageLayout>
  );
}

