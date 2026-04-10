import { Textarea, TextareaProps } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";

type FormTextareaProps = {
  name: string;
  label: ReactNode;
  helperText?: string;
  thinking?: boolean;
} & TextareaProps;

export const FormTextarea = ({
  name,
  label,
  helperText,
  thinking,
  ...props
}: FormTextareaProps) => {
  const { formState, field, fieldState } = useController({ name });

  const error = fieldState?.error?.message;

  const isSubmitting = formState.isSubmitting;

  return (
    <Textarea
      {...props}
      id={name}
      disabled={isSubmitting || thinking}
      label={label}
      error={error}
      description={helperText}
      {...field}
    />
  );
};
