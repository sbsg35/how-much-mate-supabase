"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Checkbox,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { IconArrowRight } from "@tabler/icons-react";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { HookFormProvider } from "@/components/HookFormProvider";
import { CategorySelect } from "@/components/CategorySelect";

import { CreateQuoteDto, createQuoteSchema } from "@/schema";
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
      category_id: NaN,
    },
    resolver: zodResolver(createQuoteSchema),
    mode: "onSubmit",
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

  return (
    <HookFormProvider form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="lg" mt="lg">
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <Stack gap={5}>
                <FormTextInput
                  name="title"
                  label="Title"
                  withAsterisk
                  radius="md"
                />
                <Text c="dimmed" fz="xs">
                  A short, clear title helps others find your quote
                </Text>
              </Stack>

              <CategorySelect
                name="category_id"
                label="Category"
                placeholder="Select a category"
                withAsterisk
                radius="md"
              />
            </SimpleGrid>

            <Stack gap={5}>
              <FormTextarea
                name="description"
                label="Description"
                minRows={4}
                autosize
                withAsterisk
                radius="md"
              />
              <Text c="dimmed" fz="xs">
                More detail helps others compare similar jobs
              </Text>
            </Stack>
          </Stack>

          <Stack gap="md">
            <FormTextInput
              name="business_name"
              label="Business Name"
              withAsterisk
              radius="md"
            />
          </Stack>

          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <FormNumberInput
                name="price"
                label="Price"
                placeholder="0.00"
                min={0}
                leftSection="$"
                rightSection={<></>}
                withAsterisk
              />

              <FormTextInput
                name="quote_date"
                label="Quote Date"
                type="date"
                withAsterisk
              />
            </SimpleGrid>
          </Stack>

          <Stack gap="md">
            <Stack gap={5}>
              <SuburbSelect
                name="suburb_id"
                label="Suburb or Postcode"
                withAsterisk
              />
              <Text c="dimmed" fz="xs">
                This helps others find quotes in their area and compare prices.
              </Text>
            </Stack>
          </Stack>
          <Stack gap="md">
            <Checkbox
              label="Did you go ahead with this quote?"
              checked={Boolean(completedField.value)}
              onChange={(event) =>
                completedField.onChange(event.currentTarget.checked)
              }
              color="hmw.6"
            />
          </Stack>

          {form.formState.errors.root?.server?.message ? (
            <Alert color="red" radius="md">
              {form.formState.errors.root.server.message}
            </Alert>
          ) : null}

          <FormSubmitButton
            rightSection={<IconArrowRight size={18} />}
            w={{ base: "100%", sm: 210 }}
          >
            Submit Quote
          </FormSubmitButton>
        </Stack>
      </form>
    </HookFormProvider>
  );
};
