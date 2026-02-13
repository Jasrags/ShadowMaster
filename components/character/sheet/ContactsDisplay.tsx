"use client";

import type { Character, Contact } from "@/lib/types";
import { Link } from "react-aria-components";
import { DisplayCard } from "./DisplayCard";
import { Users } from "lucide-react";

interface ContactsDisplayProps {
  character: Character;
}

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div
      data-testid="contact-row"
      className="rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {contact.name}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-semibold uppercase text-amber-500 dark:text-amber-400">
              C
            </span>
            <span
              data-testid="connection-pill"
              className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-400/12 dark:border-amber-400/20 dark:text-amber-300"
            >
              {contact.connection}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-semibold uppercase text-emerald-500 dark:text-emerald-400">
              L
            </span>
            <span
              data-testid="loyalty-pill"
              className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-400/12 dark:border-emerald-400/20 dark:text-emerald-300"
            >
              {contact.loyalty}
            </span>
          </div>
        </div>
      </div>
      {contact.type && (
        <div className="ml-0.5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{contact.type}</div>
      )}
    </div>
  );
}

export function ContactsDisplay({ character }: ContactsDisplayProps) {
  const contacts = character.contacts ?? [];
  const sorted = [...contacts].sort((a, b) => b.connection - a.connection);
  const visible = sorted.slice(0, 5);
  const remaining = contacts.length - 5;

  return (
    <DisplayCard
      title="Contacts"
      icon={<Users className="h-4 w-4 text-zinc-400" />}
      headerAction={
        <Link
          href={`/characters/${character.id}/contacts`}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Manage →
        </Link>
      }
    >
      <div>
        {contacts.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No contacts established</p>
        ) : (
          <>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {contacts.length} contacts in network
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
              {visible.map((contact, index) => (
                <ContactRow key={`contact-${index}`} contact={contact} />
              ))}
              {remaining > 0 && (
                <Link
                  href={`/characters/${character.id}/contacts`}
                  className="block text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 py-2"
                >
                  +{remaining} more contacts...
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </DisplayCard>
  );
}
