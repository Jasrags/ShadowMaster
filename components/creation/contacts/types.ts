import type { CreationState, Contact, ContactTemplateData } from "@/lib/types";

export interface ContactsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialContact?: Contact;
  isEditing: boolean;
  templates: ContactTemplateData[];
  maxCost: number;
  availableKarma: number;
}
