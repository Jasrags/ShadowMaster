import { useState, useEffect } from 'react';
import { Input, TextField } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, Quality } from '../../../lib/types';
import { qualityApi } from '../../../lib/api';
import { QualitySelector } from '../QualitySelector';
import { QualityViewModal } from '../../quality/QualityViewModal';

interface Step4QualitiesProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const MAX_QUALITY_KARMA = 25;

export function Step4Qualities({ formData, setFormData, creationData, errors, touched }: Step4QualitiesProps) {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedQualities = formData.selectedQualities || [];

  useEffect(() => {
    loadQualities();
  }, []);

  const loadQualities = async () => {
    try {
      setIsLoading(true);
      const data = await qualityApi.getQualities();
      setQualities(data);
    } catch (err) {
      console.error('Failed to load qualities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKarmaCost = (quality: Quality): number => {
    if (quality.cost.per_rating) {
      return quality.cost.base_cost; // For now, use base cost (rating selection would be added later)
    }
    return quality.cost.base_cost;
  };

  const getUsedKarma = (type: 'positive' | 'negative'): number => {
    return selectedQualities
      .filter(q => q.type === type)
      .reduce((sum, q) => {
        const quality = qualities.find(qual => qual.name === q.name);
        return sum + (quality ? calculateKarmaCost(quality) : 0);
      }, 0);
  };

  const positiveKarmaUsed = getUsedKarma('positive');
  const negativeKarmaUsed = getUsedKarma('negative');
  const negativeKarmaGained = -negativeKarmaUsed; // Negative qualities give karma

  const handleQualitySelect = (quality: Quality) => {
    const cost = calculateKarmaCost(quality);
    const usedKarma = getUsedKarma(quality.type);
    
    if (quality.type === 'positive' && usedKarma + cost > MAX_QUALITY_KARMA) {
      return; // Can't exceed max
    }
    if (quality.type === 'negative' && usedKarma + cost > MAX_QUALITY_KARMA) {
      return; // Can't exceed max
    }

    const newQualities = [...selectedQualities, { name: quality.name, type: quality.type }];
    setFormData({ ...formData, selectedQualities: newQualities });
  };

  const handleQualityRemove = (qualityName: string) => {
    const newQualities = selectedQualities.filter(q => q.name !== qualityName);
    setFormData({ ...formData, selectedQualities: newQualities });
  };

  const handleQualityClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setIsModalOpen(true);
  };

  const filteredQualities = (type: 'positive' | 'negative') => {
    return qualities.filter(q => {
      const matchesType = q.type === type;
      const matchesSearch = searchTerm === '' || 
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesType && matchesSearch;
    });
  };

  const positiveQualities = filteredQualities('positive');
  const negativeQualities = filteredQualities('negative');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Qualities</h3>
        <p className="text-sm text-gray-400 mb-6">
          Select positive and negative qualities for your character (max {MAX_QUALITY_KARMA} karma each).
        </p>
      </div>

      {/* Karma Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Positive Qualities</span>
            <span className={`text-lg font-bold ${positiveKarmaUsed <= MAX_QUALITY_KARMA ? 'text-green-400' : 'text-sr-danger'}`}>
              {positiveKarmaUsed} / {MAX_QUALITY_KARMA} karma
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Selected: {selectedQualities.filter(q => q.type === 'positive').length}
          </p>
        </div>
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Negative Qualities</span>
            <span className={`text-lg font-bold ${negativeKarmaUsed <= MAX_QUALITY_KARMA ? 'text-green-400' : 'text-sr-danger'}`}>
              {negativeKarmaUsed} / {MAX_QUALITY_KARMA} karma
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Selected: {selectedQualities.filter(q => q.type === 'negative').length} | Karma gained: {negativeKarmaGained}
          </p>
        </div>
      </div>

      {/* Search */}
      <TextField
        value={searchTerm}
        onChange={setSearchTerm}
        className="flex flex-col gap-1"
      >
        <label className="text-sm font-medium text-gray-300">Search Qualities</label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="Search by name or description..."
        />
      </TextField>

      {/* Positive Qualities */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-200">Positive Qualities</h4>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading qualities...</div>
        ) : (
          <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30 max-h-60 overflow-y-auto">
            {positiveQualities.length === 0 ? (
              <p className="text-sm text-gray-400">No positive qualities found.</p>
            ) : (
              positiveQualities.map((quality) => {
                const isSelected = selectedQualities.some(q => q.name === quality.name);
                const cost = calculateKarmaCost(quality);
                return (
                  <div
                    key={quality.name}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/20'
                        : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                    }`}
                    onClick={() => handleQualityClick(quality)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-100">{quality.name}</h5>
                          {isSelected && (
                            <span className="text-xs text-sr-accent">(Selected)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {quality.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Cost: {cost} karma</span>
                          {quality.cost.per_rating && (
                            <span className="text-xs text-gray-500">(per rating)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {isSelected ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQualityRemove(quality.name);
                            }}
                            className="px-3 py-1 text-xs bg-sr-danger/20 border border-sr-danger rounded text-sr-danger hover:bg-sr-danger/30"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQualitySelect(quality);
                            }}
                            disabled={positiveKarmaUsed + cost > MAX_QUALITY_KARMA}
                            className="px-3 py-1 text-xs bg-sr-accent/20 border border-sr-accent rounded text-sr-accent hover:bg-sr-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Negative Qualities */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-200">Negative Qualities</h4>
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading qualities...</div>
        ) : (
          <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30 max-h-60 overflow-y-auto">
            {negativeQualities.length === 0 ? (
              <p className="text-sm text-gray-400">No negative qualities found.</p>
            ) : (
              negativeQualities.map((quality) => {
                const isSelected = selectedQualities.some(q => q.name === quality.name);
                const cost = calculateKarmaCost(quality);
                return (
                  <div
                    key={quality.name}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/20'
                        : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                    }`}
                    onClick={() => handleQualityClick(quality)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-100">{quality.name}</h5>
                          {isSelected && (
                            <span className="text-xs text-sr-accent">(Selected)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {quality.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Karma: {cost}</span>
                          {quality.cost.per_rating && (
                            <span className="text-xs text-gray-500">(per rating)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {isSelected ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQualityRemove(quality.name);
                            }}
                            className="px-3 py-1 text-xs bg-sr-danger/20 border border-sr-danger rounded text-sr-danger hover:bg-sr-danger/30"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQualitySelect(quality);
                            }}
                            disabled={negativeKarmaUsed + cost > MAX_QUALITY_KARMA}
                            className="px-3 py-1 text-xs bg-sr-accent/20 border border-sr-accent rounded text-sr-accent hover:bg-sr-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quality Detail Modal */}
      {selectedQuality && (
        <QualityViewModal
          quality={selectedQuality}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuality(null);
          }}
        />
      )}
    </div>
  );
}

