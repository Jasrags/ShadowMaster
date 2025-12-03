import { useState } from 'react';
import { Button, TextField, Input, Label } from 'react-aria-components';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../lib/api';

export function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Profile</h1>

        {/* User Info */}
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-400">Email</label>
              <div className="text-gray-100 mt-1">{user.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Username</label>
              <div className="text-gray-100 mt-1">{user.username}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Roles</label>
              <div className="flex gap-2 mt-1">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-sr-accent/20 border border-sr-accent rounded text-sr-accent text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Change Password</h2>

          {error && (
            <div className="mb-4 p-3 bg-sr-danger/20 border border-sr-danger rounded-md text-sr-danger text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-sr-success/20 border border-sr-success rounded-md text-sr-success text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <TextField
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              isRequired
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300">Current Password</Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                placeholder="Enter current password"
              />
            </TextField>

            <TextField
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              isRequired
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300">New Password</Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                placeholder="At least 12 characters"
              />
            </TextField>

            <div className="text-xs text-gray-400 mb-2">
              Password must be at least 12 characters and contain uppercase, lowercase, number, and special character
            </div>

            <TextField
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              isRequired
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300">Confirm New Password</Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                placeholder="Confirm new password"
              />
            </TextField>

            <Button
              type="submit"
              isDisabled={isLoading}
              className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Changing password...' : 'Change Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

