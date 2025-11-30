import { TextField, Input, FieldError } from 'react-aria-components';

interface SpecialAttributeAllocatorProps {
  edge: number;
  magic: number;
  resonance: number;
  onChange: (allocations: { edge: number; magic: number; resonance: number }) => void;
  availablePoints: number;
  magicType?: string; // 'magician', 'adept', 'aspected_magician', 'mystic_adept', 'technomancer', or undefined
  magicPriority?: string; // 'A', 'B', 'C', 'D', 'E', or 'none' - used to determine if mundane
  selectedMetatype?: string; // For determining Edge starting value (Human = 2, others = 1)
  errors?: Record<string, string>;
}

export function SpecialAttributeAllocator({
  edge,
  magic,
  resonance,
  onChange,
  availablePoints,
  magicType,
  magicPriority,
  selectedMetatype,
  errors,
}: SpecialAttributeAllocatorProps) {
  // Determine starting values
  const edgeStart = selectedMetatype === 'human' ? 2 : 1;
  const magicStart = 0;
  const resonanceStart = 0;

  // Calculate used points (points spent above starting values)
  const calculateUsedPoints = (): number => {
    const edgeSpent = Math.max(0, edge - edgeStart);
    const magicSpent = Math.max(0, magic - magicStart);
    const resonanceSpent = Math.max(0, resonance - resonanceStart);
    return edgeSpent + magicSpent + resonanceSpent;
  };

  const handleChange = (attr: 'edge' | 'magic' | 'resonance', value: string) => {
    const numValue = parseInt(value, 10) || 0;
    
    // Check if mundane - if so, magic and resonance must stay at 0
    const isMundane = magicPriority === 'E' || magicPriority === 'none' || !magicPriority;
    if (isMundane && (attr === 'magic' || attr === 'resonance')) {
      // Don't allow changes to magic/resonance for mundane characters
      return;
    }
    
    // Determine min/max for each attribute
    let min = 0;
    let max = 6;
    
    if (attr === 'edge') {
      min = edgeStart;
      max = selectedMetatype === 'human' ? 7 : 6; // Humans can have Edge 7
    } else if (attr === 'magic') {
      min = magicStart;
      max = 6;
    } else if (attr === 'resonance') {
      min = resonanceStart;
      max = 6;
    }
    
    // Check bounds
    if (numValue < min || numValue > max) {
      return;
    }
    
    // Calculate what the used points would be if we apply this change
    const updated = { edge, magic, resonance, [attr]: numValue };
    const edgeSpent = Math.max(0, updated.edge - edgeStart);
    const magicSpent = Math.max(0, updated.magic - magicStart);
    const resonanceSpent = Math.max(0, updated.resonance - resonanceStart);
    const usedPointsAfterChange = edgeSpent + magicSpent + resonanceSpent;
    
    // Only allow the change if it doesn't exceed available points
    if (usedPointsAfterChange <= availablePoints) {
      onChange(updated);
    }
  };

  const usedPoints = calculateUsedPoints();
  const remainingPoints = availablePoints - usedPoints;

  // Determine which attributes to show
  const showEdge = true; // Always show Edge
  // Magic should only be shown if:
  // 1. A magic type is selected (magical character)
  // 2. Magic priority is not mundane (not E or "none")
  const isMundane = magicPriority === 'E' || magicPriority === 'none' || !magicPriority;
  const showMagic = !isMundane && magicType && ['magician', 'adept', 'aspected_magician', 'mystic_adept'].includes(magicType);
  const showResonance = !isMundane && magicType === 'technomancer';

  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            {remainingPoints >= 0 ? `${remainingPoints} points remaining` : `${Math.abs(remainingPoints)} points over allocated`}
          </span>
          <span className={`text-sm text-gray-400 ${remainingPoints >= 0 ? '' : 'text-sr-danger'}`}>
            {usedPoints} / {availablePoints} used
          </span>
        </div>
        {availablePoints > 0 && !magicType && (
          <p className="text-xs text-gray-400 mt-2">
            Note: Select your Magic/Resonance type in the next step to allocate points to Magic or Resonance.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Edge - Always available */}
        {showEdge && (
          <TextField
            value={String(edge)}
            onChange={(val) => handleChange('edge', val)}
            isInvalid={!!errors?.edge}
            validationBehavior="aria"
            className="flex flex-col gap-1"
          >
            <label className="text-sm font-medium text-gray-300">Edge</label>
            <Input
              type="number"
              min={edgeStart}
              max={selectedMetatype === 'human' ? 7 : 6}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
            />
            {errors?.edge && (
              <FieldError className="text-sm text-sr-danger mt-1">{errors.edge}</FieldError>
            )}
            <p className="text-xs text-gray-500">
              Range: {edgeStart}-{selectedMetatype === 'human' ? 7 : 6} (starts at {edgeStart})
            </p>
          </TextField>
        )}

        {/* Magic - Only for magical types */}
        {showMagic && (
          <TextField
            value={String(magic)}
            onChange={(val) => handleChange('magic', val)}
            isInvalid={!!errors?.magic}
            validationBehavior="aria"
            className="flex flex-col gap-1"
          >
            <label className="text-sm font-medium text-gray-300">Magic</label>
            <Input
              type="number"
              min={magicStart}
              max={6}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
            />
            {errors?.magic && (
              <FieldError className="text-sm text-sr-danger mt-1">{errors.magic}</FieldError>
            )}
            <p className="text-xs text-gray-500">
              Range: {magicStart}-6 (starts at {magicStart})
            </p>
          </TextField>
        )}

        {/* Resonance - Only for Technomancers */}
        {showResonance && (
          <TextField
            value={String(resonance)}
            onChange={(val) => handleChange('resonance', val)}
            isInvalid={!!errors?.resonance}
            validationBehavior="aria"
            className="flex flex-col gap-1"
          >
            <label className="text-sm font-medium text-gray-300">Resonance</label>
            <Input
              type="number"
              min={resonanceStart}
              max={6}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
            />
            {errors?.resonance && (
              <FieldError className="text-sm text-sr-danger mt-1">{errors.resonance}</FieldError>
            )}
            <p className="text-xs text-gray-500">
              Range: {resonanceStart}-6 (starts at {resonanceStart})
            </p>
          </TextField>
        )}
      </div>

      {remainingPoints < 0 && (
        <div className="p-3 bg-sr-danger/20 border border-sr-danger rounded-md">
          <p className="text-sm text-sr-danger">
            You have allocated {Math.abs(remainingPoints)} more points than available. Please reduce attribute values.
          </p>
        </div>
      )}

      {availablePoints > 0 && remainingPoints > 0 && (
        <div className="p-3 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <p className="text-sm text-gray-400">
            You have {remainingPoints} unspent special attribute point{remainingPoints !== 1 ? 's' : ''}. 
            Unspent points are lost at the end of character creation.
          </p>
        </div>
      )}
    </div>
  );
}

