"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Edition, EditionCode } from "@/lib/types";
import EditionCard from "./EditionCard";
import EditionDetailView from "./EditionDetailView";

interface EditionBrowserProps {
  editions: Edition[];
}

export default function EditionBrowser({ editions }: EditionBrowserProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL param - only on first render
  const getInitialEdition = useCallback((): EditionCode | null => {
    const editionParam = searchParams.get("edition");
    if (editionParam && editions.some((e) => e.shortCode === editionParam)) {
      return editionParam as EditionCode;
    }
    return null;
  }, [searchParams, editions]);

  const [selectedEditionCode, setSelectedEditionCode] = useState<EditionCode | null>(
    getInitialEdition
  );

  const handleSelectEdition = (code: EditionCode) => {
    setSelectedEditionCode(code);
    // Update URL without navigation for deep linking support
    const url = new URL(window.location.href);
    url.searchParams.set("edition", code);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleCloseDetail = () => {
    setSelectedEditionCode(null);
    // Remove edition param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("edition");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="relative flex">
      <div
        className={`flex-1 transition-all duration-300 ${selectedEditionCode ? "pr-0 lg:pr-[400px] xl:pr-[500px]" : ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {editions.map((edition) => (
            <EditionCard
              key={edition.shortCode}
              edition={edition}
              onSelect={handleSelectEdition}
              isSelected={edition.shortCode === selectedEditionCode}
            />
          ))}
        </div>
      </div>

      {/* Side Panel for Detail View */}
      <div
        className={`fixed top-16 bottom-0 right-0 w-full sm:w-[400px] xl:w-[500px] transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${
          selectedEditionCode ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedEditionCode && (
          <EditionDetailView editionCode={selectedEditionCode} onClose={handleCloseDetail} />
        )}
      </div>

      {/* Overlay for mobile/tablet when sidebar is open */}
      {selectedEditionCode && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={handleCloseDetail}
        />
      )}
    </div>
  );
}
