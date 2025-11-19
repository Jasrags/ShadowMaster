interface BonusDisplayProps {
  bonus: unknown;
  title?: string;
}

export function BonusDisplay({ bonus, title = 'Bonuses' }: BonusDisplayProps) {
  if (!bonus || typeof bonus !== 'object') {
    return null;
  }

  const bonusObj = bonus as Record<string, unknown>;
  const sections: JSX.Element[] = [];

  // Limit Modifiers
  if (bonusObj.limitmodifier) {
    sections.push(
      <LimitModifierDisplay key="limitmodifier" modifiers={bonusObj.limitmodifier} />
    );
  }

  // Skill Category Bonuses
  if (bonusObj.skillcategory) {
    sections.push(
      <SkillCategoryDisplay key="skillcategory" bonuses={bonusObj.skillcategory} />
    );
  }

  // Specific Skill Bonuses
  if (bonusObj.specificskill) {
    sections.push(
      <SpecificSkillDisplay key="specificskill" bonuses={bonusObj.specificskill} />
    );
  }

  // Social Limit
  if (bonusObj.sociallimit) {
    sections.push(
      <div key="sociallimit">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Social Limit</h3>
        <p className="text-gray-200 text-sm ml-4">{String(bonusObj.sociallimit)}</p>
      </div>
    );
  }

  // Resistance/Immunity Bonuses
  const resistanceBonuses: JSX.Element[] = [];
  if (bonusObj.toxincontactresist) {
    resistanceBonuses.push(
      <div key="toxincontactresist">
        <span className="text-gray-400">Toxin Contact Resist:</span>{' '}
        <span className="text-gray-200">{String(bonusObj.toxincontactresist)}</span>
      </div>
    );
  }
  if (bonusObj.toxincontactimmune !== undefined) {
    resistanceBonuses.push(
      <div key="toxincontactimmune">
        <span className="text-gray-400">Toxin Contact Immune:</span>{' '}
        <span className="text-gray-200">{bonusObj.toxincontactimmune ? 'Yes' : 'No'}</span>
      </div>
    );
  }
  if (bonusObj.toxininhalationimmune !== undefined) {
    resistanceBonuses.push(
      <div key="toxininhalationimmune">
        <span className="text-gray-400">Toxin Inhalation Immune:</span>{' '}
        <span className="text-gray-200">{bonusObj.toxininhalationimmune ? 'Yes' : 'No'}</span>
      </div>
    );
  }
  if (bonusObj.pathogencontactresist) {
    resistanceBonuses.push(
      <div key="pathogencontactresist">
        <span className="text-gray-400">Pathogen Contact Resist:</span>{' '}
        <span className="text-gray-200">{String(bonusObj.pathogencontactresist)}</span>
      </div>
    );
  }
  if (bonusObj.pathogencontactimmune !== undefined) {
    resistanceBonuses.push(
      <div key="pathogencontactimmune">
        <span className="text-gray-400">Pathogen Contact Immune:</span>{' '}
        <span className="text-gray-200">{bonusObj.pathogencontactimmune ? 'Yes' : 'No'}</span>
      </div>
    );
  }
  if (bonusObj.pathogeninhalationimmune !== undefined) {
    resistanceBonuses.push(
      <div key="pathogeninhalationimmune">
        <span className="text-gray-400">Pathogen Inhalation Immune:</span>{' '}
        <span className="text-gray-200">{bonusObj.pathogeninhalationimmune ? 'Yes' : 'No'}</span>
      </div>
    );
  }
  if (resistanceBonuses.length > 0) {
    sections.push(
      <div key="resistances">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Resistance/Immunity</h3>
        <div className="ml-4 space-y-1">{resistanceBonuses}</div>
      </div>
    );
  }

  // Armor Bonuses
  const armorBonuses: JSX.Element[] = [];
  if (bonusObj.firearmor) {
    armorBonuses.push(
      <div key="firearmor">
        <span className="text-gray-400">Fire Armor:</span>{' '}
        <span className="text-gray-200">{String(bonusObj.firearmor)}</span>
      </div>
    );
  }
  if (bonusObj.coldarmor) {
    armorBonuses.push(
      <div key="coldarmor">
        <span className="text-gray-400">Cold Armor:</span>{' '}
        <span className="text-gray-200">{String(bonusObj.coldarmor)}</span>
      </div>
    );
  }
  if (bonusObj.electricityarmor) {
    armorBonuses.push(
      <div key="electricityarmor">
        <span className="text-gray-400">Electricity Armor:</span>{' '}
        <span className="text-gray-200">{String(bonusObj.electricityarmor)}</span>
      </div>
    );
  }
  if (armorBonuses.length > 0) {
    sections.push(
      <div key="armor">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Elemental Armor</h3>
        <div className="ml-4 space-y-1">{armorBonuses}</div>
      </div>
    );
  }

  // Radiation Resistance
  if (bonusObj.radiationresist) {
    sections.push(
      <div key="radiationresist">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Radiation Resistance</h3>
        <p className="text-gray-200 text-sm ml-4">{String(bonusObj.radiationresist)}</p>
      </div>
    );
  }

  // Fatigue Resistance
  if (bonusObj.fatigueresist) {
    sections.push(
      <div key="fatigueresist">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Fatigue Resistance</h3>
        <p className="text-gray-200 text-sm ml-4">{String(bonusObj.fatigueresist)}</p>
      </div>
    );
  }

  // Check for unknown fields (complex bonuses)
  const knownKeys = new Set([
    'limitmodifier', 'skillcategory', 'specificskill', 'sociallimit',
    'toxincontactresist', 'toxincontactimmune', 'toxininhalationimmune',
    'pathogencontactresist', 'pathogencontactimmune', 'pathogeninhalationimmune',
    'firearmor', 'coldarmor', 'electricityarmor', 'radiationresist', 'fatigueresist',
    'selectarmor', 'selecttext', '+@unique'
  ]);
  const unknownKeys = Object.keys(bonusObj).filter(key => !knownKeys.has(key.toLowerCase()) && bonusObj[key] !== null && bonusObj[key] !== undefined && bonusObj[key] !== false);
  
  if (sections.length === 0 && unknownKeys.length === 0) {
    return null;
  }

  // If we have known sections, render them
  // If we only have unknown fields, show as complex JSON
  if (sections.length > 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">{title}</h2>
        <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
          <div className="space-y-4">{sections}</div>
          {unknownKeys.length > 0 && (
            <div className="mt-4 pt-4 border-t border-sr-light-gray">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Additional Bonuses (Complex):</h3>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto bg-sr-dark p-2 rounded">
                {JSON.stringify(Object.fromEntries(unknownKeys.map(k => [k, bonusObj[k]])), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Fallback: show as JSON for complex/unknown bonuses
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">{title}</h2>
      <div className="p-3 bg-sr-light-gray border border-sr-light-gray rounded-md">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
          {JSON.stringify(bonusObj, null, 2)}
        </pre>
      </div>
    </section>
  );
}

function LimitModifierDisplay({ modifiers }: { modifiers: unknown }) {
  const modifierList = Array.isArray(modifiers) ? modifiers : [modifiers];
  const validModifiers = modifierList.filter((m): m is Record<string, unknown> => 
    m !== null && typeof m === 'object'
  );

  if (validModifiers.length === 0) {
    return null;
  }

  const formatCondition = (condition: unknown): string => {
    if (typeof condition !== 'string') return '';
    // Format condition strings like "LimitCondition_ShieldPhysicalPenalty" to be more readable
    return condition
      .replace(/^LimitCondition_/, '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Limit Modifiers</h3>
      <ul className="list-none space-y-2 ml-4">
        {validModifiers.map((mod, idx) => {
          const conditionStr = mod.condition ? formatCondition(mod.condition) : '';
          return (
            <li key={idx} className="text-gray-200 text-sm">
              <span className="font-medium">{String(mod.limit || 'Unknown')} Limit:</span>{' '}
              <span className={String(mod.value || '').startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                {String(mod.value || '0')}
              </span>
              {conditionStr && (
                <>
                  {' '}
                  <span className="text-gray-400 italic">
                    ({conditionStr})
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SkillCategoryDisplay({ bonuses }: { bonuses: unknown }) {
  const bonusList = Array.isArray(bonuses) ? bonuses : [bonuses];
  const validBonuses = bonusList.filter((b): b is Record<string, unknown> => 
    b !== null && typeof b === 'object'
  );

  if (validBonuses.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Skill Category Bonuses</h3>
      <ul className="list-none space-y-1 ml-4">
        {validBonuses.map((bonus, idx) => (
          <li key={idx} className="text-gray-200 text-sm">
            <span className="font-medium">{String(bonus.name || 'Unknown')}:</span>{' '}
            <span className="text-green-400">+{String(bonus.bonus || '0')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpecificSkillDisplay({ bonuses }: { bonuses: unknown }) {
  const bonusList = Array.isArray(bonuses) ? bonuses : [bonuses];
  const validBonuses = bonusList.filter((b): b is Record<string, unknown> => 
    b !== null && typeof b === 'object'
  );

  if (validBonuses.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Specific Skill Bonuses</h3>
      <ul className="list-none space-y-1 ml-4">
        {validBonuses.map((bonus, idx) => (
          <li key={idx} className="text-gray-200 text-sm">
            <span className="font-medium">{String(bonus.name || 'Unknown')}:</span>{' '}
            <span className="text-green-400">
              +{typeof bonus.bonus === 'number' ? bonus.bonus : String(bonus.bonus || '0')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

