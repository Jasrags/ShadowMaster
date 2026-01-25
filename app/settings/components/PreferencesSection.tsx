"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { UserSettings } from "@/lib/types/user";
import { Moon, Sun, Monitor, Loader2 } from "lucide-react";

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();
  const [compactMode, setCompactMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/account/preferences");
        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            setCompactMode(data.preferences.navigationCollapsed || false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const updatePreferences = async (updates: Partial<UserSettings>) => {
    setSaving(true);
    try {
      await fetch("/api/account/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: updates }),
      });
    } catch (error) {
      console.error("Failed to update preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    await updatePreferences({ theme: newTheme });
  };

  const handleCompactModeToggle = async () => {
    const newValue = !compactMode;
    setCompactMode(newValue);
    await updatePreferences({ navigationCollapsed: newValue });
  };

  const themes = [
    {
      id: "light" as const,
      name: "Light",
      icon: Sun,
      description: "Classic light appearance",
    },
    {
      id: "dark" as const,
      name: "Dark",
      icon: Moon,
      description: "Easy on the eyes in low light",
    },
    {
      id: "system" as const,
      name: "Auto",
      icon: Monitor,
      description: "Follow system settings",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="settings-card">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Preferences</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Customize your experience across the sprawl.
          </p>
        </div>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
      </div>

      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-4">
            Appearance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`settings-theme-card ${isSelected ? "settings-theme-card-active" : ""}`}
                >
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-medium ${isSelected ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"}`}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs text-zinc-500">{t.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={handleCompactModeToggle}
          >
            <div>
              <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Compact Mode</h3>
              <p className="text-xs text-zinc-500">
                Reduce padding and font sizes for high-density information
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full relative transition-colors ${compactMode ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white dark:bg-zinc-900 rounded-full transition-all ${compactMode ? "left-5" : "left-1"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
