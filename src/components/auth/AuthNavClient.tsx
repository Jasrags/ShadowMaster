"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/auth/types";

interface AuthNavClientProps {
  user: User | null;
}

export function AuthNavClient({ user }: AuthNavClientProps) {
  if (!user) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/login">
          <Button intent="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button intent="primary" size="sm">
            Sign Up
          </Button>
        </Link>
      </nav>
    );
  }

  return <UserMenu user={user} />;
}

