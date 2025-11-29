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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const skillAllocations = formData.skillAllocations || {};

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
  const usedIndividualPoints = Object.values(skillAllocations).reduce((sum, rating) => sum + (rating || 0), 0);
  const remainingIndividualPoints = availablePoints.individual - usedIndividualPoints;

  // Calculate free knowledge points: (Intuition + Logic) × 2
  const intuition = formData.attributeAllocations?.intuition || 1;
  const logic = formData.attributeAllocations?.logic || 1;
  const freeKnowledgePoints = (intuition + logic) * 2;

  const handleSkillRatingChange = (skillName: string, rating: number) => {
    const newAllocations = { ...skillAllocations, [skillName]: rating };
    setFormData({ ...formData, skillAllocations: newAllocations });
  };

  const handleClearSelections = () => {
    setFormData({ ...formData, skillAllocations: {} });
  };

  const hasSelections = Object.keys(skillAllocations).length > 0 && 
    Object.values(skillAllocations).some(rating => rating > 0);

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

      {/* Native Language */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Native Language</span>
          <span className="text-sm text-gray-400">
            Rating 6, free (English by default)
          </span>
        </div>
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
            const currentRating = skillAllocations[skill.name] || 0;
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

