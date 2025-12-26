"use client";

import React, { useState, useMemo } from "react";
import type { FavorTransaction, FavorLedger, SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

interface FavorLedgerViewProps {
  ledger: FavorLedger;
  contacts: SocialContact[];
  theme?: Theme;
}

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

export function FavorLedgerView({ ledger, contacts, theme }: FavorLedgerViewProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [filterContact, setFilterContact] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get contact name by ID
  const getContactName = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || "Unknown Contact";
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let txs = [...ledger.transactions];

    if (filterContact !== "all") {
      txs = txs.filter((tx) => tx.contactId === filterContact);
    }

    if (filterType !== "all") {
      txs = txs.filter((tx) => tx.type === filterType);
    }

    txs.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return txs;
  }, [ledger.transactions, filterContact, filterType, sortOrder]);

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Date",
      "Type",
      "Contact",
      "Description",
      "Favor Change",
      "Loyalty Change",
      "Nuyen Spent",
      "Karma Spent",
      "Success",
    ];
    const rows = filteredTransactions.map((tx) => [
      new Date(tx.timestamp).toISOString(),
      tx.type,
      getContactName(tx.contactId),
      tx.description,
      tx.favorChange,
      tx.loyaltyChange || "",
      tx.nuyenSpent || "",
      tx.karmaSpent || "",
      tx.success !== undefined ? (tx.success ? "Yes" : "No") : "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `favor-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Favors Called</div>
          <div className={`text-xl font-bold ${t.colors.heading}`}>{ledger.totalFavorsCalled}</div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-amber-400 uppercase font-mono">Favors Owed</div>
          <div className="text-xl font-bold text-amber-400">{ledger.totalFavorsOwed}</div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">Nuyen Spent</div>
          <div className={`text-xl font-bold ${t.colors.heading}`}>
            ¥{ledger.totalNuyenSpent.toLocaleString()}
          </div>
        </div>
        <div className={`p-3 rounded text-center ${t.colors.card} border ${t.colors.border}`}>
          <div className="text-[10px] text-red-400 uppercase font-mono">Burned</div>
          <div className="text-xl font-bold text-red-400">{ledger.burnedContactsCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterContact}
          onChange={(e) => setFilterContact(e.target.value)}
          className={`px-3 py-1.5 text-sm rounded border ${t.colors.border} bg-background text-foreground`}
        >
          <option value="all">All Contacts</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-3 py-1.5 text-sm rounded border ${t.colors.border} bg-background text-foreground`}
        >
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([type, { label }]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded border ${t.colors.border} bg-background text-muted-foreground hover:text-foreground transition-colors`}
        >
          {sortOrder === "desc" ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
          {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>

        <div className="flex-1" />

        <button
          onClick={handleExport}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded border ${t.colors.border} bg-background text-muted-foreground hover:text-foreground transition-colors`}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const typeInfo = TYPE_LABELS[tx.type] || { label: tx.type, color: "text-muted-foreground" };
            const isExpanded = expandedId === tx.id;

            return (
              <div
                key={tx.id}
                className={`rounded border ${t.colors.border} overflow-hidden transition-all`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                  className={`w-full flex items-center justify-between p-3 ${t.colors.card} hover:bg-muted/50 transition-colors text-left`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono uppercase ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-sm text-foreground">{getContactName(tx.contactId)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-mono font-bold ${
                        tx.favorChange > 0
                          ? "text-emerald-400"
                          : tx.favorChange < 0
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tx.favorChange > 0 ? "+" : ""}
                      {tx.favorChange}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`p-3 border-t ${t.colors.border} bg-muted/30 space-y-2`}>
                    <p className="text-sm text-foreground">{tx.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {tx.loyaltyChange !== undefined && tx.loyaltyChange !== 0 && (
                        <span>
                          Loyalty:{" "}
                          <span className={tx.loyaltyChange > 0 ? "text-emerald-400" : "text-red-400"}>
                            {tx.loyaltyChange > 0 ? "+" : ""}
                            {tx.loyaltyChange}
                          </span>
                        </span>
                      )}
                      {tx.connectionChange !== undefined && tx.connectionChange !== 0 && (
                        <span>
                          Connection:{" "}
                          <span className={tx.connectionChange > 0 ? "text-emerald-400" : "text-red-400"}>
                            {tx.connectionChange > 0 ? "+" : ""}
                            {tx.connectionChange}
                          </span>
                        </span>
                      )}
                      {tx.nuyenSpent !== undefined && tx.nuyenSpent > 0 && (
                        <span>Nuyen: ¥{tx.nuyenSpent.toLocaleString()}</span>
                      )}
                      {tx.karmaSpent !== undefined && tx.karmaSpent > 0 && (
                        <span>Karma: {tx.karmaSpent}</span>
                      )}
                      {tx.success !== undefined && (
                        <span className={tx.success ? "text-emerald-400" : "text-red-400"}>
                          {tx.success ? "Success" : "Failed"}
                        </span>
                      )}
                    </div>

                    {tx.serviceType && (
                      <div className="text-xs text-muted-foreground">
                        Service: <span className="text-foreground">{tx.serviceType}</span>
                      </div>
                    )}

                    {tx.rollResult !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        Roll: <span className="text-foreground font-mono">{tx.rollResult} hits</span>
                        {tx.netHits !== undefined && (
                          <span className="ml-2">
                            (Net: {tx.netHits > 0 ? "+" : ""}
                            {tx.netHits})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-[10px] text-muted-foreground font-mono">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
