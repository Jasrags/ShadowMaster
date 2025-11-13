import { useEffect, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TextInput } from './common/TextInput';
import { useCharacterWizard } from '../context/CharacterWizardContext';

export interface ContactEntry {
  id: string;
  name: string;
  type: string;
  level: number;
  loyalty: number;
  notes?: string;
}

export interface ContactsState {
  contacts: ContactEntry[];
}

interface ContactsAllocationProps {
  storedContacts?: ContactEntry[];
  onBack: () => void;
  onStateChange: (state: ContactsState) => void;
  onSave: (state: ContactsState) => void;
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ContactsAllocation({
  storedContacts = [],
  onBack,
  onStateChange,
  onSave,
}: ContactsAllocationProps) {
  // Initialize with 2 free level 1 contacts if none exist
  const initialContacts = useMemo(() => {
    if (storedContacts.length > 0) {
      return storedContacts;
    }
    return [
      {
        id: generateId('contact'),
        name: '',
        type: 'General',
        level: 1,
        loyalty: 1,
        notes: 'Free level 1 contact',
      },
      {
        id: generateId('contact'),
        name: '',
        type: 'General',
        level: 1,
        loyalty: 1,
        notes: 'Free level 1 contact',
      },
    ];
  }, [storedContacts]);

  const [contacts, setContacts] = useState<ContactEntry[]>(initialContacts);

  const validation = useMemo(() => {
    const emptyNames = contacts.filter((c) => !c.name.trim());
    if (emptyNames.length > 0) {
      return {
        status: 'error' as const,
        message: 'All contacts must have a name.',
      };
    }
    const invalidLevels = contacts.filter((c) => c.level < 1 || c.level > 3);
    if (invalidLevels.length > 0) {
      return {
        status: 'error' as const,
        message: 'Contact level must be between 1 and 3.',
      };
    }
    const invalidLoyalty = contacts.filter((c) => c.loyalty < 1 || c.loyalty > 3);
    if (invalidLoyalty.length > 0) {
      return {
        status: 'error' as const,
        message: 'Contact loyalty must be between 1 and 3.',
      };
    }
    return {
      status: 'success' as const,
      message: `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} configured.`,
    };
  }, [contacts]);

  const state: ContactsState = useMemo(
    () => ({
      contacts,
    }),
    [contacts],
  );

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  const handleSave = () => {
    if (validation.status === 'success') {
      onSave(state);
    }
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: generateId('contact'),
        name: '',
        type: 'General',
        level: 1,
        loyalty: 1,
      },
    ]);
  };

  const updateContact = (id: string, updates: Partial<ContactEntry>) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const renderContactList = () => (
    <div className="contacts-list" aria-label="Contacts">
      {contacts.length === 0 ? (
        <p className="contacts-list__empty">No contacts yet.</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact.id} className="contacts-list__row">
            <div className="contacts-list__fields">
              <label className="contacts-list__field" htmlFor={`${contact.id}-name`}>
                <span className="contacts-list__field-label">Name</span>
                <TextInput
                  id={`${contact.id}-name`}
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                  placeholder="e.g., Fixer Joe"
                />
              </label>
              <label className="contacts-list__field" htmlFor={`${contact.id}-type`}>
                <span className="contacts-list__field-label">Type</span>
                <TextInput
                  id={`${contact.id}-type`}
                  value={contact.type}
                  onChange={(e) => updateContact(contact.id, { type: e.target.value })}
                  placeholder="e.g., Fixer, Dealer"
                />
              </label>
              <label className="contacts-list__field" htmlFor={`${contact.id}-level`}>
                <span className="contacts-list__field-label">Level (1-3)</span>
                <input
                  id={`${contact.id}-level`}
                  type="number"
                  min={1}
                  max={3}
                  value={contact.level}
                  onChange={(e) =>
                    updateContact(contact.id, { level: Number.parseInt(e.target.value, 10) || 1 })
                  }
                />
              </label>
              <label className="contacts-list__field" htmlFor={`${contact.id}-loyalty`}>
                <span className="contacts-list__field-label">Loyalty (1-3)</span>
                <input
                  id={`${contact.id}-loyalty`}
                  type="number"
                  min={1}
                  max={3}
                  value={contact.loyalty}
                  onChange={(e) =>
                    updateContact(contact.id, { loyalty: Number.parseInt(e.target.value, 10) || 1 })
                  }
                />
              </label>
            </div>
            <button type="button" className="btn-link" onClick={() => removeContact(contact.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const validationClass = `contacts-allocation__validation contacts-allocation__validation--${validation.status}`;

  return (
    <div className="contacts-allocation">
      <header className="contacts-allocation__header">
        <div className="contacts-allocation__summary">
          <span>
            Total Contacts: <strong>{contacts.length}</strong>
          </span>
          <span>
            Free Contacts: <strong>{contacts.filter((c) => c.level === 1 && c.loyalty === 1).length}</strong>
          </span>
        </div>
        <div className={validationClass}>{validation.message}</div>
      </header>

      <section className="contacts-allocation__body">
        <div className="contacts-allocation__category">
          <div className="contacts-allocation__category-header">
            <h4>Contacts</h4>
            <button type="button" className="btn-secondary" onClick={addContact}>
              Add Contact
            </button>
          </div>
          {renderContactList()}
        </div>
      </section>

      <footer className="contacts-allocation__footer">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Equipment
        </button>
        <div
          className={`contacts-allocation__status ${validation.status === 'success' ? 'contacts-allocation__status--ready' : ''}`}
        >
          {validation.status === 'success'
            ? `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} ready`
            : 'Complete contact information to continue.'}
        </div>
        <button type="button" className="btn-primary" disabled={validation.status !== 'success'} onClick={handleSave}>
          Save Contacts
        </button>
      </footer>
    </div>
  );
}

interface LegacyContactsState {
  contacts?: ContactEntry[];
}

export function ContactsPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const wizard = useCharacterWizard();
  const [storedContacts, setStoredContacts] = useState<ContactEntry[]>([]);

  useEffect(() => {
    setContainer(document.getElementById('contacts-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-contacts-enabled');
    return () => {
      document.body.classList.remove('react-contacts-enabled');
    };
  }, []);

  const contextContacts = wizard.state.contacts;

  // Use ref to track previous JSON string and only update when it actually changes
  const prevContactsKey = useRef<string>('');

  useEffect(() => {
    const contactsKey = JSON.stringify(contextContacts);
    
    // Only update if contacts actually changed
    if (contactsKey !== prevContactsKey.current) {
      prevContactsKey.current = contactsKey;
      
      setStoredContacts(contextContacts.map((entry) => ({
        id: entry.id,
        name: entry.name,
        type: entry.type,
        level: entry.level,
        loyalty: entry.loyalty,
        notes: entry.notes,
      })));
    }
    // Note: We intentionally don't include contextContacts in deps to avoid infinite loops
    // The effect will run on every render, but we check if contacts actually changed via JSON.stringify
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateChange = (state: ContactsState) => {
    const existingKey = JSON.stringify(wizard.state.contacts);
    const nextKey = JSON.stringify(state.contacts);
    if (existingKey !== nextKey) {
      wizard.setContacts(state.contacts);
    }
  };

  const handleSave = (state: ContactsState) => {
    handleStateChange(state);
    wizard.navigateToStep(8); // Move to Lifestyle step
  };

  const handleBack = () => {
    wizard.navigateToStep(6); // Back to Equipment step
  };

  if (!container) {
    return null;
  }

  return createPortal(
    <ContactsAllocation storedContacts={storedContacts} onBack={handleBack} onStateChange={handleStateChange} onSave={handleSave} />,
    container,
  );
}

