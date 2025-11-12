import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ShadowmasterLegacyApp } from '../types/legacy';

interface CharacterReviewProps {
  characterName: string;
  playerName: string;
  onBack: () => void;
  onSubmit: (data: CharacterSubmissionData) => Promise<void>;
}

export interface CharacterSubmissionData {
  name: string;
  player_name: string;
  edition: string;
  edition_data: {
    magic_priority: string;
    metatype_priority: string;
    attr_priority: string;
    skills_priority: string;
    resources_priority: string;
    metatype: string;
    magical_type?: string;
    tradition?: string;
    totem?: string;
    attributes: Record<string, number>;
    skills: {
      active: Array<{ name: string; rating: number }>;
      knowledge: Array<{ name: string; rating: number }>;
    };
    equipment: {
      weapons: Array<unknown>;
      armor: Array<unknown>;
      cyberware: Array<unknown>;
      bioware: Array<unknown>;
      gear: Array<unknown>;
      vehicles: Array<unknown>;
    };
    contacts: Array<{ name: string; type: string; level: number; loyalty: number }>;
    lifestyle: string;
  };
}

function CharacterReview({ characterName, playerName, onBack, onSubmit }: CharacterReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Partial<CharacterSubmissionData['edition_data']>>({});

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (!legacy) return;

    // Collect all wizard state
    const priorities = legacy.getPriorities?.() ?? {};
    const metatypeSelection = legacy.getMetatypeSelection?.() ?? null;
    const magicState = legacy.getMagicState?.();
    const attributesState = legacy.getAttributesState?.();
    const skillsState = legacy.getSkillsState?.();
    const equipmentState = legacy.getEquipmentState?.();
    const contactsState = legacy.getContactsState?.();
    const lifestyleState = legacy.getLifestyleState?.();

    setSummary({
      magic_priority: priorities.magic ?? '',
      metatype_priority: priorities.metatype ?? '',
      attr_priority: priorities.attributes ?? '',
      skills_priority: priorities.skills ?? '',
      resources_priority: priorities.resources ?? '',
      metatype: metatypeSelection ?? '',
      magical_type: magicState?.type ?? undefined,
      tradition: magicState?.tradition ?? undefined,
      totem: magicState?.totem ?? undefined,
      attributes: attributesState?.values ?? {},
      skills: {
        active: skillsState?.active?.map((s) => ({ name: s.name, rating: s.rating })) ?? [],
        knowledge: skillsState?.knowledge?.map((s) => ({ name: s.name, rating: s.rating })) ?? [],
      },
      equipment: {
        weapons: equipmentState?.weapons ?? [],
        armor: equipmentState?.armor ?? [],
        cyberware: equipmentState?.cyberware ?? [],
        bioware: equipmentState?.bioware ?? [],
        gear: equipmentState?.gear ?? [],
        vehicles: equipmentState?.vehicles ?? [],
      },
      contacts: contactsState?.contacts?.map((c) => ({
        name: c.name,
        type: c.type ?? 'General',
        level: c.level ?? 1,
        loyalty: c.loyalty ?? 1,
      })) ?? [],
      lifestyle: lifestyleState?.lifestyle ?? '',
    });
  }, []);

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!characterName.trim()) {
      errors.push('Character name is required');
    }
    if (!summary.magic_priority || !summary.metatype_priority || !summary.attr_priority || !summary.skills_priority || !summary.resources_priority) {
      errors.push('All priorities must be assigned');
    }
    if (!summary.metatype) {
      errors.push('Metatype must be selected');
    }
    if (!summary.attributes || Object.keys(summary.attributes).length === 0) {
      errors.push('Attributes must be assigned');
    }
    if (!summary.skills || (summary.skills.active.length === 0 && summary.skills.knowledge.length === 0)) {
      errors.push('At least one skill must be assigned');
    }
    if (!summary.lifestyle) {
      errors.push('Lifestyle must be selected');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [characterName, summary]);

  const handleSubmit = async () => {
    if (!validation.valid) {
      setSubmitError(validation.errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submissionData: CharacterSubmissionData = {
        name: characterName,
        player_name: playerName,
        edition: 'sr3',
        edition_data: summary as CharacterSubmissionData['edition_data'],
      };

      await onSubmit(submissionData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create character');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="character-review">
      <header className="character-review__header">
        <h3>Review Character</h3>
        <p className="help-text">Review your character details before finalizing creation.</p>
      </header>

      <section className="character-review__body">
        <div className="character-review__section">
          <h4>Basic Information</h4>
          <div className="character-review__field">
            <strong>Character Name:</strong> {characterName || <em>Not set</em>}
          </div>
          <div className="character-review__field">
            <strong>Player Name:</strong> {playerName || <em>Not set</em>}
          </div>
        </div>

        <div className="character-review__section">
          <h4>Priorities</h4>
          <div className="character-review__grid">
            <div className="character-review__field">
              <strong>Magic:</strong> {summary.magic_priority || <em>Not assigned</em>}
            </div>
            <div className="character-review__field">
              <strong>Metatype:</strong> {summary.metatype_priority || <em>Not assigned</em>}
            </div>
            <div className="character-review__field">
              <strong>Attributes:</strong> {summary.attr_priority || <em>Not assigned</em>}
            </div>
            <div className="character-review__field">
              <strong>Skills:</strong> {summary.skills_priority || <em>Not assigned</em>}
            </div>
            <div className="character-review__field">
              <strong>Resources:</strong> {summary.resources_priority || <em>Not assigned</em>}
            </div>
          </div>
        </div>

        <div className="character-review__section">
          <h4>Metatype & Magic</h4>
          <div className="character-review__field">
            <strong>Metatype:</strong> {summary.metatype || <em>Not selected</em>}
          </div>
          {summary.magical_type && (
            <>
              <div className="character-review__field">
                <strong>Magical Type:</strong> {summary.magical_type}
              </div>
              {summary.tradition && (
                <div className="character-review__field">
                  <strong>Tradition:</strong> {summary.tradition}
                </div>
              )}
              {summary.totem && (
                <div className="character-review__field">
                  <strong>Totem:</strong> {summary.totem}
                </div>
              )}
            </>
          )}
        </div>

        <div className="character-review__section">
          <h4>Attributes</h4>
          <div className="character-review__grid">
            {summary.attributes &&
              Object.entries(summary.attributes).map(([key, value]) => (
                <div key={key} className="character-review__field">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </div>
              ))}
          </div>
        </div>

        <div className="character-review__section">
          <h4>Skills</h4>
          <div className="character-review__field">
            <strong>Active Skills:</strong> {summary.skills?.active.length || 0}
          </div>
          <div className="character-review__field">
            <strong>Knowledge Skills:</strong> {summary.skills?.knowledge.length || 0}
          </div>
        </div>

        <div className="character-review__section">
          <h4>Equipment</h4>
          <div className="character-review__grid">
            <div className="character-review__field">
              <strong>Weapons:</strong> {summary.equipment?.weapons.length || 0}
            </div>
            <div className="character-review__field">
              <strong>Armor:</strong> {summary.equipment?.armor.length || 0}
            </div>
            <div className="character-review__field">
              <strong>Cyberware:</strong> {summary.equipment?.cyberware.length || 0}
            </div>
            <div className="character-review__field">
              <strong>Bioware:</strong> {summary.equipment?.bioware.length || 0}
            </div>
            <div className="character-review__field">
              <strong>Gear:</strong> {summary.equipment?.gear.length || 0}
            </div>
            <div className="character-review__field">
              <strong>Vehicles:</strong> {summary.equipment?.vehicles.length || 0}
            </div>
          </div>
        </div>

        <div className="character-review__section">
          <h4>Contacts & Lifestyle</h4>
          <div className="character-review__field">
            <strong>Contacts:</strong> {summary.contacts?.length || 0}
          </div>
          <div className="character-review__field">
            <strong>Lifestyle:</strong> {summary.lifestyle || <em>Not selected</em>}
          </div>
        </div>

        {!validation.valid && (
          <div className="character-review__validation character-review__validation--error">
            <strong>Issues found:</strong>
            <ul>
              {validation.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {submitError && (
          <div className="character-review__validation character-review__validation--error">
            <strong>Error:</strong> {submitError}
          </div>
        )}
      </section>

      <footer className="character-review__footer">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={isSubmitting}>
          Back to Lifestyle
        </button>
        <div className="character-review__status">
          {validation.valid ? 'Ready to create character' : 'Please complete all required fields'}
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={!validation.valid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Creating...' : 'Create Character'}
        </button>
      </footer>
    </div>
  );
}

export function CharacterReviewPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    setContainer(document.getElementById('character-review-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-character-review-enabled');
    return () => {
      document.body.classList.remove('react-character-review-enabled');
    };
  }, []);

  useEffect(() => {
    // Get character name and player name from the form
    const nameInput = document.getElementById('char-name') as HTMLInputElement;
    const playerInput = document.getElementById('player-name') as HTMLInputElement;

    if (nameInput) {
      setCharacterName(nameInput.value);
      const updateName = () => setCharacterName(nameInput.value);
      nameInput.addEventListener('input', updateName);
      return () => nameInput.removeEventListener('input', updateName);
    }
  }, []);

  useEffect(() => {
    const playerInput = document.getElementById('player-name') as HTMLInputElement;
    if (playerInput) {
      setPlayerName(playerInput.value);
      const updatePlayer = () => setPlayerName(playerInput.value);
      playerInput.addEventListener('input', updatePlayer);
      return () => playerInput.removeEventListener('input', updatePlayer);
    }
  }, []);

  const handleBack = () => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(8); // Back to Lifestyle step
    }
  };

  const handleSubmit = async (data: CharacterSubmissionData) => {
    const response = await fetch('/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const character = await response.json();

    // Close modal and reload characters
    const modal = document.getElementById('character-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    // Notify success
    if (typeof window.ShadowmasterNotify === 'function') {
      window.ShadowmasterNotify({
        type: 'success',
        title: 'Character Created',
        description: `Character "${character.name}" has been created successfully.`,
      });
    }

    // Reload characters list
    if (typeof window.ShadowmasterLegacyApp?.loadCampaigns === 'function') {
      window.ShadowmasterLegacyApp.loadCampaigns();
    }

    // Trigger character list reload
    const loadCharactersEvent = new CustomEvent('reload-characters');
    window.dispatchEvent(loadCharactersEvent);
  };

  if (!container) {
    return null;
  }

  return createPortal(
    <CharacterReview characterName={characterName} playerName={playerName} onBack={handleBack} onSubmit={handleSubmit} />,
    container,
  );
}

