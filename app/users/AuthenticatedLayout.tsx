"use client";

import { Link, Button, Menu, MenuTrigger, MenuItem, Popover } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useState } from "react";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

export default function AuthenticatedLayout({ children, currentPath = "/" }: AuthenticatedLayoutProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, href: "/", disabled: false },
    { id: "characters", label: "Characters", icon: UserIcon, href: "/characters", disabled: false, badge: null },
    { id: "rulesets", label: "Rulesets", icon: BookIcon, href: "/rulesets", disabled: true },
    ...(user.role.includes("administrator")
      ? [{ id: "users", label: "User Management", icon: UsersIcon, href: "/users", disabled: false }]
      : []),
    { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings", disabled: true },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger menu */}
            <Button
              onPress={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <Link
              href="/"
              className="text-xl font-semibold text-black transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Shadow Master
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button
              className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Button>
            {/* Settings */}
            <Button
              className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
            {/* User Menu */}
            <MenuTrigger>
              <Button
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
                aria-label="User menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.username}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <Popover className="min-w-[200px] rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <Menu className="p-1">
                  <MenuItem
                    className="flex flex-col items-start rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{user.email}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</div>
                  </MenuItem>
                  <MenuItem
                    className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onAction={handleSignOut}
                    className="rounded-md px-3 py-2 text-sm text-red-600 outline-none focus:bg-zinc-100 dark:text-red-400 dark:focus:bg-zinc-800"
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-60 border-r border-zinc-200 bg-white transition-transform dark:border-zinc-800 dark:bg-black lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex h-full flex-col p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === currentPath;
              const isDisabled = item.disabled;

              // Render disabled items as non-interactive elements
              if (isDisabled) {
                return (
                  <div
                    key={item.id}
                    className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-600"
                    title="Coming soon"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-zinc-400 ${
                    isActive
                      ? "bg-zinc-100 text-black dark:bg-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {"badge" in item && (item as { badge?: string | number | null }).badge != null && (
                    <span className="ml-auto rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {(item as { badge?: string | number | null }).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-60">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

