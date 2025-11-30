import type { Skill } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface SkillViewModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SkillViewModal({ skill, isOpen, onOpenChange }: SkillViewModalProps) {
  if (!skill || !isOpen) {
    return null;
  }

  return (
    <ViewModal
      item={skill}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue label="Name" value={skill.name} />
            <LabelValue label="Type" value={skill.type ? <span className="capitalize">{skill.type}</span> : '-'} />
            <LabelValue
              label="Category"
              value={skill.category ? skill.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-'}
            />
            <LabelValue
              label="Linked Attribute"
              value={skill.linked_attribute 
                ? skill.linked_attribute.charAt(0).toUpperCase() + skill.linked_attribute.slice(1).toLowerCase()
                : '-'}
            />
            <LabelValue label="Can Default" value={skill.can_default ? 'Yes' : 'No'} />
            <LabelValue label="Is Specific" value={skill.is_specific ? 'Yes' : 'No'} />
            {skill.source && (
              <>
                <LabelValue label="Source" value={skill.source.source || '-'} />
                {skill.source.page && (
                  <LabelValue label="Page" value={skill.source.page} />
                )}
              </>
            )}
          </FieldGrid>
        </Section>

        {/* Description */}
        {skill.description && (
          <Section title="Description">
            <p className="text-gray-100 whitespace-pre-wrap">{skill.description}</p>
          </Section>
        )}

        {/* Skill Group */}
        {skill.skill_group && (
          <Section title="Skill Group">
            <p className="text-gray-100">{skill.skill_group}</p>
          </Section>
        )}

        {/* Specializations */}
        {skill.specializations && skill.specializations.length > 0 && (
          <Section title="Available Specializations">
            <ArrayDisplay
              items={skill.specializations}
              itemClassName="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
            />
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

