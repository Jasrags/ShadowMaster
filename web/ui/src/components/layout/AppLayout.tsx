import { ReactNode, useMemo } from 'react';
import { Button } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { TabNavigation } from './TabNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  // Define tabs - only show Campaigns if authenticated, Gear only for admin
  const tabs = useMemo(() => {
    const allTabs = [
      { id: 'home', label: 'Home', path: '/' },
    ];

    if (isAuthenticated) {
      allTabs.push({ id: 'campaigns', label: 'Campaigns', path: '/campaigns' });
      // Add admin-only tabs
      if (user?.roles.includes('administrator')) {
        allTabs.push({ id: 'gear', label: 'Gear', path: '/gear' });
        allTabs.push({ id: 'armor', label: 'Armor', path: '/armor' });
      }
      // Add more authenticated tabs here as needed
      // allTabs.push({ id: 'characters', label: 'Characters', path: '/characters' });
      // allTabs.push({ id: 'sessions', label: 'Sessions', path: '/sessions' });
    }

    return allTabs;
  }, [isAuthenticated, user]);

  async function handleLogout() {
    try {
      await logout();
      showSuccess('Logged out', 'You have been successfully logged out');
    } catch (err) {
      showError('Logout failed', err instanceof Error ? err.message : 'Failed to log out');
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

      {/* Only show tab navigation if we have more than just the home tab */}
      {tabs.length > 1 && (
        <div className="bg-sr-gray border-b border-sr-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabNavigation tabs={tabs} />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

