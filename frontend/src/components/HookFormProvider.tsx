import { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { DebugJson } from "./DebugJson";

// Hook form provider wrapper component
// Use debug prop to enable "watch mode" on form
export const HookFormProvider = <T extends FieldValues = FieldValues>({
  debug,
  children,
  ...form
}: {
  children: ReactNode;
  debug?: boolean;
} & UseFormReturn<T>) => {
  return (
    <FormProvider {...form}>
      {debug && <DebugJson data={form.watch()} />}

      {children}
    </FormProvider>
  );
};
