"use client";

/**
 * ContactsCard
 *
 * Compact card for managing contacts during character creation.
 * Features:
 * - Contact karma budget (CHA × 3 free, then general karma)
 * - Add/edit/remove contacts with Connection and Loyalty ratings
 * - Contact type suggestions
 * - Karma tracking for contacts
 */

import { useMemo, useCallback, useState } from "react";
import { Plus, Minus, X, Edit2, Trash2, Info } from "lucide-react";
import type { CreationState, Contact } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { useMetatypes } from "@/lib/rules";
import { CreationCard } from "./shared";

// =============================================================================
// TYPES
// =============================================================================

interface ContactsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_CONNECTION = 6;
const MAX_LOYALTY = 6;
const MAX_KARMA_PER_CONTACT = 7;
const MIN_KARMA_PER_CONTACT = 2;

const CONTACT_TYPE_SUGGESTIONS = [
  "Fixer",
  "Street Doc",
  "Talismonger",
  "Arms Dealer",
  "Info Broker",
  "Gang Leader",
  "Corporate Contact",
  "Journalist",
  "Decker",
  "Rigger",
  "Smuggler",
  "Bartender",
  "Police Contact",
  "Lawyer",
  "Mr. Johnson",
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ContactsCard({ state, updateState }: ContactsCardProps) {
  const { budgets } = useCreationBudgets();
  const metatypes = useMetatypes();

  // Local state
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    type: "",
    connection: 1,
    loyalty: 1,
    notes: "",
  });

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

  // Calculate cost of current new contact
  const newContactCost = useMemo(() => {
    return (newContact.connection || 1) + (newContact.loyalty || 1);
  }, [newContact.connection, newContact.loyalty]);

  // Check if new contact is valid
  const isNewContactValid = useMemo(() => {
    if (!newContact.name?.trim()) return false;
    if (newContactCost < MIN_KARMA_PER_CONTACT) return false;
    if (newContactCost > MAX_KARMA_PER_CONTACT) return false;
    if (newContactCost > totalKarmaAvailableForContacts) return false;
    return true;
  }, [newContact.name, newContactCost, totalKarmaAvailableForContacts]);

  // Handle adding a new contact
  const handleAddContact = useCallback(() => {
    if (!isNewContactValid) return;

    const contact: Contact = {
      name: newContact.name!.trim(),
      connection: newContact.connection || 1,
      loyalty: newContact.loyalty || 1,
      type: newContact.type?.trim() || undefined,
      notes: newContact.notes?.trim() || undefined,
    };

    const updatedContacts = [...contacts, contact];
    const newTotalContactKarmaSpent =
      totalContactKarmaSpent + contact.connection + contact.loyalty;
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

    setNewContact({
      name: "",
      type: "",
      connection: 1,
      loyalty: 1,
      notes: "",
    });
    setIsAddingContact(false);
  }, [
    isNewContactValid,
    newContact,
    contacts,
    state.selections,
    state.budgets,
    totalContactKarmaSpent,
    freeContactKarma,
    updateState,
  ]);

  // Handle updating an existing contact
  const handleUpdateContact = useCallback(
    (index: number, updates: Partial<Contact>) => {
      const updatedContacts = [...contacts];
      updatedContacts[index] = { ...updatedContacts[index], ...updates };

      const newTotalContactKarmaSpent = updatedContacts.reduce(
        (sum, c) => sum + c.connection + c.loyalty,
        0
      );
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
    [contacts, state.selections, state.budgets, freeContactKarma, updateState]
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
              const isEditing = editingIndex === index;

              if (isEditing) {
                return (
                  <div
                    key={index}
                    className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20"
                  >
                    <div className="space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) =>
                            handleUpdateContact(index, { name: e.target.value })
                          }
                          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={contact.type || ""}
                          onChange={(e) =>
                            handleUpdateContact(index, {
                              type: e.target.value || undefined,
                            })
                          }
                          list="contact-types-edit"
                          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                          placeholder="Type"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Conn:</span>
                          <button
                            onClick={() => {
                              if (contact.connection > 1) {
                                handleUpdateContact(index, {
                                  connection: contact.connection - 1,
                                });
                              }
                            }}
                            disabled={contact.connection <= 1}
                            className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-medium">
                            {contact.connection}
                          </span>
                          <button
                            onClick={() => {
                              const newCost =
                                contact.connection + 1 + contact.loyalty;
                              if (
                                contact.connection < MAX_CONNECTION &&
                                newCost <= MAX_KARMA_PER_CONTACT
                              ) {
                                handleUpdateContact(index, {
                                  connection: contact.connection + 1,
                                });
                              }
                            }}
                            disabled={
                              contact.connection >= MAX_CONNECTION ||
                              cost >= MAX_KARMA_PER_CONTACT
                            }
                            className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            Loyalty:
                          </span>
                          <button
                            onClick={() => {
                              if (contact.loyalty > 1) {
                                handleUpdateContact(index, {
                                  loyalty: contact.loyalty - 1,
                                });
                              }
                            }}
                            disabled={contact.loyalty <= 1}
                            className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-medium">
                            {contact.loyalty}
                          </span>
                          <button
                            onClick={() => {
                              const newCost =
                                contact.connection + contact.loyalty + 1;
                              if (
                                contact.loyalty < MAX_LOYALTY &&
                                newCost <= MAX_KARMA_PER_CONTACT
                              ) {
                                handleUpdateContact(index, {
                                  loyalty: contact.loyalty + 1,
                                });
                              }
                            }}
                            disabled={
                              contact.loyalty >= MAX_LOYALTY ||
                              cost >= MAX_KARMA_PER_CONTACT
                            }
                            className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => setEditingIndex(null)}
                          className="ml-auto rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
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
                      onClick={() => setEditingIndex(index)}
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

        {/* Add Contact Form */}
        {isAddingContact ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={newContact.name || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  className="rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800"
                  placeholder="Contact name *"
                  autoFocus
                />
                <input
                  type="text"
                  value={newContact.type || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, type: e.target.value })
                  }
                  list="contact-types"
                  className="rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800"
                  placeholder="Type (e.g., Fixer)"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Connection:
                  </span>
                  <button
                    onClick={() => {
                      if ((newContact.connection || 1) > 1) {
                        setNewContact({
                          ...newContact,
                          connection: (newContact.connection || 1) - 1,
                        });
                      }
                    }}
                    disabled={(newContact.connection || 1) <= 1}
                    className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium">
                    {newContact.connection || 1}
                  </span>
                  <button
                    onClick={() => {
                      const newCost =
                        (newContact.connection || 1) +
                        1 +
                        (newContact.loyalty || 1);
                      if (
                        (newContact.connection || 1) < MAX_CONNECTION &&
                        newCost <= MAX_KARMA_PER_CONTACT
                      ) {
                        setNewContact({
                          ...newContact,
                          connection: (newContact.connection || 1) + 1,
                        });
                      }
                    }}
                    disabled={
                      (newContact.connection || 1) >= MAX_CONNECTION ||
                      newContactCost >= MAX_KARMA_PER_CONTACT
                    }
                    className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Loyalty:
                  </span>
                  <button
                    onClick={() => {
                      if ((newContact.loyalty || 1) > 1) {
                        setNewContact({
                          ...newContact,
                          loyalty: (newContact.loyalty || 1) - 1,
                        });
                      }
                    }}
                    disabled={(newContact.loyalty || 1) <= 1}
                    className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium">
                    {newContact.loyalty || 1}
                  </span>
                  <button
                    onClick={() => {
                      const newCost =
                        (newContact.connection || 1) +
                        (newContact.loyalty || 1) +
                        1;
                      if (
                        (newContact.loyalty || 1) < MAX_LOYALTY &&
                        newCost <= MAX_KARMA_PER_CONTACT
                      ) {
                        setNewContact({
                          ...newContact,
                          loyalty: (newContact.loyalty || 1) + 1,
                        });
                      }
                    }}
                    disabled={
                      (newContact.loyalty || 1) >= MAX_LOYALTY ||
                      newContactCost >= MAX_KARMA_PER_CONTACT
                    }
                    className="rounded p-0.5 hover:bg-zinc-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span
                  className={`ml-auto text-xs font-medium ${
                    newContactCost > totalKarmaAvailableForContacts
                      ? "text-red-600"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {newContactCost} Karma
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingContact(false);
                    setNewContact({
                      name: "",
                      type: "",
                      connection: 1,
                      loyalty: 1,
                      notes: "",
                    });
                  }}
                  className="rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  disabled={!isNewContactValid}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    isNewContactValid
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingContact(true)}
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
        )}

        {/* Datalist for contact type suggestions */}
        <datalist id="contact-types">
          {CONTACT_TYPE_SUGGESTIONS.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>
        <datalist id="contact-types-edit">
          {CONTACT_TYPE_SUGGESTIONS.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>

        {/* Empty state */}
        {contacts.length === 0 && !isAddingContact && (
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Every runner needs contacts. Add fixers, informants, and allies.
          </div>
        )}
      </div>
    </CreationCard>
  );
}
