import { useState } from "react";
import { Lock, Save } from "lucide-react";

interface SecuritySectionProps {
  onChangePassword: (current: string, newPass: string) => Promise<void>;
}

export function SecuritySection({ onChangePassword }: SecuritySectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await onChangePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-card">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Security Settings</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your password and security preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {message && (
            <div
              className={`rounded-md p-4 transition-colors ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Current Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="settings-input-addon rounded-l-md">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="settings-input rounded-l-none rounded-r-md"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              New Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="settings-input-addon rounded-l-md">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="settings-input rounded-l-none rounded-r-md"
                required
                minLength={8}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">Minimum 8 characters</p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Confirm New Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="settings-input-addon rounded-l-md">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="settings-input rounded-l-none rounded-r-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={loading} className="settings-btn-primary">
            {loading ? (
              "Updating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
