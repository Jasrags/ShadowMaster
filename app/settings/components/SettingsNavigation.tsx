import { User, Shield, Sliders, Database, EyeOff, Mail } from "lucide-react";

export type SettingsSection =
  | "account"
  | "security"
  | "preferences"
  | "communications"
  | "data"
  | "privacy";

interface SettingsNavigationProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const navigation = [
  { name: "Account", href: "account", icon: User },
  { name: "Security", href: "security", icon: Shield },
  { name: "Preferences", href: "preferences", icon: Sliders },
  { name: "Communications", href: "communications", icon: Mail },
  { name: "Data Management", href: "data", icon: Database },
  { name: "Privacy", href: "privacy", icon: EyeOff },
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
            className={`settings-nav-item ${isActive ? "settings-nav-item-active" : ""}`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"}`}
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
