"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Contact, ContactTemplateData } from "@/lib/types";
import {
  MAX_CONNECTION,
  MAX_LOYALTY,
  MAX_KARMA_PER_CONTACT,
  MIN_KARMA_PER_CONTACT,
} from "./constants";
import type { ContactModalProps } from "./types";

export function ContactModal({
  isOpen,
  onClose,
  onSave,
  initialContact,
  isEditing,
  templates,
  availableKarma,
}: ContactModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
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

  const handleSelectTemplate = useCallback((template: ContactTemplateData | null) => {
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
  }, []);

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

  // Render rating selector with max karma enforcement
  const renderRatingSelector = (
    value: number,
    onChange: (value: number) => void,
    max: number,
    label: string,
    color: "blue" | "rose",
    otherRatingValue: number // The other rating's current value (to calculate if selection exceeds max)
  ) => {
    const colorClasses =
      color === "blue"
        ? {
            active: "bg-blue-500 text-white",
            inactive:
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
            disabled:
              "bg-zinc-50 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed",
          }
        : {
            active: "bg-rose-500 text-white",
            inactive:
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-rose-100 dark:hover:bg-rose-900/30",
            disabled:
              "bg-zinc-50 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed",
          };

    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((rating) => {
            // Check if selecting this rating would exceed max karma per contact
            const wouldExceedMax = rating + otherRatingValue > MAX_KARMA_PER_CONTACT;
            const isDisabled = wouldExceedMax;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => !isDisabled && onChange(rating)}
                disabled={isDisabled}
                title={isDisabled ? `Would exceed ${MAX_KARMA_PER_CONTACT} karma limit` : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                  isDisabled
                    ? colorClasses.disabled
                    : value >= rating
                      ? colorClasses.active
                      : colorClasses.inactive
                }`}
              >
                {rating}
              </button>
            );
          })}
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
                    {templates.find((t) => t.id === selectedTemplateId)?.description}
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
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
                  onChange={(e) => setContact({ ...contact, type: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
                "blue",
                contact.loyalty || 1 // Pass loyalty so we can enforce max karma
              )}
              {renderRatingSelector(
                contact.loyalty || 1,
                (value) => setContact({ ...contact, loyalty: value }),
                MAX_LOYALTY,
                "Loyalty (how loyal)",
                "rose",
                contact.connection || 1 // Pass connection so we can enforce max karma
              )}
            </div>

            {/* Max karma hint */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Max {MAX_KARMA_PER_CONTACT} karma per contact (Connection + Loyalty)
            </p>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Notes
              </label>
              <textarea
                value={contact.notes || ""}
                onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Any additional details about this contact..."
              />
            </div>

            {/* Cost indicator */}
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Contact Cost:</span>
                <span
                  className={`font-medium ${
                    contactCost > availableKarma
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {contactCost} / {MAX_KARMA_PER_CONTACT} Karma
                  {contactCost > availableKarma && " (not enough available)"}
                </span>
              </div>
              {/* Validation feedback */}
              {!isValid && (
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {!contact.name?.trim() && "• Enter a contact name"}
                  {contact.name?.trim() &&
                    contactCost > availableKarma &&
                    `• Not enough karma available (have ${availableKarma})`}
                </div>
              )}
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
