import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPanel } from '../auth/AuthPanel';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sr-darker">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPanel />;
  }

  return <>{children}</>;
}

