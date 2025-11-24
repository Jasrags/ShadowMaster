interface ViewModeToggleProps {
  viewMode: 'flat' | 'grouped';
  onViewModeChange: (mode: 'flat' | 'grouped') => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewModeChange('flat')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'flat'
            ? 'bg-sr-accent text-sr-dark'
            : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
        }`}
      >
        Flat View
      </button>
      <button
        onClick={() => onViewModeChange('grouped')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'grouped'
            ? 'bg-sr-accent text-sr-dark'
            : 'bg-sr-gray border border-sr-light-gray text-gray-300 hover:bg-sr-light-gray'
        }`}
      >
        Grouped View
      </button>
    </div>
  );
}

