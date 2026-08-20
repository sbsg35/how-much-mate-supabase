"use client";
import { Input, Select } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";

type FormYearSelectProps = {
  name: string;
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
  withAsterisk?: boolean;
  minYear?: number;
  maxYear?: number;
};

export const FormYearSelect = ({
  name,
  label = "Year",
  hideLabel,
  helperText,
  thinking,
  withAsterisk,
  minYear = 2000,
  maxYear = new Date().getFullYear(),
}: FormYearSelectProps) => {
  const { formState, field, fieldState } = useController({ name });

  const isSubmitting = formState.isSubmitting;
  const error = fieldState?.error?.message;

  const yearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => {
      const value = String(maxYear - i);
      return { value, label: value };
    },
  );

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  return (
    <Input.Wrapper
      {...labelProps}
      withAsterisk={withAsterisk}
      description={helperText}
      error={error}
    >
      <Select
        aria-label="Year"
        placeholder="Year"
        data={yearOptions}
        value={field.value ? String(field.value) : null}
        onChange={(value) => field.onChange(value ? Number(value) : "")}
        onBlur={field.onBlur}
        disabled={isSubmitting || thinking}
        searchable
      />
    </Input.Wrapper>
  );
};
