import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CharacterCreationWizard } from '../components/character/CharacterCreationWizard';

export function CharacterCreationPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

  const handleSuccess = () => {
    if (campaignId) {
      navigate(`/campaigns/${campaignId}`);
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

