"use client";

import { Link } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AuthenticatedLayout from "./users/AuthenticatedLayout";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
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
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-semibold text-black transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Shadow Master
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="flex h-10 items-center justify-center rounded-md border border-solid border-black/[.08] px-4 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
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
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-5xl md:text-6xl">
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
                className="flex h-12 min-w-[140px] items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-base font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
              Features
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1: Character Management */}
            <div className="group rounded-lg border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700">
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
              <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
                Character Management
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Create, edit, and manage your Shadowrun characters with an intuitive interface
              </p>
            </div>

            {/* Feature Card 2: Multi-Edition Support */}
            <div className="group rounded-lg border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700">
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
              <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
                Multi-Edition Support
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Support for all Shadowrun editions (1E-6E + Anarchy) with edition-specific rules
              </p>
            </div>

            {/* Feature Card 3: Flexible Rulesets */}
            <div className="group rounded-lg border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700 sm:col-span-2 lg:col-span-1">
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
              <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
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
            <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
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
                className="flex h-12 min-w-[160px] items-center justify-center rounded-full border border-solid border-black/[.08] px-8 text-base font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a] dark:focus:ring-zinc-400"
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
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
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
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2024 Shadow Master
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Authenticated Homepage Component
function AuthenticatedHomepage({ user }: { user: { username: string; email: string; role: string[]; createdAt: string; lastLogin?: string | null } }) {
  return (
    <AuthenticatedLayout>
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
          Welcome back, {user.username}!
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>{user.email}</span>
          <span>•</span>
          <span>{Array.isArray(user.role) ? user.role.join(", ") : user.role}</span>
          <span>•</span>
          <span>Account created: {new Date(user.createdAt).toLocaleDateString()}</span>
          {user.lastLogin && (
            <>
              <span>•</span>
              <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </section>

      {/* Quick Actions / Dashboard */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/characters/create"
            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-6 text-center transition-all hover:border-zinc-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700 dark:focus:ring-zinc-400"
          >
            <svg className="mb-2 h-8 w-8 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-black dark:text-zinc-50">Create New Character</span>
          </Link>
          <Link
            href="/characters"
            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-6 text-center transition-all hover:border-zinc-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700 dark:focus:ring-zinc-400"
          >
            <UserIcon className="mb-2 h-8 w-8 text-zinc-600 dark:text-zinc-400" />
            <span className="text-sm font-medium text-black dark:text-zinc-50">Browse Characters</span>
          </Link>
          {/* Rulesets - Coming Soon */}
          <div
            className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
            title="Coming soon"
          >
            <BookIcon className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-600" />
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-600">View Rulesets</span>
            <span className="mt-1 rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              Soon
            </span>
          </div>
          {/* Recent Activity - Coming Soon */}
          <div
            className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
            title="Coming soon"
          >
            <svg className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-600">Recent Activity</span>
            <span className="mt-1 rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              Soon
            </span>
          </div>
        </div>
      </section>

      {/* Character List / Overview */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">Your Characters</h2>
        {/* Empty State */}
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-black">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
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
          <h3 className="mt-4 text-lg font-medium text-black dark:text-zinc-50">No characters yet</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Get started by creating your first Shadowrun character.
          </p>
          <div className="mt-6">
            <Link
              href="/characters/create"
              className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:hover:bg-[#ccc] dark:focus:ring-zinc-400"
            >
              Create your first character
            </Link>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
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


