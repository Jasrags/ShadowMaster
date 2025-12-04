"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CampaignsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Campaigns error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-danger mb-2">
          Something went wrong!
        </h2>
        <p className="text-muted-fg mb-6">
          There was an error loading your campaigns. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <Button intent="outline" onPress={() => reset()}>
            Try Again
          </Button>
          <Link href="/">
            <Button intent="primary">Go Home</Button>
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-muted-fg mt-4">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

