// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata = {
  title: "How Much Mate - Find Quotes from Service Providers",
  description:
    "Connect with trusted service providers in Australia. Browse quotes, compare prices, and find the right professional for your project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        style={{
          backgroundColor:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
