"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CampaignForm } from "@/components/forms/CampaignForm";
import { updateCampaignAction } from "../../../actions";
import type { Campaign, CampaignUpdate } from "@/lib/supabase/schema";

interface EditCampaignFormProps {
  campaign: Campaign;
}

export function EditCampaignForm({ campaign }: EditCampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CampaignUpdate) => {
    setError(null);

    const formData = new FormData();
    formData.set("name", data.name || campaign.name);
    formData.set("description", data.description || "");
    formData.set("setting", data.setting || "");
    formData.set("is_active", data.is_active ? "true" : "false");

    startTransition(async () => {
      const result = await updateCampaignAction(campaign.id, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/campaigns/${campaign.id}`);
    });
  };

  const handleCancel = () => {
    router.push(`/campaigns/${campaign.id}`);
  };

  return (
    <CampaignForm
      initialData={{
        name: campaign.name,
        description: campaign.description,
        setting: campaign.setting,
        is_active: campaign.is_active,
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isPending}
      error={error}
    />
  );
}

