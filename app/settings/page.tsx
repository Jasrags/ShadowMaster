"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SettingsSection, SettingsNavigation } from "./components/SettingsNavigation";
import { AccountSection } from "./components/AccountSection";
import { SecuritySection } from "./components/SecuritySection";
import { PreferencesSection } from "./components/PreferencesSection";
import { DataManagementSection } from "./components/DataManagementSection";
import { PrivacySection } from "./components/PrivacySection";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  // API Handlers
  const handleUpdateAccount = async (updates: { email?: string; username?: string }) => {
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to update account");
    }
  };

  const handleChangePassword = async (current: string, newPass: string) => {
    const response = await fetch("/api/account/security/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to change password");
    }
  };

  const handleExport = async () => {
    // Trigger file download
    window.location.href = "/api/account/export";
  };

  const handleDeleteAccount = async (password: string) => {
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || data.message || "Failed to delete account");
    }

    // Redirect to signin after deletion
    window.location.href = "/signin";
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <aside className="py-6 lg:col-span-3">
          <SettingsNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          {activeSection === "account" && (
            <AccountSection user={user} onUpdate={handleUpdateAccount} />
          )}
          {activeSection === "security" && (
            <SecuritySection onChangePassword={handleChangePassword} />
          )}
          {activeSection === "preferences" && <PreferencesSection />}
          {activeSection === "data" && <DataManagementSection onExport={handleExport} />}
          {activeSection === "privacy" && <PrivacySection onDeleteAccount={handleDeleteAccount} />}
        </div>
      </div>
    </div>
  );
}
