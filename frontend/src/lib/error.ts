import { notifications } from "@mantine/notifications";
import { isAuthApiError, isAuthError } from "@supabase/supabase-js";
import { FieldValues, UseFormSetError } from "react-hook-form";

export type ErrorHandlerOptions<T extends FieldValues> = {
  setError?: UseFormSetError<T>;
  resetForm: () => void;
  fallbackMessage?: string;
};

export function handleSupabaseAuthError<T extends FieldValues>(
  error: unknown,
  options: ErrorHandlerOptions<T>,
) {
  const { setError, resetForm, fallbackMessage } = options;

  let message = fallbackMessage || "An unknown error occurred";

  if (isAuthError(error)) {
    if (error.name === "AuthInvalidCredentialsError") {
      message = "Invalid email or password";
      setError?.("root" as never, {
        type: "manual",
        message,
      });
      resetForm();
    } else if (isAuthApiError(error) && error.status === 429) {
      message = "Too many attempts. Please wait and try again.";
    } else if (error.name === "AuthRetryableFetchError") {
      message = "Network issue. Please check your connection and try again.";
    } else if (error.name === "AuthWeakPasswordError") {
      message =
        error.message || "Your password does not meet strength requirements.";
    } else {
      message = error.message || "Authentication request failed";
    }
  } else if (error instanceof Error) {
    message = error.message || message;
  } else if (typeof error === "string" && error.trim()) {
    message = error;
  } else {
    message = fallbackMessage || message;
  }

  notifications.show({
    title: "Error",
    message,
    color: "red",
  });

  return false;
}
