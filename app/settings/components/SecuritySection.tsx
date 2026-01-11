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
    <div className="rounded-lg border border-border bg-card shadow-sm transition-colors">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-medium text-foreground">Security Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your password and security preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {message && (
            <div
              className={`rounded-md p-4 transition-colors ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-destructive/10 text-destructive dark:text-destructive border border-destructive/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-foreground/80"
            >
              Current Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-input bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-foreground/80">
              New Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-input bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                required
                minLength={8}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-foreground/80"
            >
              Confirm New Password
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-input bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-black"
          >
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
