import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { NewCampaignForm } from "./_components/NewCampaignForm";
import Link from "next/link";

export const metadata = {
  title: "Create Campaign | ShadowMaster",
  description: "Create a new Shadowrun campaign",
};

export default async function NewCampaignPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirectTo=/campaigns/new");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-fg mb-6">
        <Link href="/campaigns" className="hover:text-fg transition-colors">
          Campaigns
        </Link>
        <span>/</span>
        <span className="text-fg">New Campaign</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg">Create New Campaign</h1>
        <p className="text-muted-fg mt-1">
          Set up a new Shadowrun campaign for your players
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-border bg-bg p-6">
        <NewCampaignForm />
      </div>
    </div>
  );
}

