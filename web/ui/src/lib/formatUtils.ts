/**
 * Formats a cost value by appending the ¥ symbol
 * If the cost already contains ¥, it returns it as-is
 * If the cost is empty or undefined, returns '-'
 * @param cost The cost value (may or may not contain ¥)
 * @returns Formatted cost string with ¥ symbol
 */
export function formatCost(cost: string | undefined | null): string {
  if (!cost) {
    return '-';
  }
  
  // If cost already contains ¥, return as-is
  if (cost.includes('¥')) {
    return cost;
  }
  
  // Otherwise, append ¥
  return `${cost}¥`;
}

