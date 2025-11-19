import type { GearRequired, RequirementOneOf, RequirementAllOf, ParentDetails, GearDetailsRequirement, GearConditionGroup } from '../../lib/types';

interface RequirementsDisplayProps {
  required: GearRequired;
}

export function RequirementsDisplay({ required }: RequirementsDisplayProps) {
  const hasAnyRequirement = required.oneof || required.allof || required.parentdetails || required.geardetails;

  if (!hasAnyRequirement) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* OneOf Requirements */}
      {required.oneof && <OneOfDisplay oneof={required.oneof} />}

      {/* AllOf Requirements */}
      {required.allof && <AllOfDisplay allof={required.allof} />}

      {/* Parent Requirements */}
      {required.parentdetails && <ParentDisplay parent={required.parentdetails} />}

      {/* Gear Details Requirements */}
      {required.geardetails && (
        <GearDetailsDisplay details={required.geardetails as GearDetailsRequirement | Record<string, unknown>} />
      )}
    </div>
  );
}

function OneOfDisplay({ oneof }: { oneof: RequirementOneOf }) {
  const requirements: string[] = [];

  if (oneof.cyberware && oneof.cyberware.length > 0) {
    requirements.push(`Cyberware: ${oneof.cyberware.join(', ')}`);
  }
  if (oneof.bioware && oneof.bioware.length > 0) {
    requirements.push(`Bioware: ${oneof.bioware.join(', ')}`);
  }
  if (oneof.metatype) {
    requirements.push(`Metatype: ${oneof.metatype}`);
  }
  if (oneof.quality && oneof.quality.length > 0) {
    requirements.push(`Quality: ${oneof.quality.join(', ')}`);
  }
  if (oneof.power) {
    requirements.push(`Power: ${oneof.power}`);
  }
  if (oneof.group && oneof.group.length > 0) {
    requirements.push(`Group: ${oneof.group.join(', ')}`);
  }

  if (requirements.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">One Of (at least one required):</h3>
      <ul className="list-disc list-inside space-y-1 ml-4">
        {requirements.map((req, idx) => (
          <li key={idx} className="text-gray-200 text-sm">{req}</li>
        ))}
      </ul>
    </div>
  );
}

function AllOfDisplay({ allof }: { allof: RequirementAllOf }) {
  const requirements: string[] = [];

  if (allof.metatype) {
    requirements.push(`Metatype: ${allof.metatype}`);
  }
  if (allof.quality) {
    requirements.push(`Quality: ${allof.quality}`);
  }
  if (allof.power) {
    requirements.push(`Power: ${allof.power}`);
  }
  if (allof.magenabled !== undefined) {
    requirements.push(`Magic Enabled: ${allof.magenabled ? 'Yes' : 'No'}`);
  }

  if (requirements.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">All Of (all required):</h3>
      <ul className="list-disc list-inside space-y-1 ml-4">
        {requirements.map((req, idx) => (
          <li key={idx} className="text-gray-200 text-sm">{req}</li>
        ))}
      </ul>
    </div>
  );
}

function ParentDisplay({ parent }: { parent: ParentDetails }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Parent Item:</h3>
      <p className="text-gray-200 text-sm ml-4">{parent.name}</p>
    </div>
  );
}

function GearDetailsDisplay({ details }: { details: GearDetailsRequirement | Record<string, unknown> }) {
  // Check if this is a complex requirement (map[string]interface{})
  // Type-safe requirements have 'or' and/or 'and' fields
  const hasOr = 'or' in details && details.or;
  const hasAnd = 'and' in details && details.and;
  const hasOtherKeys = Object.keys(details).some(key => key !== 'or' && key !== 'and');
  
  // If it has other keys besides or/and, it's complex
  // OR if it doesn't have or/and but has content, it's complex
  const isComplex = (hasOtherKeys && (!hasOr && !hasAnd)) || (!hasOr && !hasAnd && Object.keys(details).length > 0);

  if (isComplex) {
    // Handle complex attribute-based requirements (map[string]interface{})
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Gear Details (Complex):</h3>
        <div className="p-2 bg-sr-dark border border-sr-light-gray rounded-md ml-4">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Handle type-safe requirements
  const sections: JSX.Element[] = [];
  const typedDetails = details as GearDetailsRequirement;

  if (typedDetails.or) {
    sections.push(
      <ConditionGroupDisplay key="or" label="OR (at least one):" condition={typedDetails.or} />
    );
  }

  if (typedDetails.and) {
    sections.push(
      <ConditionGroupDisplay key="and" label="AND (all required):" condition={typedDetails.and} />
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Gear Details:</h3>
      <div className="ml-4 space-y-3">{sections}</div>
    </div>
  );
}

function ConditionGroupDisplay({ label, condition }: { label: string; condition: GearConditionGroup }) {
  const items: string[] = [];

  if (condition.category && condition.category.length > 0) {
    items.push(`Category: ${condition.category.join(', ')}`);
  }
  if (condition.name && condition.name.length > 0) {
    items.push(`Name: ${condition.name.join(', ')}`);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-400 mb-1">{label}</h4>
      <ul className="list-disc list-inside space-y-1 ml-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-200 text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
}

