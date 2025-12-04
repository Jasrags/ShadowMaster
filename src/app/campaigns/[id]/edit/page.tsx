import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/session";
import { getCampaignDetails } from "../../actions";
import { EditCampaignForm } from "./_components/EditCampaignForm";
import { PlayerManagement } from "./_components/PlayerManagement";

export const metadata = {
  title: "Edit Campaign | ShadowMaster",
  description: "Edit your Shadowrun campaign settings",
};

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({
  params,
}: EditCampaignPageProps) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    redirect(`/login?redirectTo=/campaigns/${id}/edit`);
  }

  const result = await getCampaignDetails(id);

  if (!result.success) {
    if (result.error === "Campaign not found") {
      notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="rounded-lg border border-danger/50 bg-danger/10 p-6 text-center">
          <p className="text-danger font-medium">Error loading campaign</p>
          <p className="text-sm text-muted-fg mt-2">{result.error}</p>
        </div>
      </div>
    );
  }

  const { campaign, isGM } = result.data;

  if (!campaign) {
    notFound();
  }

  // Only GM can edit
  if (!isGM) {
    redirect(`/campaigns/${id}`);
  }

  const players = campaign.campaign_players || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
        <Link href="/campaigns" className="hover:text-fg transition-colors">
          Campaigns
        </Link>
        <span>/</span>
        <Link
          href={`/campaigns/${id}`}
          className="hover:text-fg transition-colors"
        >
          {campaign.name}
        </Link>
        <span>/</span>
        <span className="text-fg">Edit</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg">Edit Campaign</h1>
        <p className="text-muted-fg mt-1">
          Update your campaign settings and manage players
        </p>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg border border-border bg-bg p-6 mb-8">
        <h2 className="text-xl font-semibold text-fg mb-4">Campaign Details</h2>
        <EditCampaignForm campaign={campaign} />
      </div>

      {/* Player Management */}
      <div className="rounded-lg border border-border bg-bg p-6">
        <h2 className="text-xl font-semibold text-fg mb-4">Player Management</h2>
        <PlayerManagement campaignId={campaign.id} players={players} />
      </div>
    </div>
  );
}

