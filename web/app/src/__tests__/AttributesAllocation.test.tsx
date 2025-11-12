import '@testing-library/jest-dom/vitest';
import { describe, expect, it, afterEach, waitFor } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttributesAllocation, AttributeKey, AttributeValues } from '../components/AttributesAllocation';

const BASE_MODIFIERS: AttributeValues = {
  body: 0,
  quickness: 0,
  strength: 0,
  charisma: 0,
  intelligence: 0,
  willpower: 0,
};

function renderAllocation(overrides?: {
  modifiers?: Partial<AttributeValues>;
  priority?: string;
  storedValues?: Partial<AttributeValues> | null;
  magicType?: string | null;
  onStateChange?: (state: unknown) => void;
}) {
  const modifiers = { ...BASE_MODIFIERS, ...(overrides?.modifiers ?? {}) } as AttributeValues;
  return render(
    <AttributesAllocation
      metatypeName="Human"
      modifiers={modifiers}
      magicType={overrides?.magicType ?? null}
      priority={overrides?.priority ?? 'A'}
      storedValues={overrides?.storedValues ?? null}
      onStateChange={overrides?.onStateChange ?? (() => {})}
      onBack={() => {}}
      onSave={() => {}}
    />,
  );
}

async function setAllAttributesTo(user: ReturnType<typeof userEvent.setup>, value: number) {
  const keys: AttributeKey[] = ['body', 'quickness', 'strength', 'charisma', 'intelligence', 'willpower'];
  for (const key of keys) {
    const input = screen.getByLabelText(new RegExp(`${key} value`, 'i')) as HTMLInputElement;
    await user.type(input, `{selectAll}${value}`);
  }
}

describe('AttributesAllocation', () => {
  afterEach(() => {
    cleanup();
  });

  it('requires spending all attribute points', async () => {
    const user = userEvent.setup();
    renderAllocation();
    
    // On initial load with 0 points allocated, no error should be shown
    // (the "spend all points" message only appears after player starts allocating)
    expect(screen.queryByText(/Spend all 30 points before continuing/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save attributes/i })).toBeDisabled();
    
    // Allocate some points but not all (e.g., set Body to 3, which uses 2 points)
    const bodyInput = screen.getByLabelText(/body value/i) as HTMLInputElement;
    await user.type(bodyInput, '{selectAll}3');
    
    // Now the "spend all points" message should appear
    await waitFor(() => {
      expect(screen.getByText(/Spend all 30 points before continuing/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /save attributes/i })).toBeDisabled();
  });

  it('allows saving once all points are assigned', async () => {
    const user = userEvent.setup();
    renderAllocation();

    await setAllAttributesTo(user, 6);

    expect(screen.getByText(/Attributes ready/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save attributes/i })).toBeEnabled();
  });

  it('surfaces an error when an attribute is below 1 after modifiers', async () => {
    const user = userEvent.setup();
    renderAllocation({
      modifiers: { charisma: -1 },
    });

    await waitFor(() => {
      expect(screen.getByText(/Charisma is 0/i)).toBeInTheDocument();
    });
  });
});
