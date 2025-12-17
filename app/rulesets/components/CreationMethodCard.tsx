import { CreationMethod } from "@/lib/types";
import { UserPlus } from "lucide-react";

interface CreationMethodCardProps {
    method: CreationMethod;
    isDefault?: boolean;
    onSelect: (methodId: string) => void;
}

export default function CreationMethodCard({ method, isDefault, onSelect }: CreationMethodCardProps) {
    return (
        <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-muted text-muted-foreground">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{method.name}</h4>
                            {isDefault && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {method.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onSelect(method.id)}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors whitespace-nowrap"
                >
                    Select
                </button>
            </div>
        </div>
    );
}
