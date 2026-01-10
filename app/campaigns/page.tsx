import CampaignList from "./components/CampaignList";

export const metadata = {
  title: "Campaigns | Shadow Master",
  description: "Manage your Shadowrun campaigns",
};

export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Campaigns
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Manage your Shadowrun campaigns as GM or player.
        </p>
      </div>

      <CampaignList />
    </div>
  );
}
