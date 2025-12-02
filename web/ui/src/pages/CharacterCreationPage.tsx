import { useState } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { CharacterCreationWizard } from '../components/character/CharacterCreationWizard';

export function CharacterCreationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [searchParams] = useSearchParams();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

  // Get edition, creation method, and gameplay level from URL params
  const edition = searchParams.get('edition') || 'sr5';
  const creationMethod = searchParams.get('creationMethod') || undefined;
  const gameplayLevel = searchParams.get('gameplayLevel') as 'experienced' | 'street' | 'prime' | undefined;

  const handleSuccess = () => {
    if (campaignId) {
      navigate(`/campaigns/${campaignId}`);
    } else if (location.pathname.startsWith('/characters/create')) {
      navigate('/characters');
    } else {
      navigate('/campaigns');
    }
  };

  return (
    <div className="p-6">
      <CharacterCreationWizard
        isOpen={isWizardOpen}
        onOpenChange={(open) => {
          setIsWizardOpen(open);
          if (!open) {
            handleSuccess();
          }
        }}
        onSuccess={handleSuccess}
        edition={edition}
        initialCreationMethod={creationMethod as 'priority' | 'sum_to_ten' | 'karma' | undefined}
        initialGameplayLevel={gameplayLevel}
      />
    </div>
  );
}

