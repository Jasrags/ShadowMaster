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

    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
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
            id: 'light' as const,
            name: 'Light',
            icon: Sun,
            description: 'Classic light appearance'
        },
        {
            id: 'dark' as const,
            name: 'Dark',
            icon: Moon,
            description: 'Easy on the eyes in low light'
        },
        {
            id: 'system' as const,
            name: 'Auto',
            icon: Monitor,
            description: 'Follow system settings'
        }
    ];

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-colors">
            <div className="border-b border-border px-6 py-5 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Customize your experience across the sprawl.
                    </p>
                </div>
                {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="p-6 space-y-8">
                <section>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
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
                                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer
                                        ${isSelected
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted dark:hover:border-primary/50'
                                        }
                                    `}
                                >
                                    <div className={`p-2 rounded-lg ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <div className="pt-6 border-t border-border">
                    <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={handleCompactModeToggle}
                    >
                        <div>
                            <h3 className="text-sm font-medium text-foreground">Compact Mode</h3>
                            <p className="text-xs text-muted-foreground">Reduce padding and font sizes for high-density information</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${compactMode ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all ${compactMode ? 'left-5' : 'left-1'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
