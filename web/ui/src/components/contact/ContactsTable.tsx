import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Contact } from '../../lib/types';
import { ContactViewModal } from './ContactViewModal';

interface ContactsTableProps {
  contacts: Contact[];
}

export const ContactsTable = memo(function ContactsTable({ contacts }: ContactsTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameClick = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Contact>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Contact) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'uses',
      header: 'Uses',
      accessor: (row: Contact) => row.uses?.join(', ') || '-',
      sortable: true,
    },
    {
      id: 'places_to_meet',
      header: 'Places to Meet',
      accessor: 'places_to_meet',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
  ], [handleNameClick]);

  return (
    <>
      <DataTable
        data={contacts}
        columns={columns}
        searchFields={['name', 'uses', 'places_to_meet', 'source', 'description']}
        searchPlaceholder="Search contacts by name, uses, places to meet, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No contacts available"
        emptySearchMessage="No contacts found matching your search criteria."
        ariaLabel="Contacts data table"
      />
      <ContactViewModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

