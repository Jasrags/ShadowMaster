interface KarmaBuildPanelProps {
  startingKarma: number;
  usedKarma: number;
  onKarmaChange: (used: number) => void;
}

export function KarmaBuildPanel({ startingKarma, usedKarma, onKarmaChange }: KarmaBuildPanelProps) {
  const remainingKarma = startingKarma - usedKarma;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Karma Budget</span>
          <span className={`text-lg font-bold ${remainingKarma >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
            {remainingKarma} / {startingKarma} remaining
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Starting karma: {startingKarma} | Used: {usedKarma}
        </p>
      </div>

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <p className="text-sm text-gray-400">
          Karma point-buy interface will be implemented here with metatype costs, attribute costs, skill costs, and karma→nuyen conversion.
        </p>
      </div>
    </div>
  );
}

