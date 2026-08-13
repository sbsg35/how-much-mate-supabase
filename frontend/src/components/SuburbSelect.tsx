import { Suburb, useSuburbById, useSuburbSearch } from "../service/suburb";
import {
  Combobox,
  Loader,
  TextInput,
  TextInputProps,
  useCombobox,
} from "@mantine/core";

import { ReactNode, useEffect, useState } from "react";
import { useController } from "react-hook-form";

type SuburbSelectProps = {
  name: string;
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
} & TextInputProps;

export const SuburbSelect = ({
  name,
  label = "Suburb",
  hideLabel,
  helperText,
  thinking,
  ...props
}: SuburbSelectProps) => {
  const { formState, field, fieldState } = useController({ name });
  const { data: initialSuburb, refetch } = useSuburbById(field.value);

  useEffect(() => {
    if (field.value) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const { data: suburbs, isLoading } = useSuburbSearch(debouncedSearchValue);

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  const error = fieldState?.error?.message;
  const isSubmitting = formState.isSubmitting;

  const data: Suburb[] = suburbs || [];
  const empty = debouncedSearchValue.trim().length >= 2 && data.length === 0;

  const options = data.map((suburb) => (
    <Combobox.Option value={suburb.suburb_id} key={suburb.suburb_id}>
      {suburb.display_name}
    </Combobox.Option>
  ));

  // Get the display name for the selected suburb ID
  const selectedSuburb = data.find((s) => s.suburb_id === field.value);
  const displayValue =
    selectedSuburb?.display_name ||
    searchValue ||
    initialSuburb?.display_name ||
    "";

  return (
    <Combobox
      onOptionSubmit={(suburb_id) => {
        const selected = data?.find((s) => s.suburb_id === suburb_id);
        if (selected) {
          field.onChange(suburb_id);
          setSearchValue(selected.display_name);
        }
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          {...labelProps}
          {...props}
          placeholder="Start typing to search suburbs"
          value={displayValue}
          onChange={(event) => {
            const newValue = event.currentTarget.value;
            setSearchValue(newValue);
            combobox.resetSelectedOption();
            combobox.openDropdown();

            // Clear the field value if user is typing
            if (field.value && newValue !== selectedSuburb?.display_name) {
              field.onChange("");
            }
          }}
          onBlur={() => {
            field.onBlur();
            combobox.closeDropdown();

            // Restore the selected suburb name if we have a selection
            if (field.value && selectedSuburb) {
              setSearchValue(selectedSuburb.display_name);
            }
          }}
          rightSection={isLoading ? <Loader size={18} /> : null}
          disabled={isSubmitting || thinking}
          error={error}
          description={helperText}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
