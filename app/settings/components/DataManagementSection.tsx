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
    <div className="settings-card">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Data Management</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Export your personal data and characters.
        </p>
      </div>

      <div className="p-6 space-y-8">
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4">
          <div className="flex">
            <div className="shrink-0">
              <Download className="h-5 w-5 text-amber-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Data Management
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-500/80">
                <p>
                  Export your profile and all character data to a JSON file, or import data from a
                  previous export.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Export Data</h4>
            <p className="text-xs text-zinc-500">
              Download a complete copy of your data as a JSON file.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full settings-btn-primary"
            >
              {exporting ? (
                "Exporting..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Import Data</h4>
            <p className="text-xs text-zinc-500">
              Restore your profile and characters from a JSON export.
            </p>
            <input
              type="file"
              id="import-file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                  const content = event.target?.result as string;
                  try {
                    const response = await fetch("/api/account/import", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: content,
                    });
                    const data = await response.json();
                    if (response.ok) {
                      alert(data.message || "Import successful!");
                      window.location.reload();
                    } else {
                      alert(data.error || "Import failed.");
                    }
                  } catch (err) {
                    console.error("Import error:", err);
                    alert("Error importing file.");
                  }
                };
                reader.readAsText(file);
              }}
            />
            <button
              onClick={() => document.getElementById("import-file")?.click()}
              className="w-full settings-btn-secondary"
            >
              <Download className="mr-2 h-4 w-4 rotate-180" />
              Import JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
