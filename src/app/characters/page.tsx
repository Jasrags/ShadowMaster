import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { getUserCharacters } from "./actions";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = {
  title: "My Characters | ShadowMaster",
  description: "View and manage your Shadowrun characters",
};

async function CharactersContent() {
  const result = await getUserCharacters();

  if (!result.success) {
    return (
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
        <p className="text-danger font-medium">Error loading characters</p>
        <p className="text-sm text-muted-fg mt-2">{result.error}</p>
      </div>
    );
  }

  const characters = result.data || [];

  // Group characters by campaign
  const charactersByCampaign = characters.reduce((acc, character) => {
    const campaignId = character.campaign_id;
    const campaignName = (character.campaign as any)?.name || "Unknown Campaign";
    
    if (!acc[campaignId]) {
      acc[campaignId] = {
        name: campaignName,
        characters: [],
      };
    }
    acc[campaignId].characters.push(character);
    return acc;
  }, {} as Record<string, { name: string; characters: typeof characters }>);

  const campaignGroups = Object.entries(charactersByCampaign);

  return (
    <div className="space-y-8">
      {campaignGroups.length === 0 ? (
        <div className="rounded-lg border border-border bg-bg-muted p-12 text-center">
          <h3 className="text-lg font-medium text-fg mb-2">No characters yet</h3>
          <p className="text-muted-fg mb-6">
            Create your first character to join the shadows.
          </p>
          <LinkButton href="/characters/new" intent="primary">
            Create Your First Character
          </LinkButton>
        </div>
      ) : (
        campaignGroups.map(([campaignId, { name, characters }]) => (
          <section key={campaignId}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-fg">{name}</h2>
              <LinkButton href={`/campaigns/${campaignId}`} intent="outline" size="sm">
                View Campaign
              </LinkButton>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => {
                const characterData = character.character_data as any;
                return (
                  <Link
                    key={character.id}
                    href={`/characters/${character.id}`}
                    className="rounded-lg border border-border bg-bg p-4 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {character.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-fg group-hover:text-primary transition-colors truncate">
                          {character.name}
                        </h3>
                        <p className="text-sm text-muted-fg">
                          {characterData?.metatype || "Unknown"}{" "}
                          {characterData?.archetype || "Runner"}
                        </p>
                        <p className="text-xs text-muted-fg mt-1">
                          Created {new Date(character.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {characterData?.description && (
                      <p className="text-sm text-muted-fg mt-3 line-clamp-2">
                        {characterData.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-7 w-48 bg-bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-bg p-4 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-bg-muted" />
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function CharactersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirectTo=/characters");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg">My Characters</h1>
          <p className="text-muted-fg mt-1">
            Manage your Shadowrun characters across all campaigns
          </p>
        </div>
          <LinkButton href="/characters/new" intent="primary">
            Create Character
          </LinkButton>
      </div>

      {/* Characters List */}
      <Suspense fallback={<LoadingSkeleton />}>
        <CharactersContent />
      </Suspense>
    </div>
  );
}

