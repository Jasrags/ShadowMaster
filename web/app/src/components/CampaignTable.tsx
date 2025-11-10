import { useMemo } from 'react';
import { DataTable, DataTableColumn } from './DataTable';
import { CampaignSummary } from '../types/campaigns';
import { formatDate } from '../utils/dates';
import { ShadowmasterAuthState } from '../types/auth';

interface Props {
  campaigns: CampaignSummary[];
  loading: boolean;
  error: string | null;
  onEdit: (campaign: CampaignSummary) => void;
  onDelete: (campaign: CampaignSummary) => void;
  currentUser: ShadowmasterAuthState | null;
  actionInFlightId: string | null;
}

export function CampaignTable({
  campaigns,
  loading,
  error,
  onEdit,
  onDelete,
  currentUser,
  actionInFlightId,
}: Props) {
  const columns: DataTableColumn<CampaignSummary>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Campaign',
        sortable: true,
        accessor: (campaign) => campaign.name,
      },
      {
        key: 'edition',
        header: 'Edition',
        sortable: true,
        accessor: (campaign) => campaign.edition.toUpperCase(),
      },
      {
        key: 'gameplay_level',
        header: 'Gameplay Level',
        sortable: true,
        accessor: (campaign) => campaign.gameplay_level ?? '',
        render: (campaign) => campaign.gameplay_level?.replace(/_/g, ' ') ?? '—',
      },
      {
        key: 'creation_method',
        header: 'Creation Method',
        sortable: true,
        accessor: (campaign) => campaign.creation_method,
        render: (campaign) => campaign.creation_method?.replace(/_/g, ' ') ?? '—',
      },
      {
        key: 'gm_name',
        header: 'Gamemaster',
        sortable: true,
        accessor: (campaign) => campaign.gm_name ?? '',
        render: (campaign) => campaign.gm_name ?? '—',
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        accessor: (campaign) => campaign.status ?? '',
        render: (campaign) => (
          <span className={`status-badge status-${(campaign.status ?? 'unknown').toLowerCase()}`}>
            {campaign.status ?? '—'}
          </span>
        ),
      },
      {
        key: 'updated_at',
        header: 'Updated',
        sortable: true,
        accessor: (campaign) => (campaign.updated_at ? new Date(campaign.updated_at) : null),
        render: (campaign) => formatDate(campaign.updated_at),
      },
      {
        key: 'actions',
        header: 'Actions',
        sortable: false,
        align: 'right',
        render: (campaign) => {
          const canManage =
            campaign.can_edit ||
            campaign.can_delete ||
            currentUser?.isAdministrator ||
            (campaign.gm_user_id && currentUser?.user?.id === campaign.gm_user_id);
          const isProcessing = actionInFlightId === campaign.id;

          const allowEdit = (campaign.can_edit ?? false) || currentUser?.isAdministrator || (campaign.gm_user_id && currentUser?.user?.id === campaign.gm_user_id);
          const allowDelete = (campaign.can_delete ?? false) || currentUser?.isAdministrator || (campaign.gm_user_id && currentUser?.user?.id === campaign.gm_user_id);

          return (
            <div className="table-actions">
              <button
                type="button"
                className="button button--table"
                onClick={() => onEdit(campaign)}
                disabled={isProcessing || !canManage || !allowEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="button button--table button--danger"
                onClick={() => onDelete(campaign)}
                disabled={isProcessing || !canManage || !allowDelete}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [actionInFlightId, currentUser, onDelete, onEdit],
  );

  return (
    <div className="campaign-table">
      {error && (
        <div className="form-feedback form-feedback--error" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={campaigns}
        loading={loading}
        getRowId={(campaign) => campaign.id}
        emptyState="No campaigns yet. Create one to get started!"
        searchPlaceholder="Search campaigns…"
      />
    </div>
  );
}

