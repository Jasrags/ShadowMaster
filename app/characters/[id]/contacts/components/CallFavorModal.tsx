"use client";

import React, { useState, useMemo } from "react";
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
import { X, AlertTriangle, CheckCircle } from "lucide-react";
import type { SocialContact, FavorServiceDefinition } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface CallFavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    serviceId: string;
    diceRoll: number;
    rushJob?: boolean;
    notes?: string;
  }) => Promise<void>;
  contact: SocialContact;
  services: FavorServiceDefinition[];
  characterNuyen?: number;
  characterKarma?: number;
  theme?: Theme;
}

const RISK_COLORS: Record<string, { bg: string; text: string }> = {
  trivial: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  low: { bg: "bg-blue-500/10", text: "text-blue-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400" },
  extreme: { bg: "bg-red-500/10", text: "text-red-400" },
};

export function CallFavorModal({
  isOpen,
  onClose,
  onSubmit,
  contact,
  services,
  characterNuyen = 0,
  characterKarma = 0,
  theme,
}: CallFavorModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [diceRoll, setDiceRoll] = useState<number>(0);
  const [rushJob, setRushJob] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter services that this contact can provide
  const availableServices = useMemo(() => {
    return services.filter((s) => {
      if (s.minimumConnection > contact.connection) return false;
      if (s.minimumLoyalty > contact.loyalty) return false;
      return true;
    });
  }, [services, contact]);

  // Get selected service
  const selectedService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  // Calculate costs
  const costs = useMemo(() => {
    if (!selectedService) return { favor: 0, nuyen: 0, karma: 0 };

    let nuyenCost = 0;
    if (typeof selectedService.nuyenCost === "number") {
      nuyenCost = selectedService.nuyenCost;
    } else if (typeof selectedService.nuyenCost === "string") {
      // Simple formula parsing for "connection * X" pattern
      const match = selectedService.nuyenCost.match(/connection\s*\*\s*(\d+)/i);
      if (match) {
        nuyenCost = contact.connection * parseInt(match[1]);
      }
    }

    if (rushJob && selectedService.rushCostMultiplier) {
      nuyenCost = Math.ceil(nuyenCost * selectedService.rushCostMultiplier);
    }

    return {
      favor: selectedService.favorCost,
      nuyen: nuyenCost,
      karma: selectedService.karmaCost || 0,
    };
  }, [selectedService, contact, rushJob]);

  // Check if character can afford
  const canAfford = characterNuyen >= costs.nuyen && characterKarma >= costs.karma;

  // Check prerequisites
  const meetsPrerequisites = useMemo(() => {
    if (!selectedService) return { meets: true, reasons: [] as string[] };
    const reasons: string[] = [];

    if (contact.status !== "active") {
      reasons.push("Contact is not active");
    }
    if (contact.connection < selectedService.minimumConnection) {
      reasons.push(`Requires Connection ${selectedService.minimumConnection}+`);
    }
    if (contact.loyalty < selectedService.minimumLoyalty) {
      reasons.push(`Requires Loyalty ${selectedService.minimumLoyalty}+`);
    }
    if (!canAfford) {
      reasons.push("Insufficient resources");
    }

    return { meets: reasons.length === 0, reasons };
  }, [selectedService, contact, canAfford]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedServiceId) {
      setError("Please select a service");
      return;
    }

    if (!meetsPrerequisites.meets) {
      setError(meetsPrerequisites.reasons.join(", "));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        serviceId: selectedServiceId,
        diceRoll,
        rushJob,
        notes: notes || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to call favor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const riskStyle = selectedService
    ? RISK_COLORS[selectedService.riskLevel] || RISK_COLORS.medium
    : RISK_COLORS.medium;

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
                <div>
                  <Heading slot="title" className={`text-lg font-bold ${t.colors.heading}`}>
                    Call Favor
                  </Heading>
                  <div className="text-sm text-muted-foreground">
                    from {contact.name} ({contact.archetype})
                  </div>
                </div>
                <Button
                  onPress={close}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {/* Contact Stats */}
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground uppercase">Connection</div>
                    <div className={`text-xl font-bold ${t.colors.accent}`}>
                      {contact.connection}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground uppercase">Loyalty</div>
                    <div className="text-xl font-bold text-pink-400">{contact.loyalty}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground uppercase">Favor Balance</div>
                    <div
                      className={`text-xl font-bold ${
                        contact.favorBalance > 0
                          ? "text-emerald-400"
                          : contact.favorBalance < 0
                            ? "text-amber-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {contact.favorBalance > 0 ? "+" : ""}
                      {contact.favorBalance}
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Service Selection */}
                <div className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Service *
                  </Label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                  >
                    <option value="">Select a service...</option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} (Cost: {service.favorCost})
                      </option>
                    ))}
                  </select>
                  {availableServices.length === 0 && (
                    <div className="text-xs text-amber-400 mt-1">
                      This contact cannot provide any services at their current Connection/Loyalty.
                    </div>
                  )}
                </div>

                {/* Service Details */}
                {selectedService && (
                  <div className={`p-4 rounded border ${t.colors.border} space-y-3`}>
                    <div>
                      <div className="font-bold text-foreground">{selectedService.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedService.description}
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Risk:</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded uppercase font-mono ${riskStyle.bg} ${riskStyle.text}`}
                      >
                        {selectedService.riskLevel}
                      </span>
                      {selectedService.burnRiskOnFailure && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Can burn contact on failure
                        </span>
                      )}
                    </div>

                    {/* Costs */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-[10px] text-muted-foreground uppercase">Favor</div>
                        <div className="font-bold text-foreground">{costs.favor}</div>
                      </div>
                      <div
                        className={`p-2 rounded ${
                          costs.nuyen > characterNuyen ? "bg-red-500/10" : "bg-muted/50"
                        }`}
                      >
                        <div className="text-[10px] text-muted-foreground uppercase">Nuyen</div>
                        <div
                          className={`font-bold ${
                            costs.nuyen > characterNuyen ? "text-red-400" : "text-foreground"
                          }`}
                        >
                          ¥{costs.nuyen.toLocaleString()}
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded ${
                          costs.karma > characterKarma ? "bg-red-500/10" : "bg-muted/50"
                        }`}
                      >
                        <div className="text-[10px] text-muted-foreground uppercase">Karma</div>
                        <div
                          className={`font-bold ${
                            costs.karma > characterKarma ? "text-red-400" : "text-foreground"
                          }`}
                        >
                          {costs.karma}
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-muted-foreground">
                      Typical time: {selectedService.typicalTime}
                    </div>
                  </div>
                )}

                {/* Rush Job */}
                {selectedService?.canRush && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rushJob}
                      onChange={(e) => setRushJob(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">
                      Rush job ({selectedService.rushCostMultiplier}x cost)
                    </span>
                  </label>
                )}

                {/* Dice Roll */}
                <TextField className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Dice Roll Result *
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={diceRoll}
                    onChange={(e) => setDiceRoll(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                    placeholder="Enter your hits"
                  />
                  {selectedService?.threshold && (
                    <div className="text-xs text-muted-foreground">
                      Threshold: {selectedService.threshold} hits
                    </div>
                  )}
                </TextField>

                {/* Notes */}
                <TextField className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground uppercase">
                    Notes (optional)
                  </Label>
                  <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground min-h-[60px]`}
                    placeholder="Details about the request"
                  />
                </TextField>

                {/* Prerequisites Warning */}
                {!meetsPrerequisites.meets && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                    <div className="text-sm text-red-400 font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Cannot call this favor
                    </div>
                    <ul className="text-xs text-red-400 mt-1 list-disc list-inside">
                      {meetsPrerequisites.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className={`flex items-center justify-end gap-3 p-4 border-t ${t.colors.border}`}
              >
                <Button
                  type="button"
                  onPress={close}
                  className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={isSubmitting || !meetsPrerequisites.meets || !selectedServiceId}
                  className={`px-4 py-2 rounded ${t.colors.accentBg} text-white disabled:opacity-50`}
                >
                  {isSubmitting ? "Calling..." : "Call Favor"}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
