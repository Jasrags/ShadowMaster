"use client";

import React, { useState, useEffect, use } from "react";
import { Link, Button } from "react-aria-components";
import {
  ArrowLeft,
  Edit,
  Phone,
  MapPin,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  Flame,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type {
  SocialContact,
  FavorTransaction,
  FavorServiceDefinition,
  UpdateContactRequest,
} from "@/lib/types";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { Section } from "../../components/Section";
import { ContactFormModal } from "../components/ContactFormModal";
import { CallFavorModal } from "../components/CallFavorModal";

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

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  favor_called: { label: "Favor Called", color: "text-blue-400" },
  favor_failed: { label: "Favor Failed", color: "text-red-400" },
  favor_granted: { label: "Favor Granted", color: "text-emerald-400" },
  favor_owed: { label: "Favor Owed", color: "text-amber-400" },
  favor_repaid: { label: "Favor Repaid", color: "text-emerald-400" },
  loyalty_change: { label: "Loyalty Change", color: "text-pink-400" },
  connection_change: { label: "Connection Change", color: "text-cyan-400" },
  contact_burned: { label: "Contact Burned", color: "text-red-400" },
  contact_acquired: { label: "Contact Acquired", color: "text-emerald-400" },
  contact_reactivated: { label: "Contact Reactivated", color: "text-blue-400" },
  status_change: { label: "Status Changed", color: "text-purple-400" },
  gift: { label: "Gift Given", color: "text-amber-400" },
  betrayal: { label: "Betrayal", color: "text-red-400" },
  reputation_effect: { label: "Reputation Effect", color: "text-orange-400" },
};

interface CharacterData {
  id: string;
  name: string;
  nuyen: number;
  karmaCurrent: number;
  editionCode: string;
}

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string; contactId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: characterId, contactId } = resolvedParams;

  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [contact, setContact] = useState<SocialContact | null>(null);
  const [transactions, setTransactions] = useState<FavorTransaction[]>([]);
  const [favorServices, setFavorServices] = useState<FavorServiceDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCallFavorModal, setShowCallFavorModal] = useState(false);

  const theme = THEMES[DEFAULT_THEME];
  const statusStyle = contact ? STATUS_STYLES[contact.status] || STATUS_STYLES.inactive : STATUS_STYLES.inactive;

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [charRes, contactRes, ledgerRes] = await Promise.all([
          fetch(`/api/characters/${characterId}`),
          fetch(`/api/characters/${characterId}/contacts/${contactId}`),
          fetch(`/api/characters/${characterId}/favor-ledger?contactId=${contactId}`),
        ]);

        const charData = await charRes.json();
        const contactData = await contactRes.json();
        const ledgerData = await ledgerRes.json();

        if (!charData.success) throw new Error(charData.error);
        if (!contactData.success) throw new Error(contactData.error);

        setCharacter(charData.character);
        setContact(contactData.contact);
        setTransactions(ledgerData.transactions || contactData.transactions || []);

        // Fetch favor services
        if (charData.character?.editionCode) {
          try {
            const favorCostsRes = await fetch(
              `/api/editions/${charData.character.editionCode}/favor-costs`
            );
            const favorCostsData = await favorCostsRes.json();
            if (favorCostsData.success) {
              setFavorServices(favorCostsData.services || []);
            }
          } catch {
            // May not exist yet
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [characterId, contactId]);

  // Handle state transitions
  const handleStateTransition = async (action: string, reason?: string) => {
    if (!contact) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/characters/${characterId}/contacts/${contactId}/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || `Failed to ${action} contact`);
      }

      setContact(result.contact);
      if (result.transaction) {
        setTransactions((prev) => [result.transaction, ...prev]);
      }

      // Update character karma if reactivation
      if (action === "reactivate" && result.karmaCost && character) {
        setCharacter({
          ...character,
          karmaCurrent: character.karmaCurrent - result.karmaCost,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update contact
  const handleUpdateContact = async (data: UpdateContactRequest) => {
    const response = await fetch(`/api/characters/${characterId}/contacts/${contactId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to update contact");
    }

    setContact(result.contact);
  };

  // Handle call favor
  const handleCallFavor = async (data: {
    serviceId: string;
    diceRoll: number;
    rushJob?: boolean;
    notes?: string;
  }) => {
    const response = await fetch(`/api/characters/${characterId}/contacts/${contactId}/call-favor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to call favor");
    }

    setContact(result.contact);
    if (result.transaction) {
      setTransactions((prev) => [result.transaction, ...prev]);
    }

    // Update character resources
    if (character && result.costs) {
      setCharacter({
        ...character,
        nuyen: character.nuyen - (result.costs.nuyen || 0),
        karmaCurrent: character.karmaCurrent - (result.costs.karma || 0),
      });
    }
  };

  // Handle delete contact
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact? This cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/characters/${characterId}/contacts/${contactId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete contact");
      }

      // Redirect to contacts list
      window.location.href = `/characters/${characterId}/contacts`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Loading Contact...
          </span>
        </div>
      </div>
    );
  }

  if (error || !contact || !character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-400 font-mono">{error || "Contact not found"}</p>
        <Link
          href={`/characters/${characterId}/contacts`}
          className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          ← Return to contacts
        </Link>
      </div>
    );
  }

  const favorBalance = contact.favorBalance;
  const favorBalanceText =
    favorBalance > 0
      ? `${favorBalance} owed to you`
      : favorBalance < 0
      ? `${Math.abs(favorBalance)} owed by you`
      : "Even";
  const favorBalanceColor =
    favorBalance > 0 ? "text-emerald-400" : favorBalance < 0 ? "text-amber-400" : "text-muted-foreground";

  return (
    <div className={`min-h-screen ${theme.colors.background} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/characters/${characterId}/contacts`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Contacts
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onPress={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onPress={handleDelete}
              isDisabled={actionLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Contact Header Card */}
        <div className={`${theme.components.section.wrapper} p-6`}>
          <div className="flex items-start justify-between gap-6">
            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className={`text-2xl font-bold ${theme.colors.heading}`}>{contact.name}</h1>
                <span
                  className={`text-xs font-mono uppercase px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
                >
                  {contact.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className={theme.colors.accent}>{contact.archetype}</span>
                {contact.metatype && (
                  <>
                    <span>•</span>
                    <span>{contact.metatype}</span>
                  </>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {contact.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {contact.location}
                  </div>
                )}
                {contact.organization && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    {contact.organization}
                  </div>
                )}
              </div>

              {/* Specializations */}
              {contact.specializations && contact.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {contact.specializations.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center shrink-0">
              <div className={`p-4 rounded ${theme.colors.card} border ${theme.colors.border}`}>
                <div className="text-[10px] text-muted-foreground uppercase">Connection</div>
                <div className={`text-3xl font-bold ${theme.colors.accent}`}>{contact.connection}</div>
              </div>
              <div className={`p-4 rounded ${theme.colors.card} border ${theme.colors.border}`}>
                <div className="text-[10px] text-muted-foreground uppercase">Loyalty</div>
                <div className="text-3xl font-bold text-pink-400">{contact.loyalty}</div>
              </div>
              <div className={`p-4 rounded ${theme.colors.card} border ${theme.colors.border} col-span-2`}>
                <div className="text-[10px] text-muted-foreground uppercase">Favor Balance</div>
                <div className={`text-xl font-bold ${favorBalanceColor}`}>{favorBalanceText}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {contact.description && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">{contact.description}</p>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="mt-4 p-3 bg-muted/30 rounded">
              <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Notes</div>
              <p className="text-sm text-foreground">{contact.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <Section title="Actions" theme={theme}>
          <div className="flex flex-wrap gap-3">
            {contact.status === "active" && (
              <Button
                onPress={() => setShowCallFavorModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded ${theme.colors.accentBg} text-white`}
              >
                <Phone className="w-4 h-4" />
                Call Favor
              </Button>
            )}

            {contact.status === "active" && (
              <Button
                onPress={() => {
                  const reason = prompt("Why are you burning this contact?");
                  if (reason !== null) {
                    handleStateTransition("burn", reason);
                  }
                }}
                isDisabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Flame className="w-4 h-4" />
                Burn Contact
              </Button>
            )}

            {contact.status === "burned" && (
              <Button
                onPress={() => handleStateTransition("reactivate")}
                isDisabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reactivate (Costs Karma)
              </Button>
            )}

            {contact.status === "active" && (
              <>
                <Button
                  onPress={() => handleStateTransition("mark-missing")}
                  isDisabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Mark Missing
                </Button>
                <Button
                  onPress={() => {
                    const reason = prompt("How did this contact die?");
                    if (reason !== null) {
                      handleStateTransition("mark-deceased", reason);
                    }
                  }}
                  isDisabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors"
                >
                  Mark Deceased
                </Button>
              </>
            )}
          </div>

          {contact.status === "burned" && contact.burnedReason && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="text-xs text-red-400 font-bold">Burned Reason:</div>
              <p className="text-sm text-red-400">{contact.burnedReason}</p>
              {contact.burnedAt && (
                <div className="text-xs text-red-400/60 mt-1">
                  Burned on {new Date(contact.burnedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Transaction History */}
        <Section title="Transaction History" theme={theme}>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const typeInfo = TYPE_LABELS[tx.type] || { label: tx.type, color: "text-muted-foreground" };
                return (
                  <div
                    key={tx.id}
                    className={`p-3 rounded border ${theme.colors.border} ${theme.colors.card}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-mono uppercase ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{tx.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      {tx.favorChange !== 0 && (
                        <span
                          className={
                            tx.favorChange > 0 ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          Favor: {tx.favorChange > 0 ? "+" : ""}
                          {tx.favorChange}
                        </span>
                      )}
                      {tx.loyaltyChange !== undefined && tx.loyaltyChange !== 0 && (
                        <span>
                          Loyalty: {tx.loyaltyChange > 0 ? "+" : ""}
                          {tx.loyaltyChange}
                        </span>
                      )}
                      {tx.nuyenSpent !== undefined && tx.nuyenSpent > 0 && (
                        <span>¥{tx.nuyenSpent.toLocaleString()}</span>
                      )}
                      {tx.success !== undefined && (
                        <span className={tx.success ? "text-emerald-400" : "text-red-400"}>
                          {tx.success ? "Success" : "Failed"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          <span className="font-mono">ID: {contact.id}</span>
          <span className="font-mono">
            Created: {new Date(contact.createdAt).toLocaleDateString()}
            {contact.lastContactedAt &&
              ` • Last Contact: ${new Date(contact.lastContactedAt).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      <ContactFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateContact as (data: import("@/lib/types").CreateContactRequest) => Promise<void>}
        contact={contact}
        theme={theme}
      />

      {/* Call Favor Modal */}
      <CallFavorModal
        isOpen={showCallFavorModal}
        onClose={() => setShowCallFavorModal(false)}
        onSubmit={handleCallFavor}
        contact={contact}
        services={favorServices}
        characterNuyen={character.nuyen}
        characterKarma={character.karmaCurrent}
        theme={theme}
      />
    </div>
  );
}
