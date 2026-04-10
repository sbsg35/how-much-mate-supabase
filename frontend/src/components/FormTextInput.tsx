import { TextInput, TextInputProps } from "@mantine/core";
import { ChangeEventHandler, ReactNode } from "react";
import { useController } from "react-hook-form";
import { ProcessorFunction } from "../lib/processor";

type FormTextInputProps = {
  name: string;
  label: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  processors?: ProcessorFunction[];
  thinking?: boolean;
} & TextInputProps;

export const FormTextInput = ({
  name,
  label,
  helperText,
  processors = [],
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = processors.reduce((v, p) => p(v), e.target.value);
    field.onChange(value);
  };

  return (
    <TextInput
      {...props}
      id={name}
      disabled={isSubmitting || thinking}
      error={error}
      description={helperText}
      {...labelProps}
      {...field}
      onChange={handleChange}
    />
  );
};
