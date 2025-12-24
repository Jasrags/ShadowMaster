import { Edition, EditionCode } from "@/lib/types";
import { Book, Layers, ArrowRight } from "lucide-react";

interface EditionCardProps {
    edition: Edition;
    onSelect: (code: EditionCode) => void;
    isSelected?: boolean;
}

export default function EditionCard({ edition, onSelect, isSelected }: EditionCardProps) {
    return (
        <div
            onClick={() => onSelect(edition.shortCode)}
            className={`group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isSelected 
                    ? "border-primary shadow-lg ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/50"
            }`}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {edition.name}
                        </h3>
                        <span className="inline-block mt-1 text-sm font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                            Released {edition.releaseYear}
                        </span>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Layers className="w-6 h-6" />
                    </div>
                </div>

                <p className="text-muted-foreground mb-6 line-clamp-3">
                    {edition.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Book className="w-4 h-4" />
                        <span>{edition.bookIds.length} Books</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-3 bg-secondary/30 border-t border-border flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                <span className="text-sm font-medium text-foreground">View Details</span>
                <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}
