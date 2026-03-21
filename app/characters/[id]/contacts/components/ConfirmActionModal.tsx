"use client";

import React, { useState } from "react";
import {
  ModalOverlay,
  Modal,
  Dialog,
  Button,
  TextField,
  Label,
  TextArea,
} from "react-aria-components";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
  confirmingLabel?: string;
  variant?: "danger" | "warning" | "default";
  reasonField?: {
    label: string;
    placeholder?: string;
    required?: boolean;
  };
  theme?: Theme;
}

const VARIANT_STYLES = {
  danger: {
    confirmBg: "bg-red-600 hover:bg-red-700",
    confirmText: "text-white",
  },
  warning: {
    confirmBg: "bg-amber-600 hover:bg-amber-700",
    confirmText: "text-white",
  },
  default: {
    confirmBg: "",
    confirmText: "text-white",
  },
} as const;

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  variant = "default",
  reasonField,
  theme,
}: ConfirmActionModalProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const variantStyle = VARIANT_STYLES[variant];
  const confirmBg = variant === "default" ? t.colors.accentBg : variantStyle.confirmBg;

  const handleConfirm = async () => {
    if (reasonField?.required && !reason.trim()) {
      setError(`${reasonField.label} is required`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(reasonField ? reason.trim() || undefined : undefined);
      setReason("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <Modal className="w-full max-w-sm animate-in zoom-in-95">
        <Dialog
          className={`rounded-lg border ${t.colors.border} ${t.colors.card} p-6 outline-none`}
        >
          {() => (
            <>
              <h2 className={`text-lg font-bold mb-2 ${t.colors.heading}`}>{title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{description}</p>

              {reasonField && (
                <TextField className="mb-4" value={reason} onChange={setReason}>
                  <Label className="block text-xs text-muted-foreground mb-1">
                    {reasonField.label}
                    {reasonField.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>
                  <TextArea
                    placeholder={reasonField.placeholder}
                    rows={3}
                    className={`w-full rounded border ${t.colors.border} ${t.colors.card} px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none`}
                  />
                </TextField>
              )}

              {error && (
                <div className="mb-4 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onPress={handleClose}
                  className={`px-4 py-2 rounded text-sm border ${t.colors.border} text-muted-foreground hover:text-foreground transition-colors`}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleConfirm}
                  isDisabled={submitting}
                  className={`px-4 py-2 rounded text-sm ${confirmBg} ${variantStyle.confirmText} disabled:opacity-50 transition-colors`}
                >
                  {submitting ? confirmingLabel || "Processing..." : confirmLabel}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
