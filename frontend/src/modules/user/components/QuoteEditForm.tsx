"use client";
import { useController, useForm } from "react-hook-form";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { NextLink } from "@/components/NextLink";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { CategorySelect } from "@/components/CategorySelect";
import { SuburbSelect } from "@/components/SuburbSelect";

import { EditQuoteDto, editQuoteSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormNumberInput } from "@/components/FormNumberInput";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { quoteQueryKeys, type Quote } from "@/service/quote";
import { updateQuoteAction } from "@/modules/quote/actions";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

interface QuoteEditFormProps {
  quote: Quote;
}

export const QuoteEditForm = ({ quote }: QuoteEditFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.input<typeof editQuoteSchema>, unknown, EditQuoteDto>({
    defaultValues: {
      title: quote.title,
      business_name: quote.business_name,
      description: quote.description,
      price: Number(quote.price),
      category_id: quote.category?.category_id ?? NaN,
      suburb_id: quote.suburb?.suburb_id ?? "",
      completed: quote.completed,
      quote_date: quote.quote_date,
      confirmed: false,
    },
    resolver: zodResolver(editQuoteSchema),
    mode: "onSubmit",
  });

  const { field: completedField } = useController({
    name: "completed",
    control: form.control,
  });

  const { field: confirmedField, fieldState: confirmedFieldState } =
    useController({
      name: "confirmed",
      control: form.control,
    });

  const handleSubmit = async (data: EditQuoteDto) => {
    const result = await updateQuoteAction(quote.quote_id, data);

    if (result.underReview) {
      await queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.allMyQuotes(),
      });
      await queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.userQuote(quote.quote_id),
      });
      notifications.show({
        title: "Quote under review",
        message: "Your quote is under review.",
        color: "yellow",
      });
      router.push("/user/my-quotes");
      return;
    }

    if (result.error) {
      notifications.show({
        title: "Update failed",
        message: result.error,
        color: "red",
      });
      form.setError("root.server", { type: "server", message: result.error });
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: quoteQueryKeys.allMyQuotes(),
    });
    await queryClient.invalidateQueries({
      queryKey: quoteQueryKeys.userQuote(quote.quote_id),
    });

    notifications.show({
      title: "Quote updated successfully",
      message: "Your quote has been updated.",
      color: "green",
    });
    router.push("/user/my-quotes");
  };

  return (
    <HookFormProvider form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="md">
          <FormTextInput
            name="title"
            label="Title"
            placeholder="e.g., No call-out fee for emergency plumber"
          />

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Describe the job, e.g., Replaced a leaking hot water valve and tested for further leaks"
            helperText="Describe the job itself, no personal details."
            minRows={4}
          />

          <FormTextInput
            name="business_name"
            label="Business Name"
            placeholder="e.g., FlowMaster Plumbing"
          />

          <FormNumberInput name="price" label="Price" min={0} leftSection="$" />

          <CategorySelect name="category_id" label="Category" />

          <SuburbSelect name="suburb_id" label="Suburb" />

          <FormTextInput name="quote_date" label="Quote Date" type="date" />

          <Checkbox
            label="Did you go ahead with this quote?"
            checked={Boolean(completedField.value)}
            onChange={(event) =>
              completedField.onChange(event.currentTarget.checked)
            }
          />

          <Stack gap={4}>
            <Checkbox
              label="I confirm this quote information is accurate and doesn't include private personal information."
              checked={Boolean(confirmedField.value)}
              onChange={(event) =>
                confirmedField.onChange(event.currentTarget.checked)
              }
              error={confirmedFieldState.error?.message}
            />
            <Text size="xs" c="dimmed" ml={26}>
              By submitting, you agree to our{" "}
              <NextLink href="/terms">Terms</NextLink> and confirm you have the
              right to share this information.
            </Text>
          </Stack>

          <Group justify="flex-end" mt="md">
            <FormSubmitButton>Update Quote</FormSubmitButton>
          </Group>

          {form.formState.errors.root?.server?.message ? (
            <p>{form.formState.errors.root.server.message}</p>
          ) : null}
        </Stack>
      </form>
    </HookFormProvider>
  );
};
