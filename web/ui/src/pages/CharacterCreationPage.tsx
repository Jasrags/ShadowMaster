import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CharacterCreationWizard } from '../components/character/CharacterCreationWizard';

export function CharacterCreationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

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
        edition="sr5"
      />
    </div>
  );
}

