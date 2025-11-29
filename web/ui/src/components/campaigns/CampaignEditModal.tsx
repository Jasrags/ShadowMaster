import { Dialog, Modal, Heading, Button, TextField, Input, Select, ListBox, ListBoxItem, Popover, SelectValue, CheckboxGroup } from 'react-aria-components';
import { Checkbox } from 'react-aria-components';
import type { CampaignResponse, CampaignPlayer } from '../../lib/types';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useState, useEffect, useMemo, useCallback } from 'react';

interface CampaignEditModalProps {
  campaign: CampaignResponse | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

// Get automation friendly name
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
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Automated feature for enhanced gameplay management.',
  };
};

export function CampaignEditModal({ campaign, isOpen, onOpenChange, onSuccess }: CampaignEditModalProps) {
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string>('Active');
  const [theme, setTheme] = useState('');
  const [enabledBooks, setEnabledBooks] = useState<string[]>([]);
  const [automation, setAutomation] = useState<Record<string, boolean>>({});
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Array<{ code: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isBooksExpanded, setIsBooksExpanded] = useState(false);
  const [isAutomationExpanded, setIsAutomationExpanded] = useState(false);
  const [isPlayersExpanded, setIsPlayersExpanded] = useState(false);
  
  // Player management state
  const [players, setPlayers] = useState<CampaignPlayer[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [usernameSearch, setUsernameSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; username: string; email: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [removingPlayer, setRemovingPlayer] = useState<string | null>(null);

  const loadAvailableBooks = useCallback(async (edition: string) => {
    try {
      setIsLoadingBooks(true);
      const books = await campaignApi.getEditionBooks(edition);
      // Ensure books is an array of SourceBook objects
      const validBooks = Array.isArray(books) 
        ? books.filter((book): book is { code: string; name: string } => 
            book && typeof book === 'object' && typeof book.code === 'string' && typeof book.name === 'string'
          )
        : [];
      setAvailableBooks(validBooks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load available books';
      showError('Failed to load books', errorMessage);
      setAvailableBooks([]); // Set empty array on error
    } finally {
      setIsLoadingBooks(false);
    }
  }, [showError]);

  const loadPlayers = useCallback(async () => {
    if (!campaign?.id) return;

    try {
      setIsLoadingPlayers(true);
      const data = await campaignApi.getCampaignInvitations(campaign.id);
      setPlayers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load players';
      showError('Failed to load players', errorMessage);
    } finally {
      setIsLoadingPlayers(false);
    }
  }, [campaign?.id, showError]);

  // Load campaign data when modal opens
  useEffect(() => {
    if (campaign && isOpen) {
      setName(campaign.name || '');
      setStatus(campaign.status || 'Active');
      setTheme(campaign.theme || '');
      // Ensure enabled_books is an array of strings
      const books = campaign.enabled_books || [];
      setEnabledBooks(Array.isArray(books) ? books.filter((b): b is string => typeof b === 'string') : []);
      // Ensure automation is an object with string keys and boolean values
      // Initialize with all default automation keys set to false, then override with campaign values
      const defaultAutomationKeys = [
        'initiative_automation',
        'matrix_trace',
        'recoil_tracking',
        'damage_tracking',
        'spell_cast',
        'skill_test',
      ];
      const automationObj = campaign.automation || {};
      const validAutomation: Record<string, boolean> = {};
      
      // Initialize all default keys to false
      defaultAutomationKeys.forEach((key) => {
        validAutomation[key] = false;
      });
      
      // Override with campaign values and collect selected items
      const selectedItems: string[] = [];
      Object.keys(automationObj).forEach((key) => {
        if (typeof key === 'string' && typeof automationObj[key] === 'boolean') {
          validAutomation[key] = automationObj[key];
          if (automationObj[key] === true) {
            selectedItems.push(key);
          }
        }
      });
      
      // Always set automation state with all keys initialized
      setAutomation({ ...validAutomation });
      // Set the selected array for CheckboxGroup
      setSelectedAutomations(selectedItems);
      
      // Load available books for the edition
      if (campaign.edition) {
        loadAvailableBooks(campaign.edition);
      }
      
      // Load players if the section is expanded
      if (isPlayersExpanded) {
        loadPlayers();
      }
    }
  }, [campaign, isOpen, loadAvailableBooks, isPlayersExpanded, loadPlayers]);
  
  // Load players when section is expanded
  useEffect(() => {
    if (isOpen && campaign?.id && isPlayersExpanded) {
      loadPlayers();
    }
  }, [isOpen, campaign?.id, isPlayersExpanded, loadPlayers]);
  
  // Search users for autocomplete
  useEffect(() => {
    if (inviteMethod === 'username' && usernameSearch.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          setIsSearching(true);
          const results = await campaignApi.searchUsers(usernameSearch);
          const validResults = Array.isArray(results) ? results : [];
          setSearchResults(validResults);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error searching users';
          showError('Error searching users', errorMessage);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Debounce

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [usernameSearch, inviteMethod]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleInvite = async () => {
    if (!campaign?.id) return;

    setIsSubmittingInvite(true);
    try {
      if (inviteMethod === 'email') {
        if (!email.trim()) {
          showError('Email required', 'Please enter an email address');
          setIsSubmittingInvite(false);
          return;
        }
        await campaignApi.invitePlayer(campaign.id, { email: email.trim() });
        showSuccess('Invitation sent', `Invitation sent to ${email}`);
      } else {
        if (!selectedUser) {
          showError('User required', 'Please select a user');
          setIsSubmittingInvite(false);
          return;
        }
        await campaignApi.invitePlayer(campaign.id, {
          user_id: selectedUser.id,
          username: selectedUser.username,
        });
        showSuccess('Invitation sent', `Invitation sent to ${selectedUser.username}`);
      }

      // Reset form
      setEmail('');
      setUsernameSearch('');
      setSelectedUser(null);
      setSearchResults([]);
      setIsInviteModalOpen(false);

      // Reload players
      await loadPlayers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      showError('Failed to send invitation', errorMessage);
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!campaign?.id) return;

    setRemovingPlayer(playerId);
    try {
      await campaignApi.removeInvitation(campaign.id, playerId);
      showSuccess('Player removed', 'The player has been removed');
      await loadPlayers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove player';
      showError('Failed to remove player', errorMessage);
    } finally {
      setRemovingPlayer(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    try {
      setIsLoading(true);
      await campaignApi.updateCampaign(campaign.id, {
        name,
        status,
        theme,
        enabled_books: enabledBooks,
        automation,
      });
      showSuccess('Campaign updated', 'The campaign has been successfully updated.');
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      showError('Failed to update campaign', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  // Get all automation keys from both current automation and available automation types
  // Memoize to prevent recalculation on every render and ensure uniqueness
  const allAutomationKeys = useMemo(() => {
    const defaultKeys = [
      'initiative_automation',
      'matrix_trace',
      'recoil_tracking',
      'damage_tracking',
      'spell_cast',
      'skill_test',
    ];
    
    // Get keys from current automation object, ensuring they're strings
    const currentKeys = automation ? Object.keys(automation).filter((k): k is string => typeof k === 'string') : [];
    
    // Combine and deduplicate
    const allKeys = Array.from(new Set([...currentKeys, ...defaultKeys]));
    
    // Sort for consistent ordering
    return allKeys.sort();
  }, [automation]);

  if (!campaign || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              Edit Campaign
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close edit modal"
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
              isDisabled={isLoading}
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

          <form id="campaign-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Name */}
              <TextField
                value={name}
                onChange={setName}
                isRequired
                className="flex flex-col gap-1"
              >
                <label className="text-sm font-medium text-gray-300">Name</label>
                <Input
                  className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                  placeholder="Campaign name"
                />
              </TextField>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Status</label>
                <Select
                  selectedKey={status}
                  onSelectionChange={(key) => setStatus(key as string)}
                  className="flex flex-col gap-1"
                >
                  <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
                    <SelectValue />
                  </Button>
                  <Popover
                    placement="bottom start"
                    className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
                  >
                    <ListBox className="p-1">
                      <ListBoxItem
                        id="Active"
                        textValue="Active"
                        className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                      >
                        Active
                      </ListBoxItem>
                      <ListBoxItem
                        id="Paused"
                        textValue="Paused"
                        className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                      >
                        Paused
                      </ListBoxItem>
                      <ListBoxItem
                        id="Completed"
                        textValue="Completed"
                        className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                      >
                        Completed
                      </ListBoxItem>
                    </ListBox>
                  </Popover>
                </Select>
              </div>

              {/* Theme */}
              <TextField
                value={theme}
                onChange={setTheme}
                className="flex flex-col gap-1"
              >
                <label className="text-sm font-medium text-gray-300">Theme</label>
                <Input
                  className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                  placeholder="Campaign theme"
                />
              </TextField>

              {/* Enabled Books */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsBooksExpanded(!isBooksExpanded)}
                  className="flex items-center justify-between text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
                >
                  <span>Enabled Books</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isBooksExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isBooksExpanded && (
                  <>
                    {isLoadingBooks ? (
                      <div className="text-sm text-gray-400">Loading books...</div>
                    ) : availableBooks.length === 0 ? (
                      <div className="text-sm text-gray-400">No books available for this edition</div>
                    ) : (
                      <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30">
                        {availableBooks.map((book, index) => {
                          const bookKey = `book-${book.code}-${index}`;
                          const bookCode = book.code;
                          return (
                            <div key={bookKey} className="flex items-center gap-2">
                              <Checkbox
                                isSelected={enabledBooks.includes(bookCode)}
                                onChange={(isSelected) => {
                                  if (isSelected) {
                                    setEnabledBooks((prev) => [...prev, bookCode]);
                                  } else {
                                    setEnabledBooks((prev) => prev.filter((b) => b !== bookCode));
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                {({ isSelected }) => (
                                  <div className={`w-4 h-4 border-2 border-sr-light-gray rounded bg-sr-gray flex items-center justify-center transition-colors ${isSelected ? 'bg-sr-accent border-sr-accent' : ''}`}>
                                    <svg
                                      className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </Checkbox>
                              <span className="text-sm text-gray-100">{book.name || book.code}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Automation */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutomationExpanded(!isAutomationExpanded)}
                  className="flex items-center justify-between text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
                >
                  <span>Automation</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isAutomationExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isAutomationExpanded && (
                  <CheckboxGroup
                    value={selectedAutomations}
                    onChange={(values) => {
                      const newValues = values as string[];
                      setSelectedAutomations(newValues);
                      // Update automation object from the array
                      const updatedAutomation: Record<string, boolean> = {};
                      allAutomationKeys.forEach((key) => {
                        updatedAutomation[key] = newValues.includes(key);
                      });
                      setAutomation(updatedAutomation);
                    }}
                    className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30"
                  >
                    {allAutomationKeys.map((key, index) => {
                      // Ensure key is a string
                      const automationKey = typeof key === 'string' ? key : String(key);
                      const automationInfo = getAutomationInfo(automationKey);
                      // Use a unique key that combines the automation key with index for safety
                      const uniqueKey = `automation-${automationKey}-${index}`;
                      return (
                        <Checkbox
                          key={uniqueKey}
                          value={automationKey}
                          className="cursor-pointer"
                        >
                          {({ isSelected }) => (
                            <div className="flex items-start gap-2 flex-1">
                              <div className={`w-4 h-4 border-2 border-sr-light-gray rounded bg-sr-gray flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 ${isSelected ? 'bg-sr-accent border-sr-accent' : ''}`}>
                                <svg
                                  className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-100">
                                  {automationInfo.name}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {automationInfo.description}
                                </div>
                              </div>
                            </div>
                          )}
                        </Checkbox>
                    );
                  })}
                </CheckboxGroup>
                )}
              </div>

              {/* Players */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayersExpanded(!isPlayersExpanded)}
                  className="flex items-center justify-between text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
                >
                  <span>Players</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isPlayersExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isPlayersExpanded && (
                  <>
                    <div className="flex items-center justify-end mb-2">
                      <Button
                        onPress={() => setIsInviteModalOpen(true)}
                        aria-label="Invite player"
                        className="px-3 py-1 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors"
                        type="button"
                      >
                        Invite Player
                      </Button>
                    </div>
                    
                    {isLoadingPlayers ? (
                      <div className="text-sm text-gray-400">Loading players...</div>
                    ) : (
                      <>
                        {(() => {
                          const allPlayers = players.filter(player => player.status !== 'declined');
                          return allPlayers.length > 0 ? (
                            <div className="space-y-2">
                              {allPlayers.map((player) => {
                                const displayName = player.username || player.email || player.id;
                                const isPending = player.status === 'invited';
                                const bgColor = isPending 
                                  ? 'bg-yellow-900/20 border-yellow-700/50' 
                                  : 'bg-green-900/20 border-green-700/50';
                                
                                return (
                                  <div
                                    key={player.id}
                                    className={`flex items-center justify-between px-3 py-2 ${bgColor} border rounded-md text-gray-200 text-sm`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{displayName}</span>
                                      {isPending && player.invited_at && (
                                        <span className="text-xs text-gray-400">
                                          Invited on: {new Date(player.invited_at).toLocaleDateString()}
                                        </span>
                                      )}
                                      {!isPending && player.joined_at && (
                                        <span className="text-xs text-gray-400">
                                          Joined: {new Date(player.joined_at).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    <Button
                                      onPress={async () => {
                                        await handleRemovePlayer(player.id);
                                      }}
                                      isDisabled={removingPlayer === player.id}
                                      aria-label={`Remove ${isPending ? 'invitation for' : 'player'} ${displayName}`}
                                      className="ml-2 px-2 py-1 text-xs bg-red-900/30 border border-red-700/50 rounded text-gray-200 hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      type="button"
                                    >
                                      {removingPlayer === player.id ? 'Removing...' : 'Remove'}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No players or invitations yet</div>
                          );
                        })()}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
          
          {/* Invite Player Modal */}
          {isInviteModalOpen && (
            <Modal isOpen={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/70" aria-hidden="true" onClick={(e) => {
                e.stopPropagation();
                setIsInviteModalOpen(false);
              }} />
              <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-md w-full p-6 outline-none z-[61]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <Heading slot="title" className="text-xl font-semibold text-gray-100">
                    Invite Player
                  </Heading>
                  <Button
                    onPress={() => setIsInviteModalOpen(false)}
                    aria-label="Close invite modal"
                    className="p-1 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Invite Method Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Invite Method</label>
                    <Select
                      selectedKey={inviteMethod}
                      onSelectionChange={(key) => {
                        const newMethod = key as 'email' | 'username';
                        setInviteMethod(newMethod);
                        setEmail('');
                        setUsernameSearch('');
                        setSelectedUser(null);
                        setSearchResults([]);
                      }}
                      className="flex flex-col gap-1"
                    >
                      <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
                        <SelectValue />
                      </Button>
                      <Popover
                        placement="bottom start"
                        className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
                      >
                        <ListBox className="p-1">
                          <ListBoxItem
                            id="email"
                            textValue="By Email"
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            By Email
                          </ListBoxItem>
                          <ListBoxItem
                            id="username"
                            textValue="By Username"
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            By Username
                          </ListBoxItem>
                        </ListBox>
                      </Popover>
                    </Select>
                  </div>

                  {/* Email Input */}
                  {inviteMethod === 'email' && (
                    <TextField
                      value={email}
                      onChange={setEmail}
                      className="flex flex-col gap-1"
                    >
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <Input
                        type="email"
                        placeholder="player@example.com"
                        className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                      />
                    </TextField>
                  )}

                  {/* Username Search */}
                  {inviteMethod === 'username' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-300">Search Username</label>
                      <div className="relative">
                        <TextField
                          value={usernameSearch}
                          onChange={setUsernameSearch}
                          className="flex flex-col gap-1"
                        >
                          <Input
                            placeholder="Type to search..."
                            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent w-full"
                          />
                        </TextField>
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                            Searching...
                          </div>
                        )}
                      </div>

                      {/* Search Results Dropdown */}
                      {!selectedUser && usernameSearch.length >= 2 && (
                        <>
                          {isSearching && (
                            <div className="mt-1 px-3 py-2 text-sm text-gray-400 border border-sr-light-gray rounded-md bg-sr-gray">
                              Searching...
                            </div>
                          )}
                          {!isSearching && searchResults.length > 0 && (
                            <div className="mt-1 border border-sr-light-gray rounded-md bg-sr-gray shadow-lg max-h-48 overflow-auto z-10">
                              {searchResults.map((user) => (
                                <button
                                  key={user.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setUsernameSearch(user.username);
                                    setSearchResults([]);
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-sr-light-gray text-gray-100 text-sm border-b border-sr-light-gray last:border-b-0 cursor-pointer"
                                >
                                  <div className="font-medium">{user.username}</div>
                                  <div className="text-xs text-gray-400">{user.email}</div>
                                </button>
                              ))}
                            </div>
                          )}
                          {!isSearching && searchResults.length === 0 && usernameSearch.length >= 2 && (
                            <div className="mt-1 px-3 py-2 text-sm text-gray-400 border border-sr-light-gray rounded-md bg-sr-gray">
                              No users found
                            </div>
                          )}
                        </>
                      )}

                      {selectedUser && (
                        <div className="mt-2 px-3 py-2 bg-sr-light-gray border border-sr-light-gray rounded-md">
                          <div className="text-sm text-gray-200">
                            Selected: <span className="font-medium">{selectedUser.username}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(null);
                              setUsernameSearch('');
                            }}
                            className="mt-1 text-xs text-sr-accent hover:underline"
                          >
                            Clear selection
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      onPress={() => {
                        setIsInviteModalOpen(false);
                        setEmail('');
                        setUsernameSearch('');
                        setSelectedUser(null);
                        setSearchResults([]);
                      }}
                      className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={handleInvite}
                      isDisabled={isSubmittingInvite || (inviteMethod === 'email' && !email.trim()) || (inviteMethod === 'username' && !selectedUser)}
                      className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      {isSubmittingInvite ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </div>
                </div>
              </Dialog>
            </Modal>
          )}

          <div className="p-6 border-t border-sr-light-gray flex justify-end gap-3">
            <Button
              onPress={handleClose}
              isDisabled={isLoading}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="campaign-edit-form"
              isDisabled={isLoading || !name.trim()}
              className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

