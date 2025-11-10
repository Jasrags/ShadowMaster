import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEdition } from '../hooks/useEdition';
import { CharacterCreationData, CreationMethodDefinition, UserSummary } from '../types/editions';

interface Props {
  targetId?: string;
  onCreated?: () => void;
}

interface Option<T extends string = string> {
  label: string;
  value: T;
}

const DEFAULT_CREATION_METHOD_OPTIONS: Option[] = [
  { label: 'Priority (default)', value: 'priority' },
  { label: 'Sum-to-Ten (coming soon)', value: 'sum_to_ten' },
  { label: 'Karma (coming soon)', value: 'karma' },
];

export function CampaignCreation({ targetId = 'campaign-creation-react-root', onCreated }: Props) {
  const {
    activeEdition,
    supportedEditions,
    characterCreationData,
    reloadEditionData,
    setEdition,
  } = useEdition();

  const [container, setContainer] = useState<Element | null>(null);
  const [selectedEdition, setSelectedEdition] = useState(activeEdition.key);
  const [editionData, setEditionData] = useState<CharacterCreationData | undefined>(characterCreationData);
  const [gameplayLevels, setGameplayLevels] = useState<Option[]>([]);
  const [name, setName] = useState('');
  const [gmUserId, setGmUserId] = useState<string>('');
  const [selectedGameplayLevel, setSelectedGameplayLevel] = useState<string>('experienced');
  const [selectedCreationMethod, setSelectedCreationMethod] = useState<string>('priority');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [creationMethods, setCreationMethods] = useState<Record<string, CreationMethodDefinition>>({});
  const [creationMethodOptions, setCreationMethodOptions] = useState<Option[]>(DEFAULT_CREATION_METHOD_OPTIONS);
  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(targetId));
  }, [targetId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const timeout = window.setTimeout(() => {
      const input = document.getElementById('campaign-name');
      input?.focus({ preventScroll: false });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    setSelectedEdition(activeEdition.key);
  }, [activeEdition.key]);

  useEffect(() => {
    async function loadEdition(key: typeof selectedEdition) {
      try {
        const response = await fetch(`/api/editions/${key}/character-creation`);
        if (!response.ok) {
          throw new Error(`Failed to load edition data (${response.status})`);
        }
        const data = await response.json();
        const creationData: CharacterCreationData = data?.character_creation ?? data;
        setEditionData(creationData);
        setCreationMethods(creationData.creation_methods ?? {});
        const levels = Object.entries(creationData.gameplay_levels ?? {}).map(([value, { label }]) => ({
          value,
          label: label || value,
        }));
        setGameplayLevels(levels);
        if (!levels.some((level) => level.value === selectedGameplayLevel)) {
          setSelectedGameplayLevel(levels[0]?.value ?? 'experienced');
        }
      } catch (err) {
        console.error('Failed to load edition data', err);
      }
    }

    void loadEdition(selectedEdition);
  }, [selectedEdition, selectedGameplayLevel]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users?role=gamemaster,administrator');
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }
        const payload: UserSummary[] = await response.json();
        if (!Array.isArray(payload) || payload.length === 0) {
          setUsers([]);
          return;
        }
        setUsers(payload);
        if (payload.length > 0) {
          setGmUserId((previous) => previous || payload[0].id);
        }
      } catch (err) {
        console.error('Failed to load users', err);
        setUsers([]);
      }
    }

    void loadUsers();
  }, []);

  useEffect(() => {
    if (!editionData && characterCreationData) {
      setEditionData(characterCreationData);
      setCreationMethods(characterCreationData.creation_methods ?? {});
    }
  }, [characterCreationData, editionData]);

  useEffect(() => {
    if (!editionData && Object.keys(creationMethods).length === 0) {
      setCreationMethodOptions(DEFAULT_CREATION_METHOD_OPTIONS);
      return;
    }
    if (!creationMethods || Object.keys(creationMethods).length === 0) {
      setCreationMethodOptions(DEFAULT_CREATION_METHOD_OPTIONS);
      return;
    }
    const options = Object.entries(creationMethods).map(([value, definition]) => ({
      value,
      label: definition.label || value,
    }));
    setCreationMethodOptions(options);
  }, [creationMethods, editionData]);

  useEffect(() => {
    if (creationMethodOptions.length === 0) {
      return;
    }
    if (!creationMethodOptions.some((option) => option.value === selectedCreationMethod)) {
      setSelectedCreationMethod(creationMethodOptions[0].value);
    }
  }, [creationMethodOptions, selectedCreationMethod]);

  const editionOptions = useMemo<Option[]>(() => {
    return supportedEditions.map((edition) => ({
      label: edition.label,
      value: edition.key,
    }));
  }, [supportedEditions]);

  const gmOptions = useMemo<Option[]>(() => {
    if (users.length === 0) {
      return [{ label: 'No gamemasters found', value: '' }];
    }
    return users.map((user) => ({
      label: `${user.username} (${user.email})`,
      value: user.id,
    }));
  }, [users]);

  function resetForm() {
    setName('');
    setSelectedGameplayLevel('experienced');
    setSelectedCreationMethod(creationMethodOptions[0]?.value ?? 'priority');
    setGmUserId(users[0]?.id ?? '');
    setError(null);
  }

  function handleOpen() {
    resetForm();
    setIsOpen(true);
  }

  function handleCancel() {
    resetForm();
    setIsOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const gmUser = users.find((user) => user.id === gmUserId);

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gm_user_id: gmUserId,
          gm_name: gmUser?.username ?? gmUser?.email ?? '',
          edition: selectedEdition,
          gameplay_level: selectedGameplayLevel,
          creation_method: selectedCreationMethod,
          status: 'Active',
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to create campaign (${response.status})`);
      }

      resetForm();
      window.ShadowmasterLegacyApp?.loadCampaigns?.();
      window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
      onCreated?.();
      setIsOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create campaign.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!container) {
    return null;
  }

  return createPortal(
    <section
      className={`campaign-create-react ${isOpen ? 'campaign-create-react--open' : 'campaign-create-react--collapsed'}`}
    >
      {!isOpen ? (
        <div className="campaign-create-trigger">
          <div className="campaign-create-trigger__copy">
            <h3>Plan Your Next Campaign</h3>
            <p>Select an edition, assign a GM, and lock in gameplay defaults.</p>
          </div>
          <button type="button" className="btn-primary" onClick={handleOpen}>
            Create Campaign
          </button>
        </div>
      ) : (
        <>
          <h3>Create Campaign</h3>
          <form className="campaign-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="campaign-name">Campaign Name</label>
              <input
                id="campaign-name"
                name="campaign-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Enter campaign title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="campaign-edition">Edition</label>
              <select
                id="campaign-edition"
                name="campaign-edition"
                value={selectedEdition}
                onChange={(event) => {
                  const value = event.target.value as typeof selectedEdition;
                  setSelectedEdition(value);
                  setEdition(value);
                  void reloadEditionData(value);
                }}
              >
                {editionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {gameplayLevels.length > 0 && (
              <div className="form-group">
                <label htmlFor="campaign-gameplay-level">Gameplay Level</label>
                <select
                  id="campaign-gameplay-level"
                  name="campaign-gameplay-level"
                  value={selectedGameplayLevel}
                  onChange={(event) => setSelectedGameplayLevel(event.target.value)}
                >
                  {gameplayLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="campaign-creation-method">Character Creation Method</label>
              <select
                id="campaign-creation-method"
                name="campaign-creation-method"
                value={selectedCreationMethod}
                onChange={(event) => setSelectedCreationMethod(event.target.value)}
              >
                {creationMethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="form-help">
                {creationMethods[selectedCreationMethod]?.description && (
                  <p>{creationMethods[selectedCreationMethod]?.description}</p>
                )}
                {selectedCreationMethod !== 'priority' && (
                  <p>
                    Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily
                    default to Priority until the new workflows are implemented.
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="campaign-gm">Gamemaster</label>
              <select
                id="campaign-gm"
                name="campaign-gm"
                value={gmUserId}
                onChange={(event) => setGmUserId(event.target.value)}
              >
                {gmOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="button" className="btn-secondary" disabled={isSubmitting} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </>
      )}
    </section>,
    container,
  );
}

