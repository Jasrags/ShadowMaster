import type { Contact } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface ContactViewModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContactViewModal({ contact, isOpen, onOpenChange }: ContactViewModalProps) {
  if (!contact) return null;

  return (
    <ViewModal
      item={contact}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={contact.source ? <span className="text-gray-400">Source: {contact.source}</span> : undefined}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {contact.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{contact.description}</p>
          </Section>
        )}

        {contact.uses && contact.uses.length > 0 && (
          <Section title="Uses">
            <ul className="list-disc list-inside space-y-1">
              {contact.uses.map((use, index) => (
                <li key={index} className="text-sm text-gray-200">
                  {use}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {contact.places_to_meet && (
          <Section title="Places to Meet">
            <p className="text-sm text-gray-200">{contact.places_to_meet}</p>
          </Section>
        )}

        {contact.similar_contacts && contact.similar_contacts.length > 0 && (
          <Section title="Similar Contacts">
            <ul className="list-disc list-inside space-y-1">
              {contact.similar_contacts.map((similar, index) => (
                <li key={index} className="text-sm text-gray-200">
                  {similar}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {contact.id && (
          <Section title="Details">
            <FieldGrid columns={2}>
              <LabelValue label="ID" value={<span className="font-mono text-xs">{contact.id}</span>} />
            </FieldGrid>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

