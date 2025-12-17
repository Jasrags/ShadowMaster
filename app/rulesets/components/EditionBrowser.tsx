"use client";

import { useState } from "react";
import { Edition, EditionCode } from "@/lib/types";
import EditionCard from "./EditionCard";
import EditionDetailView from "./EditionDetailView";

interface EditionBrowserProps {
    editions: Edition[];
}

export default function EditionBrowser({ editions }: EditionBrowserProps) {
    const [selectedEditionCode, setSelectedEditionCode] = useState<EditionCode | null>(null);

    const handleSelectEdition = (code: EditionCode) => {
        setSelectedEditionCode(code);
        // Optional: Update URL without navigation, or could be handled by a router push if we wanted deep linking for the drawer state
    };

    const handleCloseDetail = () => {
        setSelectedEditionCode(null);
    };

    return (
        <div className="relative flex">
            <div className={`flex-1 transition-all duration-300 ${selectedEditionCode ? "pr-0 lg:pr-[400px] xl:pr-[500px]" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {editions.map((edition) => (
                        <EditionCard
                            key={edition.shortCode}
                            edition={edition}
                            onSelect={handleSelectEdition}
                        />
                    ))}
                </div>
            </div>

            {/* Side Panel for Detail View */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[400px] xl:w-[500px] transform transition-transform duration-300 ease-in-out z-40 shadow-2xl ${selectedEditionCode ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {selectedEditionCode && (
                    <EditionDetailView
                        editionCode={selectedEditionCode}
                        onClose={handleCloseDetail}
                    />
                )}
            </div>

            {/* Overlay for mobile/tablet when sidebar is open */}
            {selectedEditionCode && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={handleCloseDetail}
                />
            )}
        </div>
    );
}
