import { User, Shield, Sliders, Database, EyeOff } from "lucide-react";

export type SettingsSection = "account" | "security" | "preferences" | "data" | "privacy";

interface SettingsNavigationProps {
    activeSection: SettingsSection;
    onSectionChange: (section: SettingsSection) => void;
}

const navigation = [
    { name: 'Account', href: 'account', icon: User },
    { name: 'Security', href: 'security', icon: Shield },
    { name: 'Preferences', href: 'preferences', icon: Sliders },
    { name: 'Data Management', href: 'data', icon: Database },
    { name: 'Privacy', href: 'privacy', icon: EyeOff },
] as const;

export function SettingsNavigation({ activeSection, onSectionChange }: SettingsNavigationProps) {
    return (
        <nav className="space-y-1">
            {navigation.map((item) => {
                const isActive = activeSection === item.href;
                return (
                    <button
                        key={item.name}
                        onClick={() => onSectionChange(item.href as SettingsSection)}
                        className={`
              group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium
              ${isActive
                                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'}
            `}
                    >
                        <item.icon
                            className={`
                mr-3 h-5 w-5 flex-shrink-0
                ${isActive ? 'text-zinc-500 dark:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-300'}
              `}
                            aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                    </button>
                );
            })}
        </nav>
    );
}
