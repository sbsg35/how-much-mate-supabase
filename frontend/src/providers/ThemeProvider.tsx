import {
  MantineProvider,
  rem,
  Container,
  MantineColorsTuple,
  Title,
  Text,
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
  xxl: 1320, // Max container for ultra-wide or fluid layouts
};

const hmw: MantineColorsTuple = [
  "#f5fdf9",
  "#c6f5e0",
  "#83e9bb",
  "#28d889",
  "#23bd78",
  "#1ea367",
  "#198755",
  "#136942",
  "#105636",
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
        components: {
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
      <Notifications position="top-right" />

      {children}
    </MantineProvider>
  );
};
