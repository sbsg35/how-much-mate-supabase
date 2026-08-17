"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Checkbox,
  Group,
  Stack,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { NextLink } from "@/components/NextLink";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { HookFormProvider } from "@/components/HookFormProvider";
import { CategorySelect } from "@/components/CategorySelect";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";

import { CreateQuoteDto, createQuoteSchema, MIN_QUOTE_DATE } from "@/schema";
import { FormNumberInput } from "@/components/FormNumberInput";
import { SuburbSelect } from "@/components/SuburbSelect";
import type { CreateQuoteActionResult } from "../actions";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { quoteQueryKeys } from "@/service/quote";

type CreateQuoteFormValues = z.input<typeof createQuoteSchema>;

type CreateQuoteFormProps = {
  createQuoteAction: (
    data: CreateQuoteDto,
  ) => Promise<CreateQuoteActionResult | never>;
};

export const CreateQuoteForm = ({
  createQuoteAction,
}: CreateQuoteFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateQuoteFormValues, unknown, CreateQuoteDto>({
    defaultValues: {
      title: "",
      business_name: "",
      quote_date: "",
      description: "",
      price: 0,
      suburb_id: "",
      completed: false,
      confirmed: false,
      category_id: NaN,
      botToken: "",
    },
    resolver: zodResolver(createQuoteSchema),
    mode: "onSubmit",
  });

  const {
    containerRef: turnstileContainerRef,
    isVerified: isTurnstileVerified,
    reset: resetTurnstile,
  } = useTurnstile({
    siteKey: CLOUDFLARE_TURNSTILE_KEY,
    formSetValue: form.setValue,
    formFieldName: "botToken",
  });

  const handleSubmit = async (data: CreateQuoteDto) => {
    try {
      const result = await createQuoteAction(data);

      if (result?.underReview) {
        await queryClient.invalidateQueries({
          queryKey: quoteQueryKeys.allMyQuotes(),
        });
        notifications.show({
          title: "Quote under review",
          message: "Your quote is under review.",
          color: "yellow",
        });
        router.push("/user/my-quotes");
        return;
      }

      if (result?.error) {
        resetTurnstile();
        form.setError("root.server", {
          type: "server",
          message: result.error,
        });
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.allMyQuotes(),
      });
      router.push("/user/my-quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      resetTurnstile();
      form.setError("root.server", {
        type: "server",
        message: "Unable to submit quote right now",
      });
    }
  };

  const { field: completedField } = useController({
    name: "completed",
    control: form.control,
  });

  const { field: confirmedField, fieldState: confirmedFieldState } =
    useController({
      name: "confirmed",
      control: form.control,
    });

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

          <FormNumberInput
            name="price"
            label="Price"
            min={0}
            leftSection="$"
            rightSection={<></>}
          />

          <CategorySelect name="category_id" label="Category" />

          <SuburbSelect name="suburb_id" label="Suburb" />

          <FormTextInput
            name="quote_date"
            label="Quote Date"
            type="date"
            min={MIN_QUOTE_DATE}
            max={new Date().toISOString().slice(0, 10)}
          />

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
            <FormSubmitButton disabled={!isTurnstileVerified}>
              Submit Quote
            </FormSubmitButton>
          </Group>

          {/* Turnstile component */}
          <VisuallyHidden>
            <Box mt="md" style={{ display: "flex", justifyContent: "center" }}>
              <Box ref={turnstileContainerRef}>
                <Turnstile />
              </Box>
            </Box>
          </VisuallyHidden>

          {/* Hidden input for the token */}
          <input type="hidden" {...form.register("botToken")} />

          {form.formState.errors.root?.server?.message ? (
            <p>{form.formState.errors.root.server.message}</p>
          ) : null}
        </Stack>
      </form>
    </HookFormProvider>
  );
};
