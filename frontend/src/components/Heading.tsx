import { Title, type TitleProps } from "@mantine/core";
import type { ReactNode } from "react";

export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "display";

export interface HeadingProps
  extends Omit<TitleProps, "fz" | "order" | "size"> {
  children?: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: HeadingSize;
}

const sizes = {
  xs: { fz: { base: 18, sm: 20 }, lh: 1.35 },
  sm: { fz: { base: 20, sm: 22 }, lh: 1.3 },
  md: { fz: { base: 24, sm: 26 }, lh: 1.25 },
  lg: { fz: { base: 28, sm: 32 }, lh: 1.2 },
  xl: { fz: { base: 34, sm: 40 }, lh: 1.15 },
  display: { fz: { base: 44, sm: 60 }, lh: 1.08 },
} as const;

const defaultSizeByLevel: Record<
  NonNullable<HeadingProps["level"]>,
  HeadingSize
> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
  5: "xs",
  6: "xs",
};

/**
 * A semantic heading with a visual size that can be chosen independently.
 * This keeps document structure correct without tying it to one-off font sizes.
 */
export const Heading = ({
  level = 2,
  size = defaultSizeByLevel[level],
  fw = 700,
  lh,
  ...props
}: HeadingProps) => {
  const sizeStyles = sizes[size];

  return (
    <Title
      order={level}
      fz={sizeStyles.fz}
      lh={lh ?? sizeStyles.lh}
      fw={fw}
      {...props}
    />
  );
};
