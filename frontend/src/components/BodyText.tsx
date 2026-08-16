import { Text, type TextProps } from "@mantine/core";
import type { ReactNode } from "react";

export type BodyTextSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface BodyTextProps extends Omit<TextProps, "fz" | "size"> {
  children?: ReactNode;
  size?: BodyTextSize;
  muted?: boolean;
}

const lineHeights: Record<BodyTextSize, number> = {
  xs: 1.45,
  sm: 1.5,
  md: 1.6,
  lg: 1.55,
  xl: 1.5,
};

/** Consistent body copy with an optional secondary-text treatment. */
export const BodyText = ({
  size = "md",
  muted = false,
  c,
  lh,
  ...props
}: BodyTextProps) => (
  <Text
    fz={size}
    c={c ?? (muted ? "dimmed" : undefined)}
    lh={lh ?? lineHeights[size]}
    {...props}
  />
);
