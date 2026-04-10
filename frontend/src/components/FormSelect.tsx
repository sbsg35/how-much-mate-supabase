import { Select, SelectProps } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";

type FormSelectProps = {
  name: string;
  label: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
} & SelectProps;

export const FormSelect = ({
  name,
  label,
  hideLabel,
  helperText,
  thinking,
  ...props
}: FormSelectProps) => {
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
      disabled={isSubmitting || thinking}
      error={error}
      description={helperText}
      {...labelProps}
      {...field}
    />
  );
};
