import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { User, UserRole } from '../types/auth.js';
import * as usersAPI from '../lib/api/users.js';
import ProtectedRoute from '../components/ProtectedRoute.js';

function UserManagement() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ role?: UserRole }>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allUsers = await usersAPI.getAllUsers();
      setUsers(allUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({ role: user.role });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const handleSave = async (userId: string) => {
    try {
      setError(null);
      await usersAPI.updateUser(userId, editForm);
      await loadUsers();
      setEditingUserId(null);
      setEditForm({});
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  if (currentUser?.role !== 'administrator') {
    return (
      <ProtectedRoute requireRole="administrator">
        <div>Access Denied</div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">User Management</h1>

        {error && (
          <div className="mb-4 bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground">Loading users...</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Username</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3 text-sm text-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {editingUserId === user.id ? (
                        <select
                          value={editForm.role || user.role}
                          onChange={(e) =>
                            setEditForm({ role: e.target.value as UserRole })
                          }
                          className="px-2 py-1 border border-input rounded bg-background text-foreground"
                        >
                          <option value="user">user</option>
                          <option value="administrator">administrator</option>
                          <option value="gamemaster">gamemaster</option>
                        </select>
                      ) : (
                        <span className="capitalize">{user.role}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingUserId === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;

