import { getAllEditions } from "@/lib/storage/editions";
import EditionBrowser from "./components/EditionBrowser";

export const metadata = {
  title: "Rulesets | Shadow Master",
  description: "Browse and explore Shadowrun rulesets and editions.",
};

export default async function RulesetsPage() {
  const editions = await getAllEditions();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Rulesets</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse available Shadowrun editions, books, and rules.
        </p>
      </div>

      <EditionBrowser editions={editions} />
    </div>
  );
}
