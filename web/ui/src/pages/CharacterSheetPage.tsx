import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Input, TextArea, Dialog, Modal, Heading } from 'react-aria-components';
import { Button } from 'react-aria-components';
import { characterApi, campaignApi } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import type { Character, CharacterSR5, CharacterStatus, CampaignResponse } from '../lib/types';
import { PrioritySelectionDisplay } from '../components/character/PrioritySelectionDisplay';

function AttributeField({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-center">
        {value}
      </div>
    </div>
  );
}

function DamageTrack({ label, boxes, penalties }: { label: string; boxes: number; penalties: number[] }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300 mb-2 block">{label}</label>
      <div className="flex flex-col gap-1">
        {Array.from({ length: boxes }).map((_, i) => {
          const penaltyIndex = penalties.findIndex(p => i < p);
          const penalty = penaltyIndex >= 0 ? penalties[penaltyIndex] : null;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-sr-light-gray rounded cursor-pointer hover:border-sr-accent transition-colors" />
              {penalty && i === Math.floor(penalty / 3) * 3 && (
                <span className="text-xs text-gray-400">-{Math.floor(penalty / 3) + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CharacterStatus | undefined }) {
  if (!status) return null;
  
  const statusConfig = {
    Creation: { label: 'Creation', color: 'bg-yellow-600 text-yellow-100' },
    Review: { label: 'Review', color: 'bg-blue-600 text-blue-100' },
    Advancement: { label: 'Advancement', color: 'bg-green-600 text-green-100' },
  };
  
  const config = statusConfig[status] || statusConfig.Creation;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function getCharacterMode(status: CharacterStatus | undefined): 'creation' | 'review' | 'advancement' {
  if (!status) return 'creation';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'review') return 'review';
  if (lowerStatus === 'advancement') return 'advancement';
  return 'creation';
}

export function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CharacterStatus | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      loadCharacter();
    }
  }, [id]);

  useEffect(() => {
    if (character?.campaign_id) {
      loadCampaign();
    }
  }, [character?.campaign_id]);

  const loadCharacter = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await characterApi.getCharacter(id);
      setCharacter(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load character';
      showError('Failed to load character', errorMessage);
      navigate('/characters');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCampaign = async () => {
    if (!character?.campaign_id) return;
    try {
      const data = await campaignApi.getCampaign(character.campaign_id);
      setCampaign(data);
    } catch (err) {
      // Silently fail - campaign data is optional
      console.error('Failed to load campaign:', err);
    }
  };

  const handleStatusTransition = (newStatus: CharacterStatus) => {
    setPendingStatus(newStatus);
    setShowStatusConfirm(true);
  };

  const confirmStatusTransition = async () => {
    if (!character || !pendingStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const updated = await characterApi.updateCharacter(character.id, { status: pendingStatus });
      setCharacter(updated);
      setShowStatusConfirm(false);
      setPendingStatus(null);
      
      // Clear localStorage when moving out of Creation mode
      if (pendingStatus !== 'Creation') {
        const storageKey = `character_creation_${character.id}`;
        localStorage.removeItem(storageKey);
      }
      
      showSuccess('Status updated', `Character status changed to ${pendingStatus}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      showError('Failed to update status', errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Character not found</div>
      </div>
    );
  }

  const editionData = character.edition_data as CharacterSR5;
  const physicalBoxes = (editionData?.body || 0) + 2;
  const stunBoxes = (editionData?.willpower || 0) + 2;
  const characterMode = getCharacterMode(character.status);
  const canMoveToReview = character.status === 'Creation';
  const canMoveToAdvancement = character.status === 'Review';

  return (
    <div className="space-y-6">
      {/* Status Confirmation Dialog */}
      {showStatusConfirm && pendingStatus && (
        <Modal isOpen={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setShowStatusConfirm(false)} />
            <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-md w-full outline-none">
              <Heading className="text-xl font-semibold text-gray-100 mb-4 p-6 border-b border-sr-light-gray">
                Confirm Status Change
              </Heading>
              <div className="p-6">
                <p className="text-sm text-gray-300 mb-6">
                  Are you sure you want to move this character to <strong>{pendingStatus}</strong> status?
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    onPress={() => {
                      setShowStatusConfirm(false);
                      setPendingStatus(null);
                    }}
                    className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={confirmStatusTransition}
                    isDisabled={isUpdatingStatus}
                    className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingStatus ? 'Updating...' : 'Confirm'}
                  </Button>
                </div>
              </div>
            </Dialog>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Shadowrun 5th Edition Character Sheet</h1>
            <h2 className="text-2xl font-semibold text-gray-200 mt-2">{character.name}</h2>
            {character.player_name && (
              <p className="text-sm text-gray-400 mt-1">Player: {character.player_name}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={character.status} />
            <Button
              onPress={() => navigate('/characters')}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              Back to Characters
            </Button>
          </div>
        </div>

        {/* Status Transition Buttons */}
        {(canMoveToReview || canMoveToAdvancement) && (
          <div className="flex items-center gap-3 p-4 bg-sr-gray border border-sr-light-gray rounded-lg">
            <span className="text-sm font-medium text-gray-300">Status Actions:</span>
            {canMoveToReview && (
              <Button
                onPress={() => handleStatusTransition('Review')}
                className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
              >
                Move to Review
              </Button>
            )}
            {canMoveToAdvancement && (
              <Button
                onPress={() => handleStatusTransition('Advancement')}
                className="px-4 py-2 bg-green-600 border border-green-600 rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
              >
                Move to Advancement
              </Button>
            )}
          </div>
        )}

        {/* Campaign Rules Display (Creation Mode) */}
        {characterMode === 'creation' && campaign && (
          <div className="p-4 bg-sr-gray border border-sr-light-gray rounded-lg">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">Campaign Creation Rules</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Creation Method:</strong> {campaign.creation_method}</p>
              {campaign.gameplay_level && (
                <p><strong>Gameplay Level:</strong> {campaign.gameplay_level}</p>
              )}
              {editionData?.creation_method && (
                <p><strong>Character Creation Method:</strong> {editionData.creation_method}</p>
              )}
            </div>
          </div>
        )}

        {/* Creation Mode Editing Interface */}
        {characterMode === 'creation' && editionData?.creation_method === 'priority' && (
          <div className="p-4 bg-sr-gray border border-sr-light-gray rounded-lg">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Character Creation - Priority Selection</h3>
            <PrioritySelectionDisplay
              characterId={character.id}
              editionData={editionData}
              onPrioritiesChange={(priorities) => {
                // Handle priority changes - will wire up to API later
                console.log('Priorities changed:', priorities);
              }}
            />
          </div>
        )}
      </div>

      {/* Character Sheet - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Data */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              PERSONAL DATA
            </h3>
            <div className="p-4 space-y-3">
              <TextField className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Name / Primary Alias</label>
                <Input
                  value={character.name}
                  readOnly
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                />
              </TextField>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Metatype</label>
                  <Input
                    value={editionData?.metatype || ''}
                    readOnly
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Ethnicity</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Age</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Sex</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Height</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Weight</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Street Cred</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Notoriety</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Public Awareness</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Karma</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Total Karma</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Misc</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Optional"
                  />
                </TextField>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              ATTRIBUTES
            </h3>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <AttributeField label="Body" value={editionData?.body || 0} />
                  <AttributeField label="Agility" value={editionData?.agility || 0} />
                  <AttributeField label="Reaction" value={editionData?.reaction || 0} />
                  <AttributeField label="Strength" value={editionData?.strength || 0} />
                  <AttributeField label="Willpower" value={editionData?.willpower || 0} />
                  <AttributeField label="Logic" value={editionData?.logic || 0} />
                  <AttributeField label="Intuition" value={editionData?.intuition || 0} />
                  <AttributeField label="Charisma" value={editionData?.charisma || 0} />
                  <div className="pt-2">
                    <AttributeField label="Edge" value={editionData?.edge || 0} />
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border-2 border-sr-light-gray cursor-pointer hover:border-sr-accent transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <AttributeField label="Essence" value={editionData?.essence?.toFixed(1) || '0.0'} />
                  <AttributeField 
                    label="Magic/Resonance" 
                    value={editionData?.magic || editionData?.resonance || 0} 
                  />
                  <AttributeField 
                    label="Initiative" 
                    value={editionData?.initiative?.physical?.base || 0} 
                  />
                  <AttributeField 
                    label="Matrix Initiative" 
                    value={editionData?.initiative?.matrix_ar?.base || 0} 
                  />
                  <AttributeField 
                    label="Astral Initiative" 
                    value={editionData?.initiative?.astral?.base || 0} 
                  />
                  <AttributeField label="Composure" value={editionData?.composure || 0} />
                  <AttributeField label="Judge Intentions" value={editionData?.judge_intentions || 0} />
                  <AttributeField label="Memory" value={editionData?.memory || 0} />
                  <AttributeField label="Lift/Carry" value={editionData?.lift_carry || 0} />
                  <AttributeField label="Movement" value={editionData?.movement || 0} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-sr-light-gray">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Physical Limit</label>
                  <Input
                    value={editionData?.limits?.physical || ''}
                    readOnly
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Mental Limit</label>
                  <Input
                    value={editionData?.limits?.mental || ''}
                    readOnly
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Social Limit</label>
                  <Input
                    value={editionData?.limits?.social || ''}
                    readOnly
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  />
                </TextField>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              <h3 className="text-lg font-semibold text-gray-100">
                SKILLS
              </h3>
              <Button
                onPress={() => {}}
                className="px-3 py-1 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors text-sm font-medium"
              >
                Add
              </Button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Left Skills Column */}
                <div className="space-y-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <Input
                        className="col-span-6 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm"
                        placeholder="Skill"
                      />
                      <div className="col-span-2 w-8 h-6 border border-sr-light-gray rounded bg-sr-darker" />
                      <div className="col-span-2 w-8 h-6 border border-sr-light-gray rounded bg-sr-darker" />
                      <div className="col-span-2 text-xs text-gray-400">A/K</div>
                    </div>
                  ))}
                </div>
                {/* Right Skills Column */}
                <div className="space-y-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <Input
                        className="col-span-6 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm"
                        placeholder="Skill"
                      />
                      <div className="col-span-2 w-8 h-6 border border-sr-light-gray rounded bg-sr-darker" />
                      <div className="col-span-2 w-8 h-6 border border-sr-light-gray rounded bg-sr-darker" />
                      <div className="col-span-2 text-xs text-gray-400">A/K</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* IDs / Lifestyles / Currency */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              IDS / LIFESTYLES / CURRENCY
            </h3>
            <div className="p-4 space-y-3">
              <TextField className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Primary Lifestyle</label>
                <Input
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  placeholder="Lifestyle name"
                />
              </TextField>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Nuyen</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Licenses</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="License info"
                  />
                </TextField>
              </div>
              <TextField className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Fake IDs / Related Lifestyles / Funds / Licenses</label>
                <TextArea
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 min-h-[80px] resize-y"
                  placeholder="Additional information"
                />
              </TextField>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Core Combat Info */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              CORE COMBAT INFO
            </h3>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-300 w-32">Primary Armor</label>
                <Input
                  className="flex-1 px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  placeholder="Armor name"
                />
                <label className="text-sm font-medium text-gray-300">Rating:</label>
                <Input
                  className="w-20 px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Primary Ranged Weapon</label>
                <div className="grid grid-cols-6 gap-2">
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Dam" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Acc" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="AP" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Mode" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="RC" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Ammo" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Primary Melee Weapon</label>
                <div className="grid grid-cols-4 gap-2">
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Reach" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Dam" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="Acc" />
                  <Input className="px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="AP" />
                </div>
              </div>
            </div>
          </div>

          {/* Condition Monitor */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              CONDITION MONITOR
            </h3>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <DamageTrack 
                  label="Physical Damage Track" 
                  boxes={Math.min(physicalBoxes, 12)} 
                  penalties={[3, 6, 9, 12]} 
                />
                <DamageTrack 
                  label="Stun Damage Track" 
                  boxes={Math.min(stunBoxes, 12)} 
                  penalties={[3, 6, 9]} 
                />
              </div>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>Physical: Body + 2 (round up) = {physicalBoxes} boxes</p>
                <p>Stun: Willpower + 2 (round up) = {stunBoxes} boxes</p>
                <p className="mt-2">Overflow: When physical track is full, additional damage goes to overflow. Each box filled applies -1 dice pool modifier.</p>
              </div>
            </div>
          </div>

          {/* Qualities */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              <h3 className="text-lg font-semibold text-gray-100">
                QUALITIES
              </h3>
              <Button
                onPress={() => {}}
                className="px-3 py-1 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors text-sm font-medium"
              >
                Add
              </Button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Quality</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Notes</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" placeholder="P/N" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              <h3 className="text-lg font-semibold text-gray-100">
                CONTACTS
              </h3>
              <Button
                onPress={() => {}}
                className="px-3 py-1 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors text-sm font-medium"
              >
                Add
              </Button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Name</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Loyalty</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Connection</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Favor</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Second Page Content - Equipment and More */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Column - Equipment */}
        <div className="space-y-6">
          {/* Ranged Weapons */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              RANGED WEAPONS
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Weapon</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Dam</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Acc</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">AP</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Mode</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">RC</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Ammo</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Armor */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              ARMOR
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Armor</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Rating</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Augmentations */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              AUGMENTATIONS
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Augmentation</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Rating</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Notes</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Essence</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gear */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              GEAR
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Item</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - More Equipment */}
        <div className="space-y-6">
          {/* Melee Weapons */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              MELEE WEAPONS
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Weapon</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Reach</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Dam</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Acc</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">AP</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-16 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cyberdeck */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              CYBERDECK
            </h3>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Model</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Cyberdeck model"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Device Rating</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Attack</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Sleaze</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Data Processing</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Firewall</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <TextField className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Programs</label>
                <TextArea
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 min-h-[60px] resize-y"
                  placeholder="List programs"
                />
              </TextField>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Matrix Condition Monitor</label>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-sr-light-gray flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:border-sr-accent transition-colors"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              VEHICLE
            </h3>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Vehicle</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="Vehicle name"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Handling</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Acceleration</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Speed</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Pilot</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Body</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Armor</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
                <TextField className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">Sensor</label>
                  <Input
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100"
                    placeholder="0"
                  />
                </TextField>
              </div>
              <TextField className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Notes</label>
                <TextArea
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 min-h-[60px] resize-y"
                  placeholder="Vehicle notes"
                />
              </TextField>
            </div>
          </div>

          {/* Spells / Preparations / Rituals / Complex Forms */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              SPELLS / PREPARATIONS / RITUALS / COMPLEX FORMS
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">S/P/R/CF</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Type/Target</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Range</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Duration</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Drain</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adept Powers or Other Abilities */}
          <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-100 bg-sr-darker px-4 py-3 border-b border-sr-light-gray">
              ADEPT POWERS OR OTHER ABILITIES
            </h3>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sr-light-gray">
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Name</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Rating</th>
                    <th className="text-left text-sm font-medium text-gray-300 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-sr-light-gray/50">
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-20 px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                      <td className="py-2">
                        <Input className="w-full px-2 py-1 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

