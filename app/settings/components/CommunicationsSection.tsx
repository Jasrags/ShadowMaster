"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Mail, Bell, ShieldAlert, Info } from "lucide-react";
import { CommunicationPreferences } from "@/lib/types/user";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
        enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function CommunicationsSection() {
  const [preferences, setPreferences] = useState<CommunicationPreferences>({
    productUpdates: false,
    campaignNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/settings/communications");
        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            setPreferences(data.preferences);
          }
        }
      } catch (error) {
        console.error("Failed to fetch communication preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const updatePreference = useCallback(
    async (key: keyof CommunicationPreferences, value: boolean) => {
      // Optimistically update UI
      setPreferences((prev) => ({ ...prev, [key]: value }));
      setSaving(true);

      try {
        const response = await fetch("/api/settings/communications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });

        if (!response.ok) {
          // Revert on failure
          setPreferences((prev) => ({ ...prev, [key]: !value }));
          console.error("Failed to update preference");
        }
      } catch (error) {
        // Revert on error
        setPreferences((prev) => ({ ...prev, [key]: !value }));
        console.error("Failed to update communication preference:", error);
      } finally {
        setSaving(false);
      }
    },
    []
  );

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
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Communication Preferences
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Choose which emails you want to receive from Shadow Master.
          </p>
        </div>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
      </div>

      <div className="p-6 space-y-6">
        {/* Optional Email Preferences */}
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-4">
            Optional Notifications
          </h3>

          <div className="space-y-4">
            {/* Product Updates */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Product Updates
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Receive emails about new features, tips, and release notes.
                  </p>
                </div>
              </div>
              <Toggle
                enabled={preferences.productUpdates}
                onChange={() => updatePreference("productUpdates", !preferences.productUpdates)}
              />
            </div>

            {/* Campaign Notifications */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Bell className="h-5 w-5 text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Campaign Notifications
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Receive session reminders and messages from your GMs.
                  </p>
                </div>
              </div>
              <Toggle
                enabled={preferences.campaignNotifications}
                onChange={() =>
                  updatePreference("campaignNotifications", !preferences.campaignNotifications)
                }
              />
            </div>
          </div>
        </section>

        {/* Informational Section */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-4">
            Always Sent
          </h3>

          <div className="space-y-4">
            {/* Security Alerts Info */}
            <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Security Alerts
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Account lockout notifications and password change confirmations are always sent to
                  protect your account. These cannot be disabled.
                </p>
              </div>
            </div>

            {/* Transactional Info */}
            <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Transactional Emails
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Emails for account verification, password resets, and magic links cannot be
                  disabled as they are required for account functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
