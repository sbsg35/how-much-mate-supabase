import {
  MantineProvider,
  rem,
  Container,
  MantineColorsTuple,
  Button,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React, { FC, ReactNode } from "react";

const CONTAINER_SIZES: Record<string, number> = {
  xxs: 320, // Mobile baseline
  xs: 400, // Narrow content (e.g. dialogs, sidebars)
  sm: 540, // Small forms or compact content areas
  md: 720, // Default readable content width
  lg: 960, // Balanced for medium-to-large screens
  xl: 1140, // Desktop widescreen layout
  xxl: 1440, // Max container for ultra-wide or fluid layouts
};

const hmw: MantineColorsTuple = [
  "#f4fdf8",
  "#d4f4e3",
  "#9ae4b8",
  "#4ecf88",
  "#35c277",
  "#2ca96b",
  "#1e8f5a",
  "#17734b",
  "#135a3d",
  "#0d472d",
];

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MantineProvider
      theme={{
        primaryColor: "hmw",
        focusRing: "always",
        fontSizes: {
          xs: rem(12),
          sm: rem(14),
          md: rem(16),
          lg: rem(18),
          xl: rem(20),
        },
        colors: {
          hmw,
        },
        other: {
          containerSizes: CONTAINER_SIZES,
        },
        components: {
          Button: Button.extend({
            defaultProps: {},
          }),
          Container: Container.extend({
            vars: (_, { size, fluid }) => ({
              root: {
                "--container-size": fluid
                  ? "100%"
                  : size !== undefined && size in CONTAINER_SIZES
                    ? rem(CONTAINER_SIZES[size])
                    : rem(size),
              },
            }),
          }),
          // text default size
          // Text: Text.extend({
          //   styles: () => ({}),
          // }),
          // Title: Title.extend({
          //   styles: () => ({
          //     root: {
          //       fontWeight: 500,
          //     },
          //   }),
          // }),
        },
      }}
    >
      <Notifications position="bottom-center" />

      {children}
    </MantineProvider>
  );
};
