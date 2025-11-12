import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillsAllocation, SkillEntry } from '../components/SkillsAllocation';

function renderSkills(priority: 'A' | 'B' | 'C' | 'D' | 'E' | '', active: SkillEntry[] = [], knowledge: SkillEntry[] = []) {
  const onBack = vi.fn();
  const onStateChange = vi.fn();
  const onSave = vi.fn();

  const view = render(
    <SkillsAllocation
      priority={priority}
      storedActive={active}
      storedKnowledge={knowledge}
      onBack={onBack}
      onStateChange={onStateChange}
      onSave={onSave}
    />,
  );

  return { onBack, onStateChange, onSave, ...view };
}

afterEach(() => {
  cleanup();
});

describe('SkillsAllocation', () => {
  it('shows a validation error when priority is not assigned', () => {
    renderSkills('');
    expect(screen.getByText(/assign a skills priority before continuing/i)).toBeInTheDocument();
  });

  it('allows adding an active skill and updates point usage', async () => {
    const user = userEvent.setup();
    const { onStateChange } = renderSkills('C');

    const [addActive] = screen.getAllByRole('button', { name: /add active skill/i });
    await user.click(addActive);

    const skillName = await screen.findByLabelText(/skill name/i);
    await user.type(skillName, 'Pistols');

    const rating = screen.getByLabelText(/rating/i) as HTMLInputElement;
    fireEvent.change(rating, { target: { value: '4' } });
    expect(rating.value).toBe('4');

    const usedSummary = screen.getByText(/Used:/i).closest('span');
    expect(usedSummary).toHaveTextContent(/Used:\s*4/);
    expect(onStateChange).toHaveBeenCalled();
  });

  it('enforces total points before enabling save', async () => {
    const user = userEvent.setup();
    const { onSave } = renderSkills('E');

    // Add three active and two knowledge skills
    const [addActive] = screen.getAllByRole('button', { name: /add active skill/i });
    const [addKnowledge] = screen.getAllByRole('button', { name: /add knowledge skill/i });

    await user.click(addActive);
    await user.click(addActive);
    await user.click(addActive);
    await user.click(addKnowledge);
    await user.click(addKnowledge);

    const nameInputs = screen.getAllByLabelText(/skill name/i);
    const names = ['Pistols', 'Stealth', 'Athletics', 'Seattle History', 'Underworld Lore'];
    for (let index = 0; index < nameInputs.length; index += 1) {
      await user.type(nameInputs[index], names[index]);
    }

    const ratingInputs = screen.getAllByLabelText(/rating/i) as HTMLInputElement[];
    const ratings = [6, 6, 6, 6, 3];
    for (let index = 0; index < ratingInputs.length; index += 1) {
      fireEvent.change(ratingInputs[index], { target: { value: ratings[index].toString() } });
    }

    const saveButton = screen.getByRole('button', { name: /save skills/i });
    await waitFor(() => expect(saveButton).toBeEnabled());
    await user.click(saveButton);
    expect(onSave).toHaveBeenCalled();
  });
});
