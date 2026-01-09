"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Link } from "react-aria-components";
import { Loader2 } from "lucide-react";

/**
 * Resume Character Edit Page
 *
 * Redirects draft characters to sheet-based creation for continued editing.
 * Only draft characters can be resumed - active characters cannot be edited here.
 */
export default function ResumeCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const response = await fetch(`/api/characters/${resolvedParams.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load character");
        }

        const char = data.character;
        if (char.status !== "draft") {
          throw new Error("Character is not in draft status and cannot be edited.");
        }

        // Redirect to sheet creation with the character ID
        router.replace(`/characters/create/sheet?characterId=${resolvedParams.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    }

    checkAndRedirect();
  }, [resolvedParams.id, router]);

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <span className="text-sm text-zinc-500">
            Loading character...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-red-400">{error}</p>
        <Link
          href="/characters"
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Return to characters
        </Link>
      </div>
    );
  }

  return null;
}
