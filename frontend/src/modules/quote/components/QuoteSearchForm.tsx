"use client";
import { FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  PublicQuotesSearchDto,
  publicQuotesSearchSchema,
  RADIUS_OPTIONS,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Accordion, CloseButton, Group, Radio, Stack } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormTextInput } from "@/components/FormTextInput";
import { FormSelect } from "@/components/FormSelect";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormRadioGroup } from "@/components/FormRadioGroup";
import { useMediaQuery, useMounted } from "@mantine/hooks";
import { SuburbSelect } from "@/components/SuburbSelect";
import { CategorySelect } from "@/components/CategorySelect";

const AUSTRALIAN_STATES = [
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Date created: newest to oldest" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
];

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMounted = useMounted();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isMounted) {
    return <div>{children}</div>;
  }

  if (isDesktop) {
    return (
      <div
        style={{
          position: "sticky",
          top: "var(--app-shell-header-offset, 0)",
          alignSelf: "flex-start",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Accordion>
      <Accordion.Item value="form">
        <Accordion.Control>Search Filters</Accordion.Control>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export const QuoteSearchForm: FC<{ defaultValues: PublicQuotesSearchDto }> = ({
  defaultValues,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(publicQuotesSearchSchema),
  });

  const handleSubmit = (data: PublicQuotesSearchDto) => {
    const {
      keyword,
      sort_by,
      search_type,
      state,
      category_id,
      suburb_id,
      radius_km,
    } = data;

    // Build the search URL by cloning existing search params
    const params = new URLSearchParams(searchParams);

    if (!keyword?.trim()) {
      params.delete("keyword");
    } else {
      params.set("keyword", keyword.trim());
    }

    if (sort_by === "newest") {
      params.delete("sort_by");
    } else {
      params.set("sort_by", sort_by);
    }

    // Set search_type
    params.set("search_type", search_type);

    // If searching by state, clear suburb fields
    if (search_type === "state") {
      params.delete("suburb_id");
      params.delete("radius_km");

      if (!state) {
        params.delete("state");
      } else {
        params.set("state", state);
      }
    }
    // If searching by suburb, clear state field
    else if (search_type === "suburb") {
      params.delete("state");

      if (!suburb_id) {
        params.delete("suburb_id");
      } else {
        params.set("suburb_id", suburb_id);
      }

      if (!radius_km) {
        params.delete("radius_km");
      } else {
        params.set("radius_km", radius_km);
      }
    }

    if (!category_id) {
      params.delete("category_id");
    } else {
      params.set("category_id", category_id.toString());
    }

    // Reset to page 1 when searching
    params.set("page", "1");

    // Navigate to the search results
    router.push(`/?${params.toString()}`);
  };

  // When search type changes, clear the fields that are not relevant
  const handleSearchTypeChange = (value: string) => {
    if (value === "state" || value === "suburb") {
      form.setValue("search_type", value);
      if (value === "state") {
        form.setValue("suburb_id", null);
        form.setValue("radius_km", null);
      } else {
        form.setValue("state", null);
      }
    }
  };

  const searchType = useWatch({
    control: form.control,
    name: "search_type",
  });
  const keywordValue = useWatch({
    control: form.control,
    name: "keyword",
  });

  return (
    <FormWrapper>
      <HookFormProvider form={form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Group>
            <FormTextInput
              label="Enter keyword"
              type="text"
              placeholder="Search quotes..."
              name="keyword"
              mt="0"
              leftSection={<IconSearch size={18} stroke={1.5} />}
              w="100%"
              rightSection={
                <>
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => form.setValue("keyword", "")}
                    style={{
                      display: keywordValue ? undefined : "none",
                    }}
                  />
                </>
              }
            />
          </Group>

          <CategorySelect
            name="category_id"
            label="Filter by category"
            mt="md"
          />
          <FormSelect
            label="Sort by"
            data={SORT_OPTIONS}
            name="sort_by"
            mt="md"
          />
          <FormRadioGroup
            label="Search by"
            name="search_type"
            mt="md"
            onChange={handleSearchTypeChange}
          >
            <Stack mt="xs">
              <Radio value="state" label="State" />
              <Radio value="suburb" label="Suburb (with optional radius)" />
            </Stack>
          </FormRadioGroup>

          {searchType === "state" && (
            <FormSelect
              label="Filter by State"
              placeholder="All states"
              data={AUSTRALIAN_STATES}
              name="state"
              mt="md"
              clearable
            />
          )}

          {searchType === "suburb" && (
            <>
              <SuburbSelect name="suburb_id" label="Filter by suburb" mt="md" />
              <FormSelect
                label="Radius (km)"
                placeholder="Any radius"
                data={RADIUS_OPTIONS.map((km) => ({
                  value: km.toString(),
                  label: `${km} km`,
                }))}
                name="radius_km"
                mt="md"
                clearable
              />
            </>
          )}
          <Group>
            <FormSubmitButton mt="md" fullWidth variant="outline">
              Search
            </FormSubmitButton>
          </Group>
        </form>
      </HookFormProvider>
    </FormWrapper>
  );
};
