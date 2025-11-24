import { useState, useMemo, ReactNode, useEffect, useDeferredValue } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Button,
  TextField,
  Input,
  Select,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components';
import { filterData, sortData, paginateData } from '../../lib/tableUtils';

export interface ColumnDefinition<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  emptySearchMessage?: string;
  ariaLabel?: string;
  getRowKey?: (row: T, index: number) => string;
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_ROWS_PER_PAGE = 10;

export function DataTable<T>({
  data,
  columns,
  searchFields,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  defaultRowsPerPage = DEFAULT_ROWS_PER_PAGE,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  emptySearchMessage = 'No results found. Try adjusting your search.',
  ariaLabel = 'Data table',
  getRowKey,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  // Ensure defaultRowsPerPage is valid - use first option if default is not in options
  const validDefaultRowsPerPage = rowsPerPageOptions.includes(defaultRowsPerPage) 
    ? defaultRowsPerPage 
    : rowsPerPageOptions[0];
  const [rowsPerPage, setRowsPerPage] = useState(validDefaultRowsPerPage);

  // Debounce search term with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Determine search fields - use provided or all string columns
  const effectiveSearchFields = useMemo(() => {
    if (searchFields) return searchFields;
    return columns
      .filter((col) => typeof col.accessor === 'string')
      .map((col) => col.accessor as keyof T);
  }, [searchFields, columns]);

  // Generate stable row key - use provided function or create composite key
  const generateRowKey = useMemo(() => {
    if (getRowKey) {
      return getRowKey;
    }
    // Default: try to find id, name, or create composite key
    return (row: T, index: number): string => {
      // Try id field first (for Book, Lifestyle, etc.)
      if ('id' in row && typeof row.id === 'string') {
        return row.id;
      }
      // Try name + category for items without IDs
      const name = 'name' in row ? String(row.name || '') : '';
      const category = 'category' in row ? String(row.category || '') : '';
      if (name) {
        return category ? `${name}::${category}` : name;
      }
      // Fallback to index (should be rare)
      return `row-${index}`;
    };
  }, [getRowKey]);

  // Apply filtering, sorting, and pagination
  const processedData = useMemo(() => {
    // Filter (only global search, no column filters) - use debounced search term
    const filtered = filterData(data, debouncedSearchTerm, {}, effectiveSearchFields);

    // Sort
    const sorted = sortData(filtered, sortColumn, sortDirection);

    // Ensure rowsPerPage is valid
    const validRowsPerPage = rowsPerPageOptions.includes(rowsPerPage) 
      ? rowsPerPage 
      : validDefaultRowsPerPage;

    // Paginate
    const paginated = paginateData(sorted, currentPage, validRowsPerPage);

    return paginated;
  }, [data, debouncedSearchTerm, sortColumn, sortDirection, currentPage, rowsPerPage, rowsPerPageOptions, validDefaultRowsPerPage, effectiveSearchFields]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (key: string | number | null) => {
    if (key === null || key === undefined) return;
    const numValue = typeof key === 'string' ? parseInt(key, 10) : key;
    if (!isNaN(numValue) && numValue > 0) {
      setRowsPerPage(numValue);
      setCurrentPage(1);
    }
  };

  const getCellValue = (row: T, column: ColumnDefinition<T>): ReactNode => {
    let value: unknown;
    if (typeof column.accessor === 'function') {
      value = column.accessor(row);
    } else {
      value = row[column.accessor];
    }

    if (column.render) {
      return column.render(value, row);
    }

    if (value == null || value === '') {
      return '-';
    }

    return String(value);
  };

  return (
    <div className="space-y-4">
      {/* Global Search */}
      {effectiveSearchFields.length > 0 && (
        <TextField 
          value={searchTerm} 
          onChange={handleSearchChange}
          className="flex flex-col gap-1"
        >
          <Input
            aria-label={searchPlaceholder || "Search table data"}
            placeholder={searchPlaceholder}
            className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          />
        </TextField>
      )}

      {/* Table */}
      <div className="border border-sr-light-gray rounded-lg overflow-hidden">
        <Table
          aria-label={ariaLabel}
          className="w-full"
        >
          <TableHeader>
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                isRowHeader={column.id === columns[0]?.id}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-300 bg-sr-gray border-b border-sr-light-gray ${
                  column.sortable !== false ? 'cursor-pointer hover:bg-sr-light-gray' : ''
                } ${column.className || ''}`}
              >
                <div 
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (column.sortable !== false) {
                      handleSort(column.id as keyof T);
                    }
                  }}
                  role={column.sortable !== false ? 'button' : undefined}
                  tabIndex={column.sortable !== false ? 0 : undefined}
                  aria-label={
                    column.sortable !== false
                      ? `Sort by ${column.header}${sortColumn === column.id ? ` (${sortDirection === 'asc' ? 'ascending' : 'descending'})` : ''}`
                      : undefined
                  }
                  onKeyDown={(e) => {
                    if (column.sortable !== false && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column.id as keyof T);
                    }
                  }}
                >
                  {column.header}
                  {column.sortable !== false && sortColumn === column.id && (
                    <span className="text-sr-accent" aria-label={sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending'}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </Column>
            ))}
          </TableHeader>
          <TableBody>
            {processedData.data.map((row, rowIndex) => (
              <Row
                key={generateRowKey(row, processedData.startIndex - 1 + rowIndex)}
                className="border-b border-sr-light-gray hover:bg-sr-gray/50 transition-colors"
              >
                {columns.map((column) => (
                  <Cell
                    key={column.id}
                    className={`px-4 py-3 text-sm text-gray-100 ${column.className || ''}`}
                  >
                    {getCellValue(row, column)}
                  </Cell>
                ))}
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Showing {processedData.startIndex}-{processedData.endIndex} of {processedData.totalRows} items
          </span>
          <Select
            selectedKey={String(rowsPerPage)}
            onSelectionChange={handleRowsPerPageChange}
            aria-label="Rows per page"
            className="flex flex-col gap-1"
          >
            <Button className="px-3 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm">
              <SelectValue />
              <span className="ml-2">rows per page</span>
            </Button>
            <Popover 
              placement="bottom start"
              className="max-h-60 overflow-auto rounded-md border border-sr-light-gray bg-sr-gray shadow-lg"
            >
              <ListBox aria-label="Rows per page options" className="p-1">
                {rowsPerPageOptions.map((option) => (
                  <ListBoxItem
                    key={String(option)}
                    id={String(option)}
                    textValue={String(option)}
                    className="px-3 py-2 rounded hover:bg-sr-light-gray cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray"
                  >
                    {option}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onPress={() => setCurrentPage(1)}
            isDisabled={currentPage === 1}
            aria-label="Go to first page"
            className="px-3 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            First
          </Button>
          <Button
            onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            isDisabled={currentPage === 1}
            aria-label="Go to previous page"
            className="px-3 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400 px-2" aria-label={`Page ${currentPage} of ${processedData.totalPages}`}>
            Page {currentPage} of {processedData.totalPages}
          </span>
          <Button
            onPress={() => setCurrentPage((prev) => Math.min(processedData.totalPages, prev + 1))}
            isDisabled={currentPage >= processedData.totalPages}
            aria-label="Go to next page"
            className="px-3 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </Button>
          <Button
            onPress={() => setCurrentPage(processedData.totalPages)}
            isDisabled={currentPage >= processedData.totalPages}
            aria-label="Go to last page"
            className="px-3 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Last
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {processedData.data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            {searchTerm ? emptySearchMessage : emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
}

