"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, RefreshCw, User } from "lucide-react";
import StatusTransitionDialog from "./StatusTransitionDialog";
import type { Character } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface AdminActionsPanelProps {
  character: Character;
  ownerUsername?: string;
  isAdmin: boolean;
  theme?: Theme;
  onStatusChange?: () => void;
}

export default function AdminActionsPanel({
  character,
  ownerUsername,
  isAdmin,
  theme,
  onStatusChange,
}: AdminActionsPanelProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);

  // Don't render if not an admin
  if (!isAdmin) {
    return null;
  }

  const handleTransitionSuccess = () => {
    setShowTransitionDialog(false);
    onStatusChange?.();
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "draft":
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "retired":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "deceased":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <>
      <div className={`${t.components.section.wrapper} overflow-hidden print-hidden`}>
        {/* Header - always visible, clickable to toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between p-4 ${t.components.section.header} hover:bg-muted/50 transition-colors`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className={`text-sm font-semibold uppercase tracking-wider ${t.colors.heading}`}>
              Admin Actions
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Collapsible content */}
        {isExpanded && (
          <div className="p-4 border-t border-border/50 space-y-4">
            {/* Character Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className={t.colors.heading}>{ownerUsername || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(character.status)}`}>
                  {character.status}
                </span>
              </div>
            </div>

            {/* Owner ID (for advanced debugging) */}
            <div className="text-xs text-muted-foreground font-mono">
              Owner ID: {character.ownerId}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
              <button
                onClick={() => setShowTransitionDialog(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-md hover:bg-amber-500/20 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Change Status
              </button>
            </div>

            {/* Help text */}
            <p className="text-xs text-muted-foreground italic">
              Admin actions are logged to the audit trail for governance compliance.
            </p>
          </div>
        )}
      </div>

      {/* Status Transition Dialog */}
      <StatusTransitionDialog
        isOpen={showTransitionDialog}
        onClose={() => setShowTransitionDialog(false)}
        onSuccess={handleTransitionSuccess}
        characterId={character.id}
        characterName={character.name}
        currentStatus={character.status}
      />
    </>
  );
}
