import { useEffect, useState, useCallback } from 'react';
import { mentorApi } from '../lib/api';
import type { Mentor } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { MentorsTable } from '../components/mentor/MentorsTable';
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function MentorsPage() {
  const { showError } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await mentorApi.getMentors();
      setMentors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load mentors';
      showError('Failed to load mentors', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  return (
    <DatabasePageLayout
      title="Mentors Database"
      description="View and search all available mentor spirits from Shadowrun 5th Edition"
      itemCount={mentors.length}
      isLoading={isLoading}
    >
      <MentorsTable mentors={mentors} />
    </DatabasePageLayout>
  );
}

