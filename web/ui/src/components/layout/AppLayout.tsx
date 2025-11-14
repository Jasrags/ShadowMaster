import { ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="min-h-screen bg-sr-darker">
      <header className="bg-sr-gray border-b border-sr-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-sr-accent">ShadowMaster</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">{user.username}</span>
                    {user.roles.length > 0 && (
                      <span className="ml-2 text-xs">
                        ({user.roles.join(', ')})
                      </span>
                    )}
                  </div>
                  <Button
                    onPress={handleLogout}
                    className="px-4 py-2 bg-sr-light-gray hover:bg-sr-accent hover:text-sr-dark text-gray-300 font-medium rounded-md transition-colors"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

