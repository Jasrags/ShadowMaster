"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  Button,
  Label,
  Input,
  TextField,
  TextArea,
} from "react-aria-components";
import { X } from "lucide-react";
import type { SocialContact, CreateContactRequest, ContactArchetype } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContactRequest) => Promise<void>;
  contact?: SocialContact; // If editing
  archetypes?: ContactArchetype[];
  maxContactPoints?: number;
  usedContactPoints?: number;
  theme?: Theme;
}

const DEFAULT_ARCHETYPES = [
  "Fixer",
  "Street Doc",
  "Talismonger",
  "Mr. Johnson",
  "Gang Leader",
  "Fence",
  "Armorer",
  "ID Manufacturer",
  "Bartender",
  "Corporate Contact",
  "Law Enforcement",
  "Media Contact",
  "Academic",
  "Decker",
  "Rigger",
];

export function ContactFormModal({
  isOpen,
  onClose,
  onSubmit,
  contact,
  archetypes,
  maxContactPoints = 0,
  usedContactPoints = 0,
  theme,
}: ContactFormModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const isEditing = !!contact;

  const [formData, setFormData] = useState<CreateContactRequest>({
    name: "",
    connection: 1,
    loyalty: 1,
    archetype: "",
    description: "",
    specializations: [],
    location: "",
    metatype: "",
    notes: "",
  });

  const [specializationInput, setSpecializationInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or contact changes
  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          name: contact.name,
          connection: contact.connection,
          loyalty: contact.loyalty,
          archetype: contact.archetype,
          description: contact.description || "",
          specializations: contact.specializations || [],
          location: contact.location || "",
          metatype: contact.metatype || "",
          notes: contact.notes || "",
        });
      } else {
        setFormData({
          name: "",
          connection: 1,
          loyalty: 1,
          archetype: "",
          description: "",
          specializations: [],
          location: "",
          metatype: "",
          notes: "",
        });
      }
      setSpecializationInput("");
      setError(null);
    }
  }, [isOpen, contact]);

  // Calculate point cost
  const pointCost = formData.connection + formData.loyalty;
  const currentContactPoints = contact ? contact.connection + contact.loyalty : 0;
  const newUsedPoints = usedContactPoints - currentContactPoints + pointCost;
  const availablePoints = maxContactPoints - newUsedPoints;
  const isOverBudget = maxContactPoints > 0 && newUsedPoints > maxContactPoints;

  const archetypeList = archetypes?.map((a) => a.name) || DEFAULT_ARCHETYPES;

  const handleAddSpecialization = () => {
    if (specializationInput.trim() && !formData.specializations?.includes(specializationInput.trim())) {
      setFormData({
        ...formData,
        specializations: [...(formData.specializations || []), specializationInput.trim()],
      });
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations?.filter((s) => s !== spec) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.archetype) {
      setError("Archetype is required");
      return;
    }

    if (isOverBudget) {
      setError("Not enough contact points available");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={({ isEntering, isExiting }) => `
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
        ${isEntering ? "animate-in fade-in duration-300" : ""}
        ${isExiting ? "animate-out fade-out duration-200" : ""}
      `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
          w-full max-w-lg overflow-hidden rounded-xl border ${t.colors.border} ${t.colors.card} shadow-2xl
          ${isEntering ? "animate-in zoom-in-95 duration-300" : ""}
          ${isExiting ? "animate-out zoom-out-95 duration-200" : ""}
        `}
      >
        <Dialog className="outline-none">
          {({ close }) => (
            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b ${t.colors.border}`}>
                <Heading slot="title" className={`text-lg font-bold ${t.colors.heading}`}>
                  {isEditing ? "Edit Contact" : "Add New Contact"}
                </Heading>
                <Button
                  onPress={close}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {/* Budget indicator */}
                {maxContactPoints > 0 && (
                  <div
                    className={`p-3 rounded border ${
                      isOverBudget
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-muted/50 border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Contact Cost: {pointCost} points</span>
                      <span>
                        Available: {maxContactPoints - usedContactPoints + currentContactPoints} points
                      </span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Name */}
                <TextField className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Name *
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                    placeholder="Contact name"
                  />
                </TextField>

                {/* Archetype */}
                <div className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Archetype *
                  </Label>
                  <select
                    value={formData.archetype}
                    onChange={(e) => setFormData({ ...formData, archetype: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                  >
                    <option value="">Select archetype...</option>
                    {archetypeList.map((arch) => (
                      <option key={arch} value={arch}>
                        {arch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connection & Loyalty */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono text-muted-foreground uppercase">
                      Connection (1-12)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={formData.connection}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          connection: Math.max(1, Math.min(12, parseInt(e.target.value) || 1)),
                        })
                      }
                      className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-mono text-muted-foreground uppercase">
                      Loyalty (1-6)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={6}
                      value={formData.loyalty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          loyalty: Math.max(1, Math.min(6, parseInt(e.target.value) || 1)),
                        })
                      }
                      className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                    />
                  </div>
                </div>

                {/* Metatype & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <TextField className="space-y-1">
                    <Label className="text-xs font-mono text-muted-foreground uppercase">
                      Metatype
                    </Label>
                    <Input
                      value={formData.metatype || ""}
                      onChange={(e) => setFormData({ ...formData, metatype: e.target.value })}
                      className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                      placeholder="Human, Elf, etc."
                    />
                  </TextField>
                  <TextField className="space-y-1">
                    <Label className="text-xs font-mono text-muted-foreground uppercase">
                      Location
                    </Label>
                    <Input
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                      placeholder="Seattle, Downtown"
                    />
                  </TextField>
                </div>

                {/* Specializations */}
                <div className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Specializations
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={specializationInput}
                      onChange={(e) => setSpecializationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSpecialization();
                        }
                      }}
                      className={`flex-1 px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                      placeholder="Add specialization"
                    />
                    <Button
                      type="button"
                      onPress={handleAddSpecialization}
                      className={`px-3 py-2 rounded ${t.colors.accentBg} text-white`}
                    >
                      Add
                    </Button>
                  </div>
                  {formData.specializations && formData.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                        >
                          {spec}
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialization(spec)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <TextField className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Description
                  </Label>
                  <TextArea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground min-h-[80px]`}
                    placeholder="Physical description, personality, etc."
                  />
                </TextField>

                {/* Notes */}
                <TextField className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Notes
                  </Label>
                  <TextArea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground min-h-[60px]`}
                    placeholder="Private notes about this contact"
                  />
                </TextField>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-end gap-3 p-4 border-t ${t.colors.border}`}>
                <Button
                  type="button"
                  onPress={close}
                  className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={isSubmitting || isOverBudget}
                  className={`px-4 py-2 rounded ${t.colors.accentBg} text-white disabled:opacity-50`}
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Contact"}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
