import { useState, useEffect, useMemo, Fragment, useCallback } from 'react';
import { Input, TextField, Button } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, Quality } from '../../../lib/types';
import { qualityApi } from '../../../lib/api';
import { QualityViewModal } from '../../quality/QualityViewModal';
import { useToast } from '../../../contexts/ToastContext';

interface Step4QualitiesProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const STARTING_KARMA = 25;
const MAX_QUALITY_KARMA = 25; // Max 25 karma worth of positive OR negative qualities
const MIN_NET_KARMA = 0; // Can't go below 0 karma

export function Step4Qualities({ formData, setFormData, creationData, errors, touched }: Step4QualitiesProps) {
  const { showError } = useToast();
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Positive', 'Negative']));

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

  // Calculate karma used for positive qualities (costs karma) - memoized to recalculate when selectedQualities changes
  const positiveKarmaUsed = useMemo(() => {
    return selectedQualities
      .filter(q => q.type === 'positive')
      .reduce((sum, q) => {
        const quality = qualities.find(qual => qual.name === q.name);
        return sum + (quality ? Math.abs(calculateKarmaCost(quality)) : 0);
      }, 0);
  }, [selectedQualities, qualities]);

  // Calculate karma gained from negative qualities (gives karma) - memoized to recalculate when selectedQualities changes
  const negativeKarmaGained = useMemo(() => {
    return selectedQualities
      .filter(q => q.type === 'negative')
      .reduce((sum, q) => {
        const quality = qualities.find(qual => qual.name === q.name);
        // Negative quality costs are negative numbers, so we need to make them positive
        const cost = quality ? calculateKarmaCost(quality) : 0;
        return sum + Math.abs(cost); // Negative qualities give karma
      }, 0);
  }, [selectedQualities, qualities]);

  // Net karma = starting karma - positive karma spent + negative karma gained
  const netKarma = useMemo(() => {
    return STARTING_KARMA - positiveKarmaUsed + negativeKarmaGained;
  }, [positiveKarmaUsed, negativeKarmaGained]);

  const handleQualitySelect = (quality: Quality) => {
    const cost = Math.abs(calculateKarmaCost(quality));
    const isPositive = quality.type === 'positive';
    
    // Debug: Log current values
    console.log('Adding quality:', quality.name, {
      cost,
      isPositive,
      positiveKarmaUsed,
      negativeKarmaGained,
      netKarma,
      startingKarma: STARTING_KARMA
    });
    
    if (isPositive) {
      // Check: Can't exceed 25 karma worth of positive qualities (hard cap, separate from total karma pool)
      const newPositiveUsed = positiveKarmaUsed + cost;
      if (newPositiveUsed > MAX_QUALITY_KARMA) {
        showError(
          'Cannot add positive quality',
          `You can only have up to ${MAX_QUALITY_KARMA} karma worth of positive qualities (this limit is separate from your total karma pool). Currently have ${positiveKarmaUsed} karma in positive qualities, adding ${cost} would make ${newPositiveUsed}.`
        );
        return;
      }
      // Check: Net karma can't go below 0
      // Allow spending exactly all remaining karma (netKarma >= cost means newNetKarma >= 0)
      if (netKarma < cost) {
        showError(
          'Insufficient karma',
          `You need ${cost} karma but only have ${netKarma} karma remaining.`
        );
        return;
      }
    } else {
      // Check: Can't exceed 25 karma worth of negative qualities
      const newNegativeGained = negativeKarmaGained + cost;
      if (newNegativeGained > MAX_QUALITY_KARMA) {
        showError(
          'Cannot add negative quality',
          `Cannot exceed ${MAX_QUALITY_KARMA} karma worth of negative qualities.`
        );
        return;
      }
      // Note: No upper limit on net karma (can gain unlimited from negatives, but limited by 25 karma worth of negatives)
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

  const handleClearAll = () => {
    setFormData({ ...formData, selectedQualities: [] });
  };

  // Helper to format karma cost
  const formatKarma = (quality: Quality): string => {
    const cost = quality.cost;
    if (cost.per_rating) {
      if (cost.max_rating > 0) {
        return `${cost.base_cost} per rating (max ${cost.max_rating})`;
      }
      return `${cost.base_cost} per rating`;
    }
    return `${cost.base_cost}`;
  };

  // Helper to get source string
  const getSource = (quality: Quality): string => {
    return quality.source?.source || 'Unknown';
  };

  // Filter and group qualities
  const filteredQualities = useMemo(() => {
    return qualities.filter(q => {
      const matchesSearch = searchTerm === '' || 
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [qualities, searchTerm]);

  // Group qualities by type (Positive/Negative)
  const groupedQualities = useMemo(() => {
    const groups = new Map<string, Quality[]>();
    
    filteredQualities.forEach(quality => {
      const category = quality.type === 'positive' ? 'Positive' : 'Negative';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(quality);
    });

    // Convert to array and sort - Positive first, then Negative
    return Array.from(groups.entries())
      .map(([category, qualityList]) => ({
        category,
        qualities: qualityList.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => {
        // Sort Positive before Negative
        if (a.category === 'Positive' && b.category === 'Negative') return -1;
        if (a.category === 'Negative' && b.category === 'Positive') return 1;
        return 0;
      });
  }, [filteredQualities, expandedGroups]);

  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Positive and Negative Qualities</h3>
        <p className="text-sm text-gray-400 mb-6">
          Select positive and negative qualities for your character. You start with {STARTING_KARMA} karma, and you can spend all of it, some of it, or none of it on qualities. Positive qualities provide gameplay bonuses and require an expenditure of karma (reduce remaining). Negative qualities impose gameplay penalties but give bonus karma that you can spend in other areas (increase remaining). Additionally, at character creation, you can only possess at most {MAX_QUALITY_KARMA} karma worth of positive qualities and {MAX_QUALITY_KARMA} karma worth of negative qualities. Karma remaining cannot go below {MIN_NET_KARMA}. These qualities may affect your maximum attribute and skill levels, so choose them before allocating attributes and skills.
        </p>
      </div>

      {/* Karma Summary */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Karma Remaining</span>
          <div className="flex items-center gap-3">
            {selectedQualities.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
              >
                Clear Selections
              </button>
            )}
            <span className={`text-lg font-bold ${netKarma >= MIN_NET_KARMA ? 'text-green-400' : 'text-sr-danger'}`}>
              {netKarma}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sr-light-gray">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-green-300">Positive Qualities</span>
              <span className={`text-sm font-semibold ${positiveKarmaUsed <= MAX_QUALITY_KARMA ? 'text-green-400' : 'text-sr-danger'}`}>
                {positiveKarmaUsed} / {MAX_QUALITY_KARMA}
              </span>
            </div>
            <div className="text-xs text-gray-400">Karma spent on positive qualities</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-red-300">Negative Qualities</span>
              <span className={`text-sm font-semibold ${negativeKarmaGained <= MAX_QUALITY_KARMA ? 'text-red-400' : 'text-sr-danger'}`}>
                {negativeKarmaGained} / {MAX_QUALITY_KARMA}
              </span>
            </div>
            <div className="text-xs text-gray-400">Karma gained from negative qualities</div>
          </div>
        </div>
        <div className="text-xs text-gray-400 pt-2 border-t border-sr-light-gray">
          Breakdown: {STARTING_KARMA} (starting) - {positiveKarmaUsed} (positive) + {negativeKarmaGained} (negative) = {netKarma}
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

      {/* Grouped Qualities Table */}
      {isLoading ? (
        <div className="text-sm text-gray-400 text-center py-8">Loading qualities...</div>
      ) : (
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sr-light-gray/30 border-b border-sr-light-gray">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12"></th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Karma</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedQualities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No qualities found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  groupedQualities.map((group) => {
                    const groupKarmaUsed = group.category === 'Positive' ? positiveKarmaUsed : negativeKarmaGained;
                    const groupKarmaLimit = MAX_QUALITY_KARMA;
                    const groupSelectedCount = selectedQualities.filter(q => 
                      (group.category === 'Positive' && q.type === 'positive') ||
                      (group.category === 'Negative' && q.type === 'negative')
                    ).length;

                    return (
                      <Fragment key={group.category}>
                        {/* Group Header Row */}
                        <tr
                          className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
                          onClick={() => toggleGroup(group.category)}
                        >
                          <td className="px-4 py-3">
                            <button
                              className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                              aria-label={group.isExpanded ? `Collapse ${group.category}` : `Expand ${group.category}`}
                            >
                              <svg
                                className={`w-5 h-5 transition-transform ${group.isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold px-2 py-1 rounded text-sm ${
                                group.category === 'Positive' 
                                  ? 'bg-green-900/30 text-green-300' 
                                  : 'bg-red-900/30 text-red-300'
                              }`}>
                                {group.category}
                              </span>
                              <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                                {group.qualities.length} {group.qualities.length === 1 ? 'quality' : 'qualities'}
                              </span>
                              {groupSelectedCount > 0 && (
                                <span className="text-xs text-sr-accent bg-sr-accent/20 px-2 py-1 rounded">
                                  {groupSelectedCount} selected
                                </span>
                              )}
                            </div>
                          </td>
                          <td colSpan={2} className="px-4 py-3 text-sm text-gray-400">
                            Click to {group.isExpanded ? 'collapse' : 'expand'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-sm font-semibold ${
                              group.category === 'Positive'
                                ? groupKarmaUsed <= MAX_QUALITY_KARMA ? 'text-green-400' : 'text-sr-danger'
                                : groupKarmaUsed <= MAX_QUALITY_KARMA ? 'text-red-400' : 'text-sr-danger'
                            }`}>
                              {group.category === 'Positive' ? '-' : '+'}{groupKarmaUsed} / {MAX_QUALITY_KARMA}
                            </span>
                          </td>
                          <td className="px-4 py-3"></td>
                        </tr>

                        {/* Group Qualities Rows */}
                        {group.isExpanded && group.qualities.map((quality, index) => {
                          const isSelected = selectedQualities.some(q => q.name === quality.name);
                          const rawCost = calculateKarmaCost(quality);
                          const cost = Math.abs(rawCost);
                          const isPositive = quality.type === 'positive';
                          
                          // Only calculate canAdd for unselected qualities
                          let canAdd = false;
                          if (!isSelected) {
                            if (isPositive) {
                              // Can add if: 
                              // 1. positive karma used + cost <= 25 (max positive quality karma)
                              // 2. net karma >= cost (must have enough karma remaining - allows spending exactly all remaining)
                              const newPositiveUsed = positiveKarmaUsed + cost;
                              const withinMaxPositive = newPositiveUsed <= MAX_QUALITY_KARMA;
                              const hasEnoughKarma = netKarma >= cost;
                              canAdd = withinMaxPositive && hasEnoughKarma;
                            } else {
                              // Can add if: negative karma gained + cost <= 25 (max negative quality karma)
                              canAdd = (negativeKarmaGained + cost) <= MAX_QUALITY_KARMA;
                            }
                          }

                          return (
                            <tr
                              key={`${group.category}-${quality.name}-${index}`}
                              className={`border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors ${
                                isSelected ? 'bg-sr-accent/10' : ''
                              }`}
                            >
                              <td className="px-4 py-2"></td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleQualityClick(quality)}
                                  className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
                                >
                                  {quality.name}
                                  {isSelected && (
                                    <span className="ml-2 text-xs text-sr-accent">(Selected)</span>
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-2">
                                <p className="text-xs text-gray-400 line-clamp-2">
                                  {quality.description || 'No description available'}
                                </p>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`font-semibold ${
                                  quality.cost.base_cost < 0 ? 'text-red-400' : 'text-green-400'
                                }`}>
                                  {formatKarma(quality)}
                                </span>
                              </td>
                              <td className="px-4 py-2">
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
                                    className="px-3 py-1 text-xs bg-sr-accent/20 border border-sr-accent rounded text-sr-accent hover:bg-sr-accent/30 cursor-pointer"
                                  >
                                    Add
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quality Detail Modal */}
      {selectedQuality && (
        <QualityViewModal
          quality={selectedQuality}
          isOpen={isModalOpen}
          onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) {
              setSelectedQuality(null);
            }
          }}
        />
      )}
    </div>
  );
}

