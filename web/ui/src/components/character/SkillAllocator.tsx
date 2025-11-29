interface SkillAllocatorProps {
  availablePoints: number;
  usedPoints: number;
  onAllocate: (skillName: string, points: number) => void;
}

export function SkillAllocator({ availablePoints, usedPoints, onAllocate: _onAllocate }: SkillAllocatorProps) {
  const remainingPoints = availablePoints - usedPoints;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Skill Points</span>
          <span className={`text-lg font-bold ${remainingPoints >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
            {remainingPoints} / {availablePoints} remaining
          </span>
        </div>
      </div>

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400">
          Skill allocation interface will be implemented here with individual skills, skill groups, and specializations.
        </p>
      </div>
    </div>
  );
}

