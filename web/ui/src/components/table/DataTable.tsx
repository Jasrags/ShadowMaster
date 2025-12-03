import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  TextField,
  Input,
  Label,
  Button,
  Select,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDefinition<T> {
  key: string;
  label: string;
  isRowHeader?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortValue?: (item: T) => string | number | null;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  ariaLabel: string;
  columns: ColumnDefinition<T>[];
  data: T[];
  getRowId: (item: T) => string | number;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  error?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  searchPlaceholder?: string;
  searchLabel?: string;
  enableSearch?: boolean;
  searchKeys?: (keyof T)[];
  enablePagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];
const DEFAULT_PAGE_SIZE = 50;

export function DataTable<T>({
  ariaLabel,
  columns,
  data,
  getRowId,
  isLoading = false,
  loadingMessage = 'Loading...',
  emptyMessage = 'No data found.',
  error,
  onRowClick,
  className = '',
  searchPlaceholder = 'Search...',
  searchLabel = 'Search',
  enableSearch = true,
  searchKeys,
  enablePagination = true,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Determine which keys to search - use provided keys or all string/number keys
  const keysToSearch = useMemo(() => {
    if (searchKeys) return searchKeys;
    if (data.length === 0) return [];
    
    // Auto-detect searchable keys (string or number fields)
    return Object.keys(data[0] as object).filter((key) => {
      const value = (data[0] as any)[key];
      return typeof value === 'string' || typeof value === 'number';
    }) as (keyof T)[];
  }, [data, searchKeys]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || keysToSearch.length === 0) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return keysToSearch.some((key) => {
        const value = item[key];
        if (value == null) return false;
        
        // Handle arrays (e.g., roles)
        if (Array.isArray(value)) {
          return value.some((item) =>
            String(item).toLowerCase().includes(query)
          );
        }
        
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, keysToSearch]);

  // Sort data based on selected column and direction
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return filteredData;
    }

    const column = columns.find((col) => col.key === sortColumn);
    if (!column || !column.sortable) {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      if (column.sortValue) {
        aValue = column.sortValue(a);
        bValue = column.sortValue(b);
      } else {
        aValue = (a as any)[sortColumn];
        bValue = (b as any)[sortColumn];
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to strings for comparison if not numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Calculate pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = enablePagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortColumn, sortDirection]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey || !sortDirection) {
      return (
        <svg
          className="w-4 h-4 text-sr-text-dim opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    if (sortDirection === 'asc') {
      return (
        <svg
          className="w-4 h-4 text-sr-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-sr-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (error) {
    return (
      <div className="p-3 bg-sr-danger/20 border border-sr-danger rounded-md text-sr-danger text-sm">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sr-text-dim font-body">{loadingMessage}</div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {enableSearch && (
          <div className="flex-1 max-w-md">
            <TextField
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300 sr-only">
                {searchLabel}
              </Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                         data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                         data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent"
                placeholder={searchPlaceholder}
              />
            </TextField>
          </div>
        )}

        {enablePagination && (
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-300">
              Items per page:
            </Label>
            <Select
              selectedKey={pageSize.toString()}
              onSelectionChange={(key) => handlePageSizeChange(key as string)}
              className="flex flex-col"
            >
              <Button className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                               data-[hovered]:bg-sr-light-gray
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                               transition-colors text-sm min-w-[80px]">
                <SelectValue />
                <span aria-hidden="true" className="ml-2">▼</span>
              </Button>
              <Popover className="min-w-[150px]">
                <ListBox className="bg-sr-gray border border-sr-light-gray rounded-md shadow-lg p-1 outline-none">
                  {pageSizeOptions.map((size) => (
                    <ListBoxItem
                      key={size.toString()}
                      id={size.toString()}
                      className="px-3 py-2 rounded-md text-sr-text cursor-pointer 
                               data-[hovered]:bg-sr-light-gray 
                               data-[focus-visible]:bg-sr-light-gray data-[focus-visible]:outline-none
                               data-[selected]:bg-sr-accent/20 data-[selected]:text-sr-accent"
                    >
                      {size}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          </div>
        )}
      </div>

      {sortedData.length === 0 ? (
        <div className="text-sr-text-dim font-body">
          {searchQuery.trim() ? 'No results found.' : emptyMessage}
        </div>
      ) : (
        <>
          <Table aria-label={ariaLabel} className="w-full border-collapse">
            <TableHeader>
              {columns.map((column) => {
                const isSortable = column.sortable !== false && column.key !== 'actions';
                
                return (
                  <Column
                    key={column.key}
                    isRowHeader={column.isRowHeader}
                    className={`p-3 border-b border-sr-light-gray text-sr-text font-medium ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {isSortable ? (
                      <Button
                        onPress={() => handleSort(column.key)}
                        className="flex items-center gap-2 hover:text-sr-accent transition-colors focus:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-sr-accent rounded px-1 -mx-1"
                      >
                        <span>{column.label}</span>
                        {getSortIcon(column.key)}
                      </Button>
                    ) : (
                      <span>{column.label}</span>
                    )}
                  </Column>
                );
              })}
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <Row
                  key={getRowId(item)}
                  className="data-[hovered]:bg-sr-darker/50 data-[selected]:bg-sr-accent/10"
                  onPress={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((column) => (
                    <Cell
                      key={column.key}
                      className={`p-3 border-b border-sr-light-gray text-sr-text ${
                        column.align === 'right'
                          ? 'text-right'
                          : column.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </Cell>
                  ))}
                </Row>
              ))}
            </TableBody>
          </Table>

          {enablePagination && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-sr-light-gray">
              <div className="text-sm text-sr-text-dim">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  isDisabled={currentPage === 1}
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                           data-[hovered]:bg-sr-light-gray
                           data-[pressed]:bg-sr-light-gray/80
                           data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                           data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                           data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                           transition-colors text-sm font-medium"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-2 text-sr-text-dim"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = page as number;
                    const isCurrentPage = pageNum === currentPage;

                    return (
                      <Button
                        key={pageNum}
                        onPress={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 min-w-[40px] rounded-md text-sm font-medium transition-colors
                                  ${isCurrentPage
                                    ? 'bg-sr-accent border border-sr-accent text-gray-100'
                                    : 'bg-sr-darker border border-sr-light-gray text-gray-100'
                                  }
                                  data-[hovered]:bg-sr-light-gray
                                  data-[pressed]:bg-sr-light-gray/80
                                  data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                                  data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  isDisabled={currentPage === totalPages}
                  className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100
                           data-[hovered]:bg-sr-light-gray
                           data-[pressed]:bg-sr-light-gray/80
                           data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                           data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent
                           data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                           transition-colors text-sm font-medium"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
