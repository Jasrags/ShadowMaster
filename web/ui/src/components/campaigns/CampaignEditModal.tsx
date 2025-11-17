import { Dialog, Modal, Heading, Button, TextField, Input, Select, ListBox, ListBoxItem, Popover, SelectValue, CheckboxGroup, Label } from 'react-aria-components';
import { Checkbox } from 'react-aria-components';
import type { CampaignResponse } from '../../lib/types';
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
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

  const loadAvailableBooks = useCallback(async (edition: string) => {
    try {
      setIsLoadingBooks(true);
      const books = await campaignApi.getEditionBooks(edition);
      // Ensure books is an array of strings
      const validBooks = Array.isArray(books) 
        ? books.filter((book): book is string => typeof book === 'string')
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
    }
  }, [campaign, isOpen, loadAvailableBooks]);

  const handleClose = () => {
    onOpenChange(false);
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
                <label className="text-sm font-medium text-gray-300">Enabled Books</label>
                {isLoadingBooks ? (
                  <div className="text-sm text-gray-400">Loading books...</div>
                ) : availableBooks.length === 0 ? (
                  <div className="text-sm text-gray-400">No books available for this edition</div>
                ) : (
                  <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30">
                    {availableBooks.map((book, index) => {
                      // Ensure book is a string and create a truly unique key
                      const bookKey = typeof book === 'string' ? `book-${book}-${index}` : `book-${index}`;
                      const bookLabel = typeof book === 'string' ? book : String(book);
                      return (
                        <div key={bookKey} className="flex items-center gap-2">
                          <Checkbox
                            isSelected={enabledBooks.includes(bookLabel)}
                            onChange={(isSelected) => {
                              if (isSelected) {
                                setEnabledBooks((prev) => [...prev, bookLabel]);
                              } else {
                                setEnabledBooks((prev) => prev.filter((b) => b !== bookLabel));
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
                          <span className="text-sm text-gray-100">{bookLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Automation */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-gray-300">Automation</Label>
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
              </div>
            </div>
          </form>

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

