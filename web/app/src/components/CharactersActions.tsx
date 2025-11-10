import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function openCreateCharacterModal() {
  if (typeof window.showCreateCharacterModal === 'function') {
    window.showCreateCharacterModal();
    return;
  }

  window.ShadowmasterLegacyApp?.showWizardStep?.(1);
  const modal = document.getElementById('character-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

export function CharactersActions() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('characters-actions'));
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <div className="characters-callout">
      <div className="characters-callout__copy">
        <h2>Characters</h2>
        <p>
          Build new runners, review existing sheets, and keep your roster ready for the next mission.
        </p>
      </div>
      <div className="characters-callout__actions">
        <button
          id="create-character-btn"
          type="button"
          className="btn btn-primary"
          onClick={openCreateCharacterModal}
        >
          Create Character
        </button>
      </div>
    </div>,
    container,
  );
}

