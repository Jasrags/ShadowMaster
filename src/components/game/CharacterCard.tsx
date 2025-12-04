"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Character } from "@/lib/supabase/schema";

interface CharacterCardProps {
  character: Character & {
    player?: {
      id: string;
      username: string;
      avatar_url: string | null;
    };
    campaign?: {
      id: string;
      name: string;
    };
  };
  isLoading?: boolean;
}

export function CharacterCard({ character, isLoading = false }: CharacterCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-3/4 bg-bg-muted rounded" />
          <div className="h-4 w-1/2 bg-bg-muted rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-bg-muted rounded mb-2" />
          <div className="h-4 w-2/3 bg-bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const playerName = character.player?.username || "Unknown Player";
  const campaignName = character.campaign?.name || "No Campaign";

  // Extract basic character info from metadata if available
  const metadata = character.metadata as Record<string, any> | null;
  const characterType = metadata?.type || "Unknown";
  const description = metadata?.description || "No description available.";

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>
          {characterType} • Player: {playerName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-fg line-clamp-2">{description}</p>
        <p className="text-xs text-muted-fg mt-2">Campaign: {campaignName}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-fg">
          Created {new Date(character.created_at).toLocaleDateString()}
        </span>
        <Link href={`/characters/${character.id}`}>
          <Button intent="primary" size="sm">
            View Character
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

