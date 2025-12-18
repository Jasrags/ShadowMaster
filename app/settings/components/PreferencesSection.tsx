"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";

export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
}

export function PreferencesSection() {
    const { theme, setTheme } = useTheme();

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

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-colors">
            <div className="border-b border-border px-6 py-5">
                <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Customize your experience across the sprawl.
                </p>
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
                                    onClick={() => setTheme(t.id)}
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
                    <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                        <div>
                            <h3 className="text-sm font-medium text-foreground">Compact Mode</h3>
                            <p className="text-xs text-muted-foreground">Reduce padding and font sizes for high-density information</p>
                        </div>
                        <div className="w-10 h-6 bg-muted rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full" />
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
