import { NumberInput, NumberInputProps } from "@mantine/core";
import { ReactNode } from "react";
import { useController } from "react-hook-form";
import { ProcessorFunction } from "../lib/processor";

type FormTextInputProps = {
  name: string;
  label: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  processors?: ProcessorFunction[];
  thinking?: boolean;
} & NumberInputProps;

export const FormNumberInput = ({
  name,
  label,
  helperText,
  thinking,
  hideLabel,
  ...props
}: FormTextInputProps) => {
  const { formState, field, fieldState } = useController({ name });

  const error = fieldState?.error?.message;

  const isSubmitting = formState.isSubmitting;

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  return (
    <NumberInput
      {...props}
      id={name}
      disabled={isSubmitting || thinking}
      error={error}
      description={helperText}
      // max decimals set to 2 for currency inputs
      decimalScale={2}
      {...labelProps}
      {...field}
    />
  );
};
