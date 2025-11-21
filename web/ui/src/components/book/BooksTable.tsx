import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Book } from '../../lib/types';
import { BookViewModal } from './BookViewModal';

interface BooksTableProps {
  books: Book[];
}

export function BooksTable({ books }: BooksTableProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Book>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Book) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      accessor: 'code',
      sortable: true,
    },
  ];

  return (
    <>
      <DataTable
        data={books}
        columns={columns}
        searchFields={['name', 'code']}
        searchPlaceholder="Search books by name or code..."
        rowsPerPageOptions={[25, 50, 100]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No books available"
        emptySearchMessage="No books found matching your search criteria."
        ariaLabel="Books data table"
      />
      <BookViewModal
        book={selectedBook}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

