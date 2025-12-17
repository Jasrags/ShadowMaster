"use client";

import { useMemo, useCallback, useState } from "react";
import type { CreationState, Contact, ContactTemplateData } from "@/lib/types";
import { useContactTemplates, useMetatypes } from "@/lib/rules";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

// Suggested contact types for quick selection
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
] as const;

const MAX_CONNECTION = 6;
const MAX_LOYALTY = 6;
const MAX_KARMA_PER_CONTACT = 7;
const MIN_KARMA_PER_CONTACT = 2; // Minimum Karma requirement = 2 (Connection 1 + Loyalty 1)

export function ContactsStep({ state, updateState, budgetValues }: StepProps) {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    type: "",
    connection: 1,
    loyalty: 1,
    notes: "",
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Get contact templates from ruleset
  const contactTemplates = useContactTemplates();

  // Get metatypes for attribute minimum lookup
  const metatypes = useMetatypes();

  // Get charisma from state (attributes are stored as full values including minimum)
  const charisma = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    const metatypeId = state.selections.metatype as string;
    const selectedMetatype = metatypes.find((m) => m.id === metatypeId);

    // Attributes in state are stored as full values (minimum + allocated points)
    // If undefined, default to metatype minimum
    if (attrs.charisma !== undefined) {
      return attrs.charisma;
    }

    // If not set, use metatype minimum
    const metatypeMin = selectedMetatype?.attributes?.charisma && "min" in selectedMetatype.attributes.charisma
      ? selectedMetatype.attributes.charisma.min
      : 1;

    return metatypeMin;
  }, [state.selections.attributes, state.selections.metatype, metatypes]);

  // Calculate free contact Karma budget: CHA × 3
  const freeContactKarma = useMemo(() => {
    return charisma * 3;
  }, [charisma]);

  // Get current contacts from state
  const contacts = useMemo(() => {
    return (state.selections.contacts || []) as Contact[];
  }, [state.selections.contacts]);

  // Calculate total Karma spent on contacts
  const totalContactKarmaSpent = useMemo(() => {
    return contacts.reduce((sum, contact) => {
      return sum + contact.connection + contact.loyalty;
    }, 0);
  }, [contacts]);

  // Calculate how much was spent from free contact karma vs general karma
  const freeContactKarmaSpent = Math.min(totalContactKarmaSpent, freeContactKarma);
  const generalKarmaSpentOnContacts = Math.max(0, totalContactKarmaSpent - freeContactKarma);

  // Calculate general karma remaining (for purchasing contacts beyond free limit)
  const generalKarmaRemaining = useMemo(() => {
    const karmaBase = budgetValues["karma"] || 25;
    const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
    const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
    const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
    const karmaSpentSpells = (state.budgets["karma-spent-spells"] as number) || 0;
    const karmaSpentComplexForms = (state.budgets["karma-spent-complex-forms"] as number) || 0;
    const karmaSpentPowerPoints = (state.budgets["karma-spent-power-points"] as number) || 0;
    const karmaSpentFociBonding = (state.budgets["karma-spent-foci-bonding"] as number) || 0;

    const karmaTotal = karmaBase + karmaGainedNegative;
    const karmaSpent = karmaSpentPositive + karmaSpentGear + karmaSpentSpells + karmaSpentComplexForms + karmaSpentPowerPoints + karmaSpentFociBonding;
    return karmaTotal - karmaSpent;
  }, [budgetValues, state.budgets]);

  // Free contact karma remaining
  const freeContactKarmaRemaining = freeContactKarma - freeContactKarmaSpent;

  // Total karma available for new contacts (free + general)
  const totalKarmaAvailableForContacts = freeContactKarmaRemaining + generalKarmaRemaining;

  // Calculate cost of current new contact
  const newContactCost = useMemo(() => {
    return (newContact.connection || 1) + (newContact.loyalty || 1);
  }, [newContact.connection, newContact.loyalty]);

  // Check if new contact is valid
  const isNewContactValid = useMemo(() => {
    if (!newContact.name?.trim()) return false;
    if (newContactCost < MIN_KARMA_PER_CONTACT) return false; // Minimum 2 karma required
    if (newContactCost > MAX_KARMA_PER_CONTACT) return false;
    // Can use free contact karma first, then general karma
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

    const contactCost = contact.connection + contact.loyalty;
    const updatedContacts = [...contacts, contact];
    const newTotalContactKarmaSpent = totalContactKarmaSpent + contactCost;

    // Calculate new free contact karma spent vs general karma spent
    // Calculate new free contact karma spent vs general karma spent
    const newGeneralKarmaSpentOnContacts = Math.max(0, newTotalContactKarmaSpent - freeContactKarma);

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

    // Reset form
    setNewContact({
      name: "",
      type: "",
      connection: 1,
      loyalty: 1,
      notes: "",
    });
    setSelectedTemplateId(null);
    setIsAddingContact(false);
  }, [isNewContactValid, newContact, contacts, state.selections, state.budgets, totalContactKarmaSpent, freeContactKarma, updateState]);

  // Handle selecting a contact template
  const handleSelectTemplate = useCallback((template: ContactTemplateData | null) => {
    if (!template) {
      setSelectedTemplateId(null);
      setNewContact({
        name: "",
        type: "",
        connection: 1,
        loyalty: 1,
        notes: "",
      });
      return;
    }
    setSelectedTemplateId(template.id);
    setNewContact({
      name: "",
      type: template.name,
      connection: template.suggestedConnection,
      loyalty: template.suggestedLoyalty || 2,
      notes: template.description,
    });
  }, []);

  // Handle updating an existing contact
  const handleUpdateContact = useCallback((index: number, updates: Partial<Contact>) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], ...updates };

    const newTotalContactKarmaSpent = updatedContacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0);

    // Calculate new free contact karma spent vs general karma spent
    // Calculate new free contact karma spent vs general karma spent
    const newGeneralKarmaSpentOnContacts = Math.max(0, newTotalContactKarmaSpent - freeContactKarma);

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
  }, [contacts, state.selections, state.budgets, freeContactKarma, updateState]);

  // Handle removing a contact
  const handleRemoveContact = useCallback((index: number) => {
    const removedContact = contacts[index];
    const updatedContacts = contacts.filter((_, i) => i !== index);

    const newTotalContactKarmaSpent = totalContactKarmaSpent - (removedContact.connection + removedContact.loyalty);

    // Calculate new free contact karma spent vs general karma spent
    // Calculate new free contact karma spent vs general karma spent
    const newGeneralKarmaSpentOnContacts = Math.max(0, newTotalContactKarmaSpent - freeContactKarma);

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
  }, [contacts, state.selections, state.budgets, totalContactKarmaSpent, freeContactKarma, updateState]);

  // Render rating selector (1-6)
  const renderRatingSelector = (
    value: number,
    onChange: (value: number) => void,
    max: number,
    label: string,
    color: "blue" | "rose"
  ) => {
    const colorClasses = color === "blue"
      ? { active: "bg-blue-500 text-white", inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-blue-900/30" }
      : { active: "bg-rose-500 text-white", inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-rose-100 dark:hover:bg-rose-900/30" };

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
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${value >= rating ? colorClasses.active : colorClasses.inactive
                }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render contact card
  const renderContactCard = (contact: Contact, index: number) => {
    const cost = contact.connection + contact.loyalty;
    const isEditing = editingIndex === index;

    if (isEditing) {
      return (
        <div
          key={index}
          className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
        >
          <div className="space-y-4">
            {/* Name and Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => handleUpdateContact(index, { name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <input
                  type="text"
                  value={contact.type || ""}
                  onChange={(e) => handleUpdateContact(index, { type: e.target.value || undefined })}
                  list="contact-types"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g., Fixer, Street Doc"
                />
              </div>
            </div>

            {/* Connection and Loyalty */}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderRatingSelector(
                contact.connection,
                (value) => {
                  const newCost = value + contact.loyalty;
                  const costDiff = newCost - cost;
                  const newTotalKarmaSpent = totalContactKarmaSpent + costDiff;
                  const newFreeContactKarmaSpent = Math.min(newTotalKarmaSpent, freeContactKarma);
                  const newGeneralKarmaSpentOnContacts = Math.max(0, newTotalKarmaSpent - freeContactKarma);
                  const newGeneralKarmaRemaining = generalKarmaRemaining - (newGeneralKarmaSpentOnContacts - generalKarmaSpentOnContacts);
                  const newFreeContactKarmaRemaining = freeContactKarma - newFreeContactKarmaSpent;
                  const newTotalAvailable = newFreeContactKarmaRemaining + newGeneralKarmaRemaining;

                  if (newCost >= MIN_KARMA_PER_CONTACT && newCost <= MAX_KARMA_PER_CONTACT && costDiff <= newTotalAvailable) {
                    handleUpdateContact(index, { connection: value });
                  }
                },
                MAX_CONNECTION,
                "Connection (how useful)",
                "blue"
              )}
              {renderRatingSelector(
                contact.loyalty,
                (value) => {
                  const newCost = contact.connection + value;
                  const costDiff = newCost - cost;
                  const newTotalKarmaSpent = totalContactKarmaSpent + costDiff;
                  const newFreeContactKarmaSpent = Math.min(newTotalKarmaSpent, freeContactKarma);
                  const newGeneralKarmaSpentOnContacts = Math.max(0, newTotalKarmaSpent - freeContactKarma);
                  const newGeneralKarmaRemaining = generalKarmaRemaining - (newGeneralKarmaSpentOnContacts - generalKarmaSpentOnContacts);
                  const newFreeContactKarmaRemaining = freeContactKarma - newFreeContactKarmaSpent;
                  const newTotalAvailable = newFreeContactKarmaRemaining + newGeneralKarmaRemaining;

                  if (newCost >= MIN_KARMA_PER_CONTACT && newCost <= MAX_KARMA_PER_CONTACT && costDiff <= newTotalAvailable) {
                    handleUpdateContact(index, { loyalty: value });
                  }
                },
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
                onChange={(e) => handleUpdateContact(index, { notes: e.target.value || undefined })}
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Any additional details about this contact..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
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
        className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                {contact.name}
              </span>
              {contact.type && (
                <span className="flex-shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  {contact.type}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-zinc-500 dark:text-zinc-400">Connection:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: MAX_CONNECTION }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i < contact.connection
                        ? "bg-blue-500"
                        : "bg-zinc-200 dark:bg-zinc-600"
                        }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-blue-600 dark:text-blue-400">{contact.connection}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500 dark:text-zinc-400">Loyalty:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: MAX_LOYALTY }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i < contact.loyalty
                        ? "bg-rose-500"
                        : "bg-zinc-200 dark:bg-zinc-600"
                        }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-rose-600 dark:text-rose-400">{contact.loyalty}</span>
              </div>
            </div>
            {contact.notes && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {contact.notes}
              </p>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              {cost} Karma
            </div>
            <button
              type="button"
              onClick={() => setEditingIndex(index)}
              className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              title="Edit contact"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleRemoveContact(index)}
              className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              title="Remove contact"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Datalist for contact type suggestions */}
      <datalist id="contact-types">
        {CONTACT_TYPE_SUGGESTIONS.map((type) => (
          <option key={type} value={type} />
        ))}
      </datalist>

      {/* Karma Budget */}
      <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
        <div className="space-y-3">
          {/* Free Contact Karma */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Free Contact Karma</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">
                Charisma ({charisma}) × 3 = {freeContactKarma} free
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${freeContactKarmaRemaining >= 0 ? "text-indigo-700 dark:text-indigo-300" : "text-amber-600 dark:text-amber-400"}`}>
                {freeContactKarmaRemaining}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">remaining</div>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${freeContactKarma > 0 ? (freeContactKarmaSpent / freeContactKarma) * 100 : 0}%` }}
            />
          </div>

          {/* General Karma (for contacts beyond free) */}
          {generalKarmaSpentOnContacts > 0 || freeContactKarmaRemaining <= 0 ? (
            <div className="mt-3 border-t border-indigo-200 pt-3 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-indigo-800 dark:text-indigo-200">General Karma</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">
                    {generalKarmaSpentOnContacts > 0 ? `${generalKarmaSpentOnContacts} spent on contacts` : "Available for contacts"}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${generalKarmaRemaining >= 0 ? "text-indigo-700 dark:text-indigo-300" : "text-red-600 dark:text-red-400"}`}>
                    {generalKarmaRemaining}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">remaining</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Total Available */}
          <div className="mt-2 border-t border-indigo-200 pt-2 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Total Available for Contacts</div>
              <div className={`text-lg font-bold ${totalKarmaAvailableForContacts >= MIN_KARMA_PER_CONTACT ? "text-indigo-700 dark:text-indigo-300" : "text-amber-600 dark:text-amber-400"}`}>
                {totalKarmaAvailableForContacts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            <p className="font-medium">About Contacts</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Each contact costs Karma equal to Connection + Loyalty (max 7 Karma per contact).
              <strong className="text-zinc-700 dark:text-zinc-300"> Connection</strong> represents how well-connected and useful they are.
              <strong className="text-zinc-700 dark:text-zinc-300"> Loyalty</strong> represents how far they&apos;ll go for you.
            </p>
          </div>
        </div>
      </div>

      {/* Add Contact Form */}
      {isAddingContact ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h3 className="mb-4 text-sm font-semibold text-emerald-800 dark:text-emerald-200">New Contact</h3>
          <div className="space-y-4">
            {/* Template Selector */}
            {contactTemplates.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Start from Template (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(null)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${selectedTemplateId === null
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "border-zinc-300 text-zinc-600 hover:border-emerald-400 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-500"
                      }`}
                  >
                    Custom
                  </button>
                  {contactTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      title={template.description}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${selectedTemplateId === template.id
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
                    {contactTemplates.find(t => t.id === selectedTemplateId)?.description}
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
                  value={newContact.name || ""}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
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
                  value={newContact.type || ""}
                  onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                  list="contact-types"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="e.g., Fixer, Street Doc"
                />
              </div>
            </div>

            {/* Connection and Loyalty */}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderRatingSelector(
                newContact.connection || 1,
                (value) => setNewContact({ ...newContact, connection: value }),
                MAX_CONNECTION,
                "Connection (how useful)",
                "blue"
              )}
              {renderRatingSelector(
                newContact.loyalty || 1,
                (value) => setNewContact({ ...newContact, loyalty: value }),
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
                value={newContact.notes || ""}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Any additional details about this contact..."
              />
            </div>

            {/* Cost indicator */}
            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-zinc-800">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Contact Cost:</span>
              <span className={`font-medium ${newContactCost > MAX_KARMA_PER_CONTACT
                ? "text-red-600 dark:text-red-400"
                : newContactCost > totalKarmaAvailableForContacts
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
                }`}>
                {newContactCost} Karma
                {newContactCost > MAX_KARMA_PER_CONTACT && " (max 7)"}
                {newContactCost <= MAX_KARMA_PER_CONTACT && newContactCost > totalKarmaAvailableForContacts && " (not enough)"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingContact(false);
                  setNewContact({
                    name: "",
                    type: "",
                    connection: 1,
                    loyalty: 1,
                    notes: "",
                  });
                  setSelectedTemplateId(null);
                }}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddContact}
                disabled={!isNewContactValid}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isNewContactValid
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
          type="button"
          onClick={() => setIsAddingContact(true)}
          disabled={totalKarmaAvailableForContacts < MIN_KARMA_PER_CONTACT}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm font-medium transition-colors ${totalKarmaAvailableForContacts >= MIN_KARMA_PER_CONTACT
            ? "border-zinc-300 text-zinc-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
            : "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
            }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contact
          {totalKarmaAvailableForContacts < MIN_KARMA_PER_CONTACT && <span className="text-xs">(not enough Karma)</span>}
        </button>
      )}

      {/* Contacts List */}
      {contacts.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Contacts ({contacts.length})
          </h3>
          <div className="space-y-3">
            {contacts.map((contact, index) => renderContactCard(contact, index))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {contacts.length === 0 && !isAddingContact && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
          <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">No contacts yet</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Every runner needs contacts. Add fixers, informants, doctors, and other allies to help you survive the shadows.
          </p>
        </div>
      )}
    </div>
  );
}
