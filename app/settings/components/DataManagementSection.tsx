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
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Data Management</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Export your personal data and characters.
                </p>
            </div>

            <div className="p-6">
                <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Download className="h-5 w-5 text-yellow-400 dark:text-yellow-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Export User Data</h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
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
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-black"
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
