"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Info, Users, AlertTriangle } from "lucide-react";
import type { Campaign, SocialContact } from "@/lib/types";
import type {
  BetrayalTypeData,
  JohnsonFactionData,
  JohnsonProfilesModulePayload,
} from "@/lib/rules/module-payloads";
import { BetrayalAssessmentPanel } from "./BetrayalAssessmentPanel";

interface CampaignContactsTabProps {
  campaign: Campaign;
}

export default function CampaignContactsTab({ campaign }: CampaignContactsTabProps) {
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ruleset data
  const [betrayalTypes, setBetrayalTypes] = useState<BetrayalTypeData[]>([]);
  const [factions, setFactions] = useState<JohnsonFactionData[]>([]);

  // Expanded contact for betrayal panel
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/contacts`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts || []);
      } else {
        setError(data.error || "Failed to load contacts");
      }
    } catch {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [campaign.id]);

  const fetchRulesetData = useCallback(async () => {
    try {
      const res = await fetch(`/api/rulesets/${campaign.editionCode}`);
      const data = await res.json();
      if (data.success && data.extractedData) {
        const jp = data.extractedData.johnsonProfiles as JohnsonProfilesModulePayload | null;
        if (jp) {
          setBetrayalTypes(jp.betrayalTypes || []);
          setFactions(jp.factions || []);
        }
      }
    } catch {
      // Non-critical — betrayal assessment will show without faction data
    }
  }, [campaign.editionCode]);

  useEffect(() => {
    fetchContacts();
    fetchRulesetData();
  }, [fetchContacts, fetchRulesetData]);

  const handleContactUpdated = useCallback((updatedContact: SocialContact) => {
    setContacts((prev) => prev.map((c) => (c.id === updatedContact.id ? updatedContact : c)));
  }, []);

  // Johnson contacts are those with a faction tag (Run Faster pp. 196-211)
  const johnsonContacts = contacts.filter((c) => !!c.factionId);
  const otherContacts = contacts.filter((c) => !c.factionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
        <Users className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
        <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          No campaign contacts yet
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create contacts from the campaign to manage Johnson relationships and betrayal scenarios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Campaign Contacts — Betrayal Assessment
        </h3>
        {betrayalTypes.length === 0 && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <Info className="h-3.5 w-3.5" />
            Enable Run Faster for betrayal types
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline hover:no-underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Johnson Contacts */}
      {johnsonContacts.length > 0 && (
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <AlertTriangle className="h-4 w-4" />
            Johnson Contacts ({johnsonContacts.length})
          </h4>
          {johnsonContacts.map((contact) => {
            const faction = contact.factionId
              ? factions.find((f) => f.id === contact.factionId)
              : null;
            const isExpanded = expandedContactId === contact.id;

            return (
              <div
                key={contact.id}
                className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              >
                {/* Contact Header */}
                <button
                  onClick={() => setExpandedContactId(isExpanded ? null : contact.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} betrayal assessment for ${contact.name}`}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {contact.name}
                        </span>
                        {contact.betrayalPlanning && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
                            Betrayal Planned
                          </span>
                        )}
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                            contact.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-zinc-500/10 text-zinc-400"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{contact.archetype}</span>
                        {faction && (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400">
                            {faction.name}
                          </span>
                        )}
                        <span>
                          C:{contact.connection} / L:{contact.loyalty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {faction?.betrayalRisk && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          {
                            "very-low": "text-green-400 bg-green-500/10",
                            low: "text-green-300 bg-green-500/10",
                            moderate: "text-amber-400 bg-amber-500/10",
                            high: "text-orange-400 bg-orange-500/10",
                            "very-high": "text-red-400 bg-red-500/10",
                            uncertain: "text-zinc-400 bg-zinc-500/10",
                          }[faction.betrayalRisk] ?? "text-zinc-400 bg-zinc-500/10"
                        }`}
                      >
                        Risk: {faction.betrayalRisk}
                      </span>
                    )}
                  </div>
                </button>

                {/* Betrayal Assessment Panel */}
                {isExpanded && betrayalTypes.length > 0 && (
                  <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-700">
                    <BetrayalAssessmentPanel
                      contact={contact}
                      campaignId={campaign.id}
                      betrayalTypes={betrayalTypes}
                      factions={factions}
                      onContactUpdated={handleContactUpdated}
                    />
                  </div>
                )}

                {isExpanded && betrayalTypes.length === 0 && (
                  <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-700">
                    <div className="rounded border border-dashed border-zinc-600 p-4 text-center text-xs text-zinc-500">
                      <Info className="mx-auto mb-1 h-5 w-5" />
                      Betrayal type data not available. Enable the Run Faster sourcebook in campaign
                      settings.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Other Contacts ({otherContacts.length})
          </h4>
          {otherContacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {contact.name}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                    contact.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {contact.status}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{contact.archetype}</span>
                <span>
                  C:{contact.connection} / L:{contact.loyalty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
