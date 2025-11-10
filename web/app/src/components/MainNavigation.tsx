import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type TabKey = 'characters' | 'campaigns' | 'sessions';

interface TabDefinition {
  key: TabKey;
  label: string;
  description: string;
  targetId: string;
}

const TABS: TabDefinition[] = [
  {
    key: 'characters',
    label: 'Characters',
    description: 'Review your roster, build new runners, and edit existing sheets.',
    targetId: 'characters-view',
  },
  {
    key: 'campaigns',
    label: 'Campaigns',
    description: 'Manage campaign notes, participant lists, and session planning.',
    targetId: 'campaigns-view',
  },
  {
    key: 'sessions',
    label: 'Sessions',
    description: 'Track upcoming runs, agendas, and after-action reports.',
    targetId: 'sessions-view',
  },
];

function resolveInitialTab(): TabKey {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const match = TABS.find((tab) => tab.key === hash);
  return match?.key ?? 'characters';
}

function useSectionVisibility(activeTab: TabKey) {
  useEffect(() => {
    TABS.forEach(({ key, targetId }) => {
      const element = document.getElementById(targetId);
      if (!element) {
        return;
      }
      if (key === activeTab) {
        element.removeAttribute('hidden');
        element.classList.add('main-tab-panel--active');
        element.style.display = '';
        element.setAttribute('data-active-tab', key);
      } else {
        element.setAttribute('hidden', 'true');
        element.classList.remove('main-tab-panel--active');
        element.style.display = 'none';
        element.removeAttribute('data-active-tab');
      }
    });
  }, [activeTab]);
}

export function MainNavigation() {
  const [container, setContainer] = useState<Element | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(() => resolveInitialTab());

  useEffect(() => {
    setContainer(document.getElementById('main-navigation-root'));
  }, []);

  useSectionVisibility(activeTab);

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`);
  }, [activeTab]);

  const activeDescription = useMemo(
    () => TABS.find((tab) => tab.key === activeTab)?.description ?? '',
    [activeTab],
  );

  if (!container) {
    return null;
  }

  return createPortal(
    <nav className="main-tabs" role="tablist" aria-label="Primary navigation">
      <div className="main-tabs__list">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={tab.targetId}
              className={`main-tabs__tab${isActive ? ' main-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className="main-tabs__summary" role="status">
        {activeDescription}
      </p>
    </nav>,
    container,
  );
}

