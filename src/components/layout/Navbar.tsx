"use client";

import { AuthNavClient } from "@/components/auth/AuthNavClient";
import Link from "next/link";
import { useState } from "react";
import type { User } from "@/lib/auth/types";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-bg-muted">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-fg hover:bg-overlay focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="text-xl font-bold text-fg hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            ShadowMaster
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/campaigns"
            className="text-sm font-medium text-fg hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            Campaigns
          </Link>
          <Link
            href="/characters"
            className="text-sm font-medium text-fg hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            Characters
          </Link>
          <Link
            href="/play"
            className="text-sm font-medium text-fg hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1"
          >
            Play
          </Link>
        </nav>

        <div className="flex items-center">
          <AuthNavClient user={user} />
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-bg-muted">
          <nav className="flex flex-col px-4 py-2 space-y-1">
            <Link
              href="/campaigns"
              className="px-3 py-2 text-sm font-medium text-fg hover:text-primary hover:bg-overlay rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="/characters"
              className="px-3 py-2 text-sm font-medium text-fg hover:text-primary hover:bg-overlay rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Characters
            </Link>
            <Link
              href="/play"
              className="px-3 py-2 text-sm font-medium text-fg hover:text-primary hover:bg-overlay rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Play
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

