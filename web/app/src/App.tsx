import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PriorityAssignment } from './components/PriorityAssignment';
import { useEdition } from './hooks/useEdition';

function PriorityAssignmentPortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('priority-assignment-react-root'));
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(<PriorityAssignment />, container);
}

export function App() {
  const { activeEdition, isLoading, error, characterCreationData } = useEdition();

  let status = '· data pending';
  if (isLoading) {
    status = '· loading edition data…';
  } else if (error) {
    status = `· failed to load data: ${error}`;
  } else if (characterCreationData) {
    status = '· edition data loaded';
  }

  return (
    <>
      <div className="react-banner" data-active-edition={activeEdition.key}>
        <small>
          React shell active — controlling edition context for <strong>{activeEdition.label}</strong> {status}
        </small>
      </div>
      <PriorityAssignmentPortal />
    </>
  );
}
