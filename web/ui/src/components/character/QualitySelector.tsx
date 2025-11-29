import type { Quality } from '../../lib/types';

interface QualitySelectorProps {
  qualities: Quality[];
  selectedQualities: Array<{ name: string; type: string }>;
  onSelect: (quality: Quality) => void;
  onRemove: (qualityName: string) => void;
  maxKarma?: number;
  usedKarma: number;
  qualityType: 'positive' | 'negative';
}

export function QualitySelector({ 
  qualities, 
  selectedQualities: _selectedQualities, 
  onSelect: _onSelect, 
  onRemove: _onRemove, 
  maxKarma = 25, 
  usedKarma,
  qualityType 
}: QualitySelectorProps) {
  const filteredQualities = qualities.filter(q => q.type === qualityType);
  const remainingKarma = maxKarma - usedKarma;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            {qualityType === 'positive' ? 'Positive' : 'Negative'} Qualities Karma
          </span>
          <span className={`text-lg font-bold ${remainingKarma >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
            {remainingKarma} / {maxKarma} remaining
          </span>
        </div>
      </div>

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400">
          Quality selection interface will be implemented here with search, filtering, and selection capabilities.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Available {qualityType} qualities: {filteredQualities.length}
        </p>
      </div>
    </div>
  );
}

