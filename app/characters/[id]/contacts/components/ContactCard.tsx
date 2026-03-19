"use client";

import React from "react";
import { Link } from "react-aria-components";
import type { SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { STATUS_STYLES, getFavorBalanceStyle } from "./contact-constants";

interface ContactCardProps {
  contact: SocialContact;
  characterId: string;
  theme?: Theme;
  onCallFavor?: () => void;
  onConfirmEdge?: () => void;
}

export function ContactCard({
  contact,
  characterId,
  theme,
  onCallFavor,
  onConfirmEdge,
}: ContactCardProps) {
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

          {/* Badges row: relationship qualities, org, pending */}
          <div className="flex flex-wrap gap-1 mb-2">
            {contact.relationshipQualities?.includes("blackmail") && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/30"
                title="Favors are free via Intimidation; contact cannot leave"
              >
                Blackmail
              </span>
            )}
            {contact.relationshipQualities?.includes("family") && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-500/30"
                title="+1 Loyalty for tests, −1 chip to improve, −1 Loyalty for job performance"
              >
                Family
              </span>
            )}
            {contact.group === "organization" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-violet-500/10 text-violet-400 border-violet-500/30">
                Org
              </span>
            )}
            {contact.pendingKarmaConfirmation && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/30">
                Pending
              </span>
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
              <div className="text-lg font-bold font-mono text-pink-400">{contact.loyalty}</div>
            </div>
          </div>

          {/* Favor / Chip balance */}
          <div className={`text-[10px] font-mono ${favorStyle.color}`}>{favorStyle.text}</div>
          {contact.favorBalance !== 0 && (
            <div className="text-[10px] font-mono text-cyan-400">
              {Math.abs(contact.favorBalance)} chip{Math.abs(contact.favorBalance) !== 1 ? "s" : ""}
            </div>
          )}
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
          <div className="flex items-center gap-2">
            {contact.pendingKarmaConfirmation && onConfirmEdge && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfirmEdge();
                }}
                className="text-xs px-3 py-1 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                Confirm
              </button>
            )}
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
        </div>
      )}
    </div>
  );
}
