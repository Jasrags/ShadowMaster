import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/session";
import { getAvailableCampaignsForCharacter } from "../actions";
import { NewCharacterForm } from "./_components/NewCharacterForm";

export const metadata = {
  title: "Create Character | ShadowMaster",
  description: "Create a new Shadowrun character",
};

interface NewCharacterPageProps {
  searchParams: Promise<{ campaign?: string }>;
}

export default async function NewCharacterPage({
  searchParams,
}: NewCharacterPageProps) {
  const user = await getUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?redirectTo=/characters/new");
  }

  const result = await getAvailableCampaignsForCharacter();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
          <p className="text-danger font-medium">Error loading campaigns</p>
          <p className="text-sm text-muted-fg mt-2">{result.error}</p>
        </div>
      </div>
    );
  }

  const campaigns = result.data || [];

  if (campaigns.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
          <Link href="/characters" className="hover:text-fg transition-colors">
            Characters
          </Link>
          <span>/</span>
          <span className="text-fg">New Character</span>
        </nav>

        <div className="rounded-lg border border-warning/50 bg-warning/10 p-6 text-center">
          <h2 className="text-lg font-medium text-fg mb-2">
            No campaigns available
          </h2>
          <p className="text-muted-fg mb-4">
            You need to join a campaign before creating a character.
          </p>
          <Link href="/campaigns">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-fg hover:opacity-90 transition-opacity">
              Browse Campaigns
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const preselectedCampaign = params.campaign;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
        <Link href="/characters" className="hover:text-fg transition-colors">
          Characters
        </Link>
        <span>/</span>
        <span className="text-fg">New Character</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg">Create New Character</h1>
        <p className="text-muted-fg mt-1">
          Build your Shadowrun character from the ground up
        </p>
      </div>

      {/* Form */}
      <NewCharacterForm
        campaigns={campaigns}
        preselectedCampaignId={preselectedCampaign}
      />
    </div>
  );
}

