
export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
}



export function PreferencesSection() {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Preferences</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Customize your experience.
                </p>
            </div>

            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
                <p>User preferences are coming soon.</p>
                <p className="text-sm mt-2">Theme customization uses your system settings by default.</p>
            </div>
        </div>
    );
}
