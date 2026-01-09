"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Character Creation Page
 *
 * This page redirects to the sheet-based character creation.
 * It preserves any query parameters (e.g., campaignId).
 */
export default function CreateCharacterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve query parameters when redirecting
    const params = searchParams.toString();
    const redirectUrl = `/characters/create/sheet${params ? `?${params}` : ""}`;
    router.replace(redirectUrl);
  }, [router, searchParams]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-400" />
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Redirecting to character creation...
        </p>
      </div>
    </div>
  );
}
