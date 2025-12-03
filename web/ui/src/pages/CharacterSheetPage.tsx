import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Input, Label, Button } from 'react-aria-components';
import type { CharacterState, Character, User } from '../lib/types';
import { charactersApi, usersApi } from '../lib/api';
import { PrioritySelection, type PriorityAssignment, type PriorityLevel } from '../components/characters/PrioritySelection';

function CharacterStateBadge({ state }: { state: CharacterState }) {
  const getStateDisplay = (state: CharacterState): string => {
    switch (state) {
      case 'creation':
        return 'Creation';
      case 'gm_review':
        return 'GM Review';
      case 'advancement':
        return 'Advancement';
      default:
        return state;
    }
  };

  const getBadgeClass = (state: CharacterState): string => {
    switch (state) {
      case 'creation':
        return 'badge-cyber-warning';
      case 'advancement':
        return 'badge-cyber-success';
      default:
        return 'badge-cyber-accent';
    }
  };

  return (
    <span className={getBadgeClass(state)}>
      {getStateDisplay(state)}
    </span>
  );
}

export function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [player, setPlayer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [priorityAssignment, setPriorityAssignment] = useState<PriorityAssignment | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadCharacter = async () => {
      setIsLoading(true);
      setError('');
      try {
        const charData = await charactersApi.getCharacter(id);
        setCharacter(charData);

        // Load priority assignment if it exists
        if (charData.priority_assignment) {
          const assignment: PriorityAssignment = {
            metatype: (charData.priority_assignment.metatype as PriorityLevel) || '',
            selected_metatype: charData.priority_assignment.selected_metatype || undefined,
            attributes: (charData.priority_assignment.attributes as PriorityLevel) || '',
            magic_resonance: (charData.priority_assignment.magic_resonance as PriorityLevel) || '',
            skills: (charData.priority_assignment.skills as PriorityLevel) || '',
            resources: (charData.priority_assignment.resources as PriorityLevel) || '',
          };
          setPriorityAssignment(assignment);
        }

        // Fetch the user (player) data
        if (charData.user_id) {
          try {
            const userData = await usersApi.getUser(charData.user_id);
            setPlayer(userData);
          } catch (err) {
            console.error('Failed to load player:', err);
            // Don't fail the whole page if user lookup fails
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center text-gray-400">Loading character...</div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center text-sr-danger">
            Error: {error || 'Character not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-sr-light-gray">
          <div className="flex flex-col gap-2">
            <h1 className="font-tech text-4xl text-glow-cyan">SHADOWRUN</h1>
            {/* Character State Badge */}
            <div>
              <CharacterStateBadge state={character.state} />
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <TextField className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-gray-400 uppercase">CHARACTER</Label>
              <Input
                className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                         data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                         data-[focus-visible]:ring-sr-accent min-w-[200px]"
                value={character.name}
                readOnly
              />
            </TextField>
            <TextField className="flex flex-col gap-1" isReadOnly>
              <Label className="text-xs font-medium text-gray-400 uppercase">PLAYER</Label>
              <Input
                className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                         min-w-[200px] pointer-events-none"
                value={player?.username || ''}
                placeholder="Loading..."
                tabIndex={-1}
                onFocus={(e) => e.target.blur()}
              />
            </TextField>
            <TextField className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-gray-400 uppercase">NOTES</Label>
              <Input
                className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                         data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                         data-[focus-visible]:ring-sr-accent min-w-[200px]"
                placeholder="Notes"
              />
            </TextField>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button
            onPress={async () => {
              setIsValidating(true);
              try {
                // TODO: Implement validation logic
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation
                alert('Character validation passed!');
              } catch (err) {
                alert('Validation failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
              } finally {
                setIsValidating(false);
              }
            }}
            isDisabled={isValidating || isSaving}
            className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                     data-[hovered]:bg-sr-accent/80 
                     data-[pressed]:bg-sr-accent-dark
                     data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                     data-[focus-visible]:outline-2 data-[focus-visible]:outline-sr-accent 
                     transition-colors font-medium"
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
          <Button
            onPress={async () => {
              setIsSaving(true);
              try {
                // TODO: Implement save logic
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
                alert('Character saved successfully!');
              } catch (err) {
                alert('Save failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
              } finally {
                setIsSaving(false);
              }
            }}
            isDisabled={isValidating || isSaving}
            className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                     data-[hovered]:bg-sr-accent/80 
                     data-[pressed]:bg-sr-accent-dark
                     data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                     data-[focus-visible]:outline-2 data-[focus-visible]:outline-sr-accent 
                     transition-colors font-medium"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onPress={() => navigate('/characters')}
            isDisabled={isValidating || isSaving}
            className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 
                     data-[hovered]:bg-sr-gray/80 
                     data-[pressed]:bg-sr-darker
                     data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                     data-[focus-visible]:outline-2 data-[focus-visible]:outline-sr-light-gray 
                     transition-colors font-medium"
          >
            Close
          </Button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Data */}
            <Section title="PERSONAL DATA">
              <div className="grid grid-cols-2 gap-4">
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">NAME/PRIMARY ALIAS</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="Character Name"
                  />
                </TextField>
                <div className="grid grid-cols-2 gap-2">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Metatype</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Ethnicity</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Age</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Sex</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Height</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Weight</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <TextField className="flex flex-col gap-1" isReadOnly>
                    <Label className="text-xs font-medium text-gray-400">Street Cred</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="0"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1" isReadOnly>
                    <Label className="text-xs font-medium text-gray-400">Notoriety</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="0"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Public Awareness</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="0"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <TextField className="flex flex-col gap-1" isReadOnly>
                    <Label className="text-xs font-medium text-gray-400">Karma</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="0"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1" isReadOnly >
                    <Label className="text-xs font-medium text-gray-400">Total Karma</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="0"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Misc</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
              </div>
            </Section>

            {/* Attributes */}
            <Section title="ATTRIBUTES">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <AttributeFieldWithControls label="Body" />
                  <AttributeFieldWithControls label="Agility" />
                  <AttributeFieldWithControls label="Reaction" />
                  <AttributeFieldWithControls label="Strength" />
                  <AttributeFieldWithControls label="Willpower" />
                  <AttributeFieldWithControls label="Logic" />
                  <AttributeFieldWithControls label="Intuition" />
                  <AttributeFieldWithControls label="Charisma" />
                  <div className="flex items-center gap-2">
                    <AttributeFieldWithControls label="Edge" />
                    <div className="flex gap-1 mt-5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-sr-light-gray bg-sr-darker"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 mt-5">Edge Points</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <AttributeFieldWithControls label="Magic" />
                  <AttributeFieldWithControls label="Resonance" />
                  <AttributeField label="Essence" />
                  <AttributeField label="Initiative" />
                  <AttributeField label="Matrix Initiative" />
                  <AttributeField label="Astral Initiative" />
                  <AttributeField label="Composure" />
                  <AttributeField label="Judge Intentions" />
                  <AttributeField label="Memory" />
                  <AttributeField label="Lift/Carry" />
                  <AttributeField label="Movement" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-sr-light-gray">
                <div>
                  <Label className="text-xs font-medium text-gray-400">Physical Limit:</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm mt-1
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent w-full"
                    placeholder="—"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-400">Mental Limit:</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm mt-1
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent w-full"
                    placeholder="—"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-400">Social Limit:</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm mt-1
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent w-full"
                    placeholder="—"
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Priority Assignment (shown during creation with priority method) or Core Combat Info */}
            {character.state === 'creation' && character.edition_data.creation_method === 'priority' ? (
              <Section title="PRIORITY ASSIGNMENT">
                <PrioritySelection
                  playLevel={character.edition_data.play_level || 'experienced'}
                  onAssignmentChange={async (assignment) => {
                    setPriorityAssignment(assignment);
                    // Save assignment to backend
                    try {
                      // Build priority assignment object, only including defined values
                      const priorityAssignment: any = {};
                      if (assignment.metatype) priorityAssignment.metatype = assignment.metatype;
                      if (assignment.selected_metatype) priorityAssignment.selected_metatype = assignment.selected_metatype;
                      if (assignment.attributes) priorityAssignment.attributes = assignment.attributes;
                      if (assignment.magic_resonance) priorityAssignment.magic_resonance = assignment.magic_resonance;
                      if (assignment.skills) priorityAssignment.skills = assignment.skills;
                      if (assignment.resources) priorityAssignment.resources = assignment.resources;

                      await charactersApi.updateCharacter(character.id, {
                        priority_assignment: priorityAssignment,
                      });
                      // Reload character to get updated attributes
                      const updatedChar = await charactersApi.getCharacter(character.id);
                      setCharacter(updatedChar);
                    } catch (err) {
                      console.error('Failed to save priority assignment:', err);
                    }
                  }}
                  initialAssignment={priorityAssignment || undefined}
                />
              </Section>
            ) : (
              <Section title="CORE COMBAT INFO">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-400">Primary Armor</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Armor Name"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Rating"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-400">Primary Ranged Weapon</Label>
                    <div className="grid grid-cols-7 gap-1 mt-1 text-xs">
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent col-span-2"
                        placeholder="Weapon"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Dam"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Acc"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="AP"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Mode"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="RC"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Ammo"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-400">Primary Melee Weapon</Label>
                    <div className="grid grid-cols-5 gap-1 mt-1 text-xs">
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Weapon"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Reach"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Dam"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Acc"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="AP"
                      />
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Condition Monitor */}
            <Section title="CONDITION MONITOR">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-medium text-gray-400 mb-2 block">Physical Damage Track</Label>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const row = Math.floor(i / 2);
                      const col = i % 2;
                      const penalty = col === 1 && row < 6 ? -(row + 1) : null;
                      return (
                        <div key={i} className="relative">
                          <div className="w-full h-8 border border-sr-light-gray bg-sr-darker rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">{i + 1}</span>
                          </div>
                          {penalty && (
                            <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              {penalty}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Characters have 8 + (Body + 2, round up) boxes on the physical damage track; black out extra boxes.
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-400 mb-2 block">Stun Damage Track</Label>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const row = Math.floor(i / 2);
                      const col = i % 2;
                      const penalty = col === 1 && row < 5 ? -(row + 1) : null;
                      return (
                        <div key={i} className="relative">
                          <div className="w-full h-8 border border-sr-light-gray bg-sr-darker rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">{i + 1}</span>
                          </div>
                          {penalty && (
                            <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              {penalty}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Characters have 8 + (Will + 2, round up) boxes on the stun damage track; black out extra boxes.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-sr-light-gray">
                <Label className="text-xs font-medium text-gray-400 block mb-2">Overflow</Label>
                <p className="text-xs text-gray-400">
                  For every 3 boxes of damage on any one damage track, the character takes a -1 Dice Pool modifier on tests; these modifiers are cumulative within and across damage tracks, see Wound Modifiers, p. 169.
                </p>
              </div>
            </Section>
          </div>
        </div>

        {/* Skills Section - Full Width */}
        <Section title="SKILLS" className="mb-6">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((col) => (
              <div key={col}>
                <TableHeader className="grid-cols-[1fr_60px_60px]">
                  <TableHeaderCell>Skill</TableHeaderCell>
                  <TableHeaderCell>RTG</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                </TableHeader>
                <div className="space-y-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[1fr_60px_60px] gap-2">
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="Skill name"
                      />
                      <Input
                        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                                 data-[focus-visible]:ring-sr-accent"
                        placeholder="0"
                      />
                      <div className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-400 text-xs flex items-center">
                        A/K
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Bottom Sections - Two Columns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left: IDs / Lifestyles / Currency */}
          <Section title="IDS / LIFESTYLES / CURRENCY">
            <div className="space-y-4">
              <TextField className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-400">Primary Lifestyle</Label>
                <Input
                  className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                           data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                           data-[focus-visible]:ring-sr-accent"
                  placeholder="—"
                />
              </TextField>
              <TextField className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-400">Nuyen</Label>
                <Input
                  className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                           data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                           data-[focus-visible]:ring-sr-accent"
                  placeholder="0"
                />
              </TextField>
              <TextField className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-400">Licenses</Label>
                <Input
                  className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                           data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                           data-[focus-visible]:ring-sr-accent"
                  placeholder="—"
                />
              </TextField>
              <TextField className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-400">Fake IDs / Related Lifestyles / Funds / Licenses</Label>
                <textarea
                  className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm min-h-[100px]
                           focus:outline-none focus:ring-1 focus:ring-sr-accent resize-none"
                  placeholder="—"
                />
              </TextField>
            </div>
          </Section>

          {/* Right: Qualities */}
            <Section title="QUALITIES">
              <TableHeader className="grid-cols-[1fr_1fr_60px]">
                <TableHeaderCell>Quality</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
              </TableHeader>
            <div className="space-y-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_60px] gap-2">
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="Quality name"
                  />
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="Notes"
                  />
                  <div className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-400 text-xs flex items-center">
                    P/N
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Contacts Section */}
        <div className="mb-6">
          <Section title="CONTACTS">
            <TableHeader className="grid-cols-[1fr_80px_80px_80px]">
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Loyalty</TableHeaderCell>
              <TableHeaderCell>Connection</TableHeaderCell>
              <TableHeaderCell>Favor</TableHeaderCell>
            </TableHeader>
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_80px_80px] gap-2">
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="Contact name"
                  />
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="0"
                  />
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="0"
                  />
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Equipment Sections - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column Equipment */}
          <div className="space-y-6">
            {/* Ranged Weapons */}
            <Section title="RANGED WEAPONS">
              <TableHeader className="grid-cols-[1fr_50px_50px_50px_60px_50px_60px]">
                <TableHeaderCell>Weapon</TableHeaderCell>
                <TableHeaderCell>Dam</TableHeaderCell>
                <TableHeaderCell>Acc</TableHeaderCell>
                <TableHeaderCell>AP</TableHeaderCell>
                <TableHeaderCell>Mode</TableHeaderCell>
                <TableHeaderCell>RC</TableHeaderCell>
                <TableHeaderCell>Ammo</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_50px_50px_50px_60px_50px_60px] gap-1">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Weapon name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Armor */}
            <Section title="ARMOR">
              <TableHeader className="grid-cols-[1fr_80px_1fr]">
                <TableHeaderCell>Armor</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_1fr] gap-2">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Armor name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Notes"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Augmentations */}
            <Section title="AUGMENTATIONS">
              <TableHeader className="grid-cols-[1fr_80px_1fr_80px]">
                <TableHeaderCell>Augmentation</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
                <TableHeaderCell>Essence</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_1fr_80px] gap-2">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Augmentation name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Notes"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Gear */}
            <Section title="GEAR">
              <TableHeader className="grid-cols-[1fr_80px]">
                <TableHeaderCell>Item</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px] gap-2">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Item name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Right Column Equipment */}
          <div className="space-y-6">
            {/* Melee Weapons */}
            <Section title="MELEE WEAPONS">
              <TableHeader className="grid-cols-[1fr_60px_50px_50px_50px]">
                <TableHeaderCell>Weapon</TableHeaderCell>
                <TableHeaderCell>Reach</TableHeaderCell>
                <TableHeaderCell>Dam</TableHeaderCell>
                <TableHeaderCell>Acc</TableHeaderCell>
                <TableHeaderCell>AP</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_50px_50px_50px] gap-1">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Weapon name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Cyberdeck */}
            <Section title="CYBERDECK">
              <div className="space-y-3">
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Model</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="—"
                  />
                </TextField>
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Attack</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Sleaze</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Device Rating</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="—"
                  />
                </TextField>
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Data Processing</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Firewall</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Programs</Label>
                  <textarea
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm min-h-[80px]
                             focus:outline-none focus:ring-1 focus:ring-sr-accent resize-none"
                    placeholder="—"
                  />
                </TextField>
                <div>
                  <Label className="text-xs font-medium text-gray-400 mb-2 block">Matrix Condition Monitor</Label>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border border-sr-light-gray bg-sr-darker flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-400">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Vehicle */}
            <Section title="VEHICLE">
              <div className="space-y-3">
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Vehicle</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="—"
                  />
                </TextField>
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Handling</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Acceleration</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Speed</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Pilot</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Body</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-gray-400">Armor</Label>
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </TextField>
                </div>
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Sensor</Label>
                  <Input
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                             data-[focus-visible]:ring-sr-accent"
                    placeholder="—"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-gray-400">Notes</Label>
                  <textarea
                    className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm min-h-[60px]
                             focus:outline-none focus:ring-1 focus:ring-sr-accent resize-none"
                    placeholder="—"
                  />
                </TextField>
              </div>
            </Section>

            {/* Spells / Preparations / Rituals / Complex Forms */}
            <Section title="SPELLS / PREPARATIONS / RITUALS / COMPLEX FORMS">
              <TableHeader className="grid-cols-[1fr_1fr_80px_80px_60px]">
                <TableHeaderCell>S/P/R/CF</TableHeaderCell>
                <TableHeaderCell>Type/Target</TableHeaderCell>
                <TableHeaderCell>Range</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
                <TableHeaderCell>Drain</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_80px_80px_60px] gap-1">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Adept Powers or Other Abilities */}
            <Section title="ADEPT POWERS or OTHER ABILITIES">
              <TableHeader className="grid-cols-[1fr_80px_1fr]">
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
              </TableHeader>
              <div className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_1fr] gap-2">
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Power name"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="—"
                    />
                    <Input
                      className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                               data-[focus-visible]:ring-sr-accent"
                      placeholder="Notes"
                    />
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden ${className}`}>
      <div className="bg-sr-danger px-4 py-2 border-b border-sr-danger">
        <h2 className="text-white font-semibold text-sm uppercase">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function AttributeFieldWithControls({ label }: { label: string }) {
  const [value, setValue] = useState('0');

  const increment = () => {
    const num = parseInt(value) || 0;
    setValue(String(num + 1));
  };

  const decrement = () => {
    const num = parseInt(value) || 0;
    setValue(String(Math.max(0, num - 1)));
  };

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium text-gray-300 w-32">{label}</Label>
      <div className="flex items-center gap-1">
        <div className="flex flex-col">
          <Button
            onPress={increment}
            className="w-5 h-3 flex items-center justify-center bg-sr-darker border border-sr-light-gray rounded-t text-gray-300 text-xs
                     data-[hovered]:bg-sr-accent/20 data-[hovered]:border-sr-accent
                     data-[pressed]:bg-sr-accent/40
                     data-[focus-visible]:outline-none data-[focus-visible]:ring-1 data-[focus-visible]:ring-sr-accent"
            aria-label="Increment"
          >
            ▲
          </Button>
          <Button
            onPress={decrement}
            className="w-5 h-3 flex items-center justify-center bg-sr-darker border border-sr-light-gray rounded-b border-t-0 text-gray-300 text-xs
                     data-[hovered]:bg-sr-accent/20 data-[hovered]:border-sr-accent
                     data-[pressed]:bg-sr-accent/40
                     data-[focus-visible]:outline-none data-[focus-visible]:ring-1 data-[focus-visible]:ring-sr-accent"
            aria-label="Decrement"
          >
            ▼
          </Button>
        </div>
        <TextField isReadOnly>
          <Input
            className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm w-20
                     pointer-events-none"
            placeholder="0"
            value={value}
            tabIndex={-1}
            onFocus={(e) => e.target.blur()}
          />
        </TextField>
      </div>
    </div>
  );
}

function AttributeField({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium text-gray-300 w-32">{label}</Label>
      <Input
        className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded text-gray-100 text-sm w-20
                 data-[focus-visible]:outline-none data-[focus-visible]:ring-1 
                 data-[focus-visible]:ring-sr-accent"
        placeholder="0"
      />
    </div>
  );
}

function TableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-2 mb-2 pb-2 border-b border-sr-light-gray ${className}`}>
      {children}
    </div>
  );
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium text-gray-400 uppercase">{children}</div>
  );
}
