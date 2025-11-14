import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { CampaignResponse } from '../../lib/types';

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
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!campaign || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {campaign.name}
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
                    <p className={`text-gray-100 mt-1 ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Edition</label>
                    <p className="text-gray-100 mt-1">{campaign.edition.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">GM Name</label>
                    <p className="text-gray-100 mt-1">{campaign.gm_name ? toTitleCase(campaign.gm_name) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Gameplay Level</label>
                    <p className="text-gray-100 mt-1">{campaign.gameplay_level ? toTitleCase(campaign.gameplay_level) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Creation Method</label>
                    <p className="text-gray-100 mt-1">{campaign.creation_method ? toTitleCase(campaign.creation_method) : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Theme</label>
                    <p className="text-gray-100 mt-1">{campaign.theme || '-'}</p>
                  </div>
                </div>
              </section>

              {/* Description */}
              {campaign.description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Description</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{campaign.description}</p>
                </section>
              )}

              {/* House Rules */}
              {campaign.house_rule_notes && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">House Rules</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {campaign.house_rule_notes}
                  </p>
                </section>
              )}

              {/* Enabled Books */}
              {campaign.enabled_books && campaign.enabled_books.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Enabled Books</h2>
                  <div className="flex flex-wrap gap-2">
                    {campaign.enabled_books.map((book, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sr-light-gray border border-sr-light-gray rounded-md text-gray-200 text-sm"
                      >
                        {book}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Players */}
              {campaign.players && campaign.players.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Players</h2>
                  <div className="space-y-2">
                    {campaign.players.map((player) => (
                      <div
                        key={player.id}
                        className="px-3 py-2 bg-sr-light-gray border border-sr-light-gray rounded-md text-gray-200"
                      >
                        {player.username || player.id}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Factions */}
              {campaign.factions && campaign.factions.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Factions</h2>
                  <div className="space-y-3">
                    {campaign.factions.map((faction) => (
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
              {campaign.locations && campaign.locations.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Locations</h2>
                  <div className="space-y-2">
                    {campaign.locations.map((location) => (
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
              {campaign.placeholders && campaign.placeholders.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Placeholders</h2>
                  <div className="space-y-2">
                    {campaign.placeholders.map((placeholder) => (
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
              {campaign.session_seed && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Session Seed</h2>
                  <div className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md space-y-2">
                    {campaign.session_seed.title && (
                      <div>
                        <label className="text-sm text-gray-400">Title</label>
                        <p className="text-gray-200">{campaign.session_seed.title}</p>
                      </div>
                    )}
                    {campaign.session_seed.objectives && (
                      <div>
                        <label className="text-sm text-gray-400">Objectives</label>
                        <p className="text-gray-200 whitespace-pre-wrap">{campaign.session_seed.objectives}</p>
                      </div>
                    )}
                    {campaign.session_seed.scene_template && (
                      <div>
                        <label className="text-sm text-gray-400">Scene Template</label>
                        <p className="text-gray-200">{campaign.session_seed.scene_template}</p>
                      </div>
                    )}
                    {campaign.session_seed.summary && (
                      <div>
                        <label className="text-sm text-gray-400">Summary</label>
                        <p className="text-gray-200 whitespace-pre-wrap">{campaign.session_seed.summary}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Automation */}
              {campaign.automation && Object.keys(campaign.automation).length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Automation</h2>
                  <div className="space-y-2">
                    {Object.entries(campaign.automation).map(([key, value]) => {
                      const automationInfo = getAutomationInfo(key);
                      return (
                        <div
                          key={key}
                          className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-gray-200">{automationInfo.name}</div>
                            <span className={`px-2 py-1 rounded text-sm ${value ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                              {value ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">{automationInfo.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Dates */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Created</label>
                    <p className="text-gray-100 mt-1">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Updated</label>
                    <p className="text-gray-100 mt-1">
                      {new Date(campaign.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {campaign.setup_locked_at && (
                    <div>
                      <label className="text-sm text-gray-400">Setup Locked</label>
                      <p className="text-gray-100 mt-1">
                        {new Date(campaign.setup_locked_at).toLocaleDateString()}
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

