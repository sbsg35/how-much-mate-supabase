import { useCategories } from "@/service/category";
import { Select, SelectProps } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";

type CategorySelectProps = {
  name: string;
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
} & Omit<SelectProps, "data">;

export const CategorySelect = ({
  name,
  label = "Category",
  hideLabel,
  helperText,
  thinking,
  ...props
}: CategorySelectProps) => {
  const { data: categories } = useCategories();
  const { formState, field, fieldState } = useController({ name });

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  const error = fieldState?.error?.message;
  const isSubmitting = formState.isSubmitting;

  return (
    <Select
      {...props}
      id={name}
      placeholder="All categories"
      disabled={isSubmitting || thinking}
      error={error}
      description={helperText}
      searchable
      clearable
      data={categories?.map((category) => ({
        value: category.category_id.toString(),
        label: category.name,
      }))}
      {...labelProps}
      {...field}
      onChange={(value) => {
        // Convert string back to number for category_id
        field.onChange(value ?? null);
      }}
      value={field.value?.toString() || null}
    />
  );
};
