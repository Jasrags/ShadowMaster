// Generic table utility functions for filtering, sorting, and pagination

export interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: string | undefined;
}

/**
 * Filters data based on search term and column filters
 * @param data Array of data to filter
 * @param searchTerm Global search term that searches across specified fields
 * @param filters Column-specific filters
 * @param searchFields Fields to search when using global search term
 * @returns Filtered array
 */
export function filterData<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  filters: FilterConfig,
  searchFields: (keyof T)[]
): T[] {
  let filtered = data;

  // Apply global search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }

  // Apply column-specific filters
  Object.entries(filters).forEach(([key, filterValue]) => {
    if (filterValue && filterValue.trim()) {
      const filterLower = filterValue.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(filterLower);
      });
    }
  });

  return filtered;
}

/**
 * Sorts data by a specified key and direction
 * @param data Array of data to sort
 * @param sortKey Key to sort by
 * @param sortDirection Sort direction (asc or desc)
 * @returns Sorted array
 */
export function sortData<T extends Record<string, any>>(
  data: T[],
  sortKey: keyof T | null,
  sortDirection: 'asc' | 'desc'
): T[] {
  if (!sortKey) {
    return data;
  }

  const sorted = [...data];
  sorted.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Compare values
    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      // Fallback to string comparison
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Paginates data based on page number and rows per page
 * @param data Array of data to paginate
 * @param page Current page (1-indexed)
 * @param rowsPerPage Number of rows per page
 * @returns Object containing paginated data and pagination info
 */
export function paginateData<T>(
  data: T[],
  page: number,
  rowsPerPage: number
): {
  data: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalRows: number;
} {
  const totalRows = data.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalPages,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    totalRows,
  };
}

