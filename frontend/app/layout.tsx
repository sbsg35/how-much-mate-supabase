import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import { Analytics } from "@vercel/analytics/next";
import { getAppConfig } from "@/lib/config";
import { defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const title = "How Much Mate | See what local jobs really cost";
const description =
  "A community record of real quotes for everyday services across Australia — so you know roughly what to expect before you ask around.";

export const metadata: Metadata = {
  metadataBase: new URL(getAppConfig().frontendUrl),
  title,
  description,
  openGraph: { ...defaultOpenGraph, title, description },
  twitter: { ...defaultTwitter, title, description },
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: {
      url: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        style={{
          backgroundColor:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
        }}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
