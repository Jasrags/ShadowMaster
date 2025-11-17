import type { CampaignResponse } from '../../lib/types';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import { Button } from 'react-aria-components';
import { DeleteConfirmationDialog } from '../common/DeleteConfirmationDialog';
import { CampaignViewModal } from './CampaignViewModal';
import { CampaignEditModal } from './CampaignEditModal';
import { useState } from 'react';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface CampaignTableProps {
  campaigns: CampaignResponse[];
  onCampaignUpdated?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-green-400';
    case 'Paused':
      return 'text-yellow-400';
    case 'Completed':
      return 'text-gray-400';
    default:
      return 'text-gray-300';
  }
};

export function CampaignTable({ campaigns, onCampaignUpdated }: CampaignTableProps) {
  const { showSuccess, showError } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleView = (campaign: CampaignResponse) => {
    setSelectedCampaign(campaign);
    setIsViewModalOpen(true);
  };

  const handleEdit = (campaign: CampaignResponse) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    if (onCampaignUpdated) {
      onCampaignUpdated();
    }
  };

  const handleDelete = async (campaign: CampaignResponse) => {
    setIsDeleting(campaign.id);
    try {
      await campaignApi.deleteCampaign(campaign.id);
      showSuccess('Campaign deleted', `Campaign "${campaign.name}" has been deleted.`);
      if (onCampaignUpdated) {
        onCampaignUpdated();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      showError('Failed to delete campaign', errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDefinition<CampaignResponse>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'gm_username',
      header: 'GM',
      accessor: 'gm_username',
      sortable: true,
      render: (_value: unknown, row: CampaignResponse) => (
        <span>{row.gm_username || row.gm_name || '-'}</span>
      ),
    },
    {
      id: 'edition',
      header: 'Edition',
      accessor: 'edition',
      sortable: true,
    },
    {
      id: 'gameplay_level',
      header: 'Gameplay Level',
      accessor: 'gameplay_level',
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value: unknown) => (
        <span className={getStatusColor(String(value))}>{String(value)}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (_value: unknown, row: CampaignResponse) => (
        <div className="flex items-center gap-2">
          <Button
            onPress={() => handleView(row)}
            aria-label={`View campaign ${row.name}`}
            className="px-2 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors"
          >
            View
          </Button>
          <Button
            onPress={() => handleEdit(row)}
            aria-label={`Edit campaign ${row.name}`}
            className="px-2 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors"
          >
            Edit
          </Button>
          <DeleteConfirmationDialog
            title="Delete Campaign"
            message={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
            onConfirm={() => handleDelete(row)}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            trigger={
              <Button
                aria-label={`Delete campaign ${row.name}`}
                isDisabled={isDeleting === row.id}
                className="px-2 py-1 bg-sr-gray border border-sr-danger rounded-md text-gray-100 hover:bg-sr-danger/20 focus:outline-none focus:ring-2 focus:ring-sr-danger focus:border-transparent text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting === row.id ? 'Deleting...' : 'Delete'}
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={campaigns}
        columns={columns}
            searchFields={['name', 'gm_username', 'gm_name', 'edition', 'gameplay_level', 'status']}
        searchPlaceholder="Search campaigns..."
        defaultSortColumn="status"
        defaultSortDirection="asc"
        emptyMessage="No campaigns available"
        emptySearchMessage="No campaigns found. Try adjusting your search."
        ariaLabel="Campaigns table"
      />
      <CampaignViewModal
        campaign={selectedCampaign}
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />
      <CampaignEditModal
        campaign={selectedCampaign}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
