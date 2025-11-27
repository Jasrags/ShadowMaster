import { TextField, Input, FieldError } from 'react-aria-components';

interface AttributeAllocatorProps {
  attributes: Record<string, number>;
  onChange: (attributes: Record<string, number>) => void;
  minValues?: Record<string, number>;
  maxValues?: Record<string, number>;
  availablePoints: number;
  errors?: Record<string, string>;
}

const ATTRIBUTE_NAMES: Record<string, string> = {
  body: 'Body',
  agility: 'Agility',
  reaction: 'Reaction',
  strength: 'Strength',
  willpower: 'Willpower',
  logic: 'Logic',
  intuition: 'Intuition',
  charisma: 'Charisma',
};

export function AttributeAllocator({ attributes, onChange, minValues = {}, maxValues = {}, availablePoints, errors }: AttributeAllocatorProps) {
  const handleAttributeChange = (attr: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const min = minValues[attr] || 1;
    const max = maxValues[attr] || 6;
    
    if (numValue >= min && numValue <= max) {
      onChange({ ...attributes, [attr]: numValue });
    }
  };

  const usedPoints = Object.values(attributes).reduce((sum, val) => sum + Math.max(0, val - 1), 0);
  const remainingPoints = availablePoints - usedPoints;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Attribute Points</span>
          <span className={`text-lg font-bold ${remainingPoints >= 0 ? 'text-green-400' : 'text-sr-danger'}`}>
            {remainingPoints} remaining
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Available: {availablePoints} | Used: {usedPoints}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ATTRIBUTE_NAMES).map(([key, label]) => {
          const value = attributes[key] || 1;
          const min = minValues[key] || 1;
          const max = maxValues[key] || 6;
          const error = errors?.[key];

          return (
            <TextField
              key={key}
              value={String(value)}
              onChange={(val) => handleAttributeChange(key, val)}
              isInvalid={!!error}
              validationBehavior="aria"
              className="flex flex-col gap-1"
            >
              <label className="text-sm font-medium text-gray-300">{label}</label>
              <Input
                type="number"
                min={min}
                max={max}
                className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-sr-danger"
              />
              {error && (
                <FieldError className="text-sm text-sr-danger mt-1">{error}</FieldError>
              )}
              <p className="text-xs text-gray-500">
                Range: {min}-{max}
              </p>
            </TextField>
          );
        })}
      </div>

      {remainingPoints < 0 && (
        <div className="p-3 bg-sr-danger/20 border border-sr-danger rounded-md">
          <p className="text-sm text-sr-danger">
            You have allocated {Math.abs(remainingPoints)} more points than available. Please reduce attribute values.
          </p>
        </div>
      )}
    </div>
  );
}

