import { useState, useEffect } from 'react';
import { Dialog, Modal, Heading, Button, Select, SelectValue, Popover, ListBox, ListBoxItem } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { characterApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import type { CharacterCreationData } from '../../lib/types';

interface CharacterCreationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type CreationType = 'campaign' | 'standalone' | null;
type CreationSource = 'archetypes' | 'scratch' | null;

const editions = [
  { value: 'sr5', label: 'Shadowrun 5th Edition' },
  { value: 'sr3', label: 'Shadowrun 3rd Edition' },
];

export function CharacterCreationModal({ isOpen, onOpenChange }: CharacterCreationModalProps) {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [creationType, setCreationType] = useState<CreationType>(null);
  const [edition, setEdition] = useState<string>('sr5');
  const [creationMethod, setCreationMethod] = useState<string>('priority');
  const [gameplayLevel, setGameplayLevel] = useState<string>('experienced');
  const [creationSource, setCreationSource] = useState<CreationSource>(null);
  const [creationData, setCreationData] = useState<CharacterCreationData | null>(null);
  const [isLoadingCreationMethods, setIsLoadingCreationMethods] = useState(false);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);

  // Load creation methods when step 2 is reached or edition changes
  useEffect(() => {
    if (step === 2 && edition) {
      loadCreationMethods();
    }
  }, [edition, step]);

  // When moving to step 2, ensure defaults are set
  useEffect(() => {
    if (step === 2 && !creationMethod) {
      // Will be set when loadCreationMethods completes
      setCreationMethod('priority');
    }
  }, [step]);

  const loadCreationMethods = async () => {
    try {
      setIsLoadingCreationMethods(true);
      const data = await characterApi.getCharacterCreationData(edition);
      setCreationData(data);
      // Default to priority if available, otherwise use first method
      if (data.creation_methods) {
        if (data.creation_methods.priority) {
          setCreationMethod('priority');
        } else if (Object.keys(data.creation_methods).length > 0) {
          const firstMethod = Object.keys(data.creation_methods)[0];
          setCreationMethod(firstMethod);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load creation methods';
      showError('Failed to load creation methods', errorMessage);
    } finally {
      setIsLoadingCreationMethods(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCreationType(null);
    setEdition('sr5');
    setCreationMethod('priority');
    setGameplayLevel('experienced');
    setCreationSource(null);
    setCreationData(null);
    setIsCreatingCharacter(false);
    onOpenChange(false);
  };

  const handleCreationTypeSelect = (type: CreationType) => {
    if (type === 'campaign') {
      // Campaign character creation is coming soon
      return;
    }
    setCreationType(type);
    setStep(2);
  };

  const handleEditionChange = (newEdition: string) => {
    setEdition(newEdition);
    // Reset to priority when edition changes, will be updated when data loads
    setCreationMethod('priority');
  };

  const handleCreationMethodChange = (method: string) => {
    setCreationMethod(method);
  };

  const handleNextFromStep2 = () => {
    if (!edition || !creationMethod) {
      showError('Selection required', 'Please select both edition and creation method');
      return;
    }
    // If priority is selected, ensure gameplay level is set
    if (creationMethod === 'priority' && !gameplayLevel) {
      setGameplayLevel('experienced');
    }
    setStep(3);
  };

  const handleCreationSourceSelect = async (source: CreationSource) => {
    if (source === 'archetypes') {
      // Archetypes creation is coming soon
      return;
    }
    setCreationSource(source);
    await handleStartCreation();
  };

  const handleStartCreation = async () => {
    if (!edition || !creationMethod) {
      showError('Selection required', 'Please select both edition and creation method');
      return;
    }

    setIsCreatingCharacter(true);

    try {
      // Create minimal creation data - no priorities set initially
      // User will set priorities and other values in the character sheet
      const creationDataPayload: any = {};

      // Create the character with placeholder name (user can change it in character sheet)
      const character = await characterApi.createCharacter({
        name: 'New Character',
        player_name: '',
        edition,
        creation_method: creationMethod || 'priority',
        gameplay_level: gameplayLevel || 'experienced',
        edition_data: creationDataPayload,
      });

      // Update character with status "Creation"
      await characterApi.updateCharacter(character.id, {
        status: 'Creation',
      } as any);

      // Navigate to character sheet page
      navigate(`/characters/${character.id}`);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create character';
      showError('Failed to create character', errorMessage);
      setIsCreatingCharacter(false);
    }
  };

  const getCreationMethods = () => {
    if (!creationData?.creation_methods) return [];
    return Object.entries(creationData.creation_methods).map(([key, method]) => ({
      value: key,
      label: method.label || key,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto outline-none">
          {({ close }) => (
            <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading className="text-2xl font-bold text-gray-100">
                {step === 1 && 'Create Character'}
                {step === 2 && 'Select Edition & Creation Method'}
                {step === 3 && 'Choose Creation Source'}
              </Heading>
              <Button
                onPress={close}
                className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Step 1: Creation Type Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-300 mb-6">
                  Choose how you want to create your character.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleCreationTypeSelect('campaign')}
                    disabled
                    className="p-4 border-2 border-sr-light-gray rounded-lg bg-sr-gray text-left opacity-60 cursor-not-allowed relative"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">
                          Create Campaign Character
                        </h3>
                        <p className="text-sm text-gray-400">
                          Create a character for a specific campaign. The character will inherit the campaign's edition and creation method.
                        </p>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-xs text-sr-accent font-medium">
                      (Coming Soon)
                    </span>
                  </button>

                  <button
                    onClick={() => handleCreationTypeSelect('standalone')}
                    className="p-4 border-2 border-sr-accent rounded-lg bg-sr-gray text-left hover:bg-sr-light-gray transition-colors focus:outline-none focus:ring-2 focus:ring-sr-accent"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">
                      Create Stand-alone Character
                    </h3>
                    <p className="text-sm text-gray-400">
                      Create a character independently. You'll select the edition and creation method.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Edition & Creation Method Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-gray-300 mb-4">
                  Select the edition and creation method for your character.
                </p>

                {/* Edition Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Edition</label>
                  <Select
                    selectedKey={edition}
                    onSelectionChange={(key) => handleEditionChange(key as string)}
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
                        {editions.map((ed) => (
                          <ListBoxItem
                            key={ed.value}
                            id={ed.value}
                            textValue={ed.label}
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            {ed.label}
                          </ListBoxItem>
                        ))}
                      </ListBox>
                    </Popover>
                  </Select>
                </div>

                {/* Creation Method Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Creation Method</label>
                  {isLoadingCreationMethods ? (
                    <div className="px-3 py-2 text-gray-400">Loading creation methods...</div>
                  ) : (
                    <Select
                      selectedKey={creationMethod || null}
                      onSelectionChange={(key) => handleCreationMethodChange(key as string)}
                      className="flex flex-col gap-1"
                      isDisabled={!creationData}
                    >
                      <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left disabled:opacity-50">
                        <SelectValue>
                          {({ selectedText }) => selectedText || 'Select creation method...'}
                        </SelectValue>
                      </Button>
                      <Popover
                        placement="bottom start"
                        className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
                      >
                        <ListBox className="p-1">
                          {getCreationMethods().map((method) => (
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
                </div>

                {/* Gameplay Level Selection - Only show when Priority is selected */}
                {creationMethod === 'priority' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Gameplay Level</label>
                    <Select
                      selectedKey={gameplayLevel}
                      onSelectionChange={(key) => setGameplayLevel(key as string)}
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
                            id="experienced"
                            textValue="Established"
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            Established
                          </ListBoxItem>
                          <ListBoxItem
                            id="street"
                            textValue="Street-Level"
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            Street-Level
                          </ListBoxItem>
                          <ListBoxItem
                            id="prime"
                            textValue="Prime Runner"
                            className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                          >
                            Prime Runner
                          </ListBoxItem>
                        </ListBox>
                      </Popover>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onPress={() => setStep(1)}
                    className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent"
                  >
                    Back
                  </Button>
                  <Button
                    onPress={handleNextFromStep2}
                    isDisabled={!edition || !creationMethod || isLoadingCreationMethods}
                    className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Creation Source Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-gray-300 mb-6">
                  Choose how you want to start building your character.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleCreationSourceSelect('archetypes')}
                    disabled
                    className="p-4 border-2 border-sr-light-gray rounded-lg bg-sr-gray text-left opacity-60 cursor-not-allowed relative"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">
                          Create from Archetypes
                        </h3>
                        <p className="text-sm text-gray-400">
                          Start with a pre-built character archetype and customize it to fit your vision.
                        </p>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-xs text-sr-accent font-medium">
                      (Coming Soon)
                    </span>
                  </button>

                  <button
                    onClick={() => handleCreationSourceSelect('scratch')}
                    disabled={isCreatingCharacter}
                    className="p-4 border-2 border-sr-accent rounded-lg bg-sr-gray text-left hover:bg-sr-light-gray transition-colors focus:outline-none focus:ring-2 focus:ring-sr-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">
                      {isCreatingCharacter ? 'Creating Character...' : 'Create from Scratch'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Build your character step by step from the ground up.
                    </p>
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onPress={() => setStep(2)}
                    isDisabled={isCreatingCharacter}
                    className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent disabled:opacity-50"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
            </div>
          )}
        </Dialog>
      </div>
    </Modal>
  );
}

