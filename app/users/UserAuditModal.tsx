"use client";

import { useState, useEffect } from "react";
import { Dialog, Modal, ModalOverlay, Heading, Button } from "react-aria-components";
import type { PublicUser } from "@/lib/types/user";
import type { UserAuditEntry, UserAuditAction } from "@/lib/types/audit";

interface UserAuditModalProps {
  user: PublicUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAuditModal({ user, isOpen, onClose }: UserAuditModalProps) {
  const [entries, setEntries] = useState<UserAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Fetch audit entries when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAuditLog();
    }
  }, [isOpen, user.id]);

  const fetchAuditLog = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${user.id}/audit?limit=50&order=desc`);
      const data = await response.json();

      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      } else {
        setError(data.error || "Failed to fetch audit log");
      }
    } catch {
      setError("An error occurred while fetching audit log");
    } finally {
      setLoading(false);
    }
  };

  // Format action name for display
  const formatAction = (action: UserAuditAction): string => {
    const actionLabels: Record<UserAuditAction, string> = {
      user_created: "Account Created",
      user_role_granted: "Role Granted",
      user_role_revoked: "Role Revoked",
      user_email_changed: "Email Changed",
      user_username_changed: "Username Changed",
      user_suspended: "Account Suspended",
      user_reactivated: "Account Reactivated",
      user_deleted: "Account Deleted",
      user_lockout_triggered: "Account Locked",
      user_lockout_cleared: "Lockout Cleared",
      user_lockout_admin_cleared: "Lockout Cleared (Admin)",
      user_email_admin_verified: "Email Verified (Admin)",
      user_verification_admin_resent: "Verification Email Resent",
      admin_character_status_changed: "Character Status Changed",
    };
    return actionLabels[action] || action;
  };

  // Get action color
  const getActionColor = (action: UserAuditAction): string => {
    switch (action) {
      case "user_created":
      case "user_reactivated":
      case "user_lockout_cleared":
      case "user_lockout_admin_cleared":
      case "user_email_admin_verified":
        return "text-green-600 dark:text-green-400";
      case "user_suspended":
      case "user_lockout_triggered":
        return "text-yellow-600 dark:text-yellow-400";
      case "user_deleted":
      case "user_role_revoked":
        return "text-red-600 dark:text-red-400";
      case "user_verification_admin_resent":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  };

  // Format timestamp
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format details for display
  const formatDetails = (entry: UserAuditEntry): string => {
    const { details } = entry;
    const parts: string[] = [];

    if (details.previousValue !== undefined) {
      parts.push(`From: ${String(details.previousValue)}`);
    }
    if (details.newValue !== undefined) {
      parts.push(`To: ${String(details.newValue)}`);
    }
    if (details.reason) {
      parts.push(`Reason: ${details.reason}`);
    }

    return parts.join(" | ");
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Modal className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <Dialog className="outline-none">
          {({ close }) => (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <Heading
                  slot="title"
                  className="text-lg font-semibold text-black dark:text-zinc-50"
                >
                  Audit Log: {user.username}
                </Heading>
                <Button
                  onPress={close}
                  className="rounded-md p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Loading audit log...
                  </div>
                ) : entries.length === 0 ? (
                  <div className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    No audit entries found
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      {total} total entries
                    </div>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className={`font-medium ${getActionColor(entry.action)}`}>
                              {formatAction(entry.action)}
                            </span>
                            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                              {formatDate(entry.timestamp)}
                            </div>
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-500">
                            by {entry.actor.role}
                          </div>
                        </div>
                        {formatDetails(entry) && (
                          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {formatDetails(entry)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <Button
                  onPress={close}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
