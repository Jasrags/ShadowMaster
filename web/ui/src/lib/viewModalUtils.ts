import { ReactNode } from 'react';

/**
 * Format a value for display in modals
 * @param value - The value to format
 * @returns Formatted string representation
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

/**
 * Format an array value for display
 * @param value - The value to format (array or single value)
 * @returns Formatted string representation
 */
export function formatArray(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return formatValue(value);
}

/**
 * Safely convert an unknown value to a ReactNode
 * @param value - The value to convert
 * @returns ReactNode or null
 */
export function toReactNode(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  return String(value);
}
