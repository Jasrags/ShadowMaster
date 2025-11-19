import { NavLink } from 'react-router-dom';

interface TabItem {
  id: string;
  label: string;
  path: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
}

export function TabNavigation({ tabs }: TabNavigationProps) {
  return (
    <nav className="flex gap-1 border-b border-sr-light-gray" aria-label="Navigation tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sr-accent focus:ring-offset-2 focus:ring-offset-sr-gray ${
              isActive
                ? 'bg-sr-darker text-sr-accent border-b-2 border-sr-accent'
                : 'text-gray-400 hover:text-gray-200 hover:bg-sr-light-gray/50'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

