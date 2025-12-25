"use client";

import React from "react";
import { Link } from "react-aria-components";
import type { SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

interface ContactCardProps {
  contact: SocialContact;
  characterId: string;
  theme?: Theme;
  onCallFavor?: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  burned: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  inactive: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
  missing: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  deceased: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
};

function getFavorBalanceStyle(balance: number): { color: string; text: string } {
  if (balance > 0) {
    return { color: "text-emerald-400", text: `+${balance} owed to you` };
  } else if (balance < 0) {
    return { color: "text-amber-400", text: `${Math.abs(balance)} owed by you` };
  }
  return { color: "text-muted-foreground", text: "Even" };
}

export function ContactCard({ contact, characterId, theme, onCallFavor }: ContactCardProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const statusStyle = STATUS_STYLES[contact.status] || STATUS_STYLES.inactive;
  const favorStyle = getFavorBalanceStyle(contact.favorBalance);

  return (
    <div
      className={`group relative p-4 rounded-lg transition-all ${t.components.card.wrapper} ${t.components.card.hover} ${t.components.card.border}`}
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${statusStyle.bg}`} />

      <div className="flex items-start justify-between gap-4">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/characters/${characterId}/contacts/${contact.id}`}
              className={`text-sm font-bold hover:underline ${t.colors.heading}`}
            >
              {contact.name}
            </Link>
            <span
              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
            >
              {contact.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className={`${t.colors.accent}`}>{contact.archetype}</span>
            {contact.location && (
              <>
                <span>•</span>
                <span>{contact.location}</span>
              </>
            )}
          </div>

          {/* Specializations */}
          {contact.specializations && contact.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {contact.specializations.slice(0, 3).map((spec, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                >
                  {spec}
                </span>
              ))}
              {contact.specializations.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{contact.specializations.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-3 text-center">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Conn</div>
              <div className={`text-lg font-bold font-mono ${t.colors.accent}`}>
                {contact.connection}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Loy</div>
              <div className="text-lg font-bold font-mono text-pink-400">
                {contact.loyalty}
              </div>
            </div>
          </div>

          {/* Favor balance */}
          <div className={`text-[10px] font-mono ${favorStyle.color}`}>
            {favorStyle.text}
          </div>
        </div>
      </div>

      {/* Quick actions - shown on hover */}
      {contact.status === "active" && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/characters/${characterId}/contacts/${contact.id}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCallFavor?.();
            }}
            className={`text-xs px-3 py-1 rounded ${t.colors.accentBg} text-white hover:opacity-90 transition-opacity`}
          >
            Call Favor
          </button>
        </div>
      )}
    </div>
  );
}
