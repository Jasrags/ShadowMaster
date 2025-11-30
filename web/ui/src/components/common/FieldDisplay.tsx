import { ReactNode } from 'react';
import { formatValue, formatArray } from '../../lib/viewModalUtils';

/**
 * LabelValue component for displaying a label-value pair
 */
interface LabelValueProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function LabelValue({ label, value, className = '' }: LabelValueProps) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-400">{label}</label>
      <p className="text-gray-100 mt-1">{value}</p>
    </div>
  );
}

/**
 * FieldGrid component for displaying multiple fields in a grid layout
 */
interface FieldGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FieldGrid({ children, columns = 2, className = '' }: FieldGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section component for grouping related fields with a title
 */
interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">{title}</h2>
      {children}
    </section>
  );
}

/**
 * ArrayDisplay component for displaying arrays as chips/tags
 */
interface ArrayDisplayProps {
  items: (string | number)[];
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
}

export function ArrayDisplay({ 
  items, 
  className = '', 
  itemClassName = 'px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200',
  emptyMessage = 'No items'
}: ArrayDisplayProps) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, idx) => (
        <span key={idx} className={itemClassName}>
          {String(item)}
        </span>
      ))}
    </div>
  );
}

/**
 * NestedObjectDisplay component for displaying nested objects
 */
interface NestedObjectDisplayProps {
  data: Record<string, unknown>;
  className?: string;
  emptyMessage?: string;
}

export function NestedObjectDisplay({ 
  data, 
  className = '',
  emptyMessage = 'No data'
}: NestedObjectDisplayProps) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-gray-400 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className={`p-4 bg-sr-darker rounded-md ${className}`}>
      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

/**
 * ConditionalField component for conditionally displaying a field
 */
interface ConditionalFieldProps {
  condition: boolean;
  label: string;
  value: ReactNode | (() => ReactNode);
  formatter?: (value: unknown) => string;
}

export function ConditionalField({ condition, label, value, formatter }: ConditionalFieldProps) {
  if (!condition) return null;

  const displayValue = typeof value === 'function' ? value() : value;
  const formattedValue = formatter ? formatter(displayValue) : displayValue;

  return <LabelValue label={label} value={formattedValue} />;
}

/**
 * FormattedValue component for displaying formatted values
 */
interface FormattedValueProps {
  value: unknown;
  formatter?: (value: unknown) => string;
  emptyValue?: string;
}

export function FormattedValue({ 
  value, 
  formatter = formatValue,
  emptyValue = '-'
}: FormattedValueProps) {
  if (value === null || value === undefined || value === '') {
    return <>{emptyValue}</>;
  }
  return <>{formatter(value)}</>;
}

/**
 * FormattedArray component for displaying formatted arrays
 */
interface FormattedArrayProps {
  value: unknown;
  emptyValue?: string;
}

export function FormattedArray({ value, emptyValue = '-' }: FormattedArrayProps) {
  if (value === null || value === undefined) {
    return <>{emptyValue}</>;
  }
  return <>{formatArray(value)}</>;
}
