import { ReactNode, useMemo, useState } from 'react';
import { TextInput } from './common/TextInput';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  accessor?: (row: T) => string | number | boolean | Date | null | undefined;
  render?: (row: T) => ReactNode;
  searchable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  loading?: boolean;
  emptyState?: ReactNode;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  initialSortKey?: string;
  initialSortDirection?: SortDirection;
  rowClassName?: (row: T) => string | undefined;
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  const factor = direction === 'asc' ? 1 : -1;

  const normalize = (value: unknown): number | string => {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).toLowerCase();
  };

  const normalizedA = normalize(a);
  const normalizedB = normalize(b);

  if (normalizedA < normalizedB) return -1 * factor;
  if (normalizedA > normalizedB) return 1 * factor;
  return 0;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  loading = false,
  emptyState,
  enableSearch = true,
  searchPlaceholder = 'Search…',
  initialSortKey,
  initialSortDirection = 'asc',
  rowClassName,
}: DataTableProps<T>) {
  const sortableColumns = useMemo(
    () => columns.filter((column) => column.sortable),
    [columns],
  );

  const defaultSortKey = initialSortKey ?? sortableColumns[0]?.key ?? columns[0]?.key ?? '';

  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [searchQuery, setSearchQuery] = useState('');

  const processedData = useMemo(() => {
    const searchableColumns = columns.filter((column) => column.searchable !== false);

    const filtered = data.filter((row) => {
      if (!enableSearch || !searchQuery.trim()) {
        return true;
      }

      return searchableColumns.some((column) => {
        const accessor = column.accessor;
        const value = accessor ? accessor(row) : (row[column.key] as unknown);
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });

    if (!sortKey) {
      return filtered;
    }

    const sortColumn = columns.find((column) => column.key === sortKey);
    if (!sortColumn) {
      return filtered;
    }

    const accessor = sortColumn.accessor;
    return [...filtered].sort((a, b) => {
      const valueA = accessor ? accessor(a) : (a[sortKey] as unknown);
      const valueB = accessor ? accessor(b) : (b[sortKey] as unknown);
      return compareValues(valueA, valueB, sortDirection);
    });
  }, [columns, data, enableSearch, searchQuery, sortDirection, sortKey]);

  function toggleSort(columnKey: string) {
    if (sortKey === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  }

  return (
    <div className="data-table-wrapper">
      {enableSearch && columns.length > 0 && (
        <div className="data-table-toolbar">
          <TextInput
            variant="search"
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search table"
          />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => {
                const isSortable = column.sortable !== false;
                const isActive = column.key === sortKey;
                return (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className={[
                      column.align ? `align-${column.align}` : '',
                      isSortable ? 'sortable' : '',
                      isActive ? `sorted-${sortDirection}` : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (isSortable) {
                        toggleSort(column.key);
                      }
                    }}
                  >
                    <span>{column.header}</span>
                    {isSortable && (
                      <span className="sort-indicator" aria-hidden="true">
                        {isActive ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="data-table-empty">
                <td colSpan={columns.length}>Loading…</td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr className="data-table-empty">
                <td colSpan={columns.length}>{emptyState || 'No records found.'}</td>
              </tr>
            ) : (
              processedData.map((row, index) => (
                <tr key={getRowId(row, index)} className={rowClassName?.(row)}>
                  {columns.map((column) => (
                    <td key={column.key} className={column.align ? `align-${column.align}` : undefined}>
                      {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

