import { AlertTriangle, Trash2 } from "lucide-react";

interface PrivacySectionProps {
  onDeleteAccount: (password: string) => Promise<void>;
}

export function PrivacySection({ onDeleteAccount }: PrivacySectionProps) {
  return (
    <div className="settings-card !border-red-900/50">
      <div className="border-b border-red-200 dark:border-red-900/30 px-6 py-4">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-500">Danger Zone</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Irreversible actions for your account.
        </p>
      </div>

      <div className="p-6">
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex">
            <div className="shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</h3>
              <div className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">
                <p>
                  Once you delete your account, there is no going back. Please be certain. All your
                  characters and personal data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-end gap-4">
          <div className="w-full max-w-sm">
            <label
              htmlFor="delete-password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Confirm Password to Delete Account
            </label>
            <input
              type="password"
              id="delete-password"
              placeholder="Enter your password"
              className="settings-input focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <button
            onClick={async () => {
              const passwordInput = document.getElementById("delete-password") as HTMLInputElement;
              const password = passwordInput?.value;
              if (!password) {
                alert("Please enter your password to confirm deletion.");
                return;
              }
              if (
                window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone and all your characters will be lost."
                )
              ) {
                try {
                  await onDeleteAccount(password);
                } catch (error) {
                  alert((error as Error).message);
                }
              }
            }}
            className="settings-btn-danger"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
