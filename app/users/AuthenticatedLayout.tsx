"use client";

import { Link, Button, Menu, MenuTrigger, MenuItem, Popover } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/NotificationBell";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { Tooltip } from "@/components/ui/Tooltip";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ScrollIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

export default function AuthenticatedLayout({
  children,
  currentPath = "/",
}: AuthenticatedLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shadow-master-sidebar-collapsed-global");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("shadow-master-sidebar-collapsed-global", JSON.stringify(newState));
  };

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, href: "/", disabled: false },
    {
      id: "characters",
      label: "Characters",
      icon: UserIcon,
      href: "/characters",
      disabled: false,
      badge: null,
    },
    { id: "rulesets", label: "Rulesets", icon: BookIcon, href: "/rulesets" },
    { id: "campaigns", label: "Campaigns", icon: ScrollIcon, href: "/campaigns" },
    ...(user.role.includes("administrator")
      ? [
          {
            id: "users",
            label: "User Management",
            icon: ShieldCheckIcon,
            href: "/users",
            disabled: false,
          },
        ]
      : []),
    { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-zinc-950">
      {/* Header */}
      <header className="neon-header fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/95">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger menu */}
            <Button
              onPress={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-zinc-400"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <div className="flex flex-col">
              <Link
                href="/"
                className="logo-text text-xl font-semibold text-black transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-emerald-400"
              >
                Shadow Master
              </Link>
              <EnvironmentBadge />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationBell />
            {/* User Menu */}
            <MenuTrigger>
              <Button
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                aria-label="User menu"
              >
                <div className="avatar-glow flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 dark:border dark:border-emerald-500/20">
                  <span className="text-xs font-medium text-zinc-700 dark:text-emerald-400">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.username}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
              <Popover className="min-w-[200px] rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <Menu className="p-1">
                  <MenuItem className="flex flex-col items-start rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{user.email}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                    </div>
                  </MenuItem>
                  <MenuItem
                    onAction={() => router.push("/settings/profile")}
                    className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onAction={() => router.push("/settings")}
                    className="rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onAction={handleSignOut}
                    className="rounded-md px-3 py-2 text-sm text-red-600 outline-none focus:bg-zinc-100 dark:text-red-400 dark:focus:bg-zinc-800 cursor-pointer"
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`neon-sidebar fixed left-0 top-0 z-40 h-screen pt-16 border-r border-zinc-200 bg-white/95 transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/95 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isCollapsed ? "w-16" : "w-64"}`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end p-2 border-b border-zinc-100 dark:border-zinc-800/30">
              <Tooltip
                content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                placement="right"
                delay={300}
              >
                <button
                  onClick={toggleCollapse}
                  className="collapse-btn hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  )}
                </button>
              </Tooltip>
            </div>

            <nav className={`flex-1 overflow-y-auto p-2 ${isCollapsed ? "items-center" : ""}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === currentPath;
                const isDisabled = item.disabled;

                // Render disabled items as non-interactive elements
                if (isDisabled) {
                  const disabledContent = (
                    <div
                      className={`flex cursor-not-allowed items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-600 ${
                        isCollapsed ? "justify-center" : "gap-3"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          <span className="ml-auto rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                            Soon
                          </span>
                        </>
                      )}
                    </div>
                  );

                  return isCollapsed ? (
                    <Tooltip
                      key={item.id}
                      content={`${item.label} (Coming soon)`}
                      placement="right"
                      delay={300}
                    >
                      <div role="button" tabIndex={0}>
                        {disabledContent}
                      </div>
                    </Tooltip>
                  ) : (
                    <div key={item.id} title="Coming soon">
                      {disabledContent}
                    </div>
                  );
                }

                const linkContent = (
                  <Link
                    href={item.href}
                    className={`nav-item flex items-center rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                    } ${
                      isActive
                        ? "nav-item-active bg-zinc-100 text-black dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${isActive ? "dark:text-emerald-400" : ""}`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {"badge" in item &&
                          (item as { badge?: string | number | null }).badge != null && (
                            <span className="ml-auto rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                              {(item as { badge?: string | number | null }).badge}
                            </span>
                          )}
                      </>
                    )}
                  </Link>
                );

                return isCollapsed ? (
                  <Tooltip key={item.id} content={item.label} placement="right" delay={300}>
                    {linkContent}
                  </Tooltip>
                ) : (
                  <div key={item.id}>{linkContent}</div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - margin only on lg+ screens where sidebar is visible */}
        <main
          className={`flex-1 min-h-screen pt-16 transition-all duration-300 bg-white dark:bg-zinc-950 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
        >
          {/* Email Verification Banner - in document flow, spans full width */}
          <EmailVerificationBanner />
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
