"use client";

import { useRef, useEffect, useId } from "react";
import { Link, Button, Menu, MenuTrigger, MenuItem, Popover } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/lib/contexts/SidebarContext";
import { NotificationBell } from "@/components/NotificationBell";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { Tooltip } from "@/components/ui/Tooltip";

// =============================================================================
// TYPES
// =============================================================================

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

// =============================================================================
// ICON COMPONENTS
// =============================================================================

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AuthenticatedLayout({
  children,
  currentPath = "/",
}: AuthenticatedLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { isOpen, isCollapsed, toggle, close, toggleCollapse } = useSidebar();

  // Generate unique IDs for ARIA relationships
  const sidebarId = useId();
  const mainContentId = useId();

  // Ref for focus management
  const sidebarRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: move focus to sidebar when it opens on mobile
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      // Find first focusable element in sidebar
      const firstFocusable = sidebarRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  // Return focus to toggle button when sidebar closes
  useEffect(() => {
    if (!isOpen && toggleButtonRef.current) {
      // Only return focus if we're on mobile (sidebar was a drawer)
      if (window.innerWidth < 1024) {
        toggleButtonRef.current.focus();
      }
    }
  }, [isOpen]);

  // Focus trap for mobile sidebar
  useEffect(() => {
    if (!isOpen) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusableElements = sidebar.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      // Only trap focus on mobile
      if (window.innerWidth >= 1024) return;

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

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
      {/* Skip Link for keyboard users */}
      <a
        href={`#${mainContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isOpen ? "Navigation sidebar opened" : ""}
      </div>

      {/* Header */}
      <header className="neon-header fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/95">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger menu */}
            <Button
              ref={toggleButtonRef}
              onPress={toggle}
              className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:focus:ring-emerald-400 dark:focus:ring-offset-zinc-950 lg:hidden"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls={sidebarId}
            >
              {isOpen ? <CloseIcon className="h-6 w-6" /> : <HamburgerIcon className="h-6 w-6" />}
            </Button>
            <div className="flex flex-col">
              {/* Accessible heading - visually hidden but available to screen readers */}
              <h1 className="sr-only">Shadow Master</h1>
              <Link
                href="/"
                className="logo-text text-xl font-semibold text-black transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-emerald-400"
                aria-label="Shadow Master - Go to home page"
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
                aria-label={`User menu for ${user.username}`}
              >
                <div className="avatar-glow flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:border dark:border-emerald-500/20 dark:bg-zinc-800">
                  <span className="text-xs font-medium text-zinc-700 dark:text-emerald-400">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.username}</span>
                <ChevronDownIcon className="h-4 w-4" />
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
                    className="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onAction={() => router.push("/settings")}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-900 outline-none focus:bg-zinc-100 dark:text-zinc-50 dark:focus:bg-zinc-800"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onAction={handleSignOut}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 outline-none focus:bg-zinc-100 dark:text-red-400 dark:focus:bg-zinc-800"
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
          ref={sidebarRef}
          id={sidebarId}
          role="complementary"
          aria-label="Main navigation sidebar"
          className={`neon-sidebar fixed left-0 top-0 z-40 h-screen border-r border-zinc-200 bg-white/95 pt-16 transition-[transform,width] duration-300 ease-in-out dark:border-zinc-800/50 dark:bg-zinc-950/95 lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } ${isCollapsed ? "w-16" : "w-64"}`}
        >
          <div className="flex h-full flex-col">
            {/* Collapse toggle (desktop only) */}
            <div className="flex items-center justify-end border-b border-zinc-100 p-2 dark:border-zinc-800/30">
              <Tooltip
                content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                placement="right"
                delay={300}
              >
                <button
                  onClick={toggleCollapse}
                  className="collapse-btn hidden h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-zinc-500 dark:hover:bg-zinc-900 lg:flex"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!isCollapsed}
                >
                  {isCollapsed ? (
                    <ChevronRightIcon className="h-4 w-4" />
                  ) : (
                    <ChevronLeftIcon className="h-4 w-4" />
                  )}
                </button>
              </Tooltip>
            </div>

            {/* Navigation */}
            <nav
              aria-label="Main navigation"
              className={`flex-1 overflow-y-auto p-2 ${isCollapsed ? "items-center" : ""}`}
            >
              <ul role="list" className="space-y-1">
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
                        aria-disabled="true"
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

                    return (
                      <li key={item.id}>
                        {isCollapsed ? (
                          <Tooltip
                            content={`${item.label} (Coming soon)`}
                            placement="right"
                            delay={300}
                          >
                            <div role="button" tabIndex={0} aria-disabled="true">
                              {disabledContent}
                            </div>
                          </Tooltip>
                        ) : (
                          <div title="Coming soon">{disabledContent}</div>
                        )}
                      </li>
                    );
                  }

                  const linkContent = (
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
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

                  return (
                    <li key={item.id}>
                      {isCollapsed ? (
                        <Tooltip content={item.label} placement="right" delay={300}>
                          {linkContent}
                        </Tooltip>
                      ) : (
                        linkContent
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={close}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                close();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Main Content - margin only on lg+ screens where sidebar is visible */}
        <main
          id={mainContentId}
          tabIndex={-1}
          className={`flex-1 min-h-screen bg-white pt-16 transition-[margin] duration-300 ease-in-out dark:bg-zinc-950 ${
            isCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          {/* Email Verification Banner - in document flow, spans full width */}
          <EmailVerificationBanner />
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
