import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, DataTableColumn } from '../components/DataTable';

interface RunnerRow {
  id: string;
  name: string;
  role: string;
  notes: string;
}

const columns: DataTableColumn<RunnerRow>[] = [
  { key: 'name', header: 'Runner', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'notes', header: 'Notes', sortable: false, searchable: false },
];

const rows: RunnerRow[] = [
  { id: 'runner-1', name: 'Alpha', role: 'Face', notes: 'Shadow broker contact' },
  { id: 'runner-2', name: 'Bravo', role: 'Decker', notes: 'Matrix specialist' },
  { id: 'runner-3', name: 'Charlie', role: 'Street Sam', notes: 'Augmented muscle wizard' },
];

function renderTable(partialColumns = columns, partialRows = rows) {
  return render(
    <DataTable
      columns={partialColumns}
      data={partialRows}
      getRowId={(row) => row.id}
      searchPlaceholder="Search runners…"
    />,
  );
}

function getBodyRows() {
  const table = screen.getAllByRole('table')[0];
  const allRows = within(table).getAllByRole('row');
  return allRows.slice(1);
}

afterEach(() => {
  cleanup();
});

describe('DataTable', () => {
  it('filters rows via the search input across searchable columns', async () => {
    const user = userEvent.setup();
    renderTable();

    expect(getBodyRows()).toHaveLength(3);

    await user.type(screen.getByLabelText(/search table/i), 'bravo');

    await waitFor(() => {
      expect(getBodyRows()).toHaveLength(1);
    });
    expect(getBodyRows()[0]).toHaveTextContent('Bravo');
  });

  it('ignores columns marked as non-searchable when filtering', async () => {
    const user = userEvent.setup();
    renderTable();

    await user.type(screen.getByLabelText(/search table/i), 'wizard');

    await waitFor(() => {
      expect(screen.getByText(/no records found/i)).toBeInTheDocument();
    });
  });

  it('sorts rows and toggles direction when clicking a sortable header', async () => {
    const user = userEvent.setup();
    renderTable();

    expect(getBodyRows()[0]).toHaveTextContent('Alpha');

    const nameHeader = screen.getAllByRole('columnheader', { name: /runner/i })[0];
    await user.click(nameHeader);

    expect(getBodyRows()[0]).toHaveTextContent('Charlie');

    await user.click(nameHeader);

    expect(getBodyRows()[0]).toHaveTextContent('Alpha');
  });
});
