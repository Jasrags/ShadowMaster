import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/session";
import { getCharacterDetails } from "../../actions";
import { EditCharacterForm } from "./_components/EditCharacterForm";

export const metadata = {
  title: "Edit Character | ShadowMaster",
  description: "Edit your Shadowrun character",
};

interface EditCharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCharacterPage({
  params,
}: EditCharacterPageProps) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?redirectTo=/characters/${id}/edit`);
  }

  const result = await getCharacterDetails(id);

  if (!result.success) {
    if (result.error === "Character not found") {
      notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
          <p className="text-danger font-medium">Error loading character</p>
          <p className="text-sm text-muted-fg mt-2">{result.error}</p>
        </div>
      </div>
    );
  }

  const { character, isOwner, isGM } = result.data;

  if (!character) {
    notFound();
  }

  // Only owner or GM can edit
  if (!isOwner && !isGM) {
    redirect(`/characters/${id}`);
  }

  const campaign = character.campaign as { id: string; name: string } | null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
        <Link href="/characters" className="hover:text-fg transition-colors">
          Characters
        </Link>
        <span>/</span>
        <Link
          href={`/characters/${id}`}
          className="hover:text-fg transition-colors"
        >
          {character.name}
        </Link>
        <span>/</span>
        <span className="text-fg">Edit</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg">Edit Character</h1>
        <p className="text-muted-fg mt-1">
          Update {character.name}&apos;s details and stats
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

      {/* Form */}
      <EditCharacterForm character={character} />
    </div>
  );
}

