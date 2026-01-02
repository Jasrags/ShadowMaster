"use client";

/**
 * ContactsCard
 *
 * Compact card for managing contacts during character creation.
 * Features:
 * - Contact karma budget (CHA × 3 free, then general karma)
 * - Modal-based contact add/edit with template selection
 * - Connection and Loyalty rating selectors
 * - Karma tracking for contacts
 */

import { useMemo, useCallback, useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2, Info, User } from "lucide-react";
import type { CreationState, Contact, ContactTemplateData } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { useContactTemplates, useMetatypes } from "@/lib/rules";
import { CreationCard } from "./shared";

// =============================================================================
// TYPES
// =============================================================================

interface ContactsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialContact?: Contact;
  isEditing: boolean;
  templates: ContactTemplateData[];
  maxCost: number;
  availableKarma: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_CONNECTION = 6;
const MAX_LOYALTY = 6;
const MAX_KARMA_PER_CONTACT = 7;
const MIN_KARMA_PER_CONTACT = 2;

// =============================================================================
// CONTACT MODAL COMPONENT
// =============================================================================

function ContactModal({
  isOpen,
  onClose,
  onSave,
  initialContact,
  isEditing,
  templates,
  availableKarma,
}: ContactModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [contact, setContact] = useState<Partial<Contact>>(
    initialContact || {
      name: "",
      type: "",
      connection: 1,
      loyalty: 1,
      notes: "",
    }
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialContact) {
        setContact(initialContact);
        setSelectedTemplateId(null);
      } else {
        setContact({
          name: "",
          type: "",
          connection: 1,
          loyalty: 1,
          notes: "",
        });
        setSelectedTemplateId(null);
      }
    }
  }, [isOpen, initialContact]);

  const contactCost = (contact.connection || 1) + (contact.loyalty || 1);

  const isValid = useMemo(() => {
    if (!contact.name?.trim()) return false;
    if (contactCost < MIN_KARMA_PER_CONTACT) return false;
    if (contactCost > MAX_KARMA_PER_CONTACT) return false;
    if (contactCost > availableKarma) return false;
    return true;
  }, [contact.name, contactCost, availableKarma]);

  const handleSelectTemplate = useCallback(
    (template: ContactTemplateData | null) => {
      if (!template) {
        setSelectedTemplateId(null);
        setContact({
          name: "",
          type: "",
          connection: 1,
          loyalty: 1,
          notes: "",
        });
        return;
      }
      setSelectedTemplateId(template.id);
      setContact({
        name: "",
        type: template.name,
        connection: template.suggestedConnection,
        loyalty: template.suggestedLoyalty || 2,
        notes: template.description,
      });
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!isValid) return;
    onSave({
      name: contact.name!.trim(),
      connection: contact.connection || 1,
      loyalty: contact.loyalty || 1,
      type: contact.type?.trim() || undefined,
      notes: contact.notes?.trim() || undefined,
    });
  }, [isValid, contact, onSave]);

  // Render rating selector (1-6 buttons)
  const renderRatingSelector = (
    value: number,
    onChange: (value: number) => void,
    max: number,
    label: string,
    color: "blue" | "rose"
  ) => {
    const colorClasses =
      color === "blue"
        ? {
            active: "bg-blue-500 text-white",
            inactive:
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
          }
        : {
            active: "bg-rose-500 text-white",
            inactive:
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-rose-100 dark:hover:bg-rose-900/30",
          };

    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                value >= rating ? colorClasses.active : colorClasses.inactive
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
            {isEditing ? "Edit Contact" : "New Contact"}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Template Selector (only for new contacts) */}
            {!isEditing && templates.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Start from Template (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(null)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedTemplateId === null
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "border-zinc-300 text-zinc-600 hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-500"
                    }`}
                  >
                    Custom
                  </button>
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      title={template.description}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedTemplateId === template.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "border-zinc-300 text-zinc-600 hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-500"
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
                {selectedTemplateId && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {templates.find((t) => t.id === selectedTemplateId)
                      ?.description}
                  </p>
                )}
              </div>
            )}

            {/* Name and Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contact.name || ""}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Contact's name or alias"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <input
                  type="text"
                  value={contact.type || ""}
                  onChange={(e) =>
                    setContact({ ...contact, type: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g., Fixer, Street Doc"
                />
              </div>
            </div>

            {/* Connection and Loyalty */}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderRatingSelector(
                contact.connection || 1,
                (value) => setContact({ ...contact, connection: value }),
                MAX_CONNECTION,
                "Connection (how useful)",
                "blue"
              )}
              {renderRatingSelector(
                contact.loyalty || 1,
                (value) => setContact({ ...contact, loyalty: value }),
                MAX_LOYALTY,
                "Loyalty (how loyal)",
                "rose"
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Notes
              </label>
              <textarea
                value={contact.notes || ""}
                onChange={(e) =>
                  setContact({ ...contact, notes: e.target.value })
                }
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Any additional details about this contact..."
              />
            </div>

            {/* Cost indicator */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Contact Cost:
              </span>
              <span
                className={`font-medium ${
                  contactCost > MAX_KARMA_PER_CONTACT
                    ? "text-red-600 dark:text-red-400"
                    : contactCost > availableKarma
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {contactCost} Karma
                {contactCost > MAX_KARMA_PER_CONTACT && " (max 7)"}
                {contactCost <= MAX_KARMA_PER_CONTACT &&
                  contactCost > availableKarma &&
                  " (not enough)"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isValid
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            {isEditing ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ContactsCard({ state, updateState }: ContactsCardProps) {
  const { budgets } = useCreationBudgets();
  const metatypes = useMetatypes();
  const contactTemplates = useContactTemplates();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Get charisma from state
  const charisma = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    const metatypeId = state.selections.metatype as string;
    const selectedMetatype = metatypes.find((m) => m.id === metatypeId);

    if (attrs.charisma !== undefined) {
      return attrs.charisma;
    }

    const metatypeMin =
      selectedMetatype?.attributes?.charisma &&
      "min" in selectedMetatype.attributes.charisma
        ? selectedMetatype.attributes.charisma.min
        : 1;

    return metatypeMin;
  }, [state.selections.attributes, state.selections.metatype, metatypes]);

  // Calculate free contact karma budget: CHA × 3
  const freeContactKarma = useMemo(() => charisma * 3, [charisma]);

  // Get current contacts from state
  const contacts = useMemo(() => {
    return (state.selections.contacts || []) as Contact[];
  }, [state.selections.contacts]);

  // Calculate total karma spent on contacts
  const totalContactKarmaSpent = useMemo(() => {
    return contacts.reduce((sum, contact) => {
      return sum + contact.connection + contact.loyalty;
    }, 0);
  }, [contacts]);

  // Calculate free vs general karma usage
  const freeContactKarmaSpent = Math.min(
    totalContactKarmaSpent,
    freeContactKarma
  );
  const generalKarmaSpentOnContacts = Math.max(
    0,
    totalContactKarmaSpent - freeContactKarma
  );
  const freeContactKarmaRemaining = freeContactKarma - freeContactKarmaSpent;

  // Get general karma remaining from budget context
  const karmaRemaining = budgets["karma"]?.remaining ?? 0;
  const totalKarmaAvailableForContacts =
    freeContactKarmaRemaining + karmaRemaining;

  // Handle adding a new contact
  const handleAddContact = useCallback(
    (contact: Contact) => {
      const contactCost = contact.connection + contact.loyalty;
      const updatedContacts = [...contacts, contact];
      const newTotalContactKarmaSpent = totalContactKarmaSpent + contactCost;
      const newGeneralKarmaSpentOnContacts = Math.max(
        0,
        newTotalContactKarmaSpent - freeContactKarma
      );

      updateState({
        selections: {
          ...state.selections,
          contacts: updatedContacts,
        },
        budgets: {
          ...state.budgets,
          "contact-karma-spent": newTotalContactKarmaSpent,
          "contact-karma-total": freeContactKarma,
          "karma-spent-contacts": newGeneralKarmaSpentOnContacts,
        },
      });

      setIsModalOpen(false);
    },
    [
      contacts,
      state.selections,
      state.budgets,
      totalContactKarmaSpent,
      freeContactKarma,
      updateState,
    ]
  );

  // Handle updating an existing contact
  const handleUpdateContact = useCallback(
    (contact: Contact) => {
      if (editingIndex === null) return;

      const oldContact = contacts[editingIndex];
      const oldCost = oldContact.connection + oldContact.loyalty;
      const newCost = contact.connection + contact.loyalty;
      const costDiff = newCost - oldCost;

      const updatedContacts = [...contacts];
      updatedContacts[editingIndex] = contact;

      const newTotalContactKarmaSpent = totalContactKarmaSpent + costDiff;
      const newGeneralKarmaSpentOnContacts = Math.max(
        0,
        newTotalContactKarmaSpent - freeContactKarma
      );

      updateState({
        selections: {
          ...state.selections,
          contacts: updatedContacts,
        },
        budgets: {
          ...state.budgets,
          "contact-karma-spent": newTotalContactKarmaSpent,
          "contact-karma-total": freeContactKarma,
          "karma-spent-contacts": newGeneralKarmaSpentOnContacts,
        },
      });

      setIsModalOpen(false);
      setEditingIndex(null);
    },
    [
      editingIndex,
      contacts,
      state.selections,
      state.budgets,
      totalContactKarmaSpent,
      freeContactKarma,
      updateState,
    ]
  );

  // Handle removing a contact
  const handleRemoveContact = useCallback(
    (index: number) => {
      const removedContact = contacts[index];
      const updatedContacts = contacts.filter((_, i) => i !== index);
      const newTotalContactKarmaSpent =
        totalContactKarmaSpent -
        (removedContact.connection + removedContact.loyalty);
      const newGeneralKarmaSpentOnContacts = Math.max(
        0,
        newTotalContactKarmaSpent - freeContactKarma
      );

      updateState({
        selections: {
          ...state.selections,
          contacts: updatedContacts,
        },
        budgets: {
          ...state.budgets,
          "contact-karma-spent": newTotalContactKarmaSpent,
          "contact-karma-total": freeContactKarma,
          "karma-spent-contacts": newGeneralKarmaSpentOnContacts,
        },
      });
    },
    [
      contacts,
      state.selections,
      state.budgets,
      totalContactKarmaSpent,
      freeContactKarma,
      updateState,
    ]
  );

  // Handle opening modal for new contact
  const handleOpenAddModal = useCallback(() => {
    setEditingIndex(null);
    setIsModalOpen(true);
  }, []);

  // Handle opening modal for editing
  const handleOpenEditModal = useCallback((index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  }, []);

  // Handle closing modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingIndex(null);
  }, []);

  // Handle save from modal
  const handleModalSave = useCallback(
    (contact: Contact) => {
      if (editingIndex !== null) {
        handleUpdateContact(contact);
      } else {
        handleAddContact(contact);
      }
    },
    [editingIndex, handleAddContact, handleUpdateContact]
  );

  // Calculate available karma for modal (account for editing)
  const availableKarmaForModal = useMemo(() => {
    if (editingIndex !== null) {
      // When editing, add back the cost of the contact being edited
      const editingContact = contacts[editingIndex];
      const editingCost = editingContact.connection + editingContact.loyalty;
      return totalKarmaAvailableForContacts + editingCost;
    }
    return totalKarmaAvailableForContacts;
  }, [editingIndex, contacts, totalKarmaAvailableForContacts]);

  // Render rating dots
  const renderRatingDots = (value: number, max: number, color: string) => (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < value ? color : "bg-zinc-200 dark:bg-zinc-600"
          }`}
        />
      ))}
    </div>
  );

  return (
    <>
      <CreationCard
        title="Contacts"
        description={`${freeContactKarmaRemaining}/${freeContactKarma} free karma • ${contacts.length} contact${contacts.length !== 1 ? "s" : ""}`}
        status={
          contacts.length > 0
            ? "valid"
            : freeContactKarma > 0
              ? "warning"
              : "pending"
        }
      >
        <div className="space-y-3">
          {/* Budget Display */}
          <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-indigo-700 dark:text-indigo-300">
                Free Contact Karma (CHA {charisma} × 3)
              </span>
              <span
                className={`font-medium ${
                  freeContactKarmaRemaining >= 0
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {freeContactKarmaRemaining} / {freeContactKarma}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{
                  width: `${
                    freeContactKarma > 0
                      ? (freeContactKarmaSpent / freeContactKarma) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            {generalKarmaSpentOnContacts > 0 && (
              <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                + {generalKarmaSpentOnContacts} from general karma
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 rounded-md bg-zinc-50 p-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>
              Cost = Connection + Loyalty (max 7 per contact). Min 2 karma each.
            </span>
          </div>

          {/* Contacts List */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              {contacts.map((contact, index) => {
                const cost = contact.connection + contact.loyalty;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {contact.name}
                        </span>
                        {contact.type && (
                          <span className="flex-shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            {contact.type}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500">C:</span>
                          {renderRatingDots(
                            contact.connection,
                            MAX_CONNECTION,
                            "bg-blue-500"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500">L:</span>
                          {renderRatingDots(
                            contact.loyalty,
                            MAX_LOYALTY,
                            "bg-rose-500"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {cost}K
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(index)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveContact(index)}
                        className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Contact Button */}
          <button
            onClick={handleOpenAddModal}
            disabled={totalKarmaAvailableForContacts < MIN_KARMA_PER_CONTACT}
            className={`flex w-full items-center justify-center gap-1 rounded-md border-2 border-dashed py-2 text-xs font-medium transition-colors ${
              totalKarmaAvailableForContacts >= MIN_KARMA_PER_CONTACT
                ? "border-zinc-300 text-zinc-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
                : "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
            }`}
          >
            <Plus className="h-3 w-3" />
            Add Contact
            {totalKarmaAvailableForContacts < MIN_KARMA_PER_CONTACT && (
              <span className="text-xs">(need 2+ karma)</span>
            )}
          </button>

          {/* Empty state */}
          {contacts.length === 0 && (
            <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Every runner needs contacts. Add fixers, informants, and allies.
            </div>
          )}
        </div>
      </CreationCard>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        initialContact={
          editingIndex !== null ? contacts[editingIndex] : undefined
        }
        isEditing={editingIndex !== null}
        templates={contactTemplates}
        maxCost={MAX_KARMA_PER_CONTACT}
        availableKarma={availableKarmaForModal}
      />
    </>
  );
}
