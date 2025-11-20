import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NestedTabItem {
  id: string;
  label: string;
  path: string;
  nested?: NestedTabItem[]; // Sub-tabs
}

interface NestedTabNavigationProps {
  tabs: NestedTabItem[];
}

export function NestedTabNavigation({ tabs }: NestedTabNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Find the current top-level tab based on path
  const getTopLevelTab = () => {
    const currentPath = location.pathname;
    for (const tab of tabs) {
      if (tab.path === currentPath) {
        return tab.id;
      }
      // Check if current path starts with this tab's path (for nested routes)
      if (tab.nested) {
        for (const nestedTab of tab.nested) {
          if (currentPath === nestedTab.path || currentPath.startsWith(nestedTab.path + '/')) {
            return tab.id;
          }
        }
      }
    }
    return tabs[0]?.id || '';
  };


  const topLevelTabId = getTopLevelTab();

  return (
    <Tabs
      selectedKey={topLevelTabId}
      onSelectionChange={(key) => {
        const tab = tabs.find(t => t.id === key);
        if (tab && !tab.nested) {
          navigate(tab.path);
        } else if (tab?.nested) {
          // Navigate to first nested tab
          navigate(tab.nested[0].path);
        }
      }}
      className="flex flex-col h-full"
    >
      <TabList aria-label="Main navigation" className="flex gap-1 border-b border-sr-light-gray bg-sr-gray">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            className={({ isSelected, isFocused }) =>
              `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
                isSelected
                  ? 'bg-sr-darker text-sr-accent border-b-2 border-sr-accent'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-sr-light-gray/50'
              } ${isFocused ? 'ring-2 ring-sr-accent ring-offset-2 ring-offset-sr-gray' : ''}`
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      {tabs.map((tab) => {
        const isActive = tab.id === topLevelTabId;
        if (!isActive) {
          return <TabPanel key={tab.id} id={tab.id} className="hidden" />;
        }
        
        return (
          <TabPanel key={tab.id} id={tab.id}>
            {tab.nested ? (
              // Render nested tabs
              <NestedTabs parentTab={tab} />
            ) : (
              // Render route content
              <Outlet />
            )}
          </TabPanel>
        );
      })}
    </Tabs>
  );
}

function NestedTabs({ parentTab }: { parentTab: NestedTabItem }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!parentTab.nested) return null;

  const nestedTabId = parentTab.nested.find(
    tab => location.pathname === tab.path || location.pathname.startsWith(tab.path + '/')
  )?.id || parentTab.nested[0]?.id || '';

  return (
    <Tabs
      selectedKey={nestedTabId}
      onSelectionChange={(key) => {
        const nestedTab = parentTab.nested?.find(t => t.id === key);
        if (nestedTab) {
          navigate(nestedTab.path);
        }
      }}
      className="flex flex-col"
    >
      <TabList aria-label={`${parentTab.label} sub-navigation`} className="flex gap-1 border-b border-sr-light-gray bg-sr-gray/50">
        {parentTab.nested.map((nestedTab) => (
          <Tab
            key={nestedTab.id}
            id={nestedTab.id}
            className={({ isSelected, isFocused }) =>
              `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
                isSelected
                  ? 'bg-sr-dark text-sr-accent border-b-2 border-sr-accent'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-sr-light-gray/30'
              } ${isFocused ? 'ring-2 ring-sr-accent ring-offset-2' : ''}`
            }
          >
            {nestedTab.label}
          </Tab>
        ))}
      </TabList>

      {parentTab.nested.map((nestedTab) => {
        const isActive = nestedTab.id === nestedTabId;
        if (!isActive) {
          return <TabPanel key={nestedTab.id} id={nestedTab.id} className="hidden" />;
        }
        
        return (
          <TabPanel key={nestedTab.id} id={nestedTab.id}>
            <Outlet />
          </TabPanel>
        );
      })}
    </Tabs>
  );
}

