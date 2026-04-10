import { Radio, RadioGroupProps } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";

type FormRadioGroupProps = {
  name: string;
  label: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
} & RadioGroupProps;

export const FormRadioGroup = ({
  name,
  label,
  hideLabel,
  helperText,
  thinking,
  children,
  ...props
}: FormRadioGroupProps) => {
  const { formState, field, fieldState } = useController({ name });

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  const error = fieldState?.error?.message;

  const isSubmitting = formState.isSubmitting;

  return (
    <Radio.Group
      {...props}
      id={name}
      disabled={isSubmitting || thinking}
      error={error}
      description={helperText}
      {...labelProps}
      {...field}
    >
      {children}
    </Radio.Group>
  );
};
