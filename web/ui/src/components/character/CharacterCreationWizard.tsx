import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import { useState, useEffect, useCallback } from 'react';
import { characterApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import type { CharacterCreationData, PrioritySelection, SumToTenSelection, KarmaSelection } from '../../lib/types';
import { Step1Concept } from './steps/Step1Concept';
import { Step2MetatypeAttributes } from './steps/Step2MetatypeAttributes';
import { Step3MagicResonance } from './steps/Step3MagicResonance';
import { Step4Qualities } from './steps/Step4Qualities';
import { Step5Skills } from './steps/Step5Skills';
import { Step6Resources } from './steps/Step6Resources';
import { Step7KarmaSpending } from './steps/Step7KarmaSpending';
import { Step8FinalCalculations } from './steps/Step8FinalCalculations';
import { Step9FinalTouches } from './steps/Step9FinalTouches';

interface CharacterCreationWizardProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
  edition?: string;
}

interface CharacterCreationState {
  // Basic info
  name: string;
  playerName: string;
  concept: string;
  
  // Creation method
  creationMethod: 'priority' | 'sum_to_ten' | 'karma';
  gameplayLevel: 'experienced' | 'street' | 'prime';
  
  // Priority/Sum-to-Ten data
  priorities?: PrioritySelection;
  sumToTen?: SumToTenSelection;
  karma?: KarmaSelection;
  
  // Step-specific data
  selectedMetatype?: string;
  attributeAllocations?: Record<string, number>;
  magicType?: string;
  tradition?: string;
  selectedQualities?: Array<{ name: string; type: string }>;
  skillAllocations?: Record<string, number>;
  equipment?: any[];
  karmaSpending?: any;
  
  // Final touches
  background?: string;
  streetName?: string;
  notes?: string;
  
  // Validation
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const STORAGE_KEY = 'character-creation-state';

export function CharacterCreationWizard({ isOpen, onOpenChange, onSuccess, edition = 'sr5' }: CharacterCreationWizardProps) {
  const { showSuccess, showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [creationData, setCreationData] = useState<CharacterCreationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CharacterCreationState>({
    name: '',
    playerName: '',
    concept: '',
    creationMethod: 'priority',
    gameplayLevel: 'experienced',
    errors: {},
    touched: {},
  });

  // Load creation data on mount
  useEffect(() => {
    if (isOpen && !creationData) {
      loadCreationData();
    }
  }, [isOpen, edition]);

  // Load from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Failed to load saved state:', e);
        }
      }
    }
  }, [isOpen]);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isOpen]);

  const loadCreationData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await characterApi.getCharacterCreationData(edition);
      setCreationData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load character creation data';
      showError('Failed to load data', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [edition, showError]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setCurrentStep(1);
    setFormData({
      name: '',
      playerName: '',
      concept: '',
      creationMethod: 'priority',
      gameplayLevel: 'experienced',
      errors: {},
      touched: {},
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = { ...formData.touched };

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Character name is required';
        newTouched.name = true;
      }
      if (!formData.playerName.trim()) {
        newErrors.playerName = 'Player name is required';
        newTouched.playerName = true;
      }
    } else if (step === 2) {
      if (formData.creationMethod === 'priority' && formData.priorities) {
        const p = formData.priorities;
        if (!p.metatype_priority || !p.attributes_priority || !p.magic_priority || !p.skills_priority || !p.resources_priority) {
          newErrors.priorities = 'All priorities must be selected (A-E for each category)';
        }
      } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
        const stt = formData.sumToTen;
        const costs: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, E: 0 };
        const total = (costs[stt.metatype_priority] || 0) +
          (costs[stt.attributes_priority] || 0) +
          (costs[stt.magic_priority] || 0) +
          (costs[stt.skills_priority] || 0) +
          (costs[stt.resources_priority] || 0);
        if (total !== 10) {
          newErrors.sumToTen = `Priority costs must total 10 (current: ${total})`;
        }
      }
      if (!formData.selectedMetatype) {
        newErrors.metatype = 'Metatype must be selected';
      }
    }

    setFormData(prev => ({ ...prev, errors: newErrors, touched: newTouched }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      let creationData: PrioritySelection | SumToTenSelection | KarmaSelection;
      
      if (formData.creationMethod === 'priority' && formData.priorities) {
        creationData = {
          ...formData.priorities,
          selected_metatype: formData.selectedMetatype,
          magic_type: formData.magicType,
          tradition: formData.tradition,
          gameplay_level: formData.gameplayLevel,
        };
      } else if (formData.creationMethod === 'sum_to_ten' && formData.sumToTen) {
        creationData = {
          ...formData.sumToTen,
          selected_metatype: formData.selectedMetatype,
          magic_type: formData.magicType,
          tradition: formData.tradition,
          gameplay_level: formData.gameplayLevel,
        };
      } else if (formData.creationMethod === 'karma' && formData.karma) {
        creationData = {
          ...formData.karma,
          gameplay_level: formData.gameplayLevel,
        };
      } else {
        throw new Error('Invalid creation method or missing data');
      }

      await characterApi.createCharacter({
        name: formData.name.trim(),
        player_name: formData.playerName.trim(),
        edition,
        creation_data: creationData,
      });

      showSuccess('Character created', `Character "${formData.name}" has been created successfully.`);
      handleClose();
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create character';
      showError('Failed to create character', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (!creationData) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading character creation data...</div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1Concept
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 2:
        return (
          <Step2MetatypeAttributes
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 3:
        return (
          <Step3MagicResonance
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 4:
        return (
          <Step4Qualities
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 5:
        return (
          <Step5Skills
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 6:
        return (
          <Step6Resources
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 7:
        return (
          <Step7KarmaSpending
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 8:
        return (
          <Step8FinalCalculations
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      case 9:
        return (
          <Step9FinalTouches
            formData={formData}
            setFormData={setFormData}
            creationData={creationData}
            errors={formData.errors}
            touched={formData.touched}
          />
        );
      default:
        return <div>Step {currentStep}</div>;
    }
  };

  if (!isOpen) {
    return null;
  }

  const stepNames = [
    'Concept',
    'Metatype & Attributes',
    'Magic/Resonance',
    'Qualities',
    'Skills',
    'Resources',
    'Karma Spending',
    'Final Calculations',
    'Final Touches',
  ];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              Create Character
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close wizard"
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

          {/* Step Indicator */}
          <div className="px-6 py-4 border-b border-sr-light-gray bg-sr-light-gray/30 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {stepNames.map((name, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                return (
                  <div key={stepNum} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isActive || isCompleted
                        ? 'bg-sr-accent text-white'
                        : 'bg-sr-light-gray text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : stepNum}
                    </div>
                    <span className={`text-sm whitespace-nowrap ${isActive || isCompleted ? 'text-gray-100' : 'text-gray-400'}`}>
                      {name}
                    </span>
                    {stepNum < stepNames.length && (
                      <div className="w-8 h-px bg-sr-light-gray mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-sr-light-gray flex justify-between gap-3">
            <div>
              {currentStep > 1 && (
                <Button
                  onPress={handleBack}
                  className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onPress={handleClose}
                className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
              >
                Cancel
              </Button>
              {currentStep < 9 ? (
                <Button
                  onPress={handleNext}
                  className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  isDisabled={isSubmitting}
                  className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Character'}
                </Button>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

