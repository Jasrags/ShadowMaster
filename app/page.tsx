"use client";

import { useEffect, useState } from "react";
import { Link } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AuthenticatedLayout from "./users/AuthenticatedLayout";
import type { Character, Campaign } from "@/lib/types";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="flex min-h-screen w-full flex-col items-center justify-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        </main>
      </div>
    );
  }

  // Show authenticated homepage if user is logged in
  if (user) {
    return <AuthenticatedHomepage user={user} />;
  }

  // Show unauthenticated homepage
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-semibold text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Shadow Master
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="flex h-10 items-center justify-center rounded-md border border-solid border-black/[.08] px-4 text-sm font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:hover:bg-[#ccc] dark:focus:ring-zinc-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
              Welcome to Shadow Master
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Create and manage your Shadowrun characters with ease.
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Support for all editions (1E-6E + Anarchy)
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="flex h-12 min-w-[140px] items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:hover:bg-[#ccc] dark:focus:ring-zinc-400"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="flex h-12 min-w-[140px] items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-base font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Features
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1: Character Management */}
            <div className="group rounded-lg border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <svg
                  className="h-8 w-8 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Character Management
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Create, edit, and manage your Shadowrun characters with an intuitive interface
              </p>
            </div>

            {/* Feature Card 2: Multi-Edition Support */}
            <div className="group rounded-lg border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <svg
                  className="h-8 w-8 text-zinc-600 dark:text-zinc-400"
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
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Multi-Edition Support
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Support for all Shadowrun editions (1E-6E + Anarchy) with edition-specific rules
              </p>
            </div>

            {/* Feature Card 3: Flexible Rulesets */}
            <div className="group rounded-lg border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <svg
                  className="h-8 w-8 text-zinc-600 dark:text-zinc-400"
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
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Flexible Rulesets
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Customizable rulesets with book-based overrides and modular rule systems
              </p>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Ready to create your first character?
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="flex h-12 min-w-[160px] items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:hover:bg-[#ccc] dark:focus:ring-zinc-400"
              >
                Sign Up Free
              </Link>
              <Link
                href="/signin"
                className="flex h-12 min-w-[160px] items-center justify-center rounded-full border border-solid border-black/[.08] px-8 text-base font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
              Already have an account? Sign in to continue.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link
                href="#"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
              >
                Documentation
              </Link>
              <Link
                href="#"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
              >
                Terms
              </Link>
            </nav>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">© 2024 Shadow Master</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// DASHBOARD ICONS
// =============================================================================

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8l3 5-9 3 3-9 3 1zm0 0V4m0 4l4-2m-4 2l-4-2"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

// =============================================================================
// CHARACTER STATUS BADGE
// =============================================================================

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  retired: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  deceased: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-xs font-mono uppercase ${statusColors[status] || statusColors.draft}`}
    >
      {status}
    </span>
  );
}

// =============================================================================
// CAMPAIGN STATUS COLORS
// =============================================================================

const campaignStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  archived: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

// =============================================================================
// LOADING SKELETON
// =============================================================================

function CharacterSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
        <div className="h-5 w-14 bg-muted rounded" />
      </div>
      <div className="flex items-center gap-3 text-sm">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
      </div>
    </div>
  );
}

function CampaignSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
        <div className="h-5 w-14 bg-muted rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}

// =============================================================================
// COMPACT CHARACTER CARD
// =============================================================================

interface CompactCharacterCardProps {
  character: Character;
}

// Get neon card class based on character archetype/magical path
function getArchetypeCardClass(character: Character): string {
  const path = character.magicalPath;
  if (path === "full-mage" || path === "aspected-mage" || path === "explorer") {
    return "neon-card-mage";
  }
  if (path === "adept") {
    return "neon-card-face"; // Adepts get amber/face color
  }
  if (path === "technomancer") {
    return "neon-card-decker";
  }
  // Default to sam (green) for mundane characters
  return "neon-card-sam";
}

// Get hover text color based on archetype
function getArchetypeHoverColor(character: Character): string {
  const path = character.magicalPath;
  if (path === "full-mage" || path === "aspected-mage" || path === "explorer") {
    return "group-hover:text-violet-500";
  }
  if (path === "adept") {
    return "group-hover:text-amber-500";
  }
  if (path === "technomancer") {
    return "group-hover:text-blue-500";
  }
  return "group-hover:text-emerald-500";
}

function CompactCharacterCard({ character }: CompactCharacterCardProps) {
  const href =
    character.status === "draft"
      ? `/characters/${character.id}/edit`
      : `/characters/${character.id}`;

  const cardClass = getArchetypeCardClass(character);
  const hoverColor = getArchetypeHoverColor(character);

  return (
    <Link
      href={href}
      className={`group block rounded-lg border border-border bg-card neon-card ${cardClass} transition-all duration-300`}
    >
      {/* Card content with padding to account for accent bar */}
      <div className="p-4 pt-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold text-foreground truncate transition-colors ${hoverColor}`}
            >
              {character.name || "Unnamed Runner"}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {character.metatype || "Unknown"} • {character.editionCode?.toUpperCase()}
            </p>
          </div>
          <StatusBadge status={character.status} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">◉</span>
            <span className="font-mono font-semibold stat-karma">
              {character.karmaCurrent ?? 0}
            </span>
            <span className="text-muted-foreground">karma</span>
          </span>
          {character.nuyen !== undefined && character.nuyen > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">◎</span>
              <span className="font-mono font-semibold stat-nuyen">
                ¥{((character.nuyen || 0) / 1000).toFixed(0)}k
              </span>
            </span>
          )}
        </div>

        {/* Footer with archetype */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          {character.magicalPath && character.magicalPath !== "mundane" ? (
            <span className="text-xs font-medium text-archetype-mage capitalize">
              {character.magicalPath.replace(/-/g, " ")}
            </span>
          ) : (
            <span className="text-xs font-medium text-archetype-sam">Mundane</span>
          )}
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {character.editionCode?.toUpperCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// COMPACT CAMPAIGN CARD
// =============================================================================

interface CompactCampaignCardProps {
  campaign: Campaign;
  userRole: "gm" | "player";
}

function CompactCampaignCard({ campaign, userRole }: CompactCampaignCardProps) {
  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group block rounded-lg border border-border bg-card neon-card neon-card-campaign transition-all duration-300"
    >
      {/* Card content with padding to account for accent bar */}
      <div className="p-4 pt-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-indigo-500 transition-colors">
                {campaign.title}
              </h3>
              {userRole === "gm" && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <CrownIcon className="h-3 w-3" />
                  GM
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono uppercase mt-1">
              {campaign.editionCode}
            </p>
          </div>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs font-mono uppercase ${campaignStatusColors[campaign.status]}`}
          >
            {campaign.status}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UsersIcon className="h-4 w-4" />
          <span>
            <span className="font-mono font-semibold text-foreground">
              {campaign.playerIds?.length || 0}
            </span>{" "}
            players
          </span>
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// AUTHENTICATED HOMEPAGE
// =============================================================================

function AuthenticatedHomepage({
  user,
}: {
  user: {
    id: string;
    username: string;
    email: string;
    role: string[];
    createdAt: string;
    lastLogin?: string | null;
  };
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch characters and campaigns in parallel
        const [charRes, campRes] = await Promise.all([
          fetch("/api/characters?format=summary&limit=6"),
          fetch("/api/campaigns"),
        ]);

        const [charData, campData] = await Promise.all([charRes.json(), campRes.json()]);

        if (charData.success) {
          setCharacters(charData.characters || []);
        }

        if (campData.success) {
          setCampaigns(campData.campaigns || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Find draft characters for "Continue Draft" action
  const draftCharacters = characters.filter((c) => c.status === "draft");
  const mostRecentDraft = draftCharacters[0]; // Already sorted by updated date

  // Determine user role for each campaign
  const getCampaignRole = (campaign: Campaign): "gm" | "player" => {
    return campaign.gmId === user.id ? "gm" : "player";
  };

  return (
    <AuthenticatedLayout>
      {/* Dashboard container with grid background */}
      <div className="bg-grid min-h-full">
        {/* Welcome Section with Neon Divider */}
        <section className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back, {user.username}!
          </h1>
          <div className="neon-divider mt-4" />
        </section>

        {/* Pending Actions Bar */}
        {mostRecentDraft && (
          <section className="mb-8">
            <div className="alert-banner-accent flex items-center gap-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
                <PencilIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {draftCharacters.length} draft{draftCharacters.length !== 1 ? "s" : ""} in
                  progress
                </p>
                <p className="text-sm text-muted-foreground">
                  Continue working on &quot;{mostRecentDraft.name || "Unnamed Runner"}&quot;
                </p>
              </div>
              <Link
                href={`/characters/${mostRecentDraft.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Continue
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* My Characters Section */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title-accent text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              My Characters
            </h2>
            {characters.length > 0 && (
              <Link
                href="/characters"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <CharacterSkeleton key={i} />
              ))}
            </div>
          ) : characters.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/10 p-12 text-center">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No characters yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first Shadowrun character.
              </p>
              <div className="mt-6">
                <Link
                  href="/characters/create/sheet"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create your first character
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.slice(0, 5).map((character) => (
                <CompactCharacterCard key={character.id} character={character} />
              ))}
              {/* "+ New Character" Card */}
              <Link
                href="/characters/create/sheet"
                className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 p-6 text-center transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-emerald-500/10 transition-colors">
                  <PlusIcon className="h-6 w-6 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-emerald-500 transition-colors">
                  New Character
                </span>
              </Link>
            </div>
          )}
        </section>

        {/* My Campaigns Section */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title-accent text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              My Campaigns
            </h2>
            {campaigns.length > 0 && (
              <Link
                href="/campaigns"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <CampaignSkeleton key={i} />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/10 p-12 text-center">
              <MapIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No campaigns yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a new campaign or join an existing one to get started.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/campaigns/create"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Campaign
                </Link>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Browse Campaigns
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.slice(0, 5).map((campaign) => (
                <CompactCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  userRole={getCampaignRole(campaign)}
                />
              ))}
              {/* "+ New Campaign" Card */}
              <Link
                href="/campaigns/create"
                className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 p-6 text-center transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-indigo-500/10 transition-colors">
                  <PlusIcon className="h-6 w-6 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                </div>
                <span className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-indigo-500 transition-colors">
                  New Campaign
                </span>
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="section-title-accent mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/characters/create/sheet"
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <PlusIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Create Character
                </span>
                <p className="text-sm text-muted-foreground">Start a new runner</p>
              </div>
            </Link>
            <Link
              href="/campaigns/create"
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <MapIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Create Campaign
                </span>
                <p className="text-sm text-muted-foreground">Start a new game</p>
              </div>
            </Link>
            <Link
              href="/rulesets"
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-zinc-500/30 hover:shadow-lg hover:shadow-zinc-500/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-500/10 group-hover:bg-zinc-500/20 transition-colors">
                <BookIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <span className="font-semibold text-foreground group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  Browse Rulesets
                </span>
                <p className="text-sm text-muted-foreground">View editions & books</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
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
