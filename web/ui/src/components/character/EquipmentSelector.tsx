import type { EquipmentItem } from '../../lib/types';

interface EquipmentSelectorProps {
  nuyenBudget: number;
  usedNuyen: number;
  essence: number;
  onSelect: (equipment: EquipmentItem) => void;
}

export function EquipmentSelector({ nuyenBudget, usedNuyen, essence, onSelect }: EquipmentSelectorProps) {
  const remainingNuyen = nuyenBudget - usedNuyen;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Nuyen</span>
            <span className={`text-lg font-bold ${remainingNuyen >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
              {remainingNuyen} / {nuyenBudget}
            </span>
          </div>
        </div>
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Essence</span>
            <span className="text-lg font-bold text-gray-100">
              {essence.toFixed(2)} / 6.00
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400">
          Equipment selection interface will be implemented here with tabs for weapons, armor, cyberware, bioware, gear, and vehicles.
        </p>
      </div>
    </div>
  );
}

