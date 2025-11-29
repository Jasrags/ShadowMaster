import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import { useState, useEffect } from 'react';
import type { CampaignResponse } from '../../lib/types';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

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

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!currentCampaign || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {currentCampaign.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close campaign view"
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <p className={`text-gray-100 mt-1 ${getStatusColor(currentCampaign.status)}`}>
                      {currentCampaign.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Edition</label>
                    <p className="text-gray-100 mt-1">{currentCampaign.edition.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">GM</label>
                    <p className="text-gray-100 mt-1">{currentCampaign.gm_username || (currentCampaign.gm_name ? toTitleCase(currentCampaign.gm_name) : '-')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Gameplay Level</label>
                    <p className="text-gray-100 mt-1">{currentCampaign.gameplay_level ? toTitleCase(currentCampaign.gameplay_level) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Creation Method</label>
                    <p className="text-gray-100 mt-1">{currentCampaign.creation_method ? toTitleCase(currentCampaign.creation_method) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Theme</label>
                    <p className="text-gray-100 mt-1">{currentCampaign.theme || '-'}</p>
                  </div>
                </div>
              </section>

              {/* Description */}
              {currentCampaign.description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Description</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{currentCampaign.description}</p>
                </section>
              )}

              {/* House Rules */}
              {currentCampaign.house_rule_notes && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">House Rules</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {currentCampaign.house_rule_notes}
                  </p>
                </section>
              )}

              {/* Enabled Books */}
              {currentCampaign.enabled_books && currentCampaign.enabled_books.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Enabled Books</h2>
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
                </section>
              )}

              {/* Players (Read-only) */}
              {currentCampaign.players && currentCampaign.players.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Players</h2>
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
                </section>
              )}

              {/* Factions */}
              {currentCampaign.factions && currentCampaign.factions.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Factions</h2>
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
                </section>
              )}

              {/* Locations */}
              {currentCampaign.locations && currentCampaign.locations.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Locations</h2>
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
                </section>
              )}

              {/* Placeholders */}
              {currentCampaign.placeholders && currentCampaign.placeholders.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Placeholders</h2>
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
                </section>
              )}

              {/* Session Seed */}
              {currentCampaign.session_seed && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Session Seed</h2>
                  <div className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md space-y-2">
                    {currentCampaign.session_seed.title && (
                      <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <p className="text-gray-200">{currentCampaign.session_seed.title}</p>
                      </div>
                    )}
                    {currentCampaign.session_seed.objectives && (
                      <div>
                        <label className="text-sm text-gray-400">Objectives</label>
                        <p className="text-gray-200 whitespace-pre-wrap">{currentCampaign.session_seed.objectives}</p>
                      </div>
                    )}
                    {currentCampaign.session_seed.scene_template && (
                      <div>
                        <label className="text-sm text-gray-400">Scene Template</label>
                        <p className="text-gray-200">{currentCampaign.session_seed.scene_template}</p>
                      </div>
                    )}
                    {currentCampaign.session_seed.summary && (
                      <div>
                        <label className="text-sm text-gray-400">Summary</label>
                        <p className="text-gray-200 whitespace-pre-wrap">{currentCampaign.session_seed.summary}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Automation */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Automation</h2>
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
              </section>

              {/* Dates */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Created</label>
                    <p className="text-gray-100 mt-1">
                      {currentCampaign && new Date(currentCampaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Updated</label>
                    <p className="text-gray-100 mt-1">
                      {currentCampaign && new Date(currentCampaign.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {currentCampaign?.setup_locked_at && (
                    <div>
                      <label className="text-sm text-gray-400">Setup Locked</label>
                      <p className="text-gray-100 mt-1">
                        {new Date(currentCampaign.setup_locked_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="p-6 border-t border-sr-light-gray flex justify-end">
            <Button
              onPress={handleClose}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

