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

import { useMemo, useCallback, useState } from "react";
import { Plus, X, Edit2, Info, User } from "lucide-react";
import type { Contact } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { useContactTemplates, useMetatypes } from "@/lib/rules";
import { CreationCard } from "../shared";
import { MIN_KARMA_PER_CONTACT, MAX_KARMA_PER_CONTACT } from "./constants";
import { ContactModal } from "./ContactModal";
import type { ContactsCardProps } from "./types";

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
      selectedMetatype?.attributes?.charisma && "min" in selectedMetatype.attributes.charisma
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
  const freeContactKarmaSpent = Math.min(totalContactKarmaSpent, freeContactKarma);
  const generalKarmaSpentOnContacts = Math.max(0, totalContactKarmaSpent - freeContactKarma);
  const freeContactKarmaRemaining = freeContactKarma - freeContactKarmaSpent;

  // Get general karma remaining from budget context
  // Use Math.max(0, ...) to prevent overspent karma from blocking free contact points
  const karmaRemaining = Math.max(0, budgets["karma"]?.remaining ?? 0);
  const totalKarmaAvailableForContacts = freeContactKarmaRemaining + karmaRemaining;

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
          // Sync with CreationBudgetContext which reads "contact-points-spent"
          "contact-points-spent": newTotalContactKarmaSpent,
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
          // Sync with CreationBudgetContext which reads "contact-points-spent"
          "contact-points-spent": newTotalContactKarmaSpent,
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
        totalContactKarmaSpent - (removedContact.connection + removedContact.loyalty);
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
          // Sync with CreationBudgetContext which reads "contact-points-spent"
          "contact-points-spent": newTotalContactKarmaSpent,
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

  return (
    <>
      <CreationCard
        title="Contacts"
        status={contacts.length > 0 ? "valid" : "pending"}
        headerAction={
          <button
            onClick={handleOpenAddModal}
            disabled={totalKarmaAvailableForContacts < MIN_KARMA_PER_CONTACT}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              totalKarmaAvailableForContacts >= MIN_KARMA_PER_CONTACT
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            <Plus className="h-4 w-4" />
            Contact
          </button>
        }
      >
        <div className="space-y-3">
          {/* Contact Points - compact like Essence bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span
                className="flex cursor-help items-center gap-1 text-zinc-600 dark:text-zinc-400"
                title="Cost = Connection + Loyalty (max 7 per contact). Min 2 karma each."
              >
                Contact Points
                <Info className="h-3 w-3 text-zinc-400" />
              </span>
              <span
                className={`font-medium ${
                  freeContactKarmaRemaining === 0 && generalKarmaSpentOnContacts === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {freeContactKarmaSpent} / {freeContactKarma}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  freeContactKarmaRemaining === 0 && generalKarmaSpentOnContacts === 0
                    ? "bg-emerald-500"
                    : "bg-indigo-500"
                }`}
                style={{
                  width: `${
                    freeContactKarma > 0
                      ? Math.min(100, (freeContactKarmaSpent / freeContactKarma) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
            {generalKarmaSpentOnContacts > 0 && (
              <div className="text-xs text-amber-600 dark:text-amber-400">
                +{generalKarmaSpentOnContacts} from general karma
              </div>
            )}
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
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          C: {contact.connection}
                        </span>
                        <span className="inline-flex items-center rounded bg-rose-100 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                          L: {contact.loyalty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {cost}K
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(index)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                        title="Edit contact"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {/* Separator */}
                      <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
                      <button
                        onClick={() => handleRemoveContact(index)}
                        className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Remove contact"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {contacts.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No contacts added</p>
            </div>
          )}

          {/* Summary */}
          {contacts.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Total: {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {totalContactKarmaSpent} pts
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        initialContact={editingIndex !== null ? contacts[editingIndex] : undefined}
        isEditing={editingIndex !== null}
        templates={contactTemplates}
        maxCost={MAX_KARMA_PER_CONTACT}
        availableKarma={availableKarmaForModal}
      />
    </>
  );
}
