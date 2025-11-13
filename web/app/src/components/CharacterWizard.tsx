import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCharacterWizard } from '../context/CharacterWizardContext';
import { PriorityAssignment } from './PriorityAssignment';
import { MetatypeSelection } from './MetatypeSelection';
import { MagicalAbilitiesSelection } from './MagicalAbilitiesSelection';
import { AttributesPortal } from './AttributesAllocation';
import { SkillsPortal } from './SkillsAllocation';
import { EquipmentPortal } from './EquipmentAllocation';
import { ContactsPortal } from './ContactsAllocation';
import { LifestylePortal } from './LifestyleSelection';
import { CharacterReview } from './CharacterReview';
import { TextInput } from './common/TextInput';
import { useEdition } from '../hooks/useEdition';

const WIZARD_STEPS = [
  { number: 1, label: 'Priorities', key: 'priorities' },
  { number: 2, label: 'Metatype', key: 'metatype' },
  { number: 3, label: 'Magic', key: 'magic' },
  { number: 4, label: 'Attributes', key: 'attributes' },
  { number: 5, label: 'Skills', key: 'skills' },
  { number: 6, label: 'Equipment', key: 'equipment' },
  { number: 7, label: 'Contacts', key: 'contacts' },
  { number: 8, label: 'Lifestyle', key: 'lifestyle' },
  { number: 9, label: 'Review', key: 'review' },
] as const;

interface CharacterWizardProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string | null;
}

export function CharacterWizard({ isOpen, onClose, campaignId }: CharacterWizardProps) {
  const wizard = useCharacterWizard();
  const { characterCreationData, activeEdition } = useEdition();
  const currentStep = wizard.state.currentStep;
  const prevIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      // Reset wizard state when opening
      wizard.reset();
      wizard.setCurrentStep(1);
      const nextCampaignId = campaignId ?? null;
      if (wizard.state.campaignId !== nextCampaignId) {
        wizard.setCampaignId(nextCampaignId);
      }
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && wasOpen) {
      document.body.style.overflow = '';
      if (wizard.state.campaignId !== null) {
        wizard.setCampaignId(null);
      }
    }

    return () => {
      if (prevIsOpenRef.current) {
        document.body.style.overflow = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, campaignId]); // wizard methods are stable callbacks

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Sync character name and player name from DOM inputs if they exist
    // (for backward compatibility during migration)
    const nameInput = document.getElementById('char-name') as HTMLInputElement;
    const playerInput = document.getElementById('player-name') as HTMLInputElement;

    if (nameInput && nameInput.value && nameInput.value !== wizard.state.characterName) {
      wizard.setCharacterName(nameInput.value);
    }
    if (playerInput && playerInput.value && playerInput.value !== wizard.state.playerName) {
      wizard.setPlayerName(playerInput.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, wizard.state.characterName, wizard.state.playerName]); // wizard methods are stable callbacks

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    wizard.reset();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PriorityAssignment />;
      case 2:
        return (
          <MetatypeSelection
            priority={wizard.state.priorities.metatype ?? ''}
            selectedMetatype={wizard.state.selectedMetatype}
            onSelect={(id) => wizard.setSelectedMetatype(id)}
          />
        );
      case 3:
        return (
          <MagicalAbilitiesSelection
            priority={wizard.state.priorities.magic ?? ''}
            selection={wizard.state.magicSelection}
            onChange={(selection) => wizard.setMagicSelection(selection)}
          />
        );
      case 4:
        // Portal components will render into these containers automatically
        return (
          <>
            <div id="attributes-react-root" className="react-mount" />
            <AttributesPortal />
          </>
        );
      case 5:
        return (
          <>
            <div id="skills-react-root" className="react-mount" />
            <SkillsPortal />
          </>
        );
      case 6:
        return (
          <>
            <div id="equipment-react-root" className="react-mount" />
            <EquipmentPortal />
          </>
        );
      case 7:
        return (
          <>
            <div id="contacts-react-root" className="react-mount" />
            <ContactsPortal />
          </>
        );
      case 8:
        return (
          <>
            <div id="lifestyle-react-root" className="react-mount" />
            <LifestylePortal />
          </>
        );
      case 9:
        return (
          <CharacterReview
            characterName={wizard.state.characterName}
            playerName={wizard.state.playerName}
            onBack={() => wizard.navigateToStep(8)}
            onSubmit={async (data) => {
              // Character submission logic will be handled by CharacterReview
              // After successful submission, close the wizard
              handleClose();
            }}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content character-wizard-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close"
          onClick={handleClose}
          aria-label="Close character creation wizard"
        >
          &times;
        </button>
        
        <h2>Create Character</h2>

        {/* Character Name and Player Name Inputs */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <TextInput
              id="char-name"
              label="Character Name"
              value={wizard.state.characterName}
              onChange={(e) => wizard.setCharacterName(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <TextInput
              id="player-name"
              label="Player Name"
              value={wizard.state.playerName}
              onChange={(e) => wizard.setPlayerName(e.target.value)}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="wizard-progress">
          {WIZARD_STEPS.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            return (
              <div
                key={step.number}
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                data-step={step.number}
              >
                <span className="step-number">{step.number}</span>
                <span className="step-label">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="wizard-step-content">{renderStep()}</div>
      </div>
    </div>,
    document.body,
  );
}

