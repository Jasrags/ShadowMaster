"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { Link, Button } from "react-aria-components";
import { Plus, Users, Search, Filter, BookOpen, TrendingUp } from "lucide-react";
import type { SocialContact, SocialCapital, ContactArchetype, CreateContactRequest } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme, type ThemeId } from "@/lib/themes";
import { Section } from "../components/Section";
import { ContactCard } from "./components/ContactCard";
import { SocialCapitalDashboard } from "./components/SocialCapitalDashboard";
import { ContactFormModal } from "./components/ContactFormModal";
import { CallFavorModal } from "./components/CallFavorModal";
import { FavorLedgerView } from "./components/FavorLedgerView";
import { NetworkingAction } from "./components/NetworkingAction";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}

interface CharacterData {
  id: string;
  name: string;
  nuyen: number;
  karmaCurrent: number;
  editionCode: string;
}

interface FavorLedgerData {
  characterId: string;
  transactions: Array<{
    id: string;
    contactId: string;
    type: string;
    description: string;
    favorChange: number;
    timestamp: string;
    [key: string]: unknown;
  }>;
  totalFavorsCalled: number;
  totalFavorsOwed: number;
  totalNuyenSpent: number;
  totalKarmaSpent: number;
  burnedContactsCount: number;
  createdAt: string;
  updatedAt: string;
}

type TabId = "contacts" | "networking" | "ledger";

export default function ContactsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const characterId = resolvedParams.id;

  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [socialCapital, setSocialCapital] = useState<SocialCapital | null>(null);
  const [favorLedger, setFavorLedger] = useState<FavorLedgerData | null>(null);
  const [archetypes, setArchetypes] = useState<ContactArchetype[]>([]);
  const [favorServices, setFavorServices] = useState<Array<{
    id: string;
    name: string;
    description: string;
    minimumConnection: number;
    minimumLoyalty: number;
    favorCost: number;
    riskLevel: string;
    [key: string]: unknown;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<TabId>("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArchetype, setFilterArchetype] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCallFavorModal, setShowCallFavorModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SocialContact | null>(null);

  const theme = THEMES[DEFAULT_THEME];

  // Fetch all data
  useEffect(() => {
    async function fetchData() {
      try {
        const [charRes, contactsRes, socialCapRes, ledgerRes] = await Promise.all([
          fetch(`/api/characters/${characterId}`),
          fetch(`/api/characters/${characterId}/contacts`),
          fetch(`/api/characters/${characterId}/social-capital`),
          fetch(`/api/characters/${characterId}/favor-ledger`),
        ]);

        const charData = await charRes.json();
        const contactsData = await contactsRes.json();
        const socialCapData = await socialCapRes.json();
        const ledgerData = await ledgerRes.json();

        if (!charData.success) throw new Error(charData.error);

        setCharacter(charData.character);
        setContacts(contactsData.contacts || []);
        setSocialCapital(socialCapData.socialCapital || null);
        setFavorLedger(ledgerData.ledger || null);

        // Fetch edition-specific data if we have edition code
        if (charData.character?.editionCode) {
          try {
            const favorCostsRes = await fetch(
              `/api/editions/${charData.character.editionCode}/favor-costs`
            );
            const favorCostsData = await favorCostsRes.json();
            if (favorCostsData.success) {
              setFavorServices(favorCostsData.services || []);
              setArchetypes(favorCostsData.archetypes || []);
            }
          } catch {
            // Favor costs may not exist yet
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [characterId]);

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !c.name.toLowerCase().includes(query) &&
        !c.archetype.toLowerCase().includes(query) &&
        !(c.location || "").toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (filterArchetype !== "all" && c.archetype !== filterArchetype) {
      return false;
    }
    if (filterStatus !== "all" && c.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // Get unique archetypes for filter
  const uniqueArchetypes = [...new Set(contacts.map((c) => c.archetype))].sort();

  // Handle add contact
  const handleAddContact = async (data: CreateContactRequest) => {
    const response = await fetch(`/api/characters/${characterId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to add contact");
    }

    // Refresh contacts and social capital
    setContacts((prev) => [...prev, result.contact]);
    if (result.socialCapital) {
      setSocialCapital(result.socialCapital);
    }
  };

  // Handle call favor
  const handleCallFavor = async (data: {
    serviceId: string;
    diceRoll: number;
    rushJob?: boolean;
    notes?: string;
  }) => {
    if (!selectedContact) return;

    const response = await fetch(
      `/api/characters/${characterId}/contacts/${selectedContact.id}/call-favor`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to call favor");
    }

    // Update contact in list
    setContacts((prev) =>
      prev.map((c) => (c.id === selectedContact.id ? result.contact : c))
    );

    // Refresh character nuyen
    if (character) {
      setCharacter({
        ...character,
        nuyen: character.nuyen - (result.costs?.nuyen || 0),
        karmaCurrent: character.karmaCurrent - (result.costs?.karma || 0),
      });
    }
  };

  // Handle networking success
  const handleNetworkingSuccess = useCallback((suggestedContact: Partial<SocialContact>) => {
    // Pre-fill the add contact modal with suggested values
    setSelectedContact(suggestedContact as SocialContact);
    setShowAddModal(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Loading Contact Network...
          </span>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-400 font-mono">{error || "Failed to load data"}</p>
        <Link
          href={`/characters/${characterId}`}
          className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          ← Return to character
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/characters/${characterId}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to {character.name}
            </Link>
          </div>
          <Button
            onPress={() => {
              setSelectedContact(null);
              setShowAddModal(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded ${theme.colors.accentBg} text-white`}
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-3">
          <Users className={`w-8 h-8 ${theme.colors.accent}`} />
          <div>
            <h1 className={`text-2xl font-bold ${theme.colors.heading}`}>Contact Network</h1>
            <p className="text-sm text-muted-foreground">
              Manage your contacts, favors, and social capital
            </p>
          </div>
        </div>

        {/* Social Capital Dashboard */}
        {socialCapital && (
          <Section title="Social Capital" theme={theme}>
            <SocialCapitalDashboard
              socialCapital={socialCapital}
              contacts={contacts}
              theme={theme}
            />
          </Section>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors ${
              activeTab === "contacts"
                ? `${theme.colors.accentBg} text-white`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            Contacts
          </button>
          <button
            onClick={() => setActiveTab("networking")}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors ${
              activeTab === "networking"
                ? `${theme.colors.accentBg} text-white`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Networking
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors ${
              activeTab === "ledger"
                ? `${theme.colors.accentBg} text-white`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Favor Ledger
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "contacts" && (
          <Section title="Contacts" theme={theme}>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className={`w-full pl-10 pr-4 py-2 rounded border ${theme.colors.border} bg-background text-foreground`}
                />
              </div>
              <select
                value={filterArchetype}
                onChange={(e) => setFilterArchetype(e.target.value)}
                className={`px-3 py-2 rounded border ${theme.colors.border} bg-background text-foreground`}
              >
                <option value="all">All Archetypes</option>
                {uniqueArchetypes.map((arch) => (
                  <option key={arch} value={arch}>
                    {arch}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 rounded border ${theme.colors.border} bg-background text-foreground`}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="burned">Burned</option>
                <option value="inactive">Inactive</option>
                <option value="missing">Missing</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>

            {/* Contact Grid */}
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No contacts found</p>
                {contacts.length === 0 && (
                  <p className="text-sm mt-1">
                    Start building your network by adding a contact or using networking.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    characterId={characterId}
                    theme={theme}
                    onCallFavor={() => {
                      setSelectedContact(contact);
                      setShowCallFavorModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </Section>
        )}

        {activeTab === "networking" && (
          <Section title="Find New Contacts" theme={theme}>
            <NetworkingAction
              characterId={characterId}
              archetypes={archetypes}
              characterNuyen={character.nuyen}
              onSuccess={handleNetworkingSuccess}
              theme={theme}
            />
          </Section>
        )}

        {activeTab === "ledger" && favorLedger && (
          <Section title="Favor Ledger" theme={theme}>
            <FavorLedgerView
              ledger={favorLedger as unknown as import("@/lib/types").FavorLedger}
              contacts={contacts}
              theme={theme}
            />
          </Section>
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      <ContactFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedContact(null);
        }}
        onSubmit={handleAddContact}
        archetypes={archetypes}
        maxContactPoints={socialCapital?.maxContactPoints || 0}
        usedContactPoints={socialCapital?.usedContactPoints || 0}
        theme={theme}
      />

      {/* Call Favor Modal */}
      {selectedContact && (
        <CallFavorModal
          isOpen={showCallFavorModal}
          onClose={() => {
            setShowCallFavorModal(false);
            setSelectedContact(null);
          }}
          onSubmit={handleCallFavor}
          contact={selectedContact}
          services={favorServices as unknown as import("@/lib/types").FavorServiceDefinition[]}
          characterNuyen={character.nuyen}
          characterKarma={character.karmaCurrent}
          theme={theme}
        />
      )}
    </div>
  );
}
