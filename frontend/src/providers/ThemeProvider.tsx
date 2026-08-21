import {
  MantineProvider,
  rem,
  Container,
  MantineColorsTuple,
  Button,
  CSSVariablesResolver,
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

/**
 * Custom design tokens for bespoke sections (landing page, quote cards)
 * that fall outside Mantine's built-in color/variant system. Each token
 * resolves to a real CSS variable that swaps automatically with the
 * active color scheme.
 */
const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    "--hmw-heading": "#111827",
    "--hmw-body-text": "#394559",
    "--hmw-muted-text": "#5b6678",
    "--hmw-border": "#e1e8e5",
    "--hmw-surface": "#ffffff",
    "--hmw-surface-tint": "#f8faf9",
    "--hmw-card-bg": "#ffffff",
    "--hmw-highlight-bg": "linear-gradient(145deg, #f2fbf7 0%, #e8f8f1 100%)",
    "--hmw-highlight-border": "#bfe8d5",
    "--hmw-hero-bg":
      "radial-gradient(circle at 76% 45%, rgba(179, 235, 211, .42), transparent 30%), linear-gradient(115deg, #f7fcfa 0%, #f4fbf8 55%, #fbfefd 100%)",
    "--hmw-page-tint-bg":
      "linear-gradient(135deg, #f7fbfa 0%, #ffffff 46%, #f4faf7 100%)",
  },
  dark: {
    "--hmw-heading": "var(--mantine-color-dark-0)",
    "--hmw-body-text": "#aab2bd",
    "--hmw-muted-text": "var(--mantine-color-dark-2)",
    "--hmw-border": "var(--mantine-color-dark-4)",
    "--hmw-surface": "var(--mantine-color-dark-5)",
    "--hmw-surface-tint": "var(--mantine-color-dark-6)",
    "--hmw-card-bg": "var(--mantine-color-dark-4)",
    "--hmw-highlight-bg":
      "linear-gradient(145deg, #13251c 0%, #162b21 100%)",
    "--hmw-highlight-border": "#2f6f4d",
    "--hmw-hero-bg":
      "radial-gradient(circle at 76% 45%, rgba(44, 169, 107, .18), transparent 30%), linear-gradient(115deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-6) 55%, var(--mantine-color-dark-7) 100%)",
    "--hmw-page-tint-bg":
      "linear-gradient(135deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-6) 46%, var(--mantine-color-dark-7) 100%)",
  },
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MantineProvider
      defaultColorScheme="auto"
      cssVariablesResolver={cssVariablesResolver}
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
