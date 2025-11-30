import { Button, TextField, Input } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData, Tradition, PrioritySelection, SumToTenSelection, Spell, Mentor, Power } from '../../../lib/types';
import { MagicTypeSelector } from '../MagicTypeSelector';
import { traditionApi, spellApi, mentorApi, powerApi } from '../../../lib/api';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useToast } from '../../../contexts/ToastContext';

interface Step3MagicResonanceProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step3MagicResonance({ formData, setFormData, creationData, errors, touched }: Step3MagicResonanceProps) {
  const { showError } = useToast();
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [isLoadingTraditions, setIsLoadingTraditions] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(false);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);
  const [powers, setPowers] = useState<Power[]>([]);
  const [isLoadingPowers, setIsLoadingPowers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [powerSearchTerm, setPowerSearchTerm] = useState('');
  const [detectObjectInputs, setDetectObjectInputs] = useState<Record<string, string>>({});
  const [detectLifeFormInputs, setDetectLifeFormInputs] = useState<Record<string, string>>({});
  
  // Refs for scrolling to next sections
  const traditionSelectionRef = useRef<HTMLDivElement>(null);
  const mentorSelectionRef = useRef<HTMLDivElement>(null);
  const aspectedSkillGroupRef = useRef<HTMLDivElement>(null);
  const spellSelectionRef = useRef<HTMLDivElement>(null);
  const powerSelectionRef = useRef<HTMLDivElement>(null);
  
  // Magic skill groups for Aspected Magicians
  const MAGIC_SKILL_GROUPS = [
    { id: 'Sorcery', name: 'Sorcery', description: 'Spellcasting, Ritual Spellcasting, Counterspelling. Focus on casting spells and magical combat.' },
    { id: 'Conjuring', name: 'Conjuring', description: 'Summoning, Binding, Banishing. Focus on working with spirits and summoning allies.' },
    { id: 'Enchanting', name: 'Enchanting', description: 'Alchemy, Artificing, Disenchanting. Focus on creating magical items and preparations.' },
  ];

  // Physical and Mental attributes that can be affected by Increase/Decrease Attribute spells
  const PHYSICAL_ATTRIBUTES = ['Body', 'Agility', 'Reaction', 'Strength'];
  const MENTAL_ATTRIBUTES = ['Willpower', 'Logic', 'Intuition', 'Charisma'];
  const ALL_ATTRIBUTE_SPELL_ATTRIBUTES = [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES];

  // Check if a spell is an Increase/Decrease Attribute spell
  const isAttributeSpell = (spellName: string): boolean => {
    return spellName.includes('Increase [Attribute]') || spellName.includes('Decrease [Attribute]');
  };

  // Check if a spell is a Detect Object spell
  const isDetectObjectSpell = (spellName: string): boolean => {
    return spellName.includes('Detect [Object]');
  };

  // Check if a spell is a Detect Life Form spell
  const isDetectLifeFormSpell = (spellName: string): boolean => {
    return spellName.includes('Detect [Life Form]');
  };

  // Initialize priorities if they don't exist
  useEffect(() => {
    if (formData.creationMethod === 'priority' && !formData.priorities) {
      const basePriorities: PrioritySelection = {
        metatype_priority: '',
        attributes_priority: '',
        magic_priority: '',
        skills_priority: '',
        resources_priority: '',
        gameplay_level: formData.gameplayLevel || 'experienced',
      };
      setFormData(prev => ({ ...prev, priorities: basePriorities }));
    } else if (formData.creationMethod === 'sum_to_ten' && !formData.sumToTen) {
      const baseSumToTen: SumToTenSelection = {
        metatype_priority: '',
        attributes_priority: '',
        magic_priority: '',
        skills_priority: '',
        resources_priority: '',
        gameplay_level: formData.gameplayLevel || 'experienced',
      };
      setFormData(prev => ({ ...prev, sumToTen: baseSumToTen }));
    }
  }, [formData.creationMethod, formData.gameplayLevel]);

  // Get magic priority from form data
  const magicPriority = formData.creationMethod === 'priority' && formData.priorities
    ? formData.priorities.magic_priority
    : formData.creationMethod === 'sum_to_ten' && formData.sumToTen
    ? formData.sumToTen.magic_priority
    : '';

  const hasMagic = magicPriority && magicPriority !== 'none' && magicPriority !== 'E';
  
  // Get magic rating from priority data (from MagicPriorityData)
  const getMagicRating = () => {
    if (!hasMagic) return 0;
    const priorityData = creationData.priorities?.magic?.[magicPriority];
    // Magic rating comes from MagicPriorityData via the API
    return priorityData?.magic_rating ?? 0;
  };

  const magicRating = getMagicRating();
  
  // Check if magic priority has been selected
  // Only consider it selected if it's a valid priority letter (A-E) and not empty/undefined
  const magicPrioritySelected = magicPriority && magicPriority !== '' && magicPriority !== undefined && ['A', 'B', 'C', 'D', 'E'].includes(magicPriority);

  // Handle magic priority selection
  const handleMagicPriorityChange = (priority: string) => {
    if (formData.creationMethod === 'priority') {
      const updatedPriorities: PrioritySelection = {
        ...(formData.priorities || {
          metatype_priority: '',
          attributes_priority: '',
          magic_priority: '',
          skills_priority: '',
          resources_priority: '',
          gameplay_level: formData.gameplayLevel || 'experienced',
        }),
        magic_priority: priority,
      };
      setFormData(prev => ({ ...prev, priorities: updatedPriorities }));
    } else if (formData.creationMethod === 'sum_to_ten') {
      const updatedSumToTen: SumToTenSelection = {
        ...(formData.sumToTen || {
          metatype_priority: '',
          attributes_priority: '',
          magic_priority: '',
          skills_priority: '',
          resources_priority: '',
          gameplay_level: formData.gameplayLevel || 'experienced',
        }),
        magic_priority: priority,
      };
      setFormData(prev => ({ ...prev, sumToTen: updatedSumToTen }));
    }
  };

  // Get available magic types for the selected priority
  const getAvailableMagicTypes = (): string[] => {
    if (!hasMagic) {
      return [];
    }
    if (!creationData.priorities?.magic?.[magicPriority]) {
      return [];
    }
    const magicOption = creationData.priorities.magic[magicPriority];
    return magicOption.available_types || [];
  };

  const availableTypes = getAvailableMagicTypes();

  // Map priority data types to MagicTypeSelector format
  const typeMapping: Record<string, string> = {
    'Magician': 'magician',
    'Adept': 'adept',
    'Aspected Magician': 'aspected_magician',
    'Mystic Adept': 'mystic_adept',
    'Technomancer': 'technomancer',
  };

  const reverseTypeMapping: Record<string, string> = {
    'magician': 'Magician',
    'adept': 'Adept',
    'aspected_magician': 'Aspected Magician',
    'mystic_adept': 'Mystic Adept',
    'technomancer': 'Technomancer',
  };

  // Convert available types from priority data format to MagicTypeSelector format
  const availableTypeIds = availableTypes
    .map(type => typeMapping[type])
    .filter(Boolean) as string[];


  const loadTraditions = useCallback(async () => {
    try {
      setIsLoadingTraditions(true);
      const data = await traditionApi.getTraditions();
      setTraditions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load traditions';
      showError('Failed to load traditions', errorMessage);
    } finally {
      setIsLoadingTraditions(false);
    }
  }, [showError]);

  // Load traditions when magic type is selected
  useEffect(() => {
    const magicTypeId = formData.magicType;
    if (magicTypeId && (magicTypeId === 'magician' || magicTypeId === 'mystic_adept')) {
      loadTraditions();
    }
  }, [formData.magicType, loadTraditions]);

  const handleMagicTypeSelect = (typeId: string) => {
    // Convert from MagicTypeSelector format to priority data format
    const typeName = reverseTypeMapping[typeId] || typeId;
    
    setFormData({ ...formData, magicType: typeId });
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, magic_type: typeName },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, magic_type: typeName },
      }));
    }
    // Clear tradition and aspected skill group if not needed
    if (typeId !== 'magician' && typeId !== 'mystic_adept' && typeId !== 'aspected_magician') {
      setFormData(prev => ({ ...prev, tradition: undefined, aspectedSkillGroup: undefined }));
    }
    // Clear aspected skill group if switching away from aspected magician
    if (typeId !== 'aspected_magician') {
      setFormData(prev => ({ ...prev, aspectedSkillGroup: undefined }));
    }
    
    // Scroll to aspected skill group selection if needed
    if (typeId === 'aspected_magician') {
      setTimeout(() => {
        aspectedSkillGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    // Scroll to power selection if Adept
    if (typeId === 'adept') {
      setTimeout(() => {
        powerSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
  
  const loadPowers = useCallback(async () => {
    try {
      setIsLoadingPowers(true);
      const data = await powerApi.getPowers();
      setPowers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load powers';
      showError('Failed to load powers', errorMessage);
    } finally {
      setIsLoadingPowers(false);
    }
  }, [showError]);

  // Load powers when Adept is selected
  useEffect(() => {
    if (formData.magicType === 'adept' && !powers.length) {
      loadPowers();
    }
  }, [formData.magicType, powers.length, loadPowers]);
  
  // Calculate power point cost for a power
  // Matches backend calculation in pkg/shadowrun/edition/v5/powers.go
  const calculatePowerCost = (power: Power, level: number = 1): number => {
    if (!power.cost) return 0;
    if (level < 1) level = 1;
    
    const cost = power.cost;
    
    // Check max level
    if (cost.max_level !== undefined && level > cost.max_level) {
      level = cost.max_level;
    }
    
    let totalCost = 0;
    
    // Base cost (applies to all levels)
    if (cost.base_cost !== undefined) {
      totalCost += cost.base_cost;
    }
    
    // Cost per level - multiplied by level directly (not level - 1)
    // If cost_per_level is 0.25: Level 1 = 0.25, Level 2 = 0.5, Level 3 = 0.75
    if (cost.cost_per_level !== undefined) {
      totalCost += cost.cost_per_level * level;
    }
    
    // Cost per item (if applicable, also multiplied by level)
    if (cost.cost_per_item !== undefined) {
      totalCost += cost.cost_per_item * level;
    }
    
    // Additional cost (if any)
    if (cost.additional_cost !== undefined) {
      totalCost += cost.additional_cost;
    }
    
    return totalCost;
  };
  
  // Selected adept powers
  const selectedAdeptPowers = formData.selectedAdeptPowers || [];
  
  // Calculate total power points used
  const totalPowerPointsUsed = useMemo(() => {
    return selectedAdeptPowers.reduce((sum, power) => sum + (power.powerPoints || 0), 0);
  }, [selectedAdeptPowers]);
  
  // Available power points (equal to Magic rating for Adepts)
  const availablePowerPoints = magicRating;
  
  // Handle adept power selection
  const handlePowerSelect = (power: Power, level: number = 1) => {
    if (!power.name) return;
    
    const cost = calculatePowerCost(power, level);
    
    // Check if we have enough power points
    if (totalPowerPointsUsed + cost > availablePowerPoints) {
      return;
    }
    
    // Check if already selected (for variable powers, allow multiple instances)
    const existingPower = selectedAdeptPowers.find(p => p.name === power.name);
    
    if (existingPower) {
      // Update existing power
      const updated = selectedAdeptPowers.map(p => 
        p.name === power.name ? { ...p, level, powerPoints: cost } : p
      );
      setFormData({ ...formData, selectedAdeptPowers: updated });
    } else {
      // Add new power
      const newPowers = [...selectedAdeptPowers, { name: power.name, level, powerPoints: cost }];
      setFormData({ ...formData, selectedAdeptPowers: newPowers });
    }
  };
  
  // Handle adept power removal
  const handlePowerRemove = (powerName: string) => {
    const newPowers = selectedAdeptPowers.filter(p => p.name !== powerName);
    setFormData({ ...formData, selectedAdeptPowers: newPowers });
  };
  
  // Handle power level change
  const handlePowerLevelChange = (power: Power, newLevel: number) => {
    const cost = calculatePowerCost(power, newLevel);
    const existingPower = selectedAdeptPowers.find(p => p.name === power.name);
    
    if (existingPower) {
      const costDifference = cost - existingPower.powerPoints;
      
      // Check if we have enough power points for the new level
      if (totalPowerPointsUsed + costDifference > availablePowerPoints) {
        return;
      }
      
      const updated = selectedAdeptPowers.map(p => 
        p.name === power.name ? { ...p, level: newLevel, powerPoints: cost } : p
      );
      setFormData({ ...formData, selectedAdeptPowers: updated });
    }
  };
  
  // Filter powers by search term
  const filteredPowers = useMemo(() => {
    if (!powerSearchTerm.trim()) return powers;
    const term = powerSearchTerm.toLowerCase();
    return powers.filter(power => 
      power.name?.toLowerCase().includes(term) ||
      power.description?.toLowerCase().includes(term) ||
      power.activation_description?.toLowerCase().includes(term)
    );
  }, [powers, powerSearchTerm]);
  
  // Handle aspected magician skill group selection
  const handleAspectedSkillGroupSelect = (skillGroup: string) => {
    setFormData({ ...formData, aspectedSkillGroup: skillGroup });
  };
  
  const loadMentors = useCallback(async () => {
    try {
      setIsLoadingMentors(true);
      const data = await mentorApi.getMentors();
      setMentors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load mentors';
      showError('Failed to load mentors', errorMessage);
    } finally {
      setIsLoadingMentors(false);
    }
  }, [showError]);

  // Load mentors when Shaman tradition is selected
  useEffect(() => {
    if (formData.tradition === 'The Shaman' && !mentors.length) {
      loadMentors();
    }
  }, [formData.tradition, mentors.length, loadMentors]);
  
  // Handle mentor spirit selection
  const handleMentorSpiritChange = (mentorName: string) => {
    setFormData({ ...formData, mentorSpirit: mentorName });
    
    // Scroll to spell selection after a brief delay
    setTimeout(() => {
      spellSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTraditionChange = (tradition: string) => {
    setFormData({ ...formData, tradition });
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, tradition },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, tradition },
      }));
    }
    
    // If Shaman, scroll to mentor selection; otherwise scroll to spell selection
    if (tradition === 'The Shaman') {
      setTimeout(() => {
        mentorSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (formData.magicType === 'magician' || formData.magicType === 'mystic_adept') {
      setTimeout(() => {
        spellSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const loadSpells = useCallback(async () => {
    try {
      setIsLoadingSpells(true);
      const data = await spellApi.getSpells();
      setSpells(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load spells';
      showError('Failed to load spells', errorMessage);
    } finally {
      setIsLoadingSpells(false);
    }
  }, [showError]);

  // Load spells when tradition is selected (for Magicians, Mystic Adepts, or Aspected Magicians with Sorcery)
  // For Shamans, wait until mentor spirit is selected
  useEffect(() => {
    const shouldLoadSpells = 
      formData.tradition && 
      ((formData.magicType === 'magician' || formData.magicType === 'mystic_adept') ||
       (formData.magicType === 'aspected_magician' && formData.aspectedSkillGroup === 'Sorcery'));
    
    // For Shamans, also require mentor spirit
    if (formData.tradition === 'The Shaman') {
      if (shouldLoadSpells && formData.mentorSpirit) {
        loadSpells();
      }
    } else if (shouldLoadSpells) {
      loadSpells();
    }
  }, [formData.tradition, formData.magicType, formData.aspectedSkillGroup, formData.mentorSpirit, loadSpells]);

  // Get free spells count from priority data
  const getFreeSpellsCount = (): number => {
    if (!hasMagic || !formData.magicType) return 0;
    // Spells available for: Magicians, Mystic Adepts, or Aspected Magicians with Sorcery
    const canHaveSpells = formData.magicType === 'magician' || 
                         formData.magicType === 'mystic_adept' ||
                         (formData.magicType === 'aspected_magician' && formData.aspectedSkillGroup === 'Sorcery');
    
    if (!canHaveSpells) return 0;
    
    const magicOption = creationData.priorities?.magic?.[magicPriority];
    return magicOption?.free_spells ?? 0;
  };

  const freeSpellsCount = getFreeSpellsCount();
  
  // Max spells = Magic Rating x 2 (from character creation rules)
  const maxSpells = magicRating * 2;
  
  // Selected spells
  const selectedSpells = formData.selectedSpells || [];
  
  // Get free benefits based on magic type
  const getFreeBenefits = () => {
    if (!formData.magicType) return null;

    // Get free benefits from priority data
    const magicOption = creationData.priorities?.magic?.[magicPriority];
    if (!magicOption) return null;

    switch (formData.magicType) {
      case 'magician':
      case 'mystic_adept':
        // Free spells come from priority data
        return {
          title: 'Free Spells',
          description: `You receive ${freeSpellsCount} free spells at character creation. Maximum ${maxSpells} spells allowed (Magic Rating × 2).`,
        };
      case 'aspected_magician':
        if (formData.aspectedSkillGroup === 'Sorcery') {
          return {
            title: 'Free Spells',
            description: `You receive ${freeSpellsCount} free spells at character creation. Maximum ${maxSpells} spells allowed (Magic Rating × 2).`,
          };
        }
        return null;
      case 'adept':
        return {
          title: 'Power Points',
          description: `You receive ${magicRating} free Power Points (equal to your Magic rating).`,
        };
      case 'technomancer':
        return {
          title: 'Complex Forms',
          description: `You receive free Complex Forms at character creation based on your priority.`,
        };
      default:
        return null;
    }
  };

  const freeBenefits = getFreeBenefits();
  
  // Handle spell selection
  const handleSpellSelect = (spell: Spell) => {
    if (!spell.name) return;
    
    // Check if already selected
    if (selectedSpells.some(s => s.name === spell.name)) {
      return;
    }
    
    // Check max spells limit
    if (selectedSpells.length >= maxSpells) {
      return;
    }
    
    // Ensure spell has a name before adding
    if (!spell.name) {
      return;
    }
    
    const spellWithTemplate = spell as Spell & { _sourceTemplate?: string };
    const newSpell: { name: string; category?: string; _sourceTemplate?: string } = {
      name: spell.name,
      category: spell.category,
      _sourceTemplate: spellWithTemplate._sourceTemplate
    };
    const newSpells = [...selectedSpells, newSpell];
    setFormData({ ...formData, selectedSpells: newSpells });
  };
  
  // Handle spell removal
  const handleSpellRemove = (spellName: string) => {
    const newSpells = selectedSpells.filter(s => s.name !== spellName);
    setFormData({ ...formData, selectedSpells: newSpells });
  };
  
  // Filter spells by search term
  const filteredSpells = useMemo(() => {
    if (!searchTerm.trim()) return spells;
    const term = searchTerm.toLowerCase();
    return spells.filter(spell => 
      spell.name?.toLowerCase().includes(term) ||
      spell.category?.toLowerCase().includes(term) ||
      spell.description?.toLowerCase().includes(term)
    );
  }, [spells, searchTerm]);
  
  // Group spells by category
  const groupedSpells = useMemo(() => {
    const groups: Record<string, Spell[]> = {};
    filteredSpells.forEach(spell => {
      const category = spell.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(spell);
    });
    return groups;
  }, [filteredSpells]);
  

  // Check if there are selections to clear
  const hasSelections = formData.magicType !== undefined || formData.tradition !== undefined || 
    formData.mentorSpirit !== undefined || formData.aspectedSkillGroup !== undefined ||
    (formData.selectedSpells && formData.selectedSpells.length > 0) ||
    (formData.selectedAdeptPowers && formData.selectedAdeptPowers.length > 0);

  // Handle clear selections (clears magic type, tradition, mentor spirit, skill group, and spells, but keeps priority)
  const handleClearSelections = () => {
    setFormData(prev => ({ 
      ...prev, 
      magicType: undefined,
      tradition: undefined,
      mentorSpirit: undefined,
      aspectedSkillGroup: undefined,
      selectedSpells: [],
      selectedAdeptPowers: [],
    }));
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { 
          ...prev.priorities!, 
          magic_type: undefined,
          tradition: undefined,
        },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { 
          ...prev.sumToTen!, 
          magic_type: undefined,
          tradition: undefined,
        },
      }));
    }
  };

  // Get used priorities and their categories
  const getUsedPriorities = (): Map<string, string> => {
    const used = new Map<string, string>();
    const categoryNames: Record<string, string> = {
      metatype_priority: 'Metatype',
      attributes_priority: 'Attributes',
      skills_priority: 'Skills',
      resources_priority: 'Resources',
    };
    
    if (formData.creationMethod === 'priority' && formData.priorities) {
      Object.entries(formData.priorities).forEach(([key, value]) => {
        if (key.endsWith('_priority') && value && value !== 'none' && value !== '' && key !== 'magic_priority') {
          const categoryName = categoryNames[key] || key.replace('_priority', '').replace(/_/g, ' ');
          used.set(value, categoryName);
        }
      });
    } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
      Object.entries(formData.sumToTen).forEach(([key, value]) => {
        if (key.endsWith('_priority') && value && value !== 'none' && value !== '' && key !== 'magic_priority') {
          const categoryName = categoryNames[key] || key.replace('_priority', '').replace(/_/g, ' ');
          used.set(value, categoryName);
        }
      });
    }
    return used;
  };

  const usedPriorities = getUsedPriorities();
  const PRIORITY_LETTERS = ['A', 'B', 'C', 'D', 'E'];

  // Get available magic types and rating for a priority
  const getMagicOptionsForPriority = (priority: string) => {
    const magicOption = creationData.priorities?.magic?.[priority];
    if (!magicOption) return [];
    
    const availableTypes = magicOption.available_types || [];
    // Use MagicRating from the priority data (from MagicPriorityData)
    const magicRating = magicOption.magic_rating ?? 0;
    
    // Format: "Magician (6 Magic), Adept (6 Magic)" etc.
    return availableTypes.map(type => {
      // Technomancer uses Resonance, others use Magic
      const attributeName = type === 'Technomancer' ? 'Resonance' : 'Magic';
      return `${type} (${magicRating} ${attributeName})`;
    });
  };

  // Priority selection UI for Magic/Resonance
  const renderPrioritySelection = () => {
    return (
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="mb-3">
          <h4 className="text-md font-semibold text-gray-200 mb-1">Select Magic/Resonance Priority</h4>
          <p className="text-xs text-gray-400">
            Choose the priority level (A-E) for Magic or Resonance. This determines your starting Magic/Resonance rating.
          </p>
        </div>
        
        {/* Priority Letter Buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          {PRIORITY_LETTERS.map((priority) => {
            const isSelected = magicPriority === priority;
            const isUsedElsewhere = !isSelected && usedPriorities.has(priority);
            
            return (
              <button
                key={priority}
                type="button"
                onClick={() => handleMagicPriorityChange(priority)}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-md border-2 font-bold text-lg
                  transition-all
                  ${isSelected
                    ? 'bg-sr-accent border-sr-accent text-gray-100 shadow-lg scale-105'
                    : isUsedElsewhere
                    ? 'bg-sr-gray/50 border-sr-light-gray/50 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-sr-gray border-sr-light-gray text-gray-100 hover:bg-sr-light-gray hover:border-sr-accent hover:scale-105 cursor-pointer'
                  }
                `}
                disabled={isUsedElsewhere}
                title={
                  isSelected 
                    ? `Priority ${priority} is assigned to Magic/Resonance`
                    : isUsedElsewhere
                    ? `Priority ${priority} is already assigned to another category`
                    : `Assign Priority ${priority} to Magic/Resonance`
                }
              >
                {priority}
              </button>
            );
          })}
        </div>

        {/* Show available options for each priority */}
        <div className="space-y-2 mt-4">
          <h5 className="text-sm font-semibold text-gray-200">Available Options by Priority:</h5>
          <div className="space-y-2">
            {PRIORITY_LETTERS.map((priority) => {
              const magicOptions = getMagicOptionsForPriority(priority);
              if (magicOptions.length === 0 && priority !== 'E') return null;
              
              const isSelected = magicPriority === priority;
              const isUsedElsewhere = !isSelected && usedPriorities.has(priority);
              
              // For Priority E, show "Mundane (no magic)"
              const optionText = priority === 'E' 
                ? 'Mundane (no magic or resonance)'
                : magicOptions.join(', ');

              return (
                <div
                  key={priority}
                  className={`p-2 rounded-md border text-sm ${
                    isSelected
                      ? 'border-sr-accent bg-sr-accent/10'
                      : isUsedElsewhere
                      ? 'border-sr-light-gray/50 bg-sr-gray/30 opacity-60'
                      : 'border-sr-light-gray bg-sr-gray/50'
                  }`}
                >
                  <span className={`font-semibold ${
                    isSelected ? 'text-sr-accent' : isUsedElsewhere ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    Priority {priority}:{' '}
                  </span>
                  {isUsedElsewhere ? (
                    <span className="text-gray-500 italic">(Assigned to {usedPriorities.get(priority)})</span>
                  ) : (
                    <span className="text-gray-200">{optionText}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {errors.magic_priority && touched.magic_priority && (
          <p className="text-sm text-sr-danger mt-3">{errors.magic_priority}</p>
        )}
      </div>
    );
  };

  // Show priority selection if not selected yet
  if (!magicPrioritySelected) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Magic or Resonance Priority</h3>
          <p className="text-sm text-gray-400 mb-6">
            According to the recommended character creation order, select the Magic or Resonance priority level first. This determines your starting Magic or Resonance attribute value. After selecting the priority, you can choose your magic type and tradition.
          </p>
        </div>
        {renderPrioritySelection()}
      </div>
    );
  }

  // If Priority E is selected (mundane), show priority selection with message
  if (!hasMagic && magicPrioritySelected) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Magic or Resonance Priority</h3>
            <p className="text-sm text-gray-400 mb-6">
              Select the Magic or Resonance priority level. Priority E means your character is mundane (no magic or resonance abilities).
            </p>
          </div>
          <button
            onClick={() => {
              // Clear the priority selection
              if (formData.creationMethod === 'priority' && formData.priorities) {
                setFormData(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities!,
                    magic_priority: '',
                  },
                }));
              } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
                setFormData(prev => ({
                  ...prev,
                  sumToTen: {
                    ...prev.sumToTen!,
                    magic_priority: '',
                  },
                }));
              }
            }}
            className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
          >
            Clear Priority
          </button>
        </div>
        <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
          <p className="text-sm text-yellow-400">
            You selected Priority E for magic/resonance, which means your character is mundane. If you want magical abilities, select a different magic priority (A-D) below.
          </p>
        </div>
        {renderPrioritySelection()}
      </div>
    );
  }

  // If available_types is not in the response, show all types (fallback)
  // This can happen if the API hasn't been updated yet
  const shouldShowAllTypes = hasMagic && availableTypes.length === 0 && magicPriority !== 'E';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Magic or Resonance Priority</h3>
          <p className="text-sm text-gray-400 mb-6">
            According to the recommended character creation order, you should select your Magic or Resonance priority first. This determines your starting Magic or Resonance attribute value. Then select your character's magical or resonance type and tradition (if applicable).
          </p>
        </div>
        {hasSelections && (
          <button
            onClick={handleClearSelections}
            className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
          >
            Clear Selections
          </button>
        )}
      </div>

      {/* Selected Priority Display */}
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Selected Priority</span>
          <Button
            onPress={() => {
              // Clear the priority selection
              if (formData.creationMethod === 'priority' && formData.priorities) {
                setFormData(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities!,
                    magic_priority: '',
                  },
                }));
              } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
                setFormData(prev => ({
                  ...prev,
                  sumToTen: {
                    ...prev.sumToTen!,
                    magic_priority: '',
                  },
                }));
              }
            }}
            className="px-3 py-1.5 text-xs font-medium bg-sr-gray border border-sr-light-gray text-gray-300 rounded hover:bg-sr-light-gray/50 hover:text-gray-100 transition-colors"
          >
            Change Priority
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-sr-accent">Priority {magicPriority}</span>
          <span className="text-sm text-gray-400">
            {formData.magicType === 'technomancer' ? 'Resonance' : 'Magic'} Rating: {magicRating}
          </span>
        </div>
      </div>

      {/* Magic Type Selector */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-200">Select Magic Type</h4>
        {availableTypes.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-400">
              Available types for Priority {magicPriority}: {availableTypes.join(', ')}
            </p>
          </div>
        )}
        {shouldShowAllTypes && (
          <div className="mb-2 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
            <p className="text-xs text-yellow-400">
              Note: Available types data not found. Showing all magic types. Please select based on Priority {magicPriority} rules.
            </p>
          </div>
        )}
        <MagicTypeSelector
          selectedType={formData.magicType}
          onSelect={handleMagicTypeSelect}
          availableTypes={availableTypeIds.length > 0 ? availableTypeIds : undefined}
        />
        {errors.magicType && touched.magicType && (
          <p className="text-sm text-sr-danger">{errors.magicType}</p>
        )}
      </div>

      {/* Aspected Magician Skill Group Selection */}
      {formData.magicType === 'aspected_magician' && (
        <div ref={aspectedSkillGroupRef} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Magic Skill Group</h4>
          <p className="text-sm text-gray-400 mb-3">
            Aspected magicians must choose one specific Magic skill group. Once chosen, you may never take skills from the other Magic skill groups, either at character creation or in the future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MAGIC_SKILL_GROUPS.map((group) => (
              <Button
                key={group.id}
                onPress={() => handleAspectedSkillGroupSelect(group.id)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  formData.aspectedSkillGroup === group.id
                    ? 'border-sr-accent bg-sr-accent/20'
                    : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-100">{group.name}</h4>
                  {formData.aspectedSkillGroup === group.id && (
                    <svg
                      className="w-5 h-5 text-sr-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-400">{group.description}</p>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tradition Selector (for Magicians, Mystic Adepts, and Aspected Magicians after skill group is selected) */}
      {formData.magicType && 
        ((formData.magicType === 'magician' || formData.magicType === 'mystic_adept') ||
         (formData.magicType === 'aspected_magician' && formData.aspectedSkillGroup)) && (
        <div ref={traditionSelectionRef} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Tradition</h4>
          {isLoadingTraditions ? (
            <div className="text-sm text-gray-400">Loading traditions...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {traditions.map((tradition) => {
                const isSelected = formData.tradition === tradition.name;
                return (
                  <Button
                    key={tradition.name}
                    onPress={() => handleTraditionChange(tradition.name || '')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/20'
                        : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-100">{tradition.name}</h4>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-sr-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {tradition.description && (
                      <p className="text-sm text-gray-400">{tradition.description}</p>
                    )}
                    {/* Show element information if available */}
                    {(tradition.combat_element || tradition.detection_element || tradition.health_element || 
                      tradition.illusion_element || tradition.manipulation_element) && (
                      <div className="mt-2 pt-2 border-t border-sr-light-gray/30">
                        <p className="text-xs text-gray-500 mb-1">Elements:</p>
                        <div className="flex flex-wrap gap-1">
                          {tradition.combat_element && (
                            <span className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              Combat: {tradition.combat_element}
                            </span>
                          )}
                          {tradition.detection_element && (
                            <span className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              Detection: {tradition.detection_element}
                            </span>
                          )}
                          {tradition.health_element && (
                            <span className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              Health: {tradition.health_element}
                            </span>
                          )}
                          {tradition.illusion_element && (
                            <span className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              Illusion: {tradition.illusion_element}
                            </span>
                          )}
                          {tradition.manipulation_element && (
                            <span className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              Manipulation: {tradition.manipulation_element}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
          {errors.tradition && touched.tradition && (
            <p className="text-sm text-sr-danger">{errors.tradition}</p>
          )}
        </div>
      )}

      {/* Mentor Spirit Selection (for Shamans after tradition is selected) */}
      {formData.tradition === 'The Shaman' && !formData.mentorSpirit && (
        <div ref={mentorSelectionRef} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Mentor Spirit</h4>
          <p className="text-sm text-gray-400 mb-3">
            Shamans follow a mentor spirit that guides their magical practice. Choose your mentor spirit.
          </p>
          {isLoadingMentors ? (
            <div className="text-sm text-gray-400">Loading mentor spirits...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mentors.map((mentor) => {
                const isSelected = formData.mentorSpirit === mentor.name;
                return (
                  <Button
                    key={mentor.name}
                    onPress={() => handleMentorSpiritChange(mentor.name || '')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/20'
                        : 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-100">{mentor.name}</h4>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-sr-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {mentor.description && (
                      <p className="text-sm text-gray-400">{mentor.description}</p>
                    )}
                    {mentor.similar_archetypes && mentor.similar_archetypes.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-sr-light-gray/30">
                        <p className="text-xs text-gray-500 mb-1">Archetypes:</p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.similar_archetypes.map((arch) => (
                            <span key={arch} className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                              {arch}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Conjuring Information (for Aspected Magicians with Conjuring skill group) */}
      {formData.magicType === 'aspected_magician' && 
        formData.aspectedSkillGroup === 'Conjuring' && 
        formData.tradition && (
        <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-md space-y-3">
          <h4 className="text-md font-semibold text-blue-400">Conjuring Aspected Magician</h4>
          <p className="text-sm text-gray-300">
            As a Conjuring Aspected Magician, you can work with spirits through the skills of <strong>Summoning</strong>, <strong>Binding</strong>, and <strong>Banishing</strong>.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• You can summon spirits of your tradition ({formData.tradition})</p>
            <p>• You can bind spirits for long-term service (up to your Charisma attribute in bound spirits)</p>
            <p>• You can banish spirits to sever their bonds</p>
            <p>• You will select and allocate your Conjuring skills in the Skills step</p>
            <p>• Spirits can be selected and bound during gameplay or in the Karma Spending step</p>
          </div>
        </div>
      )}

      {/* Enchanting Information (for Aspected Magicians with Enchanting skill group) */}
      {formData.magicType === 'aspected_magician' && 
        formData.aspectedSkillGroup === 'Enchanting' && 
        formData.tradition && (
        <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-md space-y-3">
          <h4 className="text-md font-semibold text-purple-400">Enchanting Aspected Magician</h4>
          <p className="text-sm text-gray-300">
            As an Enchanting Aspected Magician, you can create magical items and preparations through the skills of <strong>Alchemy</strong>, <strong>Artificing</strong>, and <strong>Disenchanting</strong>.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• You can create alchemical preparations (lynchpins) with various triggers</p>
            <p>• You can craft foci and magical items through Artificing</p>
            <p>• You can disenchant existing magical items</p>
            <p>• You will select and allocate your Enchanting skills in the Skills step</p>
            <p>• Alchemical preparations can be created during gameplay or in the Karma Spending step</p>
            <p>• Maximum preparations/formulae at creation: Magic Rating × 2</p>
          </div>
        </div>
      )}

      {/* Spell Selection (for Magicians and Mystic Adepts after tradition is selected, or Shamans after mentor spirit, or Sorcery Aspected Magicians) */}
      {formData.tradition && 
        ((formData.magicType === 'magician' || formData.magicType === 'mystic_adept') ||
         (formData.tradition === 'The Shaman' && formData.mentorSpirit) ||
         (formData.magicType === 'aspected_magician' && formData.aspectedSkillGroup === 'Sorcery' && formData.tradition)) && (
        <div ref={spellSelectionRef} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Spells</h4>
          <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Spell Selection</span>
              <span className={`text-lg font-bold ${selectedSpells.length <= maxSpells ? 'text-green-400' : 'text-sr-danger'}`}>
                {selectedSpells.length} / {maxSpells} spells
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Free spells from priority: <strong className="text-gray-100">{freeSpellsCount}</strong> | 
              Maximum allowed: <strong className="text-gray-100">{maxSpells}</strong> (Magic Rating × 2)
            </p>
          </div>

          {/* Search */}
          <TextField className="flex flex-col gap-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search spells..."
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            />
          </TextField>

          {/* Selected Spells */}
          {selectedSpells.length > 0 && (
            <div className="p-3 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
              <h5 className="text-sm font-semibold text-gray-200 mb-2">Selected Spells ({selectedSpells.length}):</h5>
              <div className="flex flex-wrap gap-2">
                {selectedSpells.map((spell) => (
                  <div
                    key={spell.name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md"
                  >
                    <span className="text-sm text-gray-200">{spell.name}</span>
                    {spell.category && (
                      <span className="text-xs text-gray-400">({spell.category})</span>
                    )}
                    <button
                      onClick={() => handleSpellRemove(spell.name!)}
                      className="ml-1 p-1 text-gray-400 hover:text-sr-danger hover:bg-sr-light-gray/50 rounded transition-colors"
                      aria-label={`Remove ${spell.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spells List */}
          {isLoadingSpells ? (
            <div className="text-sm text-gray-400">Loading spells...</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSpells).map(([category, categorySpells]) => (
                <div key={category} className="border border-sr-light-gray rounded-md overflow-hidden">
                  <div className="p-3 bg-sr-light-gray/50 border-b border-sr-light-gray">
                    <h5 className="text-sm font-semibold text-gray-200 capitalize">{category} Spells</h5>
                  </div>
                  <div className="p-3 space-y-2">
                    {categorySpells.map((spell) => {
                      const isSelected = selectedSpells.some(s => s.name === spell.name);
                      const canSelect = !isSelected && selectedSpells.length < maxSpells;
                      const isAttributeModSpell = isAttributeSpell(spell.name || '');
                      const isDetectObjectModSpell = isDetectObjectSpell(spell.name || '');
                      const isDetectLifeFormModSpell = isDetectLifeFormSpell(spell.name || '');
                      const spellKey = spell.name || '';
                      const detectObjectInput = detectObjectInputs[spellKey] || '';
                      const detectLifeFormInput = detectLifeFormInputs[spellKey] || '';
                      
                      return (
                        <div
                          key={spell.name}
                          className={`p-3 rounded-md border ${
                            isSelected
                              ? 'border-sr-accent bg-sr-accent/10'
                              : canSelect
                              ? 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                              : 'border-sr-light-gray/50 bg-sr-gray/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-100">{spell.name}</span>
                                {isSelected && !isAttributeModSpell && !isDetectObjectModSpell && !isDetectLifeFormModSpell && (
                                  <span className="text-xs text-sr-accent font-medium">(Selected)</span>
                                )}
                              </div>
                              
                              {isDetectLifeFormModSpell ? (
                                <div className="space-y-3 mt-2">
                                  {/* Special display for Detect Life Form spells */}
                                  <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-md">
                                    <p className="text-xs text-gray-300 mb-3">
                                      The subject detects all of a specified type of life form within the range of the sense and knows their number and relative location. This is actually several different spells that must be learned separately, one for each type of life form that a caster might like to detect (Detect Orks, Detect Elves, Detect Dragons, and so forth), which are learned separately.
                                    </p>
                                  </div>
                                  
                                  {/* Text input for life form type */}
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-300">Enter the type of life form to detect:</p>
                                    <div className="flex gap-2">
                                      <TextField className="flex-1">
                                        <Input
                                          value={detectLifeFormInput}
                                          onChange={(e) => {
                                            setDetectLifeFormInputs(prev => ({
                                              ...prev,
                                              [spellKey]: e.target.value
                                            }));
                                          }}
                                          placeholder="e.g., Orks, Elves, Dragons"
                                          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                                        />
                                      </TextField>
                                      <Button
                                        onPress={() => {
                                          if (detectLifeFormInput.trim()) {
                                            const spellNameWithLifeForm = spell.name?.replace('[Life Form]', detectLifeFormInput.trim()) || `Detect ${detectLifeFormInput.trim()}`;
                                            const isExtended = spell.name?.includes('Extended');
                                            handleSpellSelect({ 
                                              ...spell, 
                                              name: spellNameWithLifeForm,
                                              _sourceTemplate: isExtended ? 'Detect [Life Form], Extended' : 'Detect [Life Form]'
                                            } as Spell & { _sourceTemplate?: string });
                                            setDetectLifeFormInputs(prev => ({
                                              ...prev,
                                              [spellKey]: ''
                                            }));
                                          }
                                        }}
                                        isDisabled={!detectLifeFormInput.trim() || !canSelect}
                                        className="px-4 py-2 text-xs font-medium bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Add
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-400 italic">
                                      Examples: Orks, Elves, Dragons, Humans, Dwarves, Trolls, etc.
                                    </p>
                                  </div>
                                  
                                  {/* Show selected Detect Life Form variants (regular, not Extended) */}
                                  {selectedSpells.filter(s => {
                                    const spell = s as Spell & { _sourceTemplate?: string };
                                    return spell._sourceTemplate === 'Detect [Life Form]';
                                  }).length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold text-gray-300">Selected Detect Life Form spells:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedSpells
                                          .filter(s => {
                                            const spell = s as Spell & { _sourceTemplate?: string };
                                            return spell._sourceTemplate === 'Detect [Life Form]';
                                          })
                                          .map((selectedSpell) => (
                                            <div
                                              key={selectedSpell.name}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md"
                                            >
                                              <span className="text-sm text-gray-200">{selectedSpell.name}</span>
                                              <button
                                                onClick={() => handleSpellRemove(selectedSpell.name!)}
                                                className="text-sr-danger hover:text-sr-danger/80 text-sm font-bold"
                                                aria-label={`Remove ${selectedSpell.name}`}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Show selected Detect Life Form Extended variants */}
                                  {selectedSpells.filter(s => {
                                    const spell = s as Spell & { _sourceTemplate?: string };
                                    return spell._sourceTemplate === 'Detect [Life Form], Extended';
                                  }).length > 0 && (
                                    <div className="space-y-2 mt-3">
                                      <p className="text-xs font-semibold text-gray-300">Selected Detect Life Form, Extended spells:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedSpells
                                          .filter(s => {
                                            const spell = s as Spell & { _sourceTemplate?: string };
                                            return spell._sourceTemplate === 'Detect [Life Form], Extended';
                                          })
                                          .map((selectedSpell) => (
                                            <div
                                              key={selectedSpell.name}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md"
                                            >
                                              <span className="text-sm text-gray-200">{selectedSpell.name}</span>
                                              <button
                                                onClick={() => handleSpellRemove(selectedSpell.name!)}
                                                className="text-sr-danger hover:text-sr-danger/80 text-sm font-bold"
                                                aria-label={`Remove ${selectedSpell.name}`}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : isDetectObjectModSpell ? (
                                <div className="space-y-3 mt-2">
                                  {/* Special display for Detect Object spells */}
                                  <div className="p-3 bg-purple-900/20 border border-purple-700/50 rounded-md">
                                    <p className="text-xs text-gray-300 mb-3">
                                      The subject detects all of a specified type of object within range of the sense and knows their number and relative location. Each type of object requires a separate spell (Detect Guns, Detect Computers, Detect Explosives, and so forth). These spells must all be learned and cast separately.
                                    </p>
                                  </div>
                                  
                                  {/* Text input for object type */}
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-300">Enter the type of object to detect:</p>
                                    <div className="flex gap-2">
                                      <TextField className="flex-1">
                                        <Input
                                          value={detectObjectInput}
                                          onChange={(e) => {
                                            setDetectObjectInputs(prev => ({
                                              ...prev,
                                              [spellKey]: e.target.value
                                            }));
                                          }}
                                          placeholder="e.g., Guns, Computers, Explosives"
                                          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                                        />
                                      </TextField>
                                      <Button
                                        onPress={() => {
                                          if (detectObjectInput.trim()) {
                                            const spellNameWithObject = spell.name?.replace('[Object]', detectObjectInput.trim()) || `Detect ${detectObjectInput.trim()}`;
                                            handleSpellSelect({ 
                                              ...spell, 
                                              name: spellNameWithObject,
                                              _sourceTemplate: 'Detect [Object]'
                                            } as Spell & { _sourceTemplate?: string });
                                            setDetectObjectInputs(prev => ({
                                              ...prev,
                                              [spellKey]: ''
                                            }));
                                          }
                                        }}
                                        isDisabled={!detectObjectInput.trim() || !canSelect}
                                        className="px-4 py-2 text-xs font-medium bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Add
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-400 italic">
                                      Examples: Guns, Computers, Explosives, Weapons, Electronics, etc.
                                    </p>
                                  </div>
                                  
                                  {/* Show selected Detect Object variants */}
                                  {selectedSpells.filter(s => {
                                    const spell = s as Spell & { _sourceTemplate?: string };
                                    return spell._sourceTemplate === 'Detect [Object]';
                                  }).length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold text-gray-300">Selected Detect Object spells:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedSpells
                                          .filter(s => {
                                            const spell = s as Spell & { _sourceTemplate?: string };
                                            return spell._sourceTemplate === 'Detect [Object]';
                                          })
                                          .map((selectedSpell) => (
                                            <div
                                              key={selectedSpell.name}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md"
                                            >
                                              <span className="text-sm text-gray-200">{selectedSpell.name}</span>
                                              <button
                                                onClick={() => handleSpellRemove(selectedSpell.name!)}
                                                className="text-sr-danger hover:text-sr-danger/80 text-sm font-bold"
                                                aria-label={`Remove ${selectedSpell.name}`}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : isAttributeModSpell ? (
                                <div className="space-y-3 mt-2">
                                  {/* Special display for Increase/Decrease Attribute spells */}
                                  <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-md">
                                    <p className="text-xs text-gray-300 mb-3">
                                      This spell affects Physical and Mental Attributes (not Special Attributes like Edge, Magic, Resonance, Initiative, or Essence).
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                        <p className="text-xs font-semibold text-blue-400 mb-1">Physical Attributes:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {PHYSICAL_ATTRIBUTES.map((attr) => (
                                            <span key={attr} className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                                              {attr}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold text-blue-400 mb-1">Mental Attributes:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {MENTAL_ATTRIBUTES.map((attr) => (
                                            <span key={attr} className="text-xs px-2 py-0.5 bg-sr-light-gray/30 rounded text-gray-300">
                                              {attr}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2 text-xs text-gray-400 border-t border-blue-700/30 pt-2">
                                      <p><strong className="text-gray-300">Force Requirement:</strong> The Force must equal or exceed the (augmented) value of the Attribute being affected.</p>
                                      <p><strong className="text-gray-300">Effect:</strong> The Attribute is {spell.name?.includes('Increase') ? 'increased' : 'decreased'} by hits scored, up to the target's augmented maximum (excess hits are ignored).</p>
                                      <p><strong className="text-gray-300">Limitation:</strong> Each Attribute can only be affected by a single {spell.name?.includes('Increase') ? 'Increase' : 'Decrease'} Attribute spell at a time.</p>
                                      <p><strong className="text-gray-300">Derived Stats:</strong> {spell.name?.includes('Increase') ? 'Increasing' : 'Decreasing'} an Attribute may affect derived statistics (e.g., {spell.name?.includes('Increase') ? 'Increase' : 'Decrease'} Reaction affects Initiative; {spell.name?.includes('Increase') ? 'Increase' : 'Decrease'} Body {spell.name?.includes('Increase') ? 'adds' : 'removes'} Physical Condition Monitor boxes).</p>
                                    </div>
                                  </div>
                                  
                                  {/* Attribute selection buttons */}
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-300">Select which attribute to affect:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {ALL_ATTRIBUTE_SPELL_ATTRIBUTES.map((attr) => {
                                        const spellNameWithAttr = spell.name?.replace('[Attribute]', attr) || `${spell.name} ${attr}`;
                                        const isAttrSelected = selectedSpells.some(s => s.name === spellNameWithAttr);
                                        return (
                                          <Button
                                            key={attr}
                                            onPress={() => {
                                              if (isAttrSelected) {
                                                handleSpellRemove(spellNameWithAttr);
                                              } else {
                                                handleSpellSelect({ ...spell, name: spellNameWithAttr });
                                              }
                                            }}
                                            className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                                              isAttrSelected
                                                ? 'bg-sr-accent border-sr-accent text-gray-100'
                                                : canSelect
                                                ? 'bg-sr-gray border-sr-light-gray text-gray-300 hover:bg-sr-light-gray hover:border-sr-accent'
                                                : 'bg-sr-gray/50 border-sr-light-gray/50 text-gray-500 opacity-50 cursor-not-allowed'
                                            }`}
                                            isDisabled={!canSelect && !isAttrSelected}
                                          >
                                            {isAttrSelected ? '✓ ' : ''}{attr}
                                          </Button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {spell.description && (
                                    <p className="text-xs text-gray-400 line-clamp-2">{spell.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {spell.category && (
                                      <span className="text-xs text-gray-500">Category: {spell.category}</span>
                                    )}
                                    {spell.type && (
                                      <span className="text-xs text-gray-500">Type: {spell.type}</span>
                                    )}
                                    {spell.range && (
                                      <span className="text-xs text-gray-500">Range: {spell.range}</span>
                                    )}
                                    {spell.duration && (
                                      <span className="text-xs text-gray-500">Duration: {spell.duration}</span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            {!isAttributeModSpell && !isDetectObjectModSpell && !isDetectLifeFormModSpell && (
                              <>
                                {isSelected ? (
                                  <Button
                                    onPress={() => handleSpellRemove(spell.name!)}
                                    className="px-3 py-1 text-xs font-medium bg-sr-danger border border-sr-danger rounded-md text-gray-100 hover:bg-sr-danger/80 transition-colors"
                                  >
                                    Remove
                                  </Button>
                                ) : canSelect ? (
                                  <Button
                                    onPress={() => handleSpellSelect(spell)}
                                    className="px-3 py-1 text-xs font-medium bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 transition-colors"
                                  >
                                    Add
                                  </Button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSpells.length >= maxSpells && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
              <p className="text-sm text-yellow-400">
                You have reached the maximum number of spells ({maxSpells}) allowed at character creation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Adept Power Selection (for Adepts) */}
      {formData.magicType === 'adept' && (
        <div ref={powerSelectionRef} className="space-y-3">
          <h4 className="text-md font-semibold text-gray-200">Select Adept Powers</h4>
          <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Power Points</span>
              <span className={`text-lg font-bold ${totalPowerPointsUsed <= availablePowerPoints ? 'text-green-400' : 'text-sr-danger'}`}>
                {totalPowerPointsUsed.toFixed(2)} / {availablePowerPoints} PP
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Adepts receive Power Points equal to their Magic rating ({magicRating} PP). Select powers to spend your Power Points.
            </p>
            {totalPowerPointsUsed > availablePowerPoints && (
              <p className="text-xs text-sr-danger mt-2">
                Warning: You have exceeded your available Power Points!
              </p>
            )}
          </div>

          {/* Search */}
          <TextField className="flex flex-col gap-1">
            <Input
              value={powerSearchTerm}
              onChange={(e) => setPowerSearchTerm(e.target.value)}
              placeholder="Search adept powers..."
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            />
          </TextField>

          {/* Selected Powers */}
          {selectedAdeptPowers.length > 0 && (
            <div className="p-3 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
              <h5 className="text-sm font-semibold text-gray-200 mb-2">Selected Powers ({selectedAdeptPowers.length}):</h5>
              <div className="flex flex-col gap-2">
                {selectedAdeptPowers.map((selectedPower) => {
                  const power = powers.find(p => p.name === selectedPower.name);
                  const costFormula = power?.cost;
                  const requiresLevel = costFormula?.is_variable || costFormula?.cost_per_level !== undefined;
                  
                  return (
                    <div
                      key={selectedPower.name}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">{selectedPower.name}</span>
                          {requiresLevel && selectedPower.level !== undefined && (
                            <span className="text-xs text-gray-400">(Level {selectedPower.level})</span>
                          )}
                          <span className="text-xs text-gray-500">({selectedPower.powerPoints.toFixed(2)} PP)</span>
                        </div>
                      </div>
                      {requiresLevel && power && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-400">Level:</label>
                          <select
                            value={selectedPower.level || 1}
                            onChange={(e) => handlePowerLevelChange(power, parseInt(e.target.value))}
                            className="px-2 py-1 bg-sr-gray border border-sr-light-gray rounded text-sm text-gray-100"
                          >
                            {Array.from({ length: (power.cost?.max_level || 6) }, (_, i) => i + 1).map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <button
                        onClick={() => handlePowerRemove(selectedPower.name)}
                        className="ml-1 p-1 text-gray-400 hover:text-sr-danger hover:bg-sr-light-gray/50 rounded transition-colors"
                        aria-label={`Remove ${selectedPower.name}`}
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

          {/* Powers List */}
          {isLoadingPowers ? (
            <div className="text-sm text-gray-400">Loading adept powers...</div>
          ) : (
            <div className="space-y-3">
              {filteredPowers.map((power) => {
                if (!power.name) return null;
                
                const isSelected = selectedAdeptPowers.some(p => p.name === power.name);
                const baseCost = calculatePowerCost(power, 1);
                const costFormula = power.cost;
                const requiresLevel = costFormula?.is_variable || costFormula?.cost_per_level !== undefined;
                const maxLevel = costFormula?.max_level || 6;
                const canAfford = totalPowerPointsUsed + baseCost <= availablePowerPoints;
                
                return (
                  <div
                    key={power.name}
                    className={`p-3 rounded-md border ${
                      isSelected
                        ? 'border-sr-accent bg-sr-accent/10'
                        : canAfford
                        ? 'border-sr-light-gray bg-sr-gray hover:border-sr-accent/50 hover:bg-sr-light-gray/30'
                        : 'border-sr-light-gray/50 bg-sr-gray/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-100">{power.name}</span>
                          {isSelected && (
                            <span className="text-xs text-sr-accent font-medium">(Selected)</span>
                          )}
                          <span className="text-xs text-gray-500">
                            ({baseCost.toFixed(2)} PP{requiresLevel ? ' base' : ''})
                          </span>
                        </div>
                        {power.description && (
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{power.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {power.activation_description && (
                            <span className="text-xs text-gray-500">Activation: {power.activation_description}</span>
                          )}
                          {power.prerequisite && (
                            <span className="text-xs text-gray-500">Prerequisite: {power.prerequisite}</span>
                          )}
                          {requiresLevel && (
                            <span className="text-xs text-gray-500">Levels: 1-{maxLevel}</span>
                          )}
                          {costFormula?.formula && (
                            <span className="text-xs text-gray-500">Cost: {costFormula.formula}</span>
                          )}
                        </div>
                      </div>
                      {canAfford && (
                        <Button
                          onPress={() => handlePowerSelect(power, 1)}
                          className="px-3 py-1 text-xs font-medium bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 transition-colors"
                          isDisabled={isSelected}
                        >
                          {isSelected ? 'Selected' : 'Add'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPowerPointsUsed >= availablePowerPoints && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
              <p className="text-sm text-yellow-400">
                You have used all available Power Points ({availablePowerPoints} PP).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Free Benefits Display */}
      {freeBenefits && (
        <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-md">
          <h4 className="text-md font-semibold text-green-400 mb-2">{freeBenefits.title}</h4>
          <p className="text-sm text-gray-300">{freeBenefits.description}</p>
        </div>
      )}
    </div>
  );
}

