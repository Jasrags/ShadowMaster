"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, MenuTrigger, Menu, MenuItem, Popover } from "react-aria-components";
import type { PublicUser, UpdateUserRequest, UserRole, AccountStatus } from "@/lib/types/user";
import UserEditModal from "./UserEditModal";
import UserAuditModal from "./UserAuditModal";

// Helper to check if user is currently locked out (lockoutUntil is in the future)
const isLockedOut = (user: PublicUser): boolean =>
  user.lockoutUntil ? new Date(user.lockoutUntil) > new Date() : false;

// Format time for lockout badge
const formatLockoutTime = (lockoutUntil: string): string => {
  const date = new Date(lockoutUntil);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

interface UserTableProps {
  initialUsers: PublicUser[];
}

type SortColumn = "email" | "username" | "role" | "createdAt";
type SortOrder = "asc" | "desc";

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<PublicUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [sortBy, setSortBy] = useState<SortColumn>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<PublicUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditUser, setAuditUser] = useState<PublicUser | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch {
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit, sortBy, sortOrder]);

  // Load users when filters change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, limit, sortBy, sortOrder]);

  // Handle edit start
  const handleEditStart = (user: PublicUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Handle save from modal
  const handleSave = async (data: UpdateUserRequest) => {
    if (!editingUser) return;

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);
        setEditingUser(null);
        // Refresh users
        await fetchUsers();
      } else {
        setError(result.error || "Failed to update user");
      }
    } catch {
      setError("An error occurred while updating user");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Refresh users
        await fetchUsers();
      } else {
        setError(data.error || "Failed to delete user");
      }
    } catch {
      setError("An error occurred while deleting user");
    } finally {
      setLoading(false);
    }
  };

  // Handle sort
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format role
  const formatRole = (role: UserRole | UserRole[]) => {
    const roles = Array.isArray(role) ? role : [role];
    return roles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ");
  };

  // Format status with color
  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Active
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Suspended
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Locked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
            Unknown
          </span>
        );
    }
  };

  // Handle suspend user
  const handleSuspend = async (user: PublicUser) => {
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${user.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        setError(data.error || "Failed to suspend user");
      }
    } catch {
      setError("An error occurred while suspending user");
    } finally {
      setLoading(false);
    }
  };

  // Handle reactivate user
  const handleReactivate = async (user: PublicUser) => {
    if (!confirm(`Are you sure you want to reactivate ${user.username}?`)) return;

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${user.id}/suspend`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        setError(data.error || "Failed to reactivate user");
      }
    } catch {
      setError("An error occurred while reactivating user");
    } finally {
      setLoading(false);
    }
  };

  // Handle view audit log
  const handleViewAudit = (user: PublicUser) => {
    setAuditUser(user);
    setIsAuditModalOpen(true);
  };

  // Handle unlock user (clear login lockout)
  const handleUnlock = async (user: PublicUser) => {
    if (!confirm(`Are you sure you want to unlock ${user.username}?`)) return;

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${user.id}/lockout`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        setError(data.error || "Failed to unlock user");
      }
    } catch {
      setError("An error occurred while unlocking user");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async (user: PublicUser) => {
    setIsResending(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${user.id}/resend-verification`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        alert(`Verification email sent to ${user.email}`);
      } else {
        setError(data.error || "Failed to resend verification email");
      }
    } catch {
      setError("An error occurred while resending verification email");
    } finally {
      setIsResending(false);
    }
  };

  // Handle manual email verification
  const handleManualVerify = async (user: PublicUser) => {
    if (
      !confirm(
        `Are you sure you want to manually verify ${user.email}?\n\nThis bypasses the normal email verification process.`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
      const response = await fetch(`/api/users/${user.id}/verify-email`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
      } else {
        setError(data.error || "Failed to verify email");
      }
    } catch {
      setError("An error occurred while verifying email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Page reset is handled by debounce effect
            }}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600"
            placeholder="Search by email or username..."
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full" aria-label="User management table">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Email
                  {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <button
                  onClick={() => handleSort("username")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Username
                  {sortBy === "username" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <button
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Role
                  {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Created
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Last Login
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="sr-only">Actions</span>
                <svg
                  className="ml-auto h-5 w-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">{user.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">{user.username}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {getStatusBadge(user.accountStatus)}
                      {isLockedOut(user) && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          Locked out (until {formatLockoutTime(user.lockoutUntil!)})
                        </span>
                      )}
                      {!user.emailVerified && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(user.lastLogin)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <MenuTrigger>
                        <Button
                          isDisabled={loading}
                          aria-label="User actions"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Button>
                        <Popover className="rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                          <Menu
                            onAction={(key) => {
                              if (key === "edit") {
                                handleEditStart(user);
                              } else if (key === "suspend") {
                                handleSuspend(user);
                              } else if (key === "reactivate") {
                                handleReactivate(user);
                              } else if (key === "unlock") {
                                handleUnlock(user);
                              } else if (key === "resend-verification") {
                                handleResendVerification(user);
                              } else if (key === "verify-email") {
                                handleManualVerify(user);
                              } else if (key === "audit") {
                                handleViewAudit(user);
                              } else if (key === "delete") {
                                handleDelete(user.id);
                              }
                            }}
                            className="p-1"
                          >
                            <MenuItem
                              id="edit"
                              className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                            >
                              Edit
                            </MenuItem>
                            {user.accountStatus === "active" ? (
                              <MenuItem
                                id="suspend"
                                className="rounded-md px-3 py-2 text-sm text-yellow-600 outline-none focus:bg-zinc-100 dark:text-yellow-400 dark:focus:bg-zinc-800"
                              >
                                Suspend
                              </MenuItem>
                            ) : (
                              <MenuItem
                                id="reactivate"
                                className="rounded-md px-3 py-2 text-sm text-green-600 outline-none focus:bg-zinc-100 dark:text-green-400 dark:focus:bg-zinc-800"
                              >
                                Reactivate
                              </MenuItem>
                            )}
                            {isLockedOut(user) && (
                              <MenuItem
                                id="unlock"
                                className="rounded-md px-3 py-2 text-sm text-orange-600 outline-none focus:bg-zinc-100 dark:text-orange-400 dark:focus:bg-zinc-800"
                              >
                                Unlock
                              </MenuItem>
                            )}
                            {!user.emailVerified && (
                              <>
                                <MenuItem
                                  id="resend-verification"
                                  className="rounded-md px-3 py-2 text-sm text-amber-600 outline-none focus:bg-zinc-100 dark:text-amber-400 dark:focus:bg-zinc-800"
                                >
                                  Resend Verification
                                </MenuItem>
                                <MenuItem
                                  id="verify-email"
                                  className="rounded-md px-3 py-2 text-sm text-green-600 outline-none focus:bg-zinc-100 dark:text-green-400 dark:focus:bg-zinc-800"
                                >
                                  Mark as Verified
                                </MenuItem>
                              </>
                            )}
                            <MenuItem
                              id="audit"
                              className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                            >
                              View Audit Log
                            </MenuItem>
                            <MenuItem
                              id="delete"
                              className="rounded-md px-3 py-2 text-sm text-red-600 outline-none focus:bg-zinc-100 dark:text-red-400 dark:focus:bg-zinc-800"
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </Popover>
                      </MenuTrigger>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Page <span className="font-mono">{page}</span>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={page === 1 || loading}
              className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
            >
              Previous
            </Button>
            <Button
              onPress={() => setPage((p) => p + 1)}
              isDisabled={users.length < limit || loading}
              className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSave}
          isLoading={loading}
          onUnlock={async () => {
            await handleUnlock(editingUser);
            // Refresh the editing user data
            // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
            const response = await fetch(`/api/users/${editingUser.id}`);
            const data = await response.json();
            if (data.success && data.user) {
              setEditingUser(data.user);
            }
          }}
          onResendVerification={async () => {
            await handleResendVerification(editingUser);
          }}
          onManualVerify={async () => {
            await handleManualVerify(editingUser);
            // Refresh the editing user data
            // codeql-suppress js/file-access-to-http - False positive: only UUID identifier sent, not file data
            const response = await fetch(`/api/users/${editingUser.id}`);
            const data = await response.json();
            if (data.success && data.user) {
              setEditingUser(data.user);
            }
          }}
          isResending={isResending}
        />
      )}

      {/* Audit Log Modal */}
      {auditUser && (
        <UserAuditModal
          user={auditUser}
          isOpen={isAuditModalOpen}
          onClose={() => {
            setIsAuditModalOpen(false);
            setAuditUser(null);
          }}
        />
      )}
    </div>
  );
}
