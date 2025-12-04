"use client";

import { Form, Input as InputPrimitive, TextArea } from "react-aria-components";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldError, FieldGroup } from "@/components/ui/field";
import type { CharacterInsert, CharacterUpdate } from "@/lib/supabase/schema";

interface CharacterFormProps {
  initialData?: Partial<CharacterInsert>;
  onSubmit: (data: CharacterInsert | CharacterUpdate) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function CharacterForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: CharacterFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: CharacterInsert | CharacterUpdate = {
      name: formData.get("name") as string,
      metadata: {
        type: formData.get("type") as string || "Unknown",
        description: formData.get("description") as string || "",
      },
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
          <Label>Character Name</Label>
          <InputPrimitive className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>Enter the name of your character</Description>
          <FieldError />
        </TextField>

        <TextField name="type" defaultValue={(initialData?.metadata as any)?.type || ""}>
          <Label>Character Type</Label>
          <InputPrimitive className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>e.g., Street Samurai, Decker, Mage, etc.</Description>
          <FieldError />
        </TextField>

        <TextField name="description" defaultValue={(initialData?.metadata as any)?.description || ""}>
          <Label>Description</Label>
          <TextArea className="min-h-[100px] w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" />
          <Description>Provide a brief description of your character</Description>
          <FieldError />
        </TextField>
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
          {isLoading ? "Saving..." : initialData ? "Update Character" : "Create Character"}
        </Button>
      </div>
    </Form>
  );
}

