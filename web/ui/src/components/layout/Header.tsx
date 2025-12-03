import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, MenuTrigger, Menu, MenuItem, Popover, Separator, Tabs, TabList, Tab } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/characters') return 'characters';
    if (location.pathname === '/users') return 'users';
    return 'home';
  };

  // Check if user is admin
  const isAdmin = user?.roles.includes('administrator') ?? false;

  return (
    <header className="bg-sr-gray border-b border-sr-light-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-tech font-bold text-sr-text hover:text-sr-accent transition-colors mr-8"
          >
            ShadowMaster
          </Link>

          {/* Tab Navigation */}
          <Tabs selectedKey={getActiveTab()} onSelectionChange={(key) => {
            if (key === 'home') navigate('/');
            if (key === 'characters' && isAuthenticated) navigate('/characters');
            if (key === 'users' && isAdmin) navigate('/users');
          }} className="flex-1">
            <TabList className="flex gap-1">
              <Tab
                id="home"
                className="tab-cyber"
              >
                Home
              </Tab>
              {isAuthenticated && (
                <Tab
                  id="characters"
                  className="tab-cyber"
                >
                  Characters
                </Tab>
              )}
              {isAdmin && (
                <Tab
                  id="users"
                  className="tab-cyber"
                >
                  Users
                </Tab>
              )}
            </TabList>
          </Tabs>

          {/* Right side - User menu */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2">
                  <span className="text-sr-text-dim text-sm">
                    {user.username}
                  </span>
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 bg-sr-accent/20 border border-sr-accent rounded text-sr-accent text-xs"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hamburger Menu */}
                <MenuTrigger>
                  <Button
                    aria-label="Menu"
                    className="p-2 text-sr-text-dim hover:text-sr-text hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                  <Popover className="min-w-[200px]">
                    <Menu className="bg-sr-gray border border-sr-light-gray rounded-md shadow-lg p-1 outline-none">
                      <MenuItem
                        id="profile"
                        onAction={() => navigate('/profile')}
                        className="px-3 py-2 rounded-md text-sr-text cursor-pointer hover:bg-sr-light-gray focus:bg-sr-light-gray focus:outline-none"
                      >
                        Profile
                      </MenuItem>
                      <Separator className="border-t border-sr-light-gray my-1" />
                      <MenuItem
                        id="logout"
                        onAction={handleLogout}
                        className="px-3 py-2 rounded-md text-sr-danger cursor-pointer hover:bg-sr-danger/20 focus:bg-sr-danger/20 focus:outline-none"
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </Popover>
                </MenuTrigger>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3 py-1.5 bg-sr-gray border border-sr-light-gray rounded-md text-sr-text-dim hover:text-sr-text hover:bg-sr-light-gray transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-sr-accent border border-sr-accent rounded-md text-sr-darkest hover:bg-sr-accent-light transition-colors text-sm font-medium"
                style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

