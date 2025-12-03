import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  TextField,
  Input,
  Label,
} from 'react-aria-components';
import { charactersApi } from '../../lib/api';

export type CharacterType = 'campaign' | 'standalone';

export type Edition = '5e';
export type CreationMethod = 'priority';
export type PlayLevel = 'experienced';

interface CharacterCreateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: {
    type: CharacterType;
    edition: Edition;
    creationMethod: CreationMethod;
    playLevel: PlayLevel;
  }) => Promise<void>;
}

type Step = 'type' | 'options';

export function CharacterCreateModal({
  isOpen,
  onOpenChange,
  onCreate,
}: CharacterCreateModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('type');
  const [characterType, setCharacterType] = useState<CharacterType | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [edition, setEdition] = useState<Edition>('5e');
  const [creationMethod, setCreationMethod] = useState<CreationMethod>('priority');
  const [playLevel, setPlayLevel] = useState<PlayLevel>('experienced');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('type');
      setCharacterType(null);
      setCharacterName('');
      setEdition('5e');
      setCreationMethod('priority');
      setPlayLevel('experienced');
      setError('');
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 'type') {
      if (!characterType) {
        setError('Please select a character type');
        return;
      }
      if (characterType === 'campaign') {
        setError('Campaign creation is coming soon');
        return;
      }
      setStep('options');
      setError('');
    }
  };

  const handleCreate = async () => {
    if (!characterType || !characterName.trim()) {
      setError('Character name is required');
      return;
    }

    setError('');
    setIsCreating(true);
    try {
      // Call optional onCreate callback if provided
      if (onCreate) {
        await onCreate({
          type: characterType,
          edition,
          creationMethod,
          playLevel,
        });
      }

      // Create character via API
      const character = await charactersApi.createCharacter({
        name: characterName.trim(),
        edition,
        creation_method: creationMethod,
        play_level: playLevel,
      });
      
      // Close modal before navigating
      onOpenChange(false);
      
      // Navigate to character sheet page with the new character ID
      navigate(`/characters/${character.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsCreating(false);
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-4">
      <p className="text-gray-300 mb-4">
        Choose how you want to create your character:
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        <Button
          onPress={() => {
            setCharacterType('campaign');
            setError('');
          }}
          isDisabled={true}
          className={`w-full p-6 border rounded-lg text-left transition-colors
                   ${characterType === 'campaign'
                     ? 'border-sr-accent bg-sr-accent/10'
                     : 'border-sr-light-gray bg-sr-darker'
                   }
                   data-[hovered]:border-sr-light-gray
                   data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Campaign Character
              </h3>
              <p className="text-sm text-gray-400">
                Create a character as part of an active campaign
              </p>
              <p className="text-xs text-sr-warning mt-2 italic">
                Coming soon
              </p>
            </div>
            {characterType === 'campaign' && (
              <div className="w-6 h-6 rounded-full bg-sr-accent border-2 border-sr-accent flex items-center justify-center ml-4">
                <svg className="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </Button>

        <Button
          onPress={() => {
            setCharacterType('standalone');
            setError('');
          }}
          className={`w-full p-6 border rounded-lg text-left transition-colors
                   ${characterType === 'standalone'
                     ? 'border-sr-accent bg-sr-accent/10'
                     : 'border-sr-light-gray bg-sr-darker'
                   }
                   data-[hovered]:border-sr-accent
                   data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                   data-[focus-visible]:ring-sr-accent`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Stand-alone Character
              </h3>
              <p className="text-sm text-gray-400">
                Create a character independently, not tied to a specific campaign
              </p>
            </div>
            {characterType === 'standalone' && (
              <div className="w-6 h-6 rounded-full bg-sr-accent border-2 border-sr-accent flex items-center justify-center ml-4">
                <svg className="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );

  const renderOptionsSelection = () => (
    <div className="space-y-6">
      <p className="text-gray-300 mb-4">
        Configure your character creation options:
      </p>

      {/* Edition */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Edition
        </label>
        <div className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-400 text-sm">
          Shadowrun 5th Edition (5e)
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Only 5th Edition is currently available
        </p>
      </div>

      {/* Creation Method */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Creation Method
        </label>
        <div className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-400 text-sm">
          Priority
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Only Priority method is currently available
        </p>
      </div>

      {/* Play Level */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Play Level
        </label>
        <div className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-400 text-sm">
          Experienced
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Only Experienced level is currently available
        </p>
      </div>

      {/* Character Name */}
      <TextField
        value={characterName}
        onChange={setCharacterName}
        isRequired
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">
          Character Name
        </Label>
        <Input
          className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                   data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                   data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent"
          placeholder="Enter character name"
          autoFocus
        />
      </TextField>
    </div>
  );

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 max-w-2xl w-full mx-4">
          <Dialog>
            {({ close }) => (
              <>
                <div className="flex items-center justify-between mb-6">
                  <Heading
                    slot="title"
                    className="text-2xl font-bold text-gray-100"
                  >
                    {step === 'type' ? 'Create New Character' : 'Character Options'}
                  </Heading>
                  {step === 'options' && (
                    <button
                      onClick={() => {
                        setStep('type');
                        setError('');
                      }}
                      className="text-sr-text-dim hover:text-sr-text text-sm"
                    >
                      ← Back
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-sr-danger/20 border border-sr-danger rounded-md text-sr-danger text-sm">
                    {error}
                  </div>
                )}

                <div className="min-h-[300px]">
                  {step === 'type' && renderTypeSelection()}
                  {step === 'options' && renderOptionsSelection()}
                </div>

                <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-sr-light-gray">
                  <Button
                    onPress={close}
                    className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 
                             data-[hovered]:bg-sr-darker/80 
                             data-[pressed]:bg-sr-light-gray
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                             data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent 
                             transition-colors font-medium"
                  >
                    Cancel
                  </Button>
                  {step === 'type' ? (
                    <Button
                      onPress={handleNext}
                      isDisabled={!characterType}
                      className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                               data-[hovered]:bg-sr-accent/80 
                               data-[pressed]:bg-sr-accent-dark
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                               data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                               transition-colors font-medium"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onPress={handleCreate}
                      isDisabled={isCreating || !characterName.trim()}
                      className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                               data-[hovered]:bg-sr-accent/80 
                               data-[pressed]:bg-sr-accent-dark
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                               data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                               transition-colors font-medium"
                    >
                      {isCreating ? 'Creating...' : 'Create Character'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
