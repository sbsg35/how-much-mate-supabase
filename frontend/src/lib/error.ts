import { notifications } from "@mantine/notifications";
import { AuthInvalidCredentialsError } from "@supabase/supabase-js";
import { FieldValues, UseFormSetError } from "react-hook-form";

export type ErrorHandlerOptions<T extends FieldValues> = {
  setError?: UseFormSetError<T>;
  resetForm: () => void;
  customErrorMessage?: string;
};

export function handleSupabaseAuthError<T extends FieldValues>(
  error: unknown,
  options: ErrorHandlerOptions<T>,
) {
  const { setError, customErrorMessage } = options;

  notifications.show({
    title: "Error",
    message: customErrorMessage || "An unknown error occurred",
    color: "red",
  });

  return false;
}
