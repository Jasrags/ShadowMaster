import { useEffect, useState, useCallback, useMemo } from 'react';
import { armorApi, gearApi } from '../lib/api';
import type { Armor, Gear } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { ArmorTable } from '../components/armor/ArmorTable';
import { ArmorTableGrouped } from '../components/armor/ArmorTableGrouped';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function ArmorPage() {
  const { showError } = useToast();
  const [armor, setArmor] = useState<Armor[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');

  // Create a map of gear IDs to gear objects for lookups
  const gearMap = useMemo(() => {
    const map = new Map<string, Gear>();
    gear.forEach((item) => {
      if (item.name) {
        // Create normalized ID from name (lowercase, spaces to underscores, remove special chars)
        const normalizedId = item.name
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        
        // Map by normalized ID (e.g., "Concealable Holster" -> "concealable_holster")
        map.set(normalizedId, item);
        
        // Also map by original name (case-insensitive) for backwards compatibility
        map.set(item.name.toLowerCase(), item);
        
        // Map by exact name as well
        map.set(item.name, item);
      }
    });
    return map;
  }, [gear]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [armorData, gearData] = await Promise.all([
        armorApi.getArmor(),
        gearApi.getGear().catch(() => []) // Silently fail if gear API is not available (admin only)
      ]);
      setArmor(armorData);
      setGear(gearData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      showError('Failed to load data', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DatabasePageLayout
      title="Armor Database"
      description="View and search all available armor from Shadowrun 5th Edition"
      itemCount={armor.length}
      isLoading={isLoading}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {viewMode === 'grouped' ? (
        <ArmorTableGrouped armor={armor} gearMap={gearMap} />
      ) : (
        <ArmorTable armor={armor} gearMap={gearMap} />
      )}
    </DatabasePageLayout>
  );
}

