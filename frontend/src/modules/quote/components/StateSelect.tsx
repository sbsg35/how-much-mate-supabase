"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@mantine/core";

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

interface StateSelectProps {
  initialState?: string;
}

export const StateSelect: React.FC<StateSelectProps> = ({
  initialState = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStateChange = (value: string | null) => {
    // Build the new URL with updated state
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set("state", value);
    } else {
      params.delete("state");
    }
    
    // Reset to page 1 when state changes
    params.delete("page");

    // Navigate to the updated URL
    router.push(`/?${params.toString()}`);
  };

  return (
    <Select
      placeholder="All states"
      variant="filled"
      data={AUSTRALIAN_STATES}
      value={initialState || null}
      onChange={handleStateChange}
      clearable
      mt={12}
    />
  );
};
