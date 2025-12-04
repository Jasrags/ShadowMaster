"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CampaignForm } from "@/components/forms/CampaignForm";
import { createCampaign } from "../../actions";
import type { CampaignInsert } from "@/lib/supabase/schema";

export function NewCampaignForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CampaignInsert) => {
    setError(null);

    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("description", data.description || "");
    formData.set("setting", data.setting || "");
    formData.set("is_active", data.is_active ? "true" : "false");

    startTransition(async () => {
      const result = await createCampaign(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/campaigns/${result.data.id}`);
    });
  };

  const handleCancel = () => {
    router.push("/campaigns");
  };

  return (
    <CampaignForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isPending}
      error={error}
    />
  );
}

