import { ReactNode, useMemo } from 'react';
import { Button } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { NestedTabNavigation } from './NestedTabNavigation';

interface TabItem {
  id: string;
  label: string;
  path: string;
  nested?: TabItem[];
  groupLabel?: string; // Optional group label for visual grouping
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  // Define tabs - only show Campaigns if authenticated, Database (with Gear/Armor) only for admin
  const tabs = useMemo((): TabItem[] => {
    const allTabs: TabItem[] = [
      { id: 'home', label: 'Home', path: '/' },
    ];

    if (isAuthenticated) {
      allTabs.push({ id: 'campaigns', label: 'Campaigns', path: '/campaigns' });
      // Add admin-only Database tab with nested tabs organized by category
      if (user?.roles.includes('administrator')) {
        allTabs.push({
          id: 'database',
          label: 'Database',
          path: '/database',
          nested: [
            // Combat & Actions
            { id: 'actions', label: 'Actions', path: '/actions', groupLabel: 'Combat & Actions' },
            { id: 'weapons', label: 'Weapons', path: '/weapons', groupLabel: 'Combat & Actions' },
            { id: 'weapon-accessories', label: 'Weapon Accessories', path: '/weapon-accessories', groupLabel: 'Combat & Actions' },
            { id: 'weapon-consumables', label: 'Weapon Consumables', path: '/weapon-consumables', groupLabel: 'Combat & Actions' },
            { id: 'armor', label: 'Armor', path: '/armor', groupLabel: 'Combat & Actions' },
            // Equipment & Gear
            { id: 'gear', label: 'Gear', path: '/gear', groupLabel: 'Equipment & Gear' },
            { id: 'vehicles', label: 'Vehicles', path: '/vehicles', groupLabel: 'Equipment & Gear' },
            { id: 'vehicle-modifications', label: 'Vehicle Modifications', path: '/vehicle-modifications', groupLabel: 'Equipment & Gear' },
            // Augmentations
            { id: 'cyberware', label: 'Cyberware', path: '/cyberware', groupLabel: 'Augmentations' },
            { id: 'bioware', label: 'Bioware', path: '/bioware', groupLabel: 'Augmentations' },
            // Magic
            { id: 'spells', label: 'Spells', path: '/spells', groupLabel: 'Magic' },
            { id: 'traditions', label: 'Traditions', path: '/traditions', groupLabel: 'Magic' },
            { id: 'mentors', label: 'Mentors', path: '/mentors', groupLabel: 'Magic' },
            { id: 'powers', label: 'Powers', path: '/powers', groupLabel: 'Magic' },
            // Matrix
            { id: 'programs', label: 'Programs', path: '/programs', groupLabel: 'Matrix' },
            { id: 'complex-forms', label: 'Complex Forms', path: '/complex-forms', groupLabel: 'Matrix' },
            // Character Creation
            { id: 'metatypes', label: 'Metatypes', path: '/metatypes', groupLabel: 'Character Creation' },
            { id: 'qualities', label: 'Qualities', path: '/qualities', groupLabel: 'Character Creation' },
            { id: 'skills', label: 'Skills', path: '/skills', groupLabel: 'Character Creation' },
            { id: 'lifestyles', label: 'Lifestyles', path: '/lifestyles', groupLabel: 'Character Creation' },
            { id: 'contacts', label: 'Contacts', path: '/contacts', groupLabel: 'Character Creation' },
            // Reference
            { id: 'books', label: 'Books', path: '/books', groupLabel: 'Reference' },
          ],
        });
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
            <NestedTabNavigation tabs={tabs} />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

