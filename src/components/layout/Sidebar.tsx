"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  PlayIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Campaigns", href: "/campaigns", icon: BookOpenIcon },
  { name: "Characters", href: "/characters", icon: UserIcon },
  { name: "Play", href: "/play", icon: PlayIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-border bg-bg-muted
          transition-all duration-300 ease-in-out
          lg:static lg:z-auto
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "w-16" : "w-64"}
        `}
        aria-label="Sidebar navigation"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-fg">Navigation</h2>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-md text-fg hover:text-primary hover:bg-overlay focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-md text-fg hover:text-primary hover:bg-overlay focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-ring
                  ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-fg hover:bg-overlay hover:text-primary"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`
                    h-5 w-5 flex-shrink-0
                    ${isActive ? "text-primary" : "text-fg group-hover:text-primary"}
                  `}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile menu button (shown on mobile when sidebar is closed) */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-4 left-4 z-40 lg:hidden p-3 rounded-full bg-primary text-primary-fg shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

