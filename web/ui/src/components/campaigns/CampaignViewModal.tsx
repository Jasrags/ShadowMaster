import { useState, useEffect } from 'react';
import type { CampaignResponse } from '../../lib/types';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface CampaignViewModalProps {
  campaign: CampaignResponse | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-green-400';
    case 'Paused':
      return 'text-yellow-400';
    case 'Completed':
      return 'text-gray-400';
    default:
      return 'text-gray-300';
  }
};

// Convert string to Title Case
const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Get automation friendly name and description
const getAutomationInfo = (key: string): { name: string; description: string } => {
  const automationMap: Record<string, { name: string; description: string }> = {
    initiative_automation: {
      name: 'Initiative Automation',
      description: 'Automatically tracks and manages initiative order during combat encounters.',
    },
    matrix_trace: {
      name: 'Matrix Trace',
      description: 'Automatically calculates and tracks matrix trace actions and their results.',
    },
    recoil_tracking: {
      name: 'Recoil Tracking',
      description: 'Automatically tracks recoil penalties for sustained fire and full-auto attacks.',
    },
    damage_tracking: {
      name: 'Damage Tracking',
      description: 'Automatically calculates and tracks physical and stun damage to characters.',
    },
    spell_cast: {
      name: 'Spell Casting',
      description: 'Automatically calculates spell casting tests, drain, and resistances.',
    },
    skill_test: {
      name: 'Skill Tests',
      description: 'Automatically handles skill test calculations and modifiers.',
    },
  };

  return automationMap[key] || {
    name: toTitleCase(key),
    description: 'Automated feature for enhanced gameplay management.',
  };
};


export function CampaignViewModal({ campaign, isOpen, onOpenChange }: CampaignViewModalProps) {
  const { showError } = useToast();
  const [bookNames, setBookNames] = useState<Record<string, string>>({});
  const [currentCampaign, setCurrentCampaign] = useState<CampaignResponse | null>(campaign);

  // Update currentCampaign when campaign prop changes
  useEffect(() => {
    setCurrentCampaign(campaign);
  }, [campaign]);

  // Reload campaign when modal opens or campaign prop changes
  useEffect(() => {
    if (isOpen && campaign?.id) {
      const reloadCampaign = async () => {
        try {
          const updated = await campaignApi.getCampaign(campaign.id);
          setCurrentCampaign(updated);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to reload campaign';
          showError('Failed to reload campaign', errorMessage);
        }
      };
      reloadCampaign();
    }
  }, [isOpen, campaign?.id]);

  // Load book names when modal opens
  useEffect(() => {
    if (currentCampaign && isOpen && currentCampaign.edition) {
      const edition = currentCampaign.edition;
      campaignApi.getEditionBooks(edition)
        .then(books => {
          const nameMap: Record<string, string> = {};
          books.forEach(book => {
            nameMap[book.code] = book.name;
          });
          setBookNames(nameMap);
        })
        .catch(() => {
          // Silently fail - tooltips just won't show
          setBookNames({});
        });
    }
  }, [currentCampaign, isOpen]);

  if (!currentCampaign || !isOpen) {
    return null;
  }

  return (
    <ViewModal
      item={currentCampaign}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue
              label="Status"
              value={<span className={getStatusColor(currentCampaign.status)}>{currentCampaign.status}</span>}
            />
            <LabelValue label="Edition" value={currentCampaign.edition.toUpperCase()} />
            <LabelValue
              label="GM"
              value={currentCampaign.gm_username || (currentCampaign.gm_name ? toTitleCase(currentCampaign.gm_name) : '-')}
            />
            <LabelValue
              label="Gameplay Level"
              value={currentCampaign.gameplay_level ? toTitleCase(currentCampaign.gameplay_level) : '-'}
            />
            <LabelValue
              label="Creation Method"
              value={currentCampaign.creation_method ? toTitleCase(currentCampaign.creation_method) : '-'}
            />
            <LabelValue label="Theme" value={currentCampaign.theme || '-'} />
          </FieldGrid>
        </Section>

        {/* Description */}
        {currentCampaign.description && (
          <Section title="Description">
            <p className="text-gray-300 whitespace-pre-wrap">{currentCampaign.description}</p>
          </Section>
        )}

        {/* House Rules */}
        {currentCampaign.house_rule_notes && (
          <Section title="House Rules">
            <p className="text-gray-300 whitespace-pre-wrap">
              {currentCampaign.house_rule_notes}
            </p>
          </Section>
        )}

        {/* Enabled Books */}
        {currentCampaign.enabled_books && currentCampaign.enabled_books.length > 0 && (
          <Section title="Enabled Books">
            <div className="flex flex-wrap gap-2">
              {currentCampaign.enabled_books.map((book, index) => {
                const bookName = bookNames[book] || book;
                const hasTooltip = bookNames[book] && bookNames[book] !== book;
                return (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <span
                      className="px-3 py-1 bg-sr-light-gray border border-sr-light-gray rounded-md text-gray-200 text-sm cursor-default"
                    >
                      {book}
                    </span>
                    {hasTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-xs text-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        {bookName}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                          <div className="border-4 border-transparent border-t-sr-light-gray"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Players (Read-only) */}
        {currentCampaign.players && currentCampaign.players.length > 0 && (
          <Section title="Players">
            <div className="space-y-2">
              {currentCampaign.players
                .filter(player => player.status === 'accepted')
                .map((player) => {
                  const displayName = player.username || player.email || player.id;
                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between px-3 py-2 bg-green-900/20 border border-green-700/50 rounded-md text-gray-200 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{displayName}</span>
                        {player.joined_at && (
                          <span className="text-xs text-gray-400">
                            Joined: {new Date(player.joined_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Section>
        )}

        {/* Factions */}
        {currentCampaign.factions && currentCampaign.factions.length > 0 && (
          <Section title="Factions">
            <div className="space-y-3">
              {currentCampaign.factions.map((faction) => (
                <div
                  key={faction.id}
                  className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md"
                >
                  <div className="font-medium text-gray-200">{faction.name}</div>
                  {faction.tags && (
                    <div className="text-sm text-gray-400 mt-1">Tags: {faction.tags}</div>
                  )}
                  {faction.notes && (
                    <div className="text-sm text-gray-300 mt-2">{faction.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Locations */}
        {currentCampaign.locations && currentCampaign.locations.length > 0 && (
          <Section title="Locations">
            <div className="space-y-2">
              {currentCampaign.locations.map((location) => (
                <div
                  key={location.id}
                  className="px-3 py-2 bg-sr-light-gray border border-sr-light-gray rounded-md"
                >
                  <div className="font-medium text-gray-200">{location.name}</div>
                  {location.descriptor && (
                    <div className="text-sm text-gray-400 mt-1">{location.descriptor}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Placeholders */}
        {currentCampaign.placeholders && currentCampaign.placeholders.length > 0 && (
          <Section title="Placeholders">
            <div className="space-y-2">
              {currentCampaign.placeholders.map((placeholder) => (
                <div
                  key={placeholder.id}
                  className="px-3 py-2 bg-sr-light-gray border border-sr-light-gray rounded-md"
                >
                  <div className="font-medium text-gray-200">{placeholder.name}</div>
                  {placeholder.role && (
                    <div className="text-sm text-gray-400 mt-1">Role: {placeholder.role}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Session Seed */}
        {currentCampaign.session_seed && (
          <Section title="Session Seed">
            <div className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md space-y-2">
              {currentCampaign.session_seed.title && (
                <LabelValue label="Title" value={currentCampaign.session_seed.title} />
              )}
              {currentCampaign.session_seed.objectives && (
                <div>
                  <label className="text-sm text-gray-400">Objectives</label>
                  <p className="text-gray-200 whitespace-pre-wrap mt-1">{currentCampaign.session_seed.objectives}</p>
                </div>
              )}
              {currentCampaign.session_seed.scene_template && (
                <LabelValue label="Scene Template" value={currentCampaign.session_seed.scene_template} />
              )}
              {currentCampaign.session_seed.summary && (
                <div>
                  <label className="text-sm text-gray-400">Summary</label>
                  <p className="text-gray-200 whitespace-pre-wrap mt-1">{currentCampaign.session_seed.summary}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Automation */}
        <Section title="Automation">
          <div className="space-y-2">
            {(() => {
              // Default automation keys
              const defaultAutomationKeys = [
                'initiative_automation',
                'matrix_trace',
                'recoil_tracking',
                'damage_tracking',
                'spell_cast',
                'skill_test',
              ];
              
              // Get all automation keys (from currentCampaign or default list)
              const allKeys = currentCampaign.automation 
                ? [...new Set([...defaultAutomationKeys, ...Object.keys(currentCampaign.automation)])]
                : defaultAutomationKeys;
              
              return allKeys.map((key) => {
                const automationInfo = getAutomationInfo(key);
                const isEnabled = currentCampaign.automation?.[key] === true;
                return (
                  <div
                    key={key}
                    className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-200">{automationInfo.name}</div>
                      <span className={`px-2 py-1 rounded text-sm ${isEnabled ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{automationInfo.description}</div>
                  </div>
                );
              });
            })()}
          </div>
        </Section>

        {/* Dates */}
        <Section title="Dates">
          <FieldGrid columns={3}>
            <LabelValue
              label="Created"
              value={currentCampaign ? new Date(currentCampaign.created_at).toLocaleDateString() : '-'}
            />
            <LabelValue
              label="Updated"
              value={currentCampaign ? new Date(currentCampaign.updated_at).toLocaleDateString() : '-'}
            />
            {currentCampaign?.setup_locked_at && (
              <LabelValue
                label="Setup Locked"
                value={new Date(currentCampaign.setup_locked_at).toLocaleDateString()}
              />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

