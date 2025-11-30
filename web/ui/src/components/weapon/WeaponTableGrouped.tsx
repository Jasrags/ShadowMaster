import { useState, useMemo } from 'react';
import type { Weapon, WeaponAccessoryItem } from '../../lib/types';
import { WeaponViewModal } from './WeaponViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';
import { formatCost } from '../../lib/formatUtils';

interface WeaponTableGroupedProps {
  weapons: Weapon[];
  accessoryMap: Map<string, WeaponAccessoryItem>;
}

export function WeaponTableGrouped({ weapons, accessoryMap }: WeaponTableGroupedProps) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter weapons by selected sources
  const filteredWeapons = useMemo(() => {
    if (selectedSources.length === 0) return weapons;
    return weapons.filter(item => selectedSources.includes(item.source));
  }, [weapons, selectedSources]);

  const handleNameClick = (weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setIsModalOpen(true);
  };

  const columns: GroupedTableColumn<Weapon>[] = [
    {
      header: 'Name',
      accessor: (weapon) => (
        <button
          onClick={() => handleNameClick(weapon)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
        >
          {weapon.name}
        </button>
      ),
    },
    {
      header: 'Type',
      accessor: (weapon) => weapon.type || '-',
    },
    {
      header: 'Damage',
      accessor: (weapon) => weapon.damage || '-',
    },
    {
      header: 'Accuracy',
      accessor: (weapon) => weapon.accuracy || '-',
    },
    {
      header: 'AP',
      accessor: (weapon) => weapon.ap || '-',
    },
    {
      header: 'Source',
      accessor: (weapon) => weapon.source || '-',
    },
    {
      header: 'Availability',
      accessor: (weapon) => weapon.avail || '-',
    },
    {
      header: 'Cost',
      accessor: (weapon) => formatCost(weapon.cost),
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={weapons}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(w) => w.source || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredWeapons}
        getGroupKey={(weapon) => weapon.category || 'Unknown'}
        getGroupLabel={(category) => category}
        columns={columns}
        searchFields={['name', 'category', 'type', 'source']}
        searchPlaceholder="Search weapons by name, category, type, or source..."
        renderItemRow={(weapon, index) => (
          <tr
            key={`${weapon.category}-${weapon.name}-${index}`}
            className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
          >
            <td className="px-4 py-2"></td>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-2 text-gray-300 ${column.className || ''}`}
              >
                {column.accessor(weapon)}
              </td>
            ))}
          </tr>
        )}
      />

      <WeaponViewModal
        weapon={selectedWeapon}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        accessoryMap={accessoryMap}
      />
    </>
  );
}

