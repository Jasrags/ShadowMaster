"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Modal,
  ModalOverlay,
  Heading,
  Button,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import type { PublicUser, UpdateUserRequest, UserRole } from "@/lib/types/user";
import { isValidEmail, isValidUsername } from "@/lib/auth/validation";

interface UserEditModalProps {
  user: PublicUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: UserEditModalProps) {
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [selectedRoles, setSelectedRoles] = useState<Set<UserRole>>(
    new Set(Array.isArray(user.role) ? user.role : [user.role])
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(user.email);
      setUsername(user.username);
      setSelectedRoles(new Set(Array.isArray(user.role) ? user.role : [user.role]));
      setErrors({});
    }
  }, [user, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (!isValidUsername(username)) {
      newErrors.username = "Username must be between 3 and 50 characters";
    }

    if (selectedRoles.size === 0) {
      newErrors.role = "User must have at least one role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const updateData: UpdateUserRequest = {
      email,
      username,
      role: Array.from(selectedRoles),
    };

    await onSave(updateData);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      isDismissable
    >
      <Modal className="w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <Dialog className="outline-none">
          {({ close }) => (
            <>
              <Heading
                slot="title"
                className="border-b border-zinc-200 px-6 py-4 text-xl font-semibold text-black dark:border-zinc-800 dark:text-zinc-50"
              >
                Edit User
              </Heading>
              <div className="px-6 py-4 space-y-4">
                {/* Email Field */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="edit-email"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                      errors.email
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                    placeholder="user@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Username Field */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="edit-username"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:ring-zinc-600 ${
                      errors.username
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                    placeholder="username"
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                  )}
                </div>

                {/* Roles Field */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Roles <span className="text-red-500">*</span>
                  </h3>
                  <ListBox
                    aria-label="Select roles"
                    selectedKeys={selectedRoles}
                    onSelectionChange={(keys) => {
                      setSelectedRoles(new Set(keys as Iterable<UserRole>));
                    }}
                    selectionMode="multiple"
                    className={`w-full rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:focus:ring-zinc-600 ${
                      errors.role
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <ListBoxItem
                      id="user"
                      className="px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 data-[selected]:bg-zinc-200 data-[selected]:font-medium dark:text-zinc-50 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                    >
                      User
                    </ListBoxItem>
                    <ListBoxItem
                      id="gamemaster"
                      className="px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 data-[selected]:bg-zinc-200 data-[selected]:font-medium dark:text-zinc-50 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                    >
                      Gamemaster
                    </ListBoxItem>
                    <ListBoxItem
                      id="administrator"
                      className="px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 data-[selected]:bg-zinc-200 data-[selected]:font-medium dark:text-zinc-50 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                    >
                      Administrator
                    </ListBoxItem>
                  </ListBox>
                  {errors.role && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                  )}
                </div>

                {/* Read-only fields */}
                <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">User ID:</span>
                      <p className="text-zinc-600 dark:text-zinc-400">{user.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Created:</span>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <Button
                  onPress={close}
                  isDisabled={isLoading}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSave}
                  isDisabled={isLoading}
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-[#ccc] dark:focus:ring-zinc-400"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

