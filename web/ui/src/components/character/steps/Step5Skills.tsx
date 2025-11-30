import { useState, useEffect } from 'react';
import { Input, TextField } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, Skill } from '../../../lib/types';
import { skillApi } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

interface Step5SkillsProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Skill points by priority (from SR5 rules)
const SKILL_POINTS: Record<string, { individual: number; group: number }> = {
  A: { individual: 46, group: 10 },
  B: { individual: 36, group: 5 },
  C: { individual: 28, group: 2 },
  D: { individual: 22, group: 0 },
  E: { individual: 18, group: 0 },
};

export function Step5Skills({ formData, setFormData, creationData: _creationData, errors: _errors, touched: _touched }: Step5SkillsProps) {
  const { showError } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languageSkills, setLanguageSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const skillAllocations = formData.skillAllocations || {};

  // Helper to get rating from skill allocation (handles both old number format and new object format)
  const getSkillRating = (skillName: string): number => {
    const allocation = skillAllocations[skillName];
    if (!allocation) return 0;
    if (typeof allocation === 'number') return allocation;
    return allocation.rating || 0;
  };

  // Helper to get specialization from skill allocation
  const getSkillSpecialization = (skillName: string): string | undefined => {
    const allocation = skillAllocations[skillName];
    if (!allocation || typeof allocation === 'number') return undefined;
    return allocation.specialization;
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const data = await skillApi.getSkills();
      // Filter to active skills only
      const activeSkills = data.filter(s => s.type === 'active');
      setSkills(activeSkills);
      // Filter to language skills
      const languages = data.filter(s => s.type === 'language');
      setLanguageSkills(languages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load skills';
      showError('Failed to load skills', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get skill priority
  const skillPriority = formData.creationMethod === 'priority' && formData.priorities
    ? formData.priorities.skills_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen
    ? formData.sumToTen.skills_priority
    : 'E';

  const availablePoints = SKILL_POINTS[skillPriority] || SKILL_POINTS.E;
  
  // Calculate used points
  const usedIndividualPoints = Object.keys(skillAllocations).reduce((sum, skillName) => {
    return sum + getSkillRating(skillName);
  }, 0);
  const remainingIndividualPoints = availablePoints.individual - usedIndividualPoints;

  // Calculate free knowledge points: (Intuition + Logic) × 2
  const intuition = formData.attributeAllocations?.intuition || 1;
  const logic = formData.attributeAllocations?.logic || 1;
  const freeKnowledgePoints = (intuition + logic) * 2;

  const handleSkillRatingChange = (skillName: string, rating: number) => {
    const currentAllocation = skillAllocations[skillName];
    const currentSpecialization = typeof currentAllocation === 'object' ? currentAllocation.specialization : undefined;
    const newAllocations = { 
      ...skillAllocations, 
      [skillName]: { rating, specialization: currentSpecialization }
    };
    setFormData({ ...formData, skillAllocations: newAllocations });
  };

  const handleSkillSpecializationChange = (skillName: string, specialization: string) => {
    const currentRating = getSkillRating(skillName);
    const newAllocations = { 
      ...skillAllocations, 
      [skillName]: { rating: currentRating, specialization: specialization || undefined }
    };
    setFormData({ ...formData, skillAllocations: newAllocations });
  };

  const handleClearSelections = () => {
    setFormData({ ...formData, skillAllocations: {} });
  };

  const hasSelections = Object.keys(skillAllocations).length > 0 && 
    Object.keys(skillAllocations).some(skillName => getSkillRating(skillName) > 0);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = searchTerm === '' || 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(skills.map(s => s.category))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Skills</h3>
        <p className="text-sm text-gray-400 mb-6">
          Allocate skill points and select specializations. You have {availablePoints.individual} individual skill points and {availablePoints.group} skill group points.
        </p>
      </div>

      {/* Skill Points Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Individual Skill Points</span>
            <div className="flex items-center gap-3">
              {hasSelections && (
                <button
                  onClick={handleClearSelections}
                  className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
                >
                  Clear Selections
                </button>
              )}
              <span className={`text-lg font-bold ${remainingIndividualPoints >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
                {remainingIndividualPoints} / {availablePoints.individual}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Used: {usedIndividualPoints} | Priority: {skillPriority}
          </p>
        </div>
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Skill Group Points</span>
            <span className="text-lg font-bold text-gray-100">
              {availablePoints.group} available
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Skill groups not yet implemented
          </p>
        </div>
      </div>

      {/* Free Knowledge Points */}
      <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-400">Free Knowledge Points</span>
          <span className="text-lg font-bold text-green-400">
            {freeKnowledgePoints} points
          </span>
        </div>
        <p className="text-xs text-gray-300 mt-1">
          Calculated as (Intuition {intuition} + Logic {logic}) × 2
        </p>
      </div>

      {/* Selected Skills */}
      {Object.keys(skillAllocations).filter(skill => getSkillRating(skill) > 0).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">
            Selected Skills ({Object.keys(skillAllocations).filter(skill => getSkillRating(skill) > 0).length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(skillAllocations)
              .filter(skillName => getSkillRating(skillName) > 0)
              .map((skillName) => {
                const rating = getSkillRating(skillName);
                const specialization = getSkillSpecialization(skillName);
                return (
                  <div
                    key={skillName}
                    className="flex items-center gap-2 px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md"
                  >
                    <span className="text-sm text-gray-100">
                      {skillName} (Rating {rating})
                      {specialization && <span className="text-xs text-gray-400 ml-1">- {specialization}</span>}
                    </span>
                    <button
                      onClick={() => handleSkillRatingChange(skillName, 0)}
                      className="ml-1 p-1 text-gray-400 hover:text-sr-danger hover:bg-sr-light-gray/50 rounded transition-colors"
                      aria-label={`Remove ${skillName}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Native Language */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Native Language</span>
          <div className="flex items-center gap-2">
            <select
              value={formData.nativeLanguage || 'English'}
              onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
              className="px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            >
              {languageSkills.length > 0 ? (
                languageSkills.map(lang => (
                  <option key={lang.name} value={lang.name}>{lang.name}</option>
                ))
              ) : (
                <option value="English">English</option>
              )}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Rating 6, free. Your native language is automatically included.
        </p>
      </div>

      {/* Language Selection */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Additional Languages</span>
          <span className="text-xs text-gray-400">
            {freeKnowledgePoints} free knowledge points available
          </span>
        </div>
        <div className="space-y-2">
          {(formData.languageSkills || []).map((lang, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={lang.name}
                onChange={(e) => {
                  const updated = [...(formData.languageSkills || [])];
                  updated[index] = { ...updated[index], name: e.target.value };
                  setFormData({ ...formData, languageSkills: updated });
                }}
                className="flex-1 px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
              >
                <option value="">Select language...</option>
                {languageSkills
                  .filter(l => l.name !== formData.nativeLanguage)
                  .map(langSkill => (
                    <option key={langSkill.name} value={langSkill.name}>{langSkill.name}</option>
                  ))}
              </select>
              <TextField
                value={String(lang.rating || 0)}
                onChange={(val) => {
                  const updated = [...(formData.languageSkills || [])];
                  updated[index] = { ...updated[index], rating: parseInt(val, 10) || 0 };
                  setFormData({ ...formData, languageSkills: updated });
                }}
                className="flex flex-col gap-1"
              >
                <Input
                  type="number"
                  min={0}
                  max={6}
                  className="w-16 px-2 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                  placeholder="Rating"
                />
              </TextField>
              <button
                onClick={() => {
                  const updated = (formData.languageSkills || []).filter((_, i) => i !== index);
                  setFormData({ ...formData, languageSkills: updated });
                }}
                className="p-1.5 text-gray-400 hover:text-sr-danger hover:bg-sr-light-gray/50 rounded transition-colors"
                aria-label="Remove language"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const updated = [...(formData.languageSkills || []), { name: '', rating: 0 }];
              setFormData({ ...formData, languageSkills: updated });
            }}
            className="w-full px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-sm hover:bg-sr-light-gray/50 transition-colors"
          >
            + Add Language
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Languages cost 1 knowledge point per rating point. Each language must be purchased separately.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex flex-col gap-1"
        >
          <label className="text-sm font-medium text-gray-300">Search Skills</label>
          <Input
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            placeholder="Search by name or description..."
          />
        </TextField>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading skills...</div>
        ) : filteredSkills.length === 0 ? (
          <p className="text-sm text-gray-400">No skills found.</p>
        ) : (
          filteredSkills.map((skill) => {
            const currentRating = getSkillRating(skill.name);
            const currentSpecialization = getSkillSpecialization(skill.name);
            const hasSpecializations = skill.specializations && skill.specializations.length > 0;
            
            return (
              <div
                key={skill.name}
                className="p-3 border border-sr-light-gray rounded-md bg-sr-gray"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-100">{skill.name}</h5>
                      <span className="text-xs text-gray-500">
                        ({skill.category.replace(/_/g, ' ')})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {skill.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Linked Attribute: {skill.linked_attribute}
                      {skill.skill_group && ` | Group: ${skill.skill_group}`}
                    </p>
                    {/* Specialization Selection - only show when rating > 0 */}
                    {currentRating > 0 && (
                      <div className="mt-3 pt-3 border-t border-sr-light-gray">
                        <label className="text-xs font-medium text-gray-300 mb-1 block">
                          Specialization (optional):
                        </label>
                        <div className="flex items-center gap-2">
                          {hasSpecializations ? (
                            <>
                              <select
                                value={currentSpecialization && skill.specializations?.includes(currentSpecialization) 
                                  ? currentSpecialization 
                                  : currentSpecialization ? 'custom' : ''}
                                onChange={(e) => {
                                  if (e.target.value === 'custom') {
                                    // Switch to custom input - clear specialization so input shows
                                    handleSkillSpecializationChange(skill.name, '');
                                  } else if (e.target.value === '') {
                                    // Clear specialization
                                    handleSkillSpecializationChange(skill.name, '');
                                  } else {
                                    // Select predefined specialization
                                    handleSkillSpecializationChange(skill.name, e.target.value);
                                  }
                                }}
                                className="flex-1 px-2 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                              >
                                <option value="">None</option>
                                {skill.specializations?.map(spec => (
                                  <option key={spec} value={spec}>{spec}</option>
                                ))}
                                <option value="custom">Custom...</option>
                              </select>
                              {/* Show custom input if "Custom..." is selected or if current specialization is not in the predefined list */}
                              {(!currentSpecialization || !skill.specializations?.includes(currentSpecialization)) && (
                                <Input
                                  type="text"
                                  value={currentSpecialization || ''}
                                  onChange={(e) => handleSkillSpecializationChange(skill.name, e.target.value)}
                                  placeholder="Enter custom specialization..."
                                  className="flex-1 px-2 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                                />
                              )}
                            </>
                          ) : (
                            <Input
                              type="text"
                              value={currentSpecialization || ''}
                              onChange={(e) => handleSkillSpecializationChange(skill.name, e.target.value)}
                              placeholder="Enter custom specialization..."
                              className="flex-1 px-2 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                            />
                          )}
                          {currentSpecialization && (
                            <button
                              onClick={() => handleSkillSpecializationChange(skill.name, '')}
                              className="p-1 text-gray-400 hover:text-sr-danger hover:bg-sr-light-gray/50 rounded transition-colors"
                              aria-label="Clear specialization"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {!hasSpecializations && (
                          <p className="text-xs text-gray-500 mt-1">
                            This skill has no predefined specializations. Enter a custom one if desired.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <TextField
                      value={String(currentRating)}
                      onChange={(val) => {
                        const numVal = parseInt(val, 10) || 0;
                        if (numVal >= 0 && numVal <= 6) {
                          handleSkillRatingChange(skill.name, numVal);
                        }
                      }}
                      className="flex flex-col gap-1"
                    >
                      <Input
                        type="number"
                        min={0}
                        max={6}
                        className="w-16 px-2 py-1 bg-sr-gray border border-sr-light-gray rounded text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                      />
                    </TextField>
                    <span className="text-sm text-gray-400">/ 6</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {remainingIndividualPoints < 0 && (
        <div className="p-3 bg-sr-danger/20 border border-sr-danger rounded-md">
          <p className="text-sm text-sr-danger">
            You have allocated {Math.abs(remainingIndividualPoints)} more points than available. Please reduce skill ratings.
          </p>
        </div>
      )}
    </div>
  );
}

