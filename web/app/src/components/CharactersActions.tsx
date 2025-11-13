import { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useWizard } from '../context/WizardContext';

export function CharactersActions() {
  const [container, setContainer] = useState<Element | null>(null);
  const { openWizard } = useWizard();

  useEffect(() => {
    setContainer(document.getElementById('characters-actions'));
    
    // Expose function for legacy code compatibility
    (window as any).openCharacterWizard = (campaignId?: string | null) => {
      openWizard(campaignId);
    };
  }, [openWizard]);

  if (!container) {
    return null;
  }

  const handleCreateCharacter = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.nativeEvent && typeof event.nativeEvent.stopImmediatePropagation === 'function') {
      event.nativeEvent.stopImmediatePropagation();
    }

    window.ShadowmasterLegacyApp?.clearCampaignCharacterCreation?.();
    openWizard();
  };

  return createPortal(
    <section className="campaign-create-react campaign-create-react--collapsed characters-actions">
      <div className="campaign-create-trigger">
        <div className="campaign-create-trigger__copy">
          <h3>Plan Your Next Runner</h3>
          <p>Build new characters and keep your roster ready for the next mission.</p>
        </div>
        <button
          id="create-character-btn"
          type="button"
          className="btn-primary"
          onClick={handleCreateCharacter}
        >
          Create Character
        </button>
      </div>
    </section>,
    container,
  );
}

