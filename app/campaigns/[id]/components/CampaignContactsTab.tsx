"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "react-aria-components";
import { Loader2, Info, Users, AlertTriangle, Plus, Search, X } from "lucide-react";
import type { Campaign, SocialContact, CreateContactRequest } from "@/lib/types";
import type {
  BetrayalTypeData,
  JohnsonFactionData,
  JohnsonProfilesModulePayload,
} from "@/lib/rules/module-payloads";
import { CampaignContactCard } from "./CampaignContactCard";
import { ContactFormModal } from "@/app/characters/[id]/contacts/components/ContactFormModal";

interface CampaignContactsTabProps {
  campaign: Campaign;
}

/** Owner filter option */
type OwnerFilter = "all" | "campaign" | string; // string = characterId

/** Visibility filter option */
type VisibilityFilter = "all" | "visible" | "gm-only";

export default function CampaignContactsTab({ campaign }: CampaignContactsTabProps) {
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [characterNames, setCharacterNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ruleset data
  const [betrayalTypes, setBetrayalTypes] = useState<BetrayalTypeData[]>([]);
  const [factions, setFactions] = useState<JohnsonFactionData[]>([]);

  // Expanded contact for betrayal panel
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

  // Creation modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [searchText, setSearchText] = useState("");

  // Per-character loyalty expand
  const [loyaltyExpandedId, setLoyaltyExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/contacts?include=all`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts || []);
        setCharacterNames(data.characterNames || {});
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
      if (!res.ok) return;
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

  // ---------------------------------------------------------------------------
  // Contact Creation (via modal)
  // ---------------------------------------------------------------------------

  const handleCreateContact = async (data: CreateContactRequest) => {
    const res = await fetch(`/api/campaigns/${campaign.id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      setContacts((prev) => [...prev, result.contact]);
    } else {
      throw new Error(result.error || "Failed to create contact");
    }
  };

  // ---------------------------------------------------------------------------
  // Visibility Toggle
  // ---------------------------------------------------------------------------

  const handleToggleVisibility = async (contact: SocialContact) => {
    if (contact.characterId) return;
    const newVisible = !contact.visibility.playerVisible;
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility: {
            playerVisible: newVisible,
            showConnection: newVisible,
            showLoyalty: newVisible,
            showSpecializations: newVisible,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleContactUpdated(data.contact);
      } else {
        setError(data.error || "Failed to update visibility");
      }
    } catch {
      setError("Failed to update visibility");
    }
  };

  // ---------------------------------------------------------------------------
  // Per-Character Loyalty
  // ---------------------------------------------------------------------------

  const handleSetLoyaltyOverride = async (
    contact: SocialContact,
    characterId: string,
    value: number
  ) => {
    if (contact.characterId) return;
    const updated = { ...(contact.loyaltyOverrides ?? {}), [characterId]: value };
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loyaltyOverrides: updated }),
      });
      const data = await res.json();
      if (data.success) {
        handleContactUpdated(data.contact);
      } else {
        setError(data.error || "Failed to update loyalty override");
      }
    } catch {
      setError("Failed to update loyalty override");
    }
  };

  const handleRemoveLoyaltyOverride = async (contact: SocialContact, characterId: string) => {
    if (contact.characterId) return;
    // Use destructuring to remove key immutably
    const { [characterId]: _removed, ...remaining } = contact.loyaltyOverrides ?? {};
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loyaltyOverrides: remaining }),
      });
      const data = await res.json();
      if (data.success) {
        handleContactUpdated(data.contact);
      } else {
        setError(data.error || "Failed to remove loyalty override");
      }
    } catch {
      setError("Failed to remove loyalty override");
    }
  };

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredContacts = useMemo(() => {
    let result = contacts;

    if (ownerFilter === "campaign") {
      result = result.filter((c) => !c.characterId);
    } else if (ownerFilter !== "all") {
      result = result.filter((c) => c.characterId === ownerFilter);
    }

    if (visibilityFilter === "visible") {
      result = result.filter((c) => c.visibility.playerVisible);
    } else if (visibilityFilter === "gm-only") {
      result = result.filter((c) => !c.visibility.playerVisible);
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.archetype.toLowerCase().includes(query) ||
          c.organization?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [contacts, ownerFilter, visibilityFilter, searchText]);

  const characterOwners = useMemo(() => {
    const owners = new Map<string, string>();
    for (const c of contacts) {
      if (c.characterId && characterNames[c.characterId]) {
        owners.set(c.characterId, characterNames[c.characterId]);
      }
    }
    return Array.from(owners.entries());
  }, [contacts, characterNames]);

  const johnsonContacts = filteredContacts.filter((c) => !!c.factionId);
  const otherContacts = filteredContacts.filter((c) => !c.factionId);

  const getOwnerLabel = (contact: SocialContact): string => {
    if (!contact.characterId) return "Campaign";
    return characterNames[contact.characterId] || "Character";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Campaign Contacts</h3>
        <div className="flex items-center gap-2">
          {betrayalTypes.length === 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Info className="h-3.5 w-3.5" />
              Enable Run Faster for betrayal types
            </span>
          )}
          <Button
            onPress={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white outline-none hover:bg-indigo-700 pressed:bg-indigo-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New Contact
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
          <Button
            onPress={() => setError(null)}
            className="ml-2 underline outline-none hover:no-underline"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Contact Creation Modal (reuses character contact form in campaign mode) */}
      <ContactFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateContact}
        johnsonFactions={factions}
        mode="campaign"
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          {searchText && (
            <Button
              onPress={() => setSearchText("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 outline-none hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Owner Filter */}
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">All Owners</option>
          <option value="campaign">Campaign (GM)</option>
          {characterOwners.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        {/* Visibility Filter */}
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value as VisibilityFilter)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <option value="all">All Visibility</option>
          <option value="visible">Visible to Players</option>
          <option value="gm-only">GM Only</option>
        </select>

        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {filteredContacts.length} of {contacts.length} contacts
        </span>
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <Users className="mx-auto h-12 w-12 text-zinc-400 opacity-50" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            No campaign contacts yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create contacts from the campaign to manage Johnson relationships and betrayal
            scenarios.
          </p>
          <Button
            onPress={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white outline-none hover:bg-indigo-700 pressed:bg-indigo-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New Contact
          </Button>
        </div>
      )}

      {/* No Results */}
      {contacts.length > 0 && filteredContacts.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 py-8 text-center dark:border-zinc-700">
          <Search className="mx-auto h-8 w-8 text-zinc-400 opacity-50" />
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            No contacts match the current filters.
          </p>
        </div>
      )}

      {/* Johnson Contacts */}
      {johnsonContacts.length > 0 && (
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <AlertTriangle className="h-4 w-4" />
            Johnson Contacts ({johnsonContacts.length})
          </h4>
          {johnsonContacts.map((contact) => (
            <CampaignContactCard
              key={contact.id}
              contact={contact}
              faction={
                contact.factionId
                  ? (factions.find((f) => f.id === contact.factionId) ?? null)
                  : null
              }
              ownerLabel={getOwnerLabel(contact)}
              isExpanded={expandedContactId === contact.id}
              onToggleExpand={() =>
                setExpandedContactId(expandedContactId === contact.id ? null : contact.id)
              }
              onToggleVisibility={() => handleToggleVisibility(contact)}
              betrayalTypes={betrayalTypes}
              factions={factions}
              campaignId={campaign.id}
              onContactUpdated={handleContactUpdated}
              isLoyaltyExpanded={loyaltyExpandedId === contact.id}
              onToggleLoyalty={() =>
                setLoyaltyExpandedId(loyaltyExpandedId === contact.id ? null : contact.id)
              }
              characterNames={characterNames}
              onSetLoyaltyOverride={(charId, val) => handleSetLoyaltyOverride(contact, charId, val)}
              onRemoveLoyaltyOverride={(charId) => handleRemoveLoyaltyOverride(contact, charId)}
            />
          ))}
        </div>
      )}

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Other Contacts ({otherContacts.length})
          </h4>
          {otherContacts.map((contact) => (
            <CampaignContactCard
              key={contact.id}
              contact={contact}
              faction={null}
              ownerLabel={getOwnerLabel(contact)}
              isExpanded={expandedContactId === contact.id}
              onToggleExpand={() =>
                setExpandedContactId(expandedContactId === contact.id ? null : contact.id)
              }
              onToggleVisibility={() => handleToggleVisibility(contact)}
              betrayalTypes={betrayalTypes}
              factions={factions}
              campaignId={campaign.id}
              onContactUpdated={handleContactUpdated}
              isLoyaltyExpanded={loyaltyExpandedId === contact.id}
              onToggleLoyalty={() =>
                setLoyaltyExpandedId(loyaltyExpandedId === contact.id ? null : contact.id)
              }
              characterNames={characterNames}
              onSetLoyaltyOverride={(charId, val) => handleSetLoyaltyOverride(contact, charId, val)}
              onRemoveLoyaltyOverride={(charId) => handleRemoveLoyaltyOverride(contact, charId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
