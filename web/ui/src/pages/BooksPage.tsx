import { useEffect, useState, useCallback } from 'react';
import { bookApi } from '../lib/api';
import type { Book } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { BooksTable } from '../components/book/BooksTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function BooksPage() {
  const { showError } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await bookApi.getBooks();
      setBooks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load books';
      showError('Failed to load books', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return (
    <DatabasePageLayout
      title="Books Database"
      description="View and search all available sourcebooks from Shadowrun 5th Edition"
      itemCount={books.length}
      isLoading={isLoading}
    >
      <BooksTable books={books} />
    </DatabasePageLayout>
  );
}

