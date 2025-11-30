import type { Book } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface BookViewModalProps {
  book: Book | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BookViewModal({ book, isOpen, onOpenChange }: BookViewModalProps) {
  if (!book) return null;

  return (
    <ViewModal
      item={book}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={<span className="text-gray-400">Code: {book.code}</span>}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            <LabelValue label="ID" value={<span className="font-mono text-xs">{book.id}</span>} />
            <LabelValue label="Code" value={book.code} />
            {book.permanent && (
              <LabelValue label="Permanent" value="Yes" />
            )}
            {book.hide && (
              <LabelValue label="Hide" value={book.hide} />
            )}
          </FieldGrid>
        </Section>

        {book.matches?.match && book.matches.match.length > 0 && (
          <Section title={`Text Matches (${book.matches.match.length})`}>
            <div className="space-y-2">
              {book.matches.match.map((match, index) => (
                <div
                  key={index}
                  className="bg-sr-dark border border-sr-light-gray rounded p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-sr-accent uppercase">
                      {match.language}
                    </span>
                    <span className="text-xs text-gray-400">Page {match.page}</span>
                  </div>
                  <p className="text-sm text-gray-300 italic">{match.text}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

