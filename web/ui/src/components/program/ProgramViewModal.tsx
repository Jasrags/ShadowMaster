import type { Program } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface ProgramViewModalProps {
  program: Program | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProgramViewModal({ program, isOpen, onOpenChange }: ProgramViewModalProps) {
  if (!program) return null;

  return (
    <ViewModal
      item={program}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={program.type ? <span className="text-gray-400">{program.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {program.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{program.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {program.type && (
              <LabelValue
                label="Type"
                value={program.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {program.action_effect && (
              <LabelValue label="Action/Effect" value={program.action_effect} />
            )}
            {program.rating_range && (
              <LabelValue
                label="Rating Range"
                value={
                  program.rating_range.min_rating !== undefined && program.rating_range.max_rating !== undefined
                    ? `${program.rating_range.min_rating}-${program.rating_range.max_rating}`
                    : '-'
                }
              />
            )}
            {program.cost && (
              <LabelValue label="Cost" value={program.cost.formula || '-'} />
            )}
            {program.source?.source && (
              <LabelValue label="Source" value={program.source.source} />
            )}
            {program.source?.page && (
              <LabelValue label="Page" value={program.source.page} />
            )}
          </FieldGrid>
        </Section>

        {program.effects && program.effects.length > 0 && (
          <Section title="Effects">
            <div className="space-y-2">
              {program.effects.map((effect, index) => (
                <div key={index} className="bg-sr-dark border border-sr-light-gray rounded p-3">
                  {effect.action && (
                    <div className="font-medium text-gray-200">{effect.action}</div>
                  )}
                  {effect.effect && (
                    <div className="text-sm text-gray-300 mt-1">{effect.effect}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

