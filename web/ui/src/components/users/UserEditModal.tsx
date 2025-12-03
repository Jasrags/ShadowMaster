import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  TextField,
  Input,
  Label,
  Checkbox,
} from 'react-aria-components';
import type { User, Role } from '../../lib/types';

interface UserEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User, updates: { username: string; roles: Role[] }) => Promise<void>;
}

const ALL_ROLES: Role[] = ['administrator', 'gamemaster', 'player'];

export function UserEditModal({
  isOpen,
  onOpenChange,
  user,
  onSave,
}: UserEditModalProps) {
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRoles([...user.roles]);
      setError('');
    }
  }, [user]);

  const handleRoleToggle = (role: Role) => {
    setRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(user, { username: username.trim(), roles });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <Dialog>
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="text-2xl font-bold text-gray-100 mb-6"
                >
                  Edit User
                </Heading>

                {error && (
                  <div className="mb-4 p-3 bg-sr-danger/20 border border-sr-danger rounded-md text-sr-danger text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* User ID (read-only) */}
                  <div>
                    <Label className="text-sm font-medium text-gray-300 block mb-1">
                      User ID
                    </Label>
                    <div className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-400 text-sm font-mono">
                      {user.id}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      User ID cannot be changed
                    </p>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <Label className="text-sm font-medium text-gray-300 block mb-1">
                      Email
                    </Label>
                    <div className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-400 text-sm">
                      {user.email}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Username (editable) */}
                  <TextField
                    value={username}
                    onChange={setUsername}
                    isRequired
                    className="flex flex-col gap-1"
                  >
                    <Label className="text-sm font-medium text-gray-300">
                      Username
                    </Label>
                    <Input
                      className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent"
                      placeholder="Enter username"
                    />
                  </TextField>

                  {/* Roles (checkboxes) */}
                  <div>
                    <Label className="text-sm font-medium text-gray-300 block mb-3">
                      Roles
                    </Label>
                    <div className="space-y-2">
                      {ALL_ROLES.map((role) => (
                        <Checkbox
                          key={role}
                          isSelected={roles.includes(role)}
                          onChange={(isSelected) => {
                            if (isSelected) {
                              setRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
                            } else {
                              setRoles((prev) => prev.filter((r) => r !== role));
                            }
                          }}
                          className="group flex items-center gap-2"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded border border-sr-light-gray bg-sr-darker
                                        group-data-[selected]:bg-sr-accent group-data-[selected]:border-sr-accent
                                        group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-sr-accent
                                        transition-colors">
                            <svg
                              className="h-3 w-3 text-gray-100 opacity-0 group-data-[selected]:opacity-100"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-300 capitalize">
                            {role}
                          </span>
                        </Checkbox>
                      ))}
                    </div>
                    {roles.length === 0 && (
                      <p className="mt-2 text-xs text-sr-warning">
                        User must have at least one role
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-sr-light-gray">
                  <Button
                    onPress={close}
                    className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 
                             data-[hovered]:bg-sr-darker/80 
                             data-[pressed]:bg-sr-light-gray
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                             data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent 
                             transition-colors font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handleSave}
                    isDisabled={isSaving || roles.length === 0 || !username.trim()}
                    className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                             data-[hovered]:bg-sr-accent/80 
                             data-[pressed]:bg-sr-accent-dark
                             data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                             data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                             data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                             transition-colors font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

