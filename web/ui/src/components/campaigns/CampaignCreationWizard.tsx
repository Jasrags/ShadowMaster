import { Dialog, Modal, Heading, Button, TextField, Input, TextArea, Select, ListBox, ListBoxItem, Popover, SelectValue, FieldError, Checkbox, CheckboxGroup, Label } from 'react-aria-components';
import { useState, useEffect, useCallback } from 'react';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface CampaignCreationWizardProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

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
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Automated feature for enhanced gameplay management.',
  };
};

interface WizardData {
  name: string;
  description: string;
  edition: string;
  creationMethod: string;
  minPlayers: number;
  maxPlayers: number;
  enabledBooks: string[];
  automation: Record<string, boolean>;
}

export function CampaignCreationWizard({ isOpen, onOpenChange, onSuccess }: CampaignCreationWizardProps) {
  const { showSuccess, showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>({
    name: '',
    description: '',
    edition: 'sr5',
    creationMethod: 'priority',
    minPlayers: 3,
    maxPlayers: 6,
    enabledBooks: ['SR5'], // Default to SR5 for 5e
    automation: {}, // All automations default to false
  });
  const [errors, setErrors] = useState<{ name?: string; minPlayers?: string; maxPlayers?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; minPlayers?: boolean; maxPlayers?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBooks, setAvailableBooks] = useState<Array<{ code: string; name: string }>>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);

  // Default automation keys
  const defaultAutomationKeys = [
    'initiative_automation',
    'matrix_trace',
    'recoil_tracking',
    'damage_tracking',
    'spell_cast',
    'skill_test',
  ];

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      edition: 'sr5',
      creationMethod: 'priority',
      minPlayers: 3,
      maxPlayers: 6,
      enabledBooks: ['SR5'],
      automation: {},
    });
    setErrors({});
    setTouched({});
    setAvailableBooks([]);
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors: { name?: string } = {};
      const newTouched: { name?: boolean } = { ...touched };
      
      if (!formData.name.trim()) {
        newErrors.name = 'Campaign name is required';
        newTouched.name = true;
      }
      
      setErrors(newErrors);
      setTouched(newTouched);
      // Mark field as touched so error displays
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    } else if (currentStep === 2) {
      const newErrors: { minPlayers?: string; maxPlayers?: string } = {};
      const newTouched: { minPlayers?: boolean; maxPlayers?: boolean } = { ...touched };
      
      if (formData.minPlayers < 1) {
        newErrors.minPlayers = 'Minimum players must be at least 1';
        newTouched.minPlayers = true;
      }
      
      if (formData.maxPlayers > 100) {
        newErrors.maxPlayers = 'Maximum players cannot exceed 100';
        newTouched.maxPlayers = true;
      }
      
      if (formData.minPlayers > formData.maxPlayers) {
        newErrors.maxPlayers = 'Maximum players must be greater than or equal to minimum players';
        newTouched.maxPlayers = true;
      }
      
      setErrors(newErrors);
      setTouched(newTouched);
      // Mark field as touched so error displays
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    // Clear errors when moving to next step
    setErrors({});
    setTouched({});
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate final step before submitting
    if (currentStep === 2) {
      const newErrors: { minPlayers?: string; maxPlayers?: string } = {};
      const newTouched: { minPlayers?: boolean; maxPlayers?: boolean } = { ...touched };
      
      if (formData.minPlayers < 1) {
        newErrors.minPlayers = 'Minimum players must be at least 1';
        newTouched.minPlayers = true;
      }
      
      if (formData.maxPlayers > 100) {
        newErrors.maxPlayers = 'Maximum players cannot exceed 100';
        newTouched.maxPlayers = true;
      }
      
      if (formData.minPlayers > formData.maxPlayers) {
        newErrors.maxPlayers = 'Maximum players must be greater than or equal to minimum players';
        newTouched.maxPlayers = true;
      }
      
      setErrors(newErrors);
      setTouched(newTouched);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await campaignApi.createCampaign({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        edition: formData.edition,
        creationMethod: formData.creationMethod,
        status: 'Active',
        enabledBooks: formData.enabledBooks.length > 0 ? formData.enabledBooks : undefined,
        automation: Object.keys(formData.automation).length > 0 ? formData.automation : undefined,
      });
      
      showSuccess('Campaign created', `Campaign "${formData.name}" has been created successfully.`);
      handleClose();
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      showError('Failed to create campaign', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    // Clear error when user starts typing
    if (errors.name && value.trim()) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    // Validate on blur if field is empty
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: 'Campaign name is required' });
    }
  };

  const handleMinPlayersChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setFormData({ ...formData, minPlayers: numValue });
    // Clear error when user starts typing
    if (errors.minPlayers) {
      setErrors({ ...errors, minPlayers: undefined });
    }
  };

  const handleMinPlayersBlur = () => {
    setTouched({ ...touched, minPlayers: true });
    // Validate on blur
    if (formData.minPlayers < 1) {
      setErrors({ ...errors, minPlayers: 'Minimum players must be at least 1' });
    } else if (formData.minPlayers > formData.maxPlayers) {
      setErrors({ ...errors, maxPlayers: 'Maximum players must be greater than or equal to minimum players' });
      setTouched({ ...touched, maxPlayers: true });
    } else if (errors.minPlayers) {
      setErrors({ ...errors, minPlayers: undefined });
    }
  };

  const handleMaxPlayersChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setFormData({ ...formData, maxPlayers: numValue });
    // Clear error when user starts typing
    if (errors.maxPlayers) {
      setErrors({ ...errors, maxPlayers: undefined });
    }
  };

  const handleMaxPlayersBlur = () => {
    setTouched({ ...touched, maxPlayers: true });
    // Validate on blur
    if (formData.maxPlayers > 100) {
      setErrors({ ...errors, maxPlayers: 'Maximum players cannot exceed 100' });
    } else if (formData.maxPlayers < formData.minPlayers) {
      setErrors({ ...errors, maxPlayers: 'Maximum players must be greater than or equal to minimum players' });
    } else if (errors.maxPlayers) {
      setErrors({ ...errors, maxPlayers: undefined });
    }
  };

  const loadAvailableBooks = useCallback(async (edition: string) => {
    try {
      setIsLoadingBooks(true);
      const books = await campaignApi.getEditionBooks(edition);
      const validBooks = Array.isArray(books) 
        ? books.filter((book): book is { code: string; name: string } => 
            book && typeof book === 'object' && typeof book.code === 'string' && typeof book.name === 'string'
          )
        : [];
      setAvailableBooks(validBooks);
      
      // For sr5, ensure SR5 is always selected
      if (edition === 'sr5') {
        setFormData(prev => {
          if (!prev.enabledBooks.includes('SR5')) {
            return {
              ...prev,
              enabledBooks: ['SR5', ...prev.enabledBooks.filter(b => b !== 'SR5')],
            };
          }
          return prev;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load available books';
      showError('Failed to load books', errorMessage);
      setAvailableBooks([]);
    } finally {
      setIsLoadingBooks(false);
    }
  }, [showError]);

  // Load books when Settings step is shown or edition changes
  useEffect(() => {
    if (isOpen && currentStep === 2 && formData.edition) {
      loadAvailableBooks(formData.edition);
    }
  }, [isOpen, currentStep, formData.edition, loadAvailableBooks]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            touched={touched}
            onNameChange={handleNameChange}
            onNameBlur={handleNameBlur}
          />
        );
      case 2:
        return (
          <SettingsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            touched={touched}
            availableBooks={availableBooks}
            isLoadingBooks={isLoadingBooks}
            selectedAutomations={selectedAutomations}
            setSelectedAutomations={setSelectedAutomations}
            defaultAutomationKeys={defaultAutomationKeys}
            onMinPlayersChange={handleMinPlayersChange}
            onMinPlayersBlur={handleMinPlayersBlur}
            onMaxPlayersChange={handleMaxPlayersChange}
            onMaxPlayersBlur={handleMaxPlayersBlur}
          />
        );
      default:
        return <div>Step {currentStep}</div>;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              Create Campaign
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
          <div className="px-6 py-4 border-b border-sr-light-gray bg-sr-light-gray/30">
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= 1 ? 'bg-sr-accent text-white' : 'bg-sr-light-gray text-gray-400'
              }`}>
                1
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-gray-100' : 'text-gray-400'}`}>General</span>
              <div className="flex-1 h-px bg-sr-light-gray mx-2" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= 2 ? 'bg-sr-accent text-white' : 'bg-sr-light-gray text-gray-400'
              }`}>
                2
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-gray-100' : 'text-gray-400'}`}>Settings</span>
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
              {currentStep < 2 ? (
                <Button
                  onPress={handleNext}
                  className={`px-4 py-2 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors ${
                    currentStep === 1 && !formData.name.trim()
                      ? 'bg-sr-gray border-sr-light-gray opacity-60 cursor-not-allowed'
                      : 'bg-sr-accent border-sr-accent hover:bg-sr-accent/80'
                  }`}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  isDisabled={isSubmitting}
                  className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

interface GeneralStepProps {
  formData: WizardData;
  setFormData: (data: WizardData | ((prev: WizardData) => WizardData)) => void;
  errors: { name?: string };
  touched: { name?: boolean };
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
}

function GeneralStep({
  formData,
  setFormData,
  errors,
  touched,
  onNameChange,
  onNameBlur,
}: GeneralStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">General Information</h3>
        <p className="text-sm text-gray-400 mb-6">
          Provide basic information about your campaign.
        </p>
      </div>

      {/* Campaign Name */}
      <TextField
        value={formData.name}
        onChange={onNameChange}
        onBlur={onNameBlur}
        isRequired
        isInvalid={!!errors.name && !!touched.name}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <label className="text-sm font-medium text-gray-300">Campaign Name</label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
          placeholder="Enter campaign name"
        />
        {errors.name && touched.name && (
          <FieldError className="text-sm text-sr-danger mt-1">{errors.name}</FieldError>
        )}
      </TextField>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <TextArea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent min-h-[100px] resize-y"
          placeholder="Enter campaign description (optional)"
        />
      </div>
    </div>
  );
}

interface SettingsStepProps {
  formData: WizardData;
  setFormData: (data: WizardData | ((prev: WizardData) => WizardData)) => void;
  errors: { minPlayers?: string; maxPlayers?: string };
  touched: { minPlayers?: boolean; maxPlayers?: boolean };
  availableBooks: Array<{ code: string; name: string }>;
  isLoadingBooks: boolean;
  selectedAutomations: string[];
  setSelectedAutomations: (automations: string[] | ((prev: string[]) => string[])) => void;
  defaultAutomationKeys: string[];
  onMinPlayersChange: (value: string) => void;
  onMinPlayersBlur: () => void;
  onMaxPlayersChange: (value: string) => void;
  onMaxPlayersBlur: () => void;
}

function SettingsStep({
  formData,
  setFormData,
  errors,
  touched,
  availableBooks,
  isLoadingBooks,
  selectedAutomations,
  setSelectedAutomations,
  defaultAutomationKeys,
  onMinPlayersChange,
  onMinPlayersBlur,
  onMaxPlayersChange,
  onMaxPlayersBlur,
}: SettingsStepProps) {
  const editions = [
    { value: 'sr5', label: 'Shadowrun 5th Edition' },
    { value: 'sr3', label: 'Shadowrun 3rd Edition' },
  ];

  const creationMethods = [
    { value: 'priority', label: 'Priority' },
    { value: 'sum_to_ten', label: 'Sum-to-Ten' },
    { value: 'karma', label: 'Karma Point-Buy' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Campaign Settings</h3>
        <p className="text-sm text-gray-400 mb-6">
          Configure the rules and player limits for your campaign.
        </p>
      </div>

      {/* Edition */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Edition</label>
        <Select
          selectedKey={formData.edition}
          onSelectionChange={(key) => {
            const newEdition = key as string;
            // Reset enabled books when edition changes
            // For sr5, default to SR5
            const defaultBooks = newEdition === 'sr5' ? ['SR5'] : [];
            setFormData({ ...formData, edition: newEdition, enabledBooks: defaultBooks });
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
              {editions.map((edition) => (
                <ListBoxItem
                  key={edition.value}
                  id={edition.value}
                  textValue={edition.label}
                  className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                >
                  {edition.label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      </div>

      {/* Creation Method */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Character Creation Method</label>
        <Select
          selectedKey={formData.creationMethod}
          onSelectionChange={(key) => setFormData({ ...formData, creationMethod: key as string })}
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
              {creationMethods.map((method) => (
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
      </div>

      {/* Player Count */}
      <div className="grid grid-cols-2 gap-4">
        {/* Minimum Players */}
        <TextField
          value={String(formData.minPlayers)}
          onChange={onMinPlayersChange}
          onBlur={onMinPlayersBlur}
          isRequired
          isInvalid={!!errors.minPlayers && !!touched.minPlayers}
          validationBehavior="aria"
          className="flex flex-col gap-1"
        >
          <label className="text-sm font-medium text-gray-300">Minimum Players</label>
          <Input
            type="number"
            min={1}
            max={100}
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
            placeholder="3"
          />
          {errors.minPlayers && touched.minPlayers && (
            <FieldError className="text-sm text-sr-danger mt-1">{errors.minPlayers}</FieldError>
          )}
        </TextField>

        {/* Maximum Players */}
        <TextField
          value={String(formData.maxPlayers)}
          onChange={onMaxPlayersChange}
          onBlur={onMaxPlayersBlur}
          isRequired
          isInvalid={!!errors.maxPlayers && !!touched.maxPlayers}
          validationBehavior="aria"
          className="flex flex-col gap-1"
        >
          <label className="text-sm font-medium text-gray-300">Maximum Players</label>
          <Input
            type="number"
            min={1}
            max={100}
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
            placeholder="100"
          />
          {errors.maxPlayers && touched.maxPlayers && (
            <FieldError className="text-sm text-sr-danger mt-1">{errors.maxPlayers}</FieldError>
          )}
        </TextField>
      </div>

      {/* Enabled Books */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Enabled Books</label>
        {isLoadingBooks ? (
          <div className="text-sm text-gray-400">Loading books...</div>
        ) : availableBooks.length === 0 ? (
          <div className="text-sm text-gray-400">No books available for this edition</div>
        ) : (
          <div className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30 max-h-60 overflow-y-auto">
            {availableBooks.map((book, index) => {
              const bookKey = `book-${book.code}-${index}`;
              const isSR5 = book.code === 'SR5';
              const isSelected = formData.enabledBooks.includes(book.code);
              const isDisabled = isSR5 && formData.edition === 'sr5'; // SR5 is always selected for 5e
              
              return (
                <div key={bookKey} className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onChange={(selected) => {
                      if (selected) {
                        setFormData(prev => ({
                          ...prev,
                          enabledBooks: [...prev.enabledBooks, book.code],
                        }));
                      } else if (!isDisabled) {
                        setFormData(prev => ({
                          ...prev,
                          enabledBooks: prev.enabledBooks.filter(b => b !== book.code),
                        }));
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {({ isSelected: checked }) => (
                      <div className={`w-4 h-4 border-2 border-sr-light-gray rounded bg-sr-gray flex items-center justify-center transition-colors ${checked ? 'bg-sr-accent border-sr-accent' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <svg
                          className={`w-3 h-3 text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
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
                  <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-100'}`}>
                    {book.name || book.code}
                    {isDisabled && <span className="ml-2 text-xs text-gray-500">(Required)</span>}
                  </span>
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
            defaultAutomationKeys.forEach((key) => {
              updatedAutomation[key] = newValues.includes(key);
            });
            setFormData(prev => ({ ...prev, automation: updatedAutomation }));
          }}
          className="space-y-2 border border-sr-light-gray rounded-md p-3 bg-sr-light-gray/30"
        >
          {defaultAutomationKeys.map((key, index) => {
            const automationKey = typeof key === 'string' ? key : String(key);
            const automationInfo = getAutomationInfo(automationKey);
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
  );
}

