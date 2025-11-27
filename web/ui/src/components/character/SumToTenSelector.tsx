import { Select, Button, Popover, ListBox, ListBoxItem, SelectValue } from 'react-aria-components';
import type { SumToTenSelection, CharacterCreationData } from '../../lib/types';

interface SumToTenSelectorProps {
  selection: SumToTenSelection;
  onChange: (selection: SumToTenSelection) => void;
  creationData: CharacterCreationData;
  gameplayLevel?: string;
  onGameplayLevelChange?: (level: string) => void;
}

const PRIORITY_COSTS: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, E: 0 };

export function SumToTenSelector({ selection, onChange, creationData, gameplayLevel, onGameplayLevelChange }: SumToTenSelectorProps) {
  const priorityOptions = ['A', 'B', 'C', 'D', 'E'];
  
  const handlePriorityChange = (category: keyof SumToTenSelection, value: string) => {
    onChange({ ...selection, [category]: value });
  };

  const calculateTotal = () => {
    const costs = [
      PRIORITY_COSTS[selection.metatype_priority] || 0,
      PRIORITY_COSTS[selection.attributes_priority] || 0,
      PRIORITY_COSTS[selection.magic_priority === 'none' ? 'E' : selection.magic_priority] || 0,
      PRIORITY_COSTS[selection.skills_priority] || 0,
      PRIORITY_COSTS[selection.resources_priority] || 0,
    ];
    return costs.reduce((sum, cost) => sum + cost, 0);
  };

  const total = calculateTotal();
  const isValid = total === 10;

  const getPriorityLabel = (category: string, priority: string) => {
    const option = creationData.priorities[category]?.[priority];
    return option ? `${priority}: ${option.label}` : priority;
  };

  return (
    <div className="space-y-4">
      {gameplayLevel !== undefined && onGameplayLevelChange && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Gameplay Level</label>
          <Select
            selectedKey={gameplayLevel}
            onSelectionChange={(key) => onGameplayLevelChange(key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue />
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {Object.entries(creationData.gameplay_levels || {}).map(([key, level]) => (
                  <ListBoxItem
                    key={key}
                    id={key}
                    textValue={level.label}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {level.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>
      )}

      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Total Priority Cost</span>
          <span className={`text-lg font-bold ${isValid ? 'text-green-400' : 'text-sr-danger'}`}>
            {total} / 10
          </span>
        </div>
        {!isValid && (
          <p className="text-xs text-sr-danger mt-1">
            Priority costs must total exactly 10. Current: {total}
          </p>
        )}
        <div className="mt-2 text-xs text-gray-400">
          <p>Costs: A=4, B=3, C=2, D=1, E=0</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Metatype Priority</label>
          <Select
            selectedKey={selection.metatype_priority}
            onSelectionChange={(key) => handlePriorityChange('metatype_priority', key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue>
                {({ selectedText }) => selectedText || 'Select...'}
              </SelectValue>
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {priorityOptions.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={`${opt} (${PRIORITY_COSTS[opt]} points)`}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {getPriorityLabel('metatype', opt)} ({PRIORITY_COSTS[opt]} points)
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Attributes Priority</label>
          <Select
            selectedKey={selection.attributes_priority}
            onSelectionChange={(key) => handlePriorityChange('attributes_priority', key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue>
                {({ selectedText }) => selectedText || 'Select...'}
              </SelectValue>
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {priorityOptions.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={`${opt} (${PRIORITY_COSTS[opt]} points)`}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {getPriorityLabel('attributes', opt)} ({PRIORITY_COSTS[opt]} points)
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Magic Priority</label>
          <Select
            selectedKey={selection.magic_priority || 'none'}
            onSelectionChange={(key) => handlePriorityChange('magic_priority', key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue>
                {({ selectedText }) => selectedText || 'Select...'}
              </SelectValue>
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                <ListBoxItem
                  id="none"
                  textValue="None (Mundane) - 0 points"
                  className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                >
                  None (Mundane) - 0 points
                </ListBoxItem>
                {priorityOptions.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={`${opt} (${PRIORITY_COSTS[opt]} points)`}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {getPriorityLabel('magic', opt)} ({PRIORITY_COSTS[opt]} points)
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Skills Priority</label>
          <Select
            selectedKey={selection.skills_priority}
            onSelectionChange={(key) => handlePriorityChange('skills_priority', key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue>
                {({ selectedText }) => selectedText || 'Select...'}
              </SelectValue>
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {priorityOptions.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={`${opt} (${PRIORITY_COSTS[opt]} points)`}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {getPriorityLabel('skills', opt)} ({PRIORITY_COSTS[opt]} points)
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Resources Priority</label>
          <Select
            selectedKey={selection.resources_priority}
            onSelectionChange={(key) => handlePriorityChange('resources_priority', key as string)}
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-left">
              <SelectValue>
                {({ selectedText }) => selectedText || 'Select...'}
              </SelectValue>
            </Button>
            <Popover
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox className="p-1">
                {priorityOptions.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={`${opt} (${PRIORITY_COSTS[opt]} points)`}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {getPriorityLabel('resources', opt)} ({PRIORITY_COSTS[opt]} points)
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>
      </div>
    </div>
  );
}

