import { useEffect, useState, useCallback } from 'react';
import { contactApi } from '../lib/api';
import type { Contact } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { ContactsTable } from '../components/contact/ContactsTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function ContactsPage() {
  const { showError } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load contacts';
      showError('Failed to load contacts', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return (
    <DatabasePageLayout
      title="Contacts Database"
      description="View and search all available contact types from Shadowrun 5th Edition"
      itemCount={contacts.length}
      isLoading={isLoading}
    >
      <ContactsTable contacts={contacts} />
    </DatabasePageLayout>
  );
}

