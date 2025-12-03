import { useState, useEffect } from 'react';
import { Button } from 'react-aria-components';
import { usersApi } from '../lib/api';
import type { User, Role } from '../lib/types';
import { DataTable, type ColumnDefinition } from '../components/table/DataTable';
import { DeleteConfirmModal } from '../components/table/DeleteConfirmModal';
import { UserEditModal } from '../components/users/UserEditModal';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdate = async (
    user: User,
    updates: { username: string; roles: Role[] }
  ) => {
    await usersApi.updateUser(user.id, {
      username: updates.username,
      roles: updates.roles,
    });
    await loadUsers();
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await usersApi.deleteUser(userToDelete.id);
      setUserToDelete(null);
      setIsDeleteModalOpen(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDefinition<User>[] = [
    {
      key: 'username',
      label: 'Username',
      isRowHeader: true,
      sortable: true,
      render: (user) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(user);
          }}
          className="text-sr-accent hover:text-sr-accent-light hover:underline cursor-pointer font-medium text-left"
        >
          {user.username}
        </button>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'roles',
      label: 'Roles',
      sortable: true,
      sortValue: (user) => user.roles.join(', ').toLowerCase(),
      render: (user) => (
        <div className="flex gap-2 flex-wrap">
          {user.roles.map((role) => (
            <span
              key={role}
              className="px-2 py-1 bg-sr-accent/20 border border-sr-accent rounded text-sr-accent text-sm"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (user) => (
        <Button
          onPress={() => handleDeleteClick(user)}
          className="px-3 py-1 bg-sr-danger border border-sr-danger rounded-md text-gray-100 
                     data-[hovered]:bg-sr-danger/80 
                     data-[pressed]:bg-sr-danger-dark
                     data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                     data-[focus-visible]:ring-sr-danger data-[focus-visible]:border-transparent 
                     transition-colors text-sm font-medium"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-tech text-4xl mb-6 text-glow-cyan">Users</h1>
        <div className="card-cyber p-8">
          <DataTable
            ariaLabel="Users table"
            columns={columns}
            data={users}
            getRowId={(user) => user.id}
            isLoading={isLoading}
            loadingMessage="Loading users..."
            emptyMessage="No users found."
            error={error}
            searchPlaceholder="Search by username, email, or role..."
            searchKeys={['username', 'email', 'roles']}
          />
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        item={userToDelete}
        itemName={(user) => user.username}
        title="Delete User"
        message="This action will soft delete the user. They will no longer appear in the user list."
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={userToEdit}
        onSave={handleUserUpdate}
      />
    </div>
  );
}
