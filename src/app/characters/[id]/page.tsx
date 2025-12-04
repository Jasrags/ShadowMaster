import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/session";
import { getCharacterDetails } from "../actions";
import { CharacterDetailView } from "./_components/CharacterDetailView";
import { LinkButton } from "@/components/ui/link-button";
import { PrintButton } from "@/components/ui/print-button";

export const metadata = {
  title: "Character Details | ShadowMaster",
  description: "View your Shadowrun character sheet",
};

interface CharacterDetailPageProps {
  params: Promise<{ id: string }>;
}

async function CharacterContent({ characterId }: { characterId: string }) {
  const result = await getCharacterDetails(characterId);

  if (!result.success) {
    if (result.error === "Character not found") {
      notFound();
    }
    return (
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
        <p className="text-danger font-medium">Error loading character</p>
        <p className="text-sm text-muted-fg mt-2">{result.error}</p>
      </div>
    );
  }

  const { character, isOwner, isGM } = result.data;

  if (!character) {
    notFound();
  }

  const canEdit = isOwner || isGM;
  const campaign = character.campaign as { id: string; name: string } | null;
  const player = character.player as { id: string; username: string; avatar_url: string | null } | null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg">{character.name}</h1>
          <p className="text-muted-fg mt-1">
            Player: {player?.username || "Unknown"}
            {campaign && (
              <>
                {" "}
                •{" "}
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {campaign.name}
                </Link>
              </>
            )}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <LinkButton href={`/characters/${character.id}/edit`} intent="outline">
              Edit Character
            </LinkButton>
            <PrintButton intent="primary">
              Print Sheet
            </PrintButton>
          </div>
        )}
      </div>

      {/* Character Sheet */}
      <CharacterDetailView character={character} canEdit={canEdit} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <div className="h-9 w-64 bg-bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-48 bg-bg-muted rounded animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className="h-96 bg-bg-muted rounded animate-pulse" />
    </div>
  );
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?redirectTo=/characters/${id}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl print:px-0 print:py-0">
      {/* Breadcrumb (hide in print) */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6 print:hidden">
        <Link href="/characters" className="hover:text-fg transition-colors">
          Characters
        </Link>
        <span>/</span>
        <span className="text-fg">Character Sheet</span>
      </nav>

      <Suspense fallback={<LoadingSkeleton />}>
        <CharacterContent characterId={id} />
      </Suspense>
    </div>
  );
}

