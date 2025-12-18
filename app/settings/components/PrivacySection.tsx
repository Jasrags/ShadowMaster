import { AlertTriangle, Trash2 } from "lucide-react";

interface PrivacySectionProps {
    onDeleteAccount: () => Promise<void>;
}

export function PrivacySection({ onDeleteAccount }: PrivacySectionProps) {
    return (
        <div className="rounded-lg border border-border bg-card shadow-sm transition-colors">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Irreversible actions for your account.
                </p>
            </div>

            <div className="p-6">
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
                            <div className="mt-2 text-sm text-destructive opacity-90">
                                <p>
                                    Once you delete your account, there is no going back. Please be certain.
                                    All your characters and personal data will be permanently deleted.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                onDeleteAccount();
                            }
                        }}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 dark:focus:ring-offset-background"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
