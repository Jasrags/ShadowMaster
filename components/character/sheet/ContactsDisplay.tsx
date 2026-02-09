"use client";

import type { Character } from "@/lib/types";
import { Link } from "react-aria-components";
import { DisplayCard } from "./DisplayCard";
import { Users } from "lucide-react";

interface ContactsDisplayProps {
  character: Character;
}

export function ContactsDisplay({ character }: ContactsDisplayProps) {
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
        <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-3">
          {character.contacts?.length || 0} contacts in network
        </span>
        {!character.contacts || character.contacts.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No contacts established</p>
        ) : (
          <div className="space-y-2">
            {character.contacts.slice(0, 5).map((contact, index) => (
              <div
                key={`contact-${index}`}
                className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded border-l-2 border-emerald-500/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {contact.name}
                  </span>
                  {contact.type && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{contact.type}</span>
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Connection:{" "}
                    <span className="text-amber-500 dark:text-amber-400 font-mono">
                      {contact.connection}
                    </span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Loyalty:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {contact.loyalty}
                    </span>
                  </span>
                </div>
              </div>
            ))}
            {character.contacts.length > 5 && (
              <Link
                href={`/characters/${character.id}/contacts`}
                className="block text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 py-2"
              >
                +{character.contacts.length - 5} more contacts...
              </Link>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
