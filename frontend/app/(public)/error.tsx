"use client";

import { DefaultContainer } from "@/components/DefaultContainer";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Home page error:", error);
  }, [error]);

  return (
    <DefaultContainer>
      <Stack align="center" gap="lg" py="xl">
        <IconAlertCircle size={64} color="var(--mantine-color-red-6)" />

        <Title order={1} ta="center">
          Something went wrong
        </Title>

        <Text size="lg" ta="center" maw={600} mx="auto">
          We couldn&apos;t load the quotes at this time. This could be due to a
          network issue or our servers might be experiencing problems.
        </Text>

        <Group>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={() => reset()}
            variant="filled"
          >
            Try again
          </Button>

          <Button component="a" href="/" variant="light">
            Go to homepage
          </Button>
        </Group>
      </Stack>
    </DefaultContainer>
  );
}
