"use client";

import { Form, Input as InputPrimitive, TextArea } from "react-aria-components";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldError, FieldGroup } from "@/components/ui/field";
import type { CampaignInsert, CampaignUpdate } from "@/lib/supabase/schema";

interface CampaignFormProps {
  initialData?: Partial<CampaignInsert>;
  onSubmit: (data: CampaignInsert | CampaignUpdate) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function CampaignForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: CampaignFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: CampaignInsert | CampaignUpdate = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      setting: formData.get("setting") as string || null,
      is_active: formData.get("is_active") === "true",
    };

    await onSubmit(data);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="space-y-6"
      validationBehavior="aria"
    >
      {error && (
        <div className="rounded-lg border border-danger/50 bg-danger/10 p-4">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <FieldGroup>
        <TextField name="name" isRequired defaultValue={initialData?.name || ""}>
          <Label>Campaign Name</Label>
          <InputPrimitive className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>Enter a name for your campaign</Description>
          <FieldError />
        </TextField>

        <TextField name="description" defaultValue={initialData?.description || ""}>
          <Label>Description</Label>
          <TextArea className="min-h-[100px] w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>Provide a brief description of your campaign</Description>
          <FieldError />
        </TextField>

        <TextField name="setting" defaultValue={initialData?.setting || ""}>
          <Label>Setting</Label>
          <InputPrimitive className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>Describe the world or setting of your campaign</Description>
          <FieldError />
        </TextField>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            defaultChecked={initialData?.is_active ?? true}
            className="rounded border-border text-primary focus:ring-ring"
          />
          <Label htmlFor="is_active">Active Campaign</Label>
        </div>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            intent="outline"
            onPress={onCancel}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          intent="primary"
          isDisabled={isLoading}
        >
          {isLoading ? "Saving..." : initialData ? "Update Campaign" : "Create Campaign"}
        </Button>
      </div>
    </Form>
  );
}

