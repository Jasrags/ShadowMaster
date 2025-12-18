import { useState } from "react";
import { Download } from "lucide-react";

interface DataManagementSectionProps {
    onExport: () => Promise<void>;
}

export function DataManagementSection({ onExport }: DataManagementSectionProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            await onExport();
        } catch {
            console.error("Export failed");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="rounded-lg border border-border bg-card shadow-sm transition-colors">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-medium text-foreground">Data Management</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Export your personal data and characters.
                </p>
            </div>

            <div className="p-6">
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Download className="h-5 w-5 text-amber-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">Export User Data</h3>
                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-500/80">
                                <p>
                                    Download a copy of all your data, including your profile information and all character data.
                                    This will initiate a download of a JSON file.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-background"
                    >
                        {exporting ? "Exporting..." : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
