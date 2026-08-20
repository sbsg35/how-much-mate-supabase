"use client";
import { Group, Input, Select } from "@mantine/core";
import { ReactNode, useState } from "react";
import { useController } from "react-hook-form";

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

type FormMonthYearSelectProps = {
  name: string;
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: string;
  thinking?: boolean;
  withAsterisk?: boolean;
  // Bounds as 'YYYY-MM-DD' strings
  minDate?: string;
  maxDate?: string;
};

const parseYearMonth = (value?: string | null) => {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(value ?? "");
  return { year: match?.[1] ?? null, month: match?.[2] ?? null };
};

export const FormMonthYearSelect = ({
  name,
  label = "Date",
  hideLabel,
  helperText,
  thinking,
  withAsterisk,
  minDate,
  maxDate,
}: FormMonthYearSelectProps) => {
  const { formState, field, fieldState } = useController({ name });

  // The form field only stores a full date once both month and year are
  // picked, so month/year selections are tracked locally to avoid one
  // resetting the other while incomplete.
  const initial = parseYearMonth(field.value);
  const [year, setYear] = useState<string | null>(initial.year);
  const [month, setMonth] = useState<string | null>(initial.month);

  const isSubmitting = formState.isSubmitting;
  const error = fieldState?.error?.message;

  const minYear = minDate?.slice(0, 4) ?? null;
  const minMonth = minDate?.slice(5, 7) ?? null;
  const maxYear = maxDate?.slice(0, 4) ?? String(new Date().getFullYear());
  const maxMonth = maxDate?.slice(5, 7) ?? null;

  const minY = minYear ? Number(minYear) : 2000;
  const maxY = Number(maxYear);

  const yearOptions = Array.from({ length: maxY - minY + 1 }, (_, i) => {
    const value = String(maxY - i);
    return { value, label: value };
  });

  const monthOptions = MONTH_OPTIONS.filter(({ value }) => {
    if (year === minYear && minMonth && value < minMonth) return false;
    if (year === maxYear && maxMonth && value > maxMonth) return false;
    return true;
  });

  const emitChange = (nextYear: string | null, nextMonth: string | null) => {
    setYear(nextYear);
    setMonth(nextMonth);
    field.onChange(nextYear && nextMonth ? `${nextYear}-${nextMonth}-01` : "");
  };

  const handleYearChange = (nextYear: string | null) => {
    let nextMonth = month;
    if (nextYear === maxYear && maxMonth && nextMonth && nextMonth > maxMonth) {
      nextMonth = maxMonth;
    }
    if (nextYear === minYear && minMonth && nextMonth && nextMonth < minMonth) {
      nextMonth = minMonth;
    }
    emitChange(nextYear, nextMonth);
  };

  const handleMonthChange = (nextMonth: string | null) => {
    emitChange(year, nextMonth);
  };

  const labelProps = hideLabel
    ? { "aria-label": typeof label === "string" ? label : undefined }
    : { label };

  return (
    <Input.Wrapper
      {...labelProps}
      withAsterisk={withAsterisk}
      description={helperText}
      error={error}
    >
      <Group gap="sm" grow wrap="nowrap">
        <Select
          aria-label="Month"
          placeholder="Month"
          data={monthOptions}
          value={month}
          onChange={handleMonthChange}
          onBlur={field.onBlur}
          disabled={isSubmitting || thinking}
          searchable
        />
        <Select
          aria-label="Year"
          placeholder="Year"
          data={yearOptions}
          value={year}
          onChange={handleYearChange}
          onBlur={field.onBlur}
          disabled={isSubmitting || thinking}
          searchable
        />
      </Group>
    </Input.Wrapper>
  );
};
