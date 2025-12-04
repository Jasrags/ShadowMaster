"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Character } from "@/lib/supabase/schema";

interface ShadowrunCharacterData {
  metatype?: string;
  archetype?: string;
  description?: string;
  attributes?: {
    body?: number;
    agility?: number;
    reaction?: number;
    strength?: number;
    willpower?: number;
    logic?: number;
    intuition?: number;
    charisma?: number;
    edge?: number;
    magic?: number;
    resonance?: number;
  };
  karma?: { total?: number; available?: number };
  nuyen?: number;
}

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
  showCampaign?: boolean;
  compact?: boolean;
}

export function CharacterCard({ 
  character, 
  isLoading = false,
  showCampaign = true,
  compact = false,
}: CharacterCardProps) {
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

  // Extract Shadowrun character data
  const data = character.character_data as ShadowrunCharacterData | null;
  const metatype = data?.metatype || "";
  const archetype = data?.archetype || "";
  const description = data?.description || "No description available.";
  const attributes = data?.attributes;

  // Build character type string
  const characterType = [metatype, archetype].filter(Boolean).join(" ") || "Runner";

  if (compact) {
    return (
      <Link
        href={`/characters/${character.id}`}
        className="block rounded-lg border border-border bg-bg p-3 hover:border-primary/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {character.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-fg group-hover:text-primary transition-colors truncate">
              {character.name}
            </h4>
            <p className="text-xs text-muted-fg truncate">{characterType}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary">
              {character.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{character.name}</CardTitle>
            <CardDescription className="truncate">
              {characterType} • Player: {playerName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Quick stats if available */}
        {attributes && (
          <div className="grid grid-cols-4 gap-1 mb-3">
            {[
              { key: "body", label: "B" },
              { key: "agility", label: "A" },
              { key: "reaction", label: "R" },
              { key: "strength", label: "S" },
            ].map(({ key, label }) => (
              <div key={key} className="text-center p-1 rounded bg-bg-muted">
                <div className="text-xs text-muted-fg">{label}</div>
                <div className="text-sm font-bold text-fg">
                  {attributes[key as keyof typeof attributes] || 1}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-sm text-muted-fg line-clamp-2">{description}</p>
        
        {showCampaign && (
          <p className="text-xs text-muted-fg mt-2">
            Campaign:{" "}
            <Link
              href={`/campaigns/${character.campaign_id}`}
              className="hover:text-primary transition-colors"
            >
              {campaignName}
            </Link>
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-fg">
          Created {new Date(character.created_at).toLocaleDateString()}
        </span>
        <Link href={`/characters/${character.id}`}>
          <Button intent="primary" size="sm">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
