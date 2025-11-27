import { useState, useEffect, useRef } from 'react';
import { TextField, Input, TextArea, FieldError, Select, Button, Popover, ListBox, ListBoxItem, SelectValue } from 'react-aria-components';
import type { CharacterCreationState } from '../CharacterCreationWizard';
import type { CharacterCreationData } from '../../../lib/types';
import { useAuth } from '../../../contexts/AuthContext';
import { campaignApi } from '../../../lib/api';

interface Step1ConceptProps {
  formData: CharacterCreationState;
  setFormData: (data: CharacterCreationState | ((prev: CharacterCreationState) => CharacterCreationState)) => void;
  creationData: CharacterCreationData | null;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export function Step1Concept({ formData, setFormData, creationData, errors, touched }: Step1ConceptProps) {
  const { user } = useAuth();
  const [userSearchResults, setUserSearchResults] = useState<Array<{ id: string; username: string; email: string }>>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.roles.includes('administrator') || false;

  // Initialize player name with current user's username if not admin
  useEffect(() => {
    if (!isAdmin && user?.username && !formData.playerName) {
      setFormData(prev => ({ ...prev, playerName: user.username }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username, isAdmin]);

  // Search users when player name changes (for admins)
  useEffect(() => {
    if (isAdmin && formData.playerName.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          setIsSearchingUsers(true);
          const results = await campaignApi.searchUsers(formData.playerName);
          setUserSearchResults(results);
          setShowUserDropdown(results.length > 0);
        } catch (err) {
          console.error('Failed to search users:', err);
          setUserSearchResults([]);
          setShowUserDropdown(false);
        } finally {
          setIsSearchingUsers(false);
        }
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setUserSearchResults([]);
      setShowUserDropdown(false);
    }
  }, [formData.playerName, isAdmin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserDropdown]);
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (errors.name && value.trim()) {
      setFormData(prev => ({ ...prev, errors: { ...prev.errors, name: undefined } }));
    }
  };

  const handleNameBlur = () => {
    setFormData(prev => ({ ...prev, touched: { ...prev.touched, name: true } }));
    if (!formData.name.trim()) {
      setFormData(prev => ({ ...prev, errors: { ...prev.errors, name: 'Character name is required' } }));
    }
  };

  const handlePlayerNameChange = (value: string) => {
    setFormData({ ...formData, playerName: value });
    if (errors.playerName && value.trim()) {
      setFormData(prev => ({ ...prev, errors: { ...prev.errors, playerName: undefined } }));
    }
    if (isAdmin) {
      setShowUserDropdown(value.length >= 2);
    }
  };

  const handleUserSelect = (username: string) => {
    setFormData({ ...formData, playerName: username });
    setShowUserDropdown(false);
    setUserSearchResults([]);
  };

  const handlePlayerNameBlur = () => {
    setFormData(prev => ({ ...prev, touched: { ...prev.touched, playerName: true } }));
    if (!formData.playerName.trim()) {
      setFormData(prev => ({ ...prev, errors: { ...prev.errors, playerName: 'Player name is required' } }));
    }
  };

  // Get creation methods from backend data, with fallback to standard SR5 methods
  const creationMethods = (() => {
    const methods = creationData?.creation_methods;
    
    if (methods && typeof methods === 'object' && Object.keys(methods).length > 0) {
      try {
        return Object.entries(methods).map(([key, method]) => ({
          value: key,
          label: method?.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        }));
      } catch (err) {
        console.error('Error mapping creation methods:', err);
      }
    }
    
    // Fallback to standard SR5 creation methods
    return [
      { value: 'priority', label: 'Priority' },
      { value: 'sum_to_ten', label: 'Sum-to-Ten' },
      { value: 'karma', label: 'Karma Point-Buy' },
    ];
  })();

  // Get gameplay levels from backend data
  const gameplayLevels = (() => {
    const levels = creationData?.gameplay_levels;
    
    if (levels && typeof levels === 'object' && Object.keys(levels).length > 0) {
      try {
        return Object.entries(levels).map(([key, level]) => ({
          value: key,
          label: level?.label || key.charAt(0).toUpperCase() + key.slice(1),
          description: level?.description || '',
        }));
      } catch (err) {
        console.error('Error mapping gameplay levels:', err);
      }
    }
    
    // Fallback to standard SR5 gameplay levels
    return [
      { value: 'experienced', label: 'Experienced', description: 'Standard play assumptions from the core rules.' },
      { value: 'street', label: 'Street-Level Play', description: 'Grimier campaigns with lower resources and tighter gear caps.' },
      { value: 'prime', label: 'Prime Runner Play', description: 'High-powered games for elite runners.' },
    ];
  })();

  const handleCreationMethodChange = (method: string) => {
    const newMethod = method as 'priority' | 'sum_to_ten' | 'karma';
    const basePriorities = {
      metatype_priority: '',
      attributes_priority: '',
      magic_priority: '',
      skills_priority: '',
      resources_priority: '',
    };

    if (newMethod === 'priority') {
      setFormData({
        ...formData,
        creationMethod: newMethod,
        priorities: formData.priorities || basePriorities,
        // Default to experienced if not set
        gameplayLevel: formData.gameplayLevel || 'experienced',
      });
    } else if (newMethod === 'sum_to_ten') {
      setFormData({
        ...formData,
        creationMethod: newMethod,
        sumToTen: formData.sumToTen || basePriorities,
        // Default to experienced if not set
        gameplayLevel: formData.gameplayLevel || 'experienced',
      });
    } else {
      setFormData({
        ...formData,
        creationMethod: newMethod,
        // Default to experienced if not set
        gameplayLevel: formData.gameplayLevel || 'experienced',
      });
    }
  };

  const handleGameplayLevelChange = (level: string) => {
    setFormData({ ...formData, gameplayLevel: level as 'experienced' | 'street' | 'prime' });
    // Update priorities/sumToTen if they exist
    if (formData.priorities) {
      setFormData(prev => ({
        ...prev,
        priorities: { ...prev.priorities!, gameplay_level: level },
      }));
    }
    if (formData.sumToTen) {
      setFormData(prev => ({
        ...prev,
        sumToTen: { ...prev.sumToTen!, gameplay_level: level },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Character Concept</h3>
        <p className="text-sm text-gray-400 mb-6">
          Start by providing basic information about your character.
        </p>
      </div>

      {/* Character Name */}
      <TextField
        value={formData.name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        isRequired
        isInvalid={!!errors.name && !!touched.name}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <label className="text-sm font-medium text-gray-300">Character Name</label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
          placeholder="Enter character name"
        />
        {errors.name && touched.name && (
          <FieldError className="text-sm text-sr-danger mt-1">{errors.name}</FieldError>
        )}
      </TextField>

      {/* Player Name */}
      {isAdmin ? (
        <div className="flex flex-col gap-1" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-300">Player Name</label>
          <div className="relative">
            <TextField
              value={formData.playerName}
              onChange={handlePlayerNameChange}
              onBlur={handlePlayerNameBlur}
              isRequired
              isInvalid={!!errors.playerName && !!touched.playerName}
              validationBehavior="aria"
              className="flex flex-col gap-1"
            >
              <Input
                className="w-full px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
                placeholder="Search for a player by username..."
                onFocus={() => {
                  if (formData.playerName.length >= 2 && userSearchResults.length > 0) {
                    setShowUserDropdown(true);
                  }
                }}
              />
            </TextField>
            {isSearchingUsers && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {showUserDropdown && userSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-sr-gray border border-sr-light-gray rounded-md shadow-lg max-h-60 overflow-auto">
                {userSearchResults.map((userResult) => (
                  <button
                    key={userResult.username}
                    type="button"
                    onClick={() => handleUserSelect(userResult.username)}
                    className="w-full px-3 py-2 text-left hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray transition-colors"
                  >
                    <div className="font-medium">{userResult.username}</div>
                    <div className="text-xs text-gray-400">{userResult.email}</div>
                  </button>
                ))}
              </div>
            )}
            {showUserDropdown && userSearchResults.length === 0 && formData.playerName.length >= 2 && !isSearchingUsers && (
              <div className="absolute z-10 w-full mt-1 bg-sr-gray border border-sr-light-gray rounded-md shadow-lg">
                <div className="px-3 py-2 text-sm text-gray-400">No users found</div>
              </div>
            )}
          </div>
          {errors.playerName && touched.playerName && (
            <FieldError className="text-sm text-sr-danger mt-1">{errors.playerName}</FieldError>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Search for a player by typing their username
          </p>
        </div>
      ) : (
        <TextField
          value={formData.playerName}
          onChange={handlePlayerNameChange}
          onBlur={handlePlayerNameBlur}
          isRequired
          isInvalid={!!errors.playerName && !!touched.playerName}
          validationBehavior="aria"
          className="flex flex-col gap-1"
          isReadOnly
        >
          <label className="text-sm font-medium text-gray-300">Player Name</label>
          <Input
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger opacity-75 cursor-not-allowed"
            placeholder="Enter player name"
          />
          {errors.playerName && touched.playerName && (
            <FieldError className="text-sm text-sr-danger mt-1">{errors.playerName}</FieldError>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Using your account username
          </p>
        </TextField>
      )}

      {/* Concept */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Concept / Role</label>
        <TextArea
          value={formData.concept}
          onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent min-h-[100px] resize-y"
          placeholder="Describe your character's concept, role, or archetype (e.g., Street Samurai, Face, Decker, Mage, etc.)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Describe your character's role and concept to help guide creation choices.
        </p>
      </div>

      {/* Character Creation Method */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Character Creation Method</label>
        {creationMethods.length === 0 ? (
          <div className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-400 text-sm">
            Loading creation methods...
          </div>
        ) : (
          <Select
            selectedKey={formData.creationMethod || null}
            onSelectionChange={(key) => {
              if (key) {
                handleCreationMethodChange(key as string);
              }
            }}
            className="flex flex-col gap-1"
            isRequired
            isInvalid={!!errors.creationMethod && !!touched.creationMethod}
            validationBehavior="aria"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left data-[invalid]:border-sr-danger">
              <SelectValue placeholder="Select creation method..." />
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {creationMethods.map((method) => (
                  <ListBoxItem
                    key={method.value}
                    id={method.value}
                    textValue={method.label}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {method.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        )}
        {errors.creationMethod && touched.creationMethod && (
          <p className="text-sm text-sr-danger mt-1">{errors.creationMethod}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Choose how you want to create your character. Priority is the standard method.
        </p>
      </div>

      {/* Gameplay Level - Only show if Priority method is selected */}
      {formData.creationMethod === 'priority' && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Gameplay Level</label>
          {gameplayLevels.length === 0 ? (
            <div className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-400 text-sm">
              Loading gameplay levels...
            </div>
          ) : (
            <Select
              selectedKey={formData.gameplayLevel || null}
              onSelectionChange={(key) => {
                if (key) {
                  handleGameplayLevelChange(key as string);
                }
              }}
              className="flex flex-col gap-1"
              isRequired
              isInvalid={!!errors.gameplayLevel && !!touched.gameplayLevel}
              validationBehavior="aria"
            >
              <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left data-[invalid]:border-sr-danger">
                <SelectValue placeholder="Select gameplay level..." />
              </Button>
              <Popover
                placement="bottom start"
                className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
              >
                <ListBox className="p-1">
                  {gameplayLevels.map((level) => (
                    <ListBoxItem
                      key={level.value}
                      id={level.value}
                      textValue={level.label}
                      className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                    >
                      <div>
                        <div className="font-medium">{level.label}</div>
                        {level.description && (
                          <div className="text-xs text-gray-400 mt-0.5">{level.description}</div>
                        )}
                      </div>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          )}
          {errors.gameplayLevel && touched.gameplayLevel && (
            <p className="text-sm text-sr-danger mt-1">{errors.gameplayLevel}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Gameplay level affects starting resources, karma, and gear restrictions.
          </p>
        </div>
      )}
    </div>
  );
}

