import { ReactNode } from 'react';
import { ViewModeToggle } from './ViewModeToggle';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface DatabasePageLayoutProps {
  title: string;
  description: string;
  itemCount: number;
  isLoading: boolean;
  children: ReactNode;
  viewMode?: 'flat' | 'grouped';
  onViewModeChange?: (mode: 'flat' | 'grouped') => void;
  headerActions?: ReactNode;
}

export function DatabasePageLayout({
  title,
  description,
  itemCount,
  isLoading,
  children,
  viewMode,
  onViewModeChange,
  headerActions,
}: DatabasePageLayoutProps) {
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
              <p className="text-gray-400">
                {description} (loading...)
              </p>
            </div>
            {viewMode !== undefined && onViewModeChange && (
              <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            )}
            {headerActions}
          </div>
        </div>
        <LoadingSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
            <p className="text-gray-400">
              {description} ({itemCount} items)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode !== undefined && onViewModeChange && (
              <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            )}
            {headerActions}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

