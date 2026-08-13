import { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { DebugJson } from "./DebugJson";

type HookFormProviderProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  children: ReactNode;
  debug?: boolean;
};

// Hook form provider wrapper component
// Use debug prop to enable "watch mode" on form
export const HookFormProvider = <
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  form,
  debug,
  children,
}: HookFormProviderProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <FormProvider {...form}>
      {debug && (
        <DebugJson
          data={{ data: form.watch(), errors: form.formState.errors }}
        />
      )}

      {children}
    </FormProvider>
  );
};
