import { AlertTriangle, Trash2 } from "lucide-react";

interface PrivacySectionProps {
    onDeleteAccount: () => Promise<void>;
}

export function PrivacySection({ onDeleteAccount }: PrivacySectionProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-lg font-medium text-red-600 dark:text-red-500">Danger Zone</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Irreversible actions for your account.
                </p>
            </div>

            <div className="p-6">
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Delete Account</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
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
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
