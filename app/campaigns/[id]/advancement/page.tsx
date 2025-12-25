"use client";

import { useEffect, useState, use, useCallback } from "react";
import { Link, Button } from "react-aria-components";
import { 
  CheckCircle, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight,
  User,
  Shield,
  Zap
} from "lucide-react";
import type { AdvancementRecord, ID } from "@/lib/types";

interface PendingAdvancement {
  advancement: AdvancementRecord;
  characterId: ID;
  characterName: string;
  characterOwnerId: ID;
}

export default function GMApprovalDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;
  
  const [pendingItems, setPendingItems] = useState<PendingAdvancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchPendingAdvancements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/advancements/pending`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to load pending advancements");
      }
      
      setPendingItems(data.pendingAdvancements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchPendingAdvancements();
  }, [fetchPendingAdvancements]);

  const handleAction = async (characterId: ID, recordId: string, action: "approve" | "reject") => {
    setIsSubmitting(recordId);
    try {
      let rejectionReason = "";
      if (action === "reject") {
        rejectionReason = window.prompt("Reason for rejection:") || "Rejected by GM";
      }

      const response = await fetch(`/api/characters/${characterId}/advancement/${recordId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: action === "reject" ? JSON.stringify({ reason: rejectionReason }) : undefined,
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || `Failed to ${action} advancement`);

      // Remove from list
      setPendingItems(prev => prev.filter(item => item.advancement.id !== recordId));
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to ${action} advancement`);
    } finally {
      setIsSubmitting(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attribute": return <Shield className="h-4 w-4 text-blue-400" />;
      case "skill": return <Zap className="h-4 w-4 text-emerald-400" />;
      case "edge": return <Shield className="h-4 w-4 text-amber-400" />;
      default: return <Clock className="h-4 w-4 text-zinc-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500" />
          <span className="text-sm font-mono text-zinc-500 animate-pulse">
            LOADING PENDING ADVANCEMENTS...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 font-mono">{error}</p>
        <Link
          href={`/campaigns/${campaignId}`}
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Return to campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-500" />
            GM Advancement Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review and approve character advancements for your campaign
          </p>
        </div>
        <div className="flex gap-4">
           <Link
            href={`/campaigns/${campaignId}`}
            className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            ← Campaign Detail
          </Link>
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="p-12 text-center rounded-lg border border-dashed border-zinc-700 bg-zinc-800/10">
          <CheckCircle className="h-12 w-12 text-emerald-500/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">No Pending Advancements</h3>
          <p className="text-sm text-zinc-500 mt-1">All character growth has been reviewed. Good work, Chummer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingItems.map((item) => (
            <div
              key={item.advancement.id}
              className="p-5 rounded-lg border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <User className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                        {item.characterName}
                        <Link 
                          href={`/characters/${item.characterId}`}
                          className="text-xs font-normal text-zinc-500 hover:text-emerald-400 underline decoration-zinc-700 underline-offset-4"
                        >
                          View Sheet
                        </Link>
                      </h3>
                      <div className="text-xs text-zinc-500">
                        Submitted on {formatDate(item.advancement.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-13">
                    <div className="p-3 rounded bg-zinc-900/50 border border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(item.advancement.type)}
                        <span className="text-sm font-semibold text-zinc-300 capitalize">{item.advancement.type} Advancement</span>
                      </div>
                      <div className="text-sm text-zinc-100 font-medium">
                        {item.advancement.targetName}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {item.advancement.previousValue !== undefined ? (
                          <>Rating {item.advancement.previousValue} <ChevronRight className="inline h-3 w-3" /> {item.advancement.newValue}</>
                        ) : (
                          <>Rating {item.advancement.newValue}</>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-zinc-900/50 border border-zinc-700/50">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Transaction Details</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Karma Cost:</span>
                        <span className="font-bold text-amber-400">{item.advancement.karmaCost}k</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-zinc-400">Paid:</span>
                        <span className="text-emerald-400">✓ Deducted</span>
                      </div>
                    </div>
                  </div>

                  {item.advancement.notes && (
                    <div className="ml-13 p-3 rounded bg-blue-500/5 border border-blue-500/10 text-sm text-zinc-300 italic">
                      &quot; {item.advancement.notes} &quot;
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onPress={() => handleAction(item.characterId, item.advancement.id, "approve")}
                    isDisabled={isSubmitting !== null}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors min-w-[120px]"
                  >
                    {isSubmitting === item.advancement.id ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    onPress={() => handleAction(item.characterId, item.advancement.id, "reject")}
                    isDisabled={isSubmitting !== null}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-900/40 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-900/50 rounded font-medium transition-colors min-w-[120px]"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
