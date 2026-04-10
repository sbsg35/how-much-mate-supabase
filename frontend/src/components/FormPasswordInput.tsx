import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { ChangeEventHandler } from "react";
import { useController } from "react-hook-form";
import { ProcessorFunction } from "../lib/processor";

type FormPasswordInputProps = {
  name: string;
  label: string;
  helperText?: string;
  processors?: ProcessorFunction[];
  thinking?: boolean;
} & PasswordInputProps;

export const FormPasswordInput = ({
  name,
  label,
  helperText,
  processors = [],
  thinking,
  ...props
}: FormPasswordInputProps) => {
  const { formState, field, fieldState } = useController({ name });

  const error = fieldState?.error?.message;

  const isSubmitting = formState.isSubmitting;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = processors.reduce((v, p) => p(v), e.target.value);
    field.onChange(value);
  };

  return (
    <PasswordInput
      {...props}
      id={name}
      disabled={isSubmitting || thinking}
      label={label}
      error={error}
      description={helperText}
      {...field}
      onChange={handleChange}
    />
  );
};
