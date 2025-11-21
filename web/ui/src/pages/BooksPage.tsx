import { useEffect, useState, useCallback } from 'react';
import { bookApi } from '../lib/api';
import type { Book } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { BooksTable } from '../components/book/BooksTable';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading books...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Books Database</h2>
          <p className="text-gray-400">
            View and search all available sourcebooks from Shadowrun 5th Edition ({books.length} books)
          </p>
        </div>
      </div>
      <BooksTable books={books} />
    </div>
  );
}

