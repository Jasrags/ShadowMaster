"use client";

import Image from "next/image";
import { Link, Button } from "react-aria-components";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function Home() {
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-black dark:text-zinc-50">
                  {user.username}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {user.email} • {user.role}
                </p>
              </div>
              <Button
                onPress={handleSignOut}
                className="rounded-md border border-solid border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {user ? `Welcome back, ${user.username}!` : "Welcome to Shadow Master"}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {user ? (
              <>
                You're signed in as <span className="font-medium">{user.email}</span> with the{" "}
                <span className="font-medium">{user.role}</span> role. Start creating and managing your Shadowrun characters.
              </>
            ) : (
              <>
                Create and manage your Shadowrun characters.{" "}
                <Link
                  href="/signup"
                  className="font-medium text-zinc-950 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                >
                  Sign up
                </Link>{" "}
                or{" "}
                <Link
                  href="/signin"
                  className="font-medium text-zinc-950 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                >
                  sign in
                </Link>{" "}
                to get started.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {user ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Account created: {new Date(user.createdAt).toLocaleDateString()}
              {user.lastLogin && (
                <> • Last login: {new Date(user.lastLogin).toLocaleDateString()}</>
              )}
            </div>
          ) : (
            <>
              <Link
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                href="/signup"
              >
                Sign Up
              </Link>
              <Link
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
                href="/signin"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
